<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Log; // Import the Log facade

class StripeController extends Controller
{
    // Constructor to set your Stripe Secret Key
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    // Create a payment intent
    public function createPaymentIntent(Request $request)
    {
        try {
            // Log incoming request data
            Log::info('Creating payment intent', [
                'amount' => $request->amount,
                'currency' => $request->currency,
            ]);

            // You can pass dynamic amount from the front-end
            $amount = (int) ($request->amount * 100); // Convert to cents (e.g., 275.79 -> 27579)
            $currency = $request->currency;

            // Create the PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency, // or another currency
                'metadata' => ['integration_check' => 'accept_a_payment'],
            ]);

            // Log the successful creation of the payment intent
            Log::info('Payment intent created successfully', [
                'paymentIntentId' => $paymentIntent->id,
                'clientSecret' => $paymentIntent->client_secret,
            ]);

            // Return the client secret to the front-end
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            // Log the exception if there is any error
            Log::error('Error creating payment intent', [
                'error_message' => $e->getMessage(),
                'error_stack' => $e->getTraceAsString(), // Optionally log the stack trace
            ]);

            // Return error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
