<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
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

        // Retrieve the order
        $order = Order::findOrFail($validatedData['orderId']);

        // Check if the user is authorized to make this payment (for security reasons)
        if ($order->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        // Create the payment record
        $payment = new Payment();
        $payment->order_id = $order->id;
        $payment->total_amount = $order->total_amount;
        $payment->paid_amount = $order->total_amount;
        $payment->due_amount = $order->total_amount - $payment->paid_amount;
        $payment->payment_method = $validatedData['payment_method']; // 'credit_card', 'paypal', etc.
        $payment->gateway = $validatedData['gateway']; // 'stripe', 'razorpay', etc.
        $payment->currency = $validatedData['currency'];
        $payment->payment_status = 'success'; // Assuming success if no issues
        $payment->payment_date = now(); // Use the current date and time
        $payment->providers_id = 1; // Use the current date and time
        $payment->save();

        $order->status = 'paid';
        $order->save();

        // Return a successful response with the payment details
        return response()->json(['success' => 'Payment processed successfully', 'payment' => $payment]);
    }
}
