<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\ProductCoupon;
use App\Models\UserCoupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            Log::info('Product Ids', ['product id'=>$productIds]);

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
            $orderItems = OrderItem::where('orders_id', $order->id)->whereIn('products_id', $productIds)->with('product')->get();

            if ($orderItems->isEmpty()) {
                return response()->json(['message' => 'No matching products found in the order.'], 400);
            }

            // Calculate the total amount
            $totalAmount = $orderItems->sum(function ($item) {
                return $item->total_amount;  // Assuming each order item has a total_amount field
            });

            // Calculate the discount based on coupon type
            $discountAmount = 0;
            $discountAmount = ($totalAmount * $coupon->discount) / 100;

            $totalAfterDiscount = max(0, $totalAmount - $discountAmount);

            UserCoupon::where('users_id', $user->id)
                ->where('coupons_id', $coupon->id)
                ->delete(); // Delete the coupon from the user's active coupons

            // Return the updated order details with discount applied
            return response()->json([
                'order_id' => $order->id,
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'coupon' => $coupon,
                'total_after_discount' => $totalAfterDiscount,
                'order_items' => $orderItems,
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new coupon, check if any product has the same discount,
     * and assign the coupon to the products and the authenticated user.
     */
    public function create(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'discount' => 'required|numeric',
            'expiration_date' => 'required|date',
        ]);

        Log::info('Creating new coupon', ['discount' => $validated['discount'], 'expiration_date' => $validated['expiration_date']]);

        // Check if a product already has a coupon with the same discount
        $existingProducts = Product::whereHas('coupons', function ($query) use ($validated) {
            $query->where('discount', $validated['discount']);
        })->get();

        if ($existingProducts->isNotEmpty()) {
            Log::info('Found products with the same discount', ['discount' => $validated['discount'], 'products' => $existingProducts->pluck('id')]);
        }

        // Start a database transaction to ensure atomicity
        DB::beginTransaction(); // Start transaction for atomic operations

        try {
            // Create the new coupon
            $coupon = Coupon::create([
                'discount' => $validated['discount'],
                'expiration_date' => $validated['expiration_date'],
            ]);

            Log::info('Coupon created successfully', ['coupon_id' => $coupon->id]);

            // If any products already have the same discount, assign the new coupon to them
            foreach ($existingProducts as $product) {
                $product->coupons()->attach($coupon->id);
                Log::info('Coupon assigned to product', ['coupon_id' => $coupon->id, 'product_id' => $product->id]);
            }

            // Assign the coupon to the authenticated user (use request()->user()->id)
            $userId = $request->user()->id;  // Get the authenticated user's ID
            $coupon->users()->attach($userId);

            Log::info('Coupon assigned to user', ['coupon_id' => $coupon->id, 'user_id' => $userId]);

            DB::commit(); // Commit the transaction

            return response()->json($coupon, 201);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on error

            // Log the error
            Log::error('Error creating coupon', [
                'error' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'There was an error creating the coupon.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Get the coupons associated with the authenticated user.
     */
    public function getAllCoupons(Request $request)
    {
        // Get the authenticated user using the request()->user() helper
        $user = $request->user();

        // Log the action for tracking purposes
        Log::info('Fetching coupons for user', ['user_id' => $user->id]);

        // Fetch the user's coupons
        $coupons = $user->coupons;  // Assuming the relationship 'coupons' is defined in the User model

        if ($coupons->isEmpty()) {
            Log::info('No coupons found for user', ['user_id' => $user->id]);
            return response()->json([
                'message' => 'You have no coupons.',
                'coupons' => [],
            ], 200);
        }

        Log::info('Coupons found for user', ['user_id' => $user->id, 'coupons' => $coupons->pluck('id')]);

        // Return the coupons in a response
        return response()->json($coupons, 200);
    }
}
