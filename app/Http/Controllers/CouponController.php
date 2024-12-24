<?php
namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Get the active coupon for the authenticated user.
     */
    public function getCoupon(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user

            // Fetch the active coupon for the user
            $coupon = Coupon::where('user_id', $user->id)
                            ->where('is_active', true)
                            ->first();

            return response()->json($coupon ?: null);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Validate the provided coupon code for the authenticated user.
     */
    public function validateCoupon(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user
            $code = $request->input('code');  // Get the coupon code from the request

            // Find the coupon for the user and validate if it's active
            $coupon = Coupon::where('code', $code)
                            ->where('user_id', $user->id)
                            ->where('is_active', true)
                            ->first();

            if (!$coupon) {
                return response()->json(['message' => 'Coupon not found'], 404);
            }

            // Check if the coupon has expired
            if ($coupon->expiration_date < now()) {
                $coupon->is_active = false;
                $coupon->save();
                return response()->json(['message' => 'Coupon expired'], 404);
            }

            return response()->json([
                'message' => 'Coupon is valid',
                'code' => $coupon->code,
                'discount_percentage' => $coupon->discount_percentage
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }
}
