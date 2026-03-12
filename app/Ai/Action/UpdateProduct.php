<?php

namespace App\Ai\Action;

use App\Models\Product;
use Illuminate\Support\Facades\Log;

class UpdateProduct
{
    public static function run(array $data)
    {
        // If AI sends 'parameters', use them
        // if (isset($data['parameters']) && is_array($data['parameters'])) {
        //     $data = array_merge($data, $data['parameters']);
        // }

        Log::info('UpdateProduct data:', $data);

        $product = null;

        // first try id
        if (!empty($data['id'])) {
            $product = Product::find($data['id']);
        }

        // fallback: find by name
        if (!$product && !empty($data['name'])) {
            $product = Product::where('name', $data['name'])->first();
        }

        if (!$product) {
            return [
                'success' => false,
                'error' => 'Product not found'
            ];
        }

        $product->update([
            'name'     => $data['name'] ?? $product->name,
            'price'    => $data['price'] ?? $product->price,
            'quantity' => $data['quantity'] ?? $product->quantity,
            'active'   => $data['active'] ?? $product->active
        ]);

        return [
            'success' => true,
            'message' => "Product {$product->name} updated"
        ];
    }
}
