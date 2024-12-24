<?php
namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Coupon as StripeCoupon;
use Stripe\PaymentIntent;
use Exception;

class CheckoutController extends Controller
{
    public function __construct()
    {
        // Set Stripe API Key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    /**
     * Create a Stripe Checkout session
     */
    public function createCheckoutSession(Request $request)
    {
        try {
            $products = $request->input('products');
            $couponCode = $request->input('couponCode');
            
            // Validate products array
            if (!is_array($products) || count($products) === 0) {
                return response()->json(['error' => 'Invalid or empty products array'], 400);
            }

            $totalAmount = 0;
            $lineItems = [];

            // Loop over products and prepare Stripe line items
            foreach ($products as $product) {
                $amount = round($product['price'] * 100); // Stripe expects amount in cents
                $totalAmount += $amount * $product['quantity'];

                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $product['name'],
                            'images' => [$product['image']],
                        ],
                        'unit_amount' => $amount,
                    ],
                    'quantity' => $product['quantity'],
                ];
            }

            // Handle Coupon if provided
            $coupon = null;
            if ($couponCode) {
                $coupon = Coupon::where('code', $couponCode)
                    ->where('user_id', auth()->id())
                    ->where('is_active', true)
                    ->first();

                if ($coupon) {
                    $totalAmount -= round(($totalAmount * $coupon->discount_percentage) / 100);
                }
            }

            // Create the Checkout session
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => env('CLIENT_URL') . '/purchase-success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => env('CLIENT_URL') . '/purchase-cancel',
                'discounts' => $coupon
                    ? [
                        [
                            'coupon' => $this->createStripeCoupon($coupon->discount_percentage),
                        ],
                    ]
                    : [],
                'metadata' => [
                    'user_id' => auth()->id(),
                    'coupon_code' => $couponCode ?? '',
                    'products' => json_encode($products),
                ],
            ]);

            // Optionally, create a new coupon if total exceeds a certain amount
            if ($totalAmount >= 20000) {
                $this->createNewCoupon(auth()->id());
            }

            return response()->json([
                'id' => $session->id,
                'totalAmount' => $totalAmount / 100, // convert back to dollars
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error processing checkout', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle checkout success
     */
    public function checkoutSuccess(Request $request)
    {
        try {
            $sessionId = $request->input('sessionId');
            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                if ($session->metadata->coupon_code) {
                    Coupon::where('code', $session->metadata->coupon_code)
                        ->where('user_id', $session->metadata->user_id)
                        ->update(['is_active' => false]);
                }

                // Create a new Order
                $products = json_decode($session->metadata->products);
                $order = Order::create([
                    'user_id' => $session->metadata->user_id,
                    'total_amount' => $session->amount_total / 100, // Convert from cents to dollars
                    'stripe_session_id' => $sessionId,
                ]);

                foreach ($products as $product) {
                    $order->products()->create([
                        'product_id' => $product->id,
                        'quantity' => $product->quantity,
                        'price' => $product->price,
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful, order created, and coupon deactivated if used.',
                    'orderId' => $order->id,
                ]);
            }

            return response()->json(['error' => 'Payment not successful'], 400);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error processing successful checkout', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a Stripe coupon
     */
    private function createStripeCoupon($discountPercentage)
    {
        $coupon = StripeCoupon::create([
            'percent_off' => $discountPercentage,
            'duration' => 'once',
        ]);

        return $coupon->id;
    }

    /**
     * Create a new coupon for the user
     */
    private function createNewCoupon($userId)
    {
        Coupon::where('user_id', $userId)->delete(); // Remove any old coupons

        $newCoupon = Coupon::create([
            'code' => 'GIFT' . strtoupper(str_random(6)),
            'discount_percentage' => 10,
            'expiration_date' => now()->addDays(30),
            'user_id' => $userId,
        ]);

        return $newCoupon;
    }
}
