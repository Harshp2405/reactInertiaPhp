<?php

namespace App\Ai\Action;

use App\Models\Product;

class DeleteProduct
{
    public static function run(array $data)
    {
        $product = null;

        if (isset($data['id'])) {
            $product = Product::find($data['id']);
        }

        if (!$product && isset($data['name'])) {
            $product = Product::where('name', $data['name'])->first();
        }

        if (!$product) {
            return [
                'success' => false,
                'error' => 'Product not found'
            ];
        }

        $product->delete();

        return [
            'success' => true,
            'message' => "Product {$product->name} deleted"
        ];
    }
}
