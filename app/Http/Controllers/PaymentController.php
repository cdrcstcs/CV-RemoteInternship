<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderItem;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Set Stripe API Key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    /**
     * Handle the payment processing through an AJAX request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processPayment(Request $request)
    {
        // Validate the payment data coming from frontend
        $validatedData = $request->validate([
            'orderId' => 'required|exists:orders,id',
            'payment_method' => 'required|string',
            'gateway' => 'required|string',
            'currency' => 'required|string',
        ]);

        // Log the incoming request data for debugging
        Log::info('Received request to create checkout session', $request->all());

        // Get the input data
        $orderId = $request->input('orderId');
        Log::info('Order ID: ' . $orderId);

        // Retrieve the order
        $order = Order::findOrFail($validatedData['orderId']);

        // Check if the user is authorized to make this payment (for security reasons)
        if ($order->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

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
                    'currency' => $validatedData['currency'],
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
        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => env('FRONTEND_URL') . '/purchase-success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => env('FRONTEND_URL') . '/purchase-cancel',
                'metadata' => [
                    'order_id' => $orderId,
                ],
            ]);

            Log::info('Stripe session created successfully with ID: ' . $session->id);

            // Return the session id to frontend
            return response()->json([
                'id' => $session->id,
            ]);
        } catch (Exception $e) {
            Log::error('Error creating Stripe session: ' . $e->getMessage());
            return response()->json(['error' => 'Error creating Stripe session: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Handle the Stripe webhook for payment success
     */
    public function handleStripeWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');

        // Verify webhook signature
        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            Log::error('Invalid payload received for Stripe webhook: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            Log::error('Invalid signature received for Stripe webhook: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event (payment success)
        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $orderId = $session->metadata->order_id;

            // Retrieve the order from the database
            $order = Order::findOrFail($orderId);

            // Update order status to 'Paid' and save the payment information
            $payment = new Payment();
            $payment->order_id = $order->id;
            $payment->total_amount = $order->total_amount;
            $payment->paid_amount = $order->total_amount;
            $payment->due_amount = 0; // No due amount as it's fully paid
            $payment->payment_method = 'credit_card'; // Assuming the method from Stripe
            $payment->gateway = 'stripe'; // Stripe gateway
            $payment->currency = $session->currency;
            $payment->payment_status = 'success';
            $payment->payment_date = now();
            $payment->providers_id = 1; // Use the current provider
            $payment->save();

            // Mark order as paid
            $order->status = 'Paid';
            $order->save();

            Log::info('Payment successfully processed for order ID: ' . $orderId);
            return Inertia::render('PurchaseSuccessPage', $orderId);        
        }

        return response()->json(['status' => 'success']);
    }
}
