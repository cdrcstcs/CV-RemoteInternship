<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    /**
     * Add product to the user's cart.
     */
    public function addToCart(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user

            $productId = $request->input('productId');
            $orderId = $request->input('orderId');
            $product = Product::find($productId);  // Correct method: find()

            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            $pricePerProduct = $product->price;

            // If no orderId is provided or the order doesn't exist, create a new order
            $order = Order::find($orderId);

            if (!$order) {
                // Create a new order if it doesn't exist
                $order = new Order([
                    'user_id' => $user->id,
                    'status' => 'pending',  // Set the initial status, modify as needed
                    'order_date' => now(),
                    'total_amount' => 0,  // Start with a total amount of 0
                ]);

                // Optionally generate a tracking number (can be done here or later)
                $order->tracking_number = strtoupper('TRACK-' . uniqid());

                // Save the new order
                $order->save();
            }

            // Check if the product is already in the cart (OrderItem exists for this order and product)
            $existingItem = OrderItem::where('orders_id', $order->id)
                                    ->where('products_id', $productId)
                                    ->first();

            // If the product is already in the cart
            if ($existingItem) {
                Log::info('Existing Item', $existingItem->toArray());

                // Store the previous total amount before updating the quantity
                $previousTotalAmount = $existingItem->total_amount;

                // Increment the quantity by 1
                $existingItem->quantity += 1;
                $existingItem->total_amount = $existingItem->quantity * $pricePerProduct;  // Recalculate total amount for the item

                // Save the updated order item
                $existingItem->save();

                // Update the total amount of the order by adding the difference between the new total and the old total
                $order->total_amount += $existingItem->total_amount - $previousTotalAmount;
            } else {
                // If the product is not in the cart, add it
                $newOrderItem = new OrderItem([
                    'orders_id' => $order->id,
                    'products_id' => $productId,
                    'quantity' => 1,
                    'total_amount' => $pricePerProduct
                ]);
                $newOrderItem->save();  // Save the new order item

                // Update the total amount of the order
                $order->total_amount += $pricePerProduct;
            }

            // Save the updated order
            $order->save();

            // Retrieve all order items for this order
            $allOrderItems = OrderItem::where('orders_id', $order->id)->with('product')->get();
            $totalAmount = $allOrderItems->sum(function ($item) {
                return $item->total_amount;  // Assuming each order item has a total_amount field
            });
            return response()->json([
                'orderItems' => $allOrderItems,
                'orderId' => $order->id,  // Return the updated order, including the tracking number and total amount
                'totalAmount' => $totalAmount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }


    public function removeCartItem(Request $request)
    {
        try {
            // Get the authenticated user
            $user = $request->user();
            $orderId = $request->input('orderId');
            $productId = $request->input('productId');
            // Find the order associated with the provided orderId
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            // Check if the order belongs to the authenticated user
            if ($order->user_id !== $user->id) {
                return response()->json(['message' => 'You are not authorized to modify this order'], 403);
            }

            // Find the specific order item for the provided productId
            $orderItem = OrderItem::where('orders_id', $orderId)
                                ->where('products_id', $productId)
                                ->first();

            if (!$orderItem) {
                return response()->json(['message' => 'Product not found in cart'], 404);
            }

            // Store the total amount of the item being deleted
            $itemTotalAmount = $orderItem->total_amount;

            // Delete the order item from the cart
            $orderItem->delete();

            // Update the total amount of the order
            $order->total_amount -= $itemTotalAmount;

            // Save the updated order
            $order->save();

            // Retrieve the updated order items
            $allOrderItems = OrderItem::where('orders_id', $orderId)->with('product')->get();
            $totalAmount = $allOrderItems->sum(function ($item) {
                return $item->total_amount;  // Assuming each order item has a total_amount field
            });
            return response()->json([
                'orderId' => $order->id,
                'orderItems' => $allOrderItems,
                'totalAmount' => $totalAmount,

            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the quantity of a product in the user's cart by incrementing or decrementing.
     */
    public function updateOrderItemQuantity(Request $request)
    {
        try {
            // Get the authenticated user
            $user = $request->user();
            $orderId = $request->input('orderId');
            $productId = $request->input('productId');
            $isIncrement = $request->input('isIncrement'); // true for increment, false for decrement

            // Ensure 'isIncrement' is either true or false
            if ($isIncrement === null) {
                return response()->json(['message' => 'isIncrement flag is required'], 400);
            }

            // Find the order associated with the provided orderId
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            // Check if the order belongs to the authenticated user
            if ($order->user_id !== $user->id) {
                return response()->json(['message' => 'You are not authorized to modify this order'], 403);
            }

            // Find the specific order item for the provided productId
            $orderItem = OrderItem::where('orders_id', $orderId)
                                ->where('products_id', $productId)
                                ->first();

            if (!$orderItem) {
                return response()->json(['message' => 'Product not found in cart'], 404);
            }

            // Get the price per product for recalculating the total amount
            $product = Product::find($productId);
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            $pricePerProduct = $product->price;

            // Store the previous total amount before updating the quantity
            $previousTotalAmount = $orderItem->total_amount;

            // Adjust the quantity based on the 'isIncrement' flag
            if ($isIncrement) {
                $orderItem->quantity += 1; // Increase quantity by 1
            } else {
                if ($orderItem->quantity > 1) {
                    $orderItem->quantity -= 1; // Decrease quantity by 1, but never go below 1
                } else {
                    return response()->json(['message' => 'Quantity cannot be less than 1'], 400);
                }
            }

            // Recalculate the total amount for the item
            $orderItem->total_amount = $orderItem->quantity * $pricePerProduct;

            // Save the updated order item
            $orderItem->save();

            // Update the total amount of the order by adding the difference between the new total and the old total
            $order->total_amount += $orderItem->total_amount - $previousTotalAmount;

            // Save the updated order
            $order->save();

            // Retrieve the updated order items
            $allOrderItems = OrderItem::where('orders_id', $orderId)->with('product')->get();
            $totalAmount = $allOrderItems->sum(function ($item) {
                return $item->total_amount;  // Assuming each order item has a total_amount field
            });
            return response()->json([
                'orderId' => $order->id,
                'orderItems' => $allOrderItems,
                'totalAmount' => $totalAmount,

            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

}