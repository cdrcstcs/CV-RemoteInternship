<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Exception;
use Illuminate\Support\Facades\Log;

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
            // Log the incoming request data
            Log::info('Received request to create checkout session', $request->all());

            // Get the input data
            $orderId = $request->input('orderId');
            Log::info('Order ID: ' . $orderId);

            // Fetch order items for the given orderId
            $orderItems = OrderItem::where('orders_id', $orderId)->with('product')->get();
            Log::info('Fetched order items: ' . $orderItems->count());

            if ($orderItems->isEmpty()) {
                Log::error('No order items found for this order.');
                return response()->json(['error' => 'No order items found for this order.'], 400);
            }

            // Prepare line items for Stripe Checkout
            $lineItems = [];
            foreach ($orderItems as $orderItem) {
                $product = $orderItem->product; // Product associated with this order item
                Log::info('Processing order item for product: ' . $product->name);

                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $product->name,
                            'images' => [$product->image], // Assuming 'image' is a valid field in the Product model
                        ],
                        'unit_amount' => (int)($product->price * 100), // Convert price to cents (integer)
                    ],
                    'quantity' => $orderItem->quantity, // Quantity from the order item
                ];
            }

            Log::info('Prepared line items for Stripe Checkout: ' . count($lineItems));

            // Create the Checkout session
            $sessionData = [
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => env('FRONTEND_URL') . '/purchase-success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => env('FRONTEND_URL') . '/purchase-cancel',
                'metadata' => [
                    'order_id' => $orderId,
                ],
            ];
            Log::info('Success URL: ' . env('FRONTEND_URL') . '/purchase-success?session_id={CHECKOUT_SESSION_ID}');
            Log::info('Cancel URL: ' . env('FRONTEND_URL') . '/purchase-cancel');
            
            // Log the session data before creating the session
            Log::info('Creating Stripe session with data: ', $sessionData);

            // Create Stripe session
            $session = Session::create($sessionData);
            Log::info('Stripe session created successfully with ID: ' . $session->id);

            // Return the session id
            return response()->json([
                'id' => $session->id,
            ]);

        } catch (Exception $e) {
            // Log the exception message and stack trace
            Log::error('Error processing checkout', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
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
            Log::info('Received session ID: ' . $sessionId);

            // Retrieve session data from Stripe
            $session = Session::retrieve($sessionId);
            Log::info('Retrieved session data: ', (array) $session);

            if ($session->payment_status === 'paid') {
                // Process the order, update payment status, etc.
                $orderId = $session->metadata->order_id;
                Log::info('Payment was successful, updating order status for Order ID: ' . $orderId);

                // Update order status
                $order = Order::find($orderId);

                if ($order) {
                    $order->status = 'paid'; // Update the order status as paid
                    $order->save();
                    Log::info('Order updated successfully: ' . $orderId);
                } else {
                    Log::warning('Order not found for ID: ' . $orderId);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful, order updated.',
                ]);
            }

            Log::warning('Payment not successful for session ID: ' . $sessionId);
            return response()->json(['error' => 'Payment not successful'], 400);

        } catch (Exception $e) {
            // Log the exception
            Log::error('Error processing successful checkout', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Error processing successful checkout', 'error' => $e->getMessage()], 500);
        }
    }
}
