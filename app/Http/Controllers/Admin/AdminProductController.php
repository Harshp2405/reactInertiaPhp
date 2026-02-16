<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ProductCreated;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use League\Csv\Reader;
use League\Csv\Statement;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query()->with('images', 'parent', 'children');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->category) {
            $query->where(function ($q) use ($request) {
                $q->where('parent_id', $request->category)
                    ->orWhere('id', $request->category);
            });
        }

        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->get();
        $categories = Product::whereNull('parent_id')->get();

        return inertia('admin/Products/Index', [
            'Data' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'min_price', 'max_price']),
            'User' => auth()->user(),
        ]);
    }

/**
 * Get categories with their children for dropdowns or filters.
 */
    public function getCategory()
    {
        $categories = Product::with('children')
            ->whereNull('parent_id')   // top-level only
            ->get();

        return response()->json($categories);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $parents = Product::all(['id', 'name']);

        return Inertia::render("admin/Products/Create", [
            'categories' => $parents,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $data = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|max:999999.99',
                'description' => 'nullable|string | max:1000',
                'parent_id'   => 'nullable|exists:products,id',
                // Main Image
                'default_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

                'images' => 'nullable|array|max:5',
                'images.*' => 'image|max:2048',
            ]);
            if ($request->hasFile('default_image')) {
            }

            $data['is_parent'] = false;
            $product = Product::create($data);

            Mail::to(auth()->user()->email)->send(new ProductCreated($product));


            if ($request->hasFile('default_image')) {
                $path = $request->file('default_image')
                    ->store("products/{$product->id}/thumbnail/", 'public');

                $product->update([
                    'default_image' => $path,
                ]);
            }

            if ($product->parent_id) {
                Product::where('id', $product->parent_id)->update([
                    'is_parent' => true,
                ]);
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {
                    $path = $img->store("products/{$product->id}", 'public');

                    $product->images()->create([
                        'image' => $path,
                    ]);
                }
            }
            // dd($request->file('images'));
            return redirect()
                ->route('admin.products.index')
                ->with('message', 'Product created')->with('email', 'Email Sent success fully');
        } catch (QueryException $e) {
            return back()
                ->withErrors(['price' => 'Invalid price value'])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('images', 'parent', 'children');
        return Inertia::render("admin/Products/Singleproduct", compact('product'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load('images', 'parent');

        $categories = Product::where('id', '!=', $product->id)
            ->get(['id', 'name']);

        return Inertia::render('admin/Products/Edit', [
            'product'    => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // dd($request);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'parent_id'   => 'nullable|exists:products,id',
            'default_image' => 'nullable|image|max:2048',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:2048',
        ]);
        $oldParentId = $product->parent_id;

        $product->update($data);

        if ($oldParentId && $oldParentId !== $product->parent_id) {
            $hasChildren = Product::where('parent_id', $oldParentId)->exists();
            Product::where('id', $oldParentId)
                ->update(['is_parent' => $hasChildren]);
        }

        // New parent: set as parent
        if ($product->parent_id) {
            Product::where('id', $product->parent_id)
                ->update(['is_parent' => true]);
        }

        //Defaul Image
        if ($request->hasFile('default_image')) {

            // delete old default image if exists
            if ($product->default_image) {
                Storage::disk('public')->delete($product->default_image);
            }

            $path = $request->file('default_image')
                ->store("products/{$product->id}/thumbnail/", 'public');

            $product->update([
                'default_image' => $path,
            ]);
        }
        //Array of multiple image
        if ($request->hasFile('images')) {

            foreach ($product->images as $img) {
                Storage::disk('public')->delete($img->image);
                $img->delete();
            }

            foreach ($request->file('images') as $img) {
                $path = $img->store("products/{$product->id}/", 'public');

                $product->images()->create([
                    'image' => $path,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('message', 'Edited');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product->children()->exists()) {
            return back()->withErrors([
                'error' => 'Cannot delete product with child items',
            ]);
        }
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image);
            $img->delete();
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
        // return Inertia::render("admin/Products/Index", [
        //     'message' => 'Product deleted successfully',
        // ]);
    }

    public function sendMail(Request $request)
    {
        $product = Product::findOrFail($request->id);

        Mail::to('admin@example.com')->send(
            new ProductCreated($product)
        );

        return back()->with('success', 'Mail sent');
    }

    public function changeImage(Request $request, Product $product)
    {
        $request->validate([
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:2048',
        ]);

        if ($request->hasFile('images')) {

            foreach ($product->images as $img) {
                Storage::disk('public')->delete($img->image);
                $img->delete();
            }

            foreach ($request->file('images') as $img) {
                $path = $img->store("products/{$product->id}", 'public');

                $product->images()->create([
                    'image' => $path,
                ]);
            }
        }

        return back()->with('message', 'Product updated');
    }

    public function editImage(Product $product)
    {
        $product->load('images');
        return inertia('admin/products/Imageedit', compact('product'));
    }

    public function toggleActiveStatus(Request $request, $id)
    {
        // Find the product by ID
        $product = Product::findOrFail($id);

        // Toggle the active status
        $product->active = !$product->active;

        // Save the updated product
        $product->save();

        // Return a response, in this case, redirect back
        return redirect()->route('admin.products.index')->with('message', 'Product status updated successfully.');
    }

    public function uploadCSV(Request $request)
    {
        // Validate the uploaded CSV file
        $request->validate([
            'csv_file' => 'required|mimes:csv,txt|max:2048',  // Adjust max size as needed
        ]);

        // Get the uploaded file
        $file = $request->file('csv_file');



        // Open the CSV file using League CSV package
        $csv = Reader::createFromPath($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0); // Set the first row as the header

        // Process the CSV file
        $stmt = (new Statement());
        $records = $stmt->process($csv);

        // Insert products into the database
        foreach ($records as $record) {
            Product::create([
                'name' => $record['name'] ?? null,
                'price' => $record['price'] ?? 0,
                'description' => $record['description'] ?? null,

                'parent_id' => !empty($record['parent_id'])
                    ? (int) $record['parent_id']
                    : null,

                'is_parent' => isset($record['is_parent'])
                    ? (bool) $record['is_parent']
                    : false,

                'default_image' => !empty($record['default_image'])
                    ? $record['default_image']
                    : null,

                'active' => isset($record['active'])
                    ? (bool) $record['active']
                    : true,
            ]);
        }

        // Return a response once the products are uploaded successfully
        return redirect()
            ->route('admin.products.index')
            ->with('message', 'Product created')->with('email', 'Email Sent success fully');
    }
}
