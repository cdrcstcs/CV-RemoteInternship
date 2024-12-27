<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\ProductCoupon;
use App\Models\UserCoupon;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CouponController extends Controller
{
    /**
     * Get the active coupon for the authenticated user.
     */
    public function getMyCoupon(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user
            $productIds = $request->productIds;  // Product IDs from the request

            if (empty($productIds)) {
                return response()->json(['message' => 'No products in the cart.'], 400);
            }

            // Find coupons applicable for the products in the user's cart
            $validCoupons = ProductCoupon::whereIn('products_id', $productIds)
                ->whereIn('coupons_id', function ($query) use ($user) {
                    $query->select('coupons_id')
                        ->from('users_coupons')
                        ->where('users_id', $user->id);
                })
                ->get();

            if ($validCoupons->isEmpty()) {
                return response()->json(['message' => 'No valid coupons for the selected products.'], 400);
            }

            // Return the coupons with their details
            $coupons = Coupon::whereIn('id', $validCoupons->pluck('coupons_id'))->get();

            return response()->json($coupons);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Validate and apply the coupon for the authenticated user.
     */
    public function applyCoupon(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user
            $couponId = $request->couponId;  // Coupon code from the request
            $productIds = $request->productIds;  // Product IDs from the request
            $orderId = $request->orderId;  // Order ID (if applicable)

            if (empty($productIds)) {
                return response()->json(['message' => 'No products in the cart.'], 400);
            }

            // Validate if the coupon exists
            $coupon = Coupon::where('id', $couponId)->first();

            if (!$coupon) {
                return response()->json(['message' => 'Coupon code is invalid.'], 400);
            }

            // Check if the coupon is associated with the products in the cart
            $productCoupon = ProductCoupon::whereIn('products_id', $productIds)
                ->where('coupons_id', $coupon->id)
                ->first();

            if (!$productCoupon) {
                return response()->json(['message' => 'Coupon is not valid for the selected products.'], 400);
            }

            // Now, let's apply the coupon to the user's cart and calculate the total amount
            $order = Order::find($orderId);

            if (!$order || $order->user_id !== $user->id) {
                return response()->json(['message' => 'Order not found or unauthorized.'], 400);
            }

            // Get the order items for the products in the cart
            $orderItems = $order->orderItems()->whereIn('products_id', $productIds)->get();

            if ($orderItems->isEmpty()) {
                return response()->json(['message' => 'No matching products found in the order.'], 400);
            }

            // Calculate the total amount
            $totalAmount = $orderItems->sum(function ($item) {
                return $item->total_amount;  // Assuming each order item has a total_amount field
            });

            // Calculate the discount based on coupon type
            $discountAmount = 0;
            if ($coupon->discount_type === 'percentage') {
                $discountAmount = ($totalAmount * $coupon->discount) / 100;
            } elseif ($coupon->discount_type === 'fixed') {
                $discountAmount = $coupon->discount;
            }

            $totalAfterDiscount = max(0, $totalAmount - $discountAmount);

            UserCoupon::where('users_id', $user->id)
                ->where('coupons_id', $coupon->id)
                ->delete(); // Delete the coupon from the user's active coupons

            // Return the updated order details with discount applied
            return response()->json([
                'order_id' => $order->id,
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'total_after_discount' => $totalAfterDiscount,
                'order_items' => $orderItems,
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }
}
