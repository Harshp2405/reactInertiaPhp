<?php

namespace App\Ai\Action;

use App\Models\Order;

class UpdateOrder
{
    public static function run(array $data)
    {
        $order = Order::find($data['order_id'] ?? null);

        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $order->update([
            'status' => $data['status'] ?? $order->status
        ]);

        return [
            'success' => true,
            'message' => "Order {$order->id} updated"
        ];
    }
}
