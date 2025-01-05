<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Method to get the order status by order ID
    public function getOrderStatusById($orderId)
    {
        try {
            // Find the order by ID
            $order = Order::find($orderId);

            // If the order doesn't exist, return a 404 response
            if (!$order) {
                return response()->json(['error' => 'Order not found.'], 404);
            }

            // Return the order status
            return response()->json($order->status, 200);

        } catch (\Exception $e) {
            // Log any exceptions and return a 500 error response
            return response()->json(['error' => 'An error occurred while fetching the order status.'], 500);
        }
    }
}
