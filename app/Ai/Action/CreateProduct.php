<?php

namespace App\Ai\Action;

use App\Models\Product;

class CreateProduct
{
    public static function run(array $data)
    {
        // Required fields validation
        if (!isset($data['name']) || !isset($data['price']) || !isset($data['quantity'])) {
            return [
                'success' => false,
                'error' => 'Missing required fields: name, price, quantity',
                'received' => $data
            ];
        }

        $product = Product::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'quantity' => $data['quantity'],
            'active' => $data['active'] ?? 1,
            'parent_id' => $data['parent_id'] ?? null,
            'is_parent' => false,
            'created_by' => auth()->id() ?? 1
        ]);

        return [
            'success' => true,
            'message' => "Product {$product->name} created successfully",
            'product_id' => $product->id
        ];
    }
}
