<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderConfirmationMail;

class MailController extends Controller
{
    public function sendEmail(Request $request)
    {
        // Log incoming request data
        Log::info('Received order email request', [
            'cart' => $request->input('cart'),
            'orderId' => $request->input('orderId'),
            'routeDetails' => $request->input('routeDetails'),
            'totalAmount' => $request->input('totalAmount'),
            'discountAmount' => $request->input('discountAmount'),
            'totalAfterDiscount' => $request->input('totalAfterDiscount'),
            'orderStatus' => $request->input('orderStatus'),
            'totalDistance' => $request->input('totalDistance'),
            'feedbackForms' => $request->input('feedbackForms')
        ]);

        // Validate the incoming request
        $validatedData = $request->validate([
            'cart' => 'required|array',
            'orderId' => 'required|numeric',
            'routeDetails' => 'required|array',
            'totalAmount' => 'required|numeric',
            'discountAmount' => 'required|numeric',
            'totalAfterDiscount' => 'required|numeric',
            'orderStatus' => 'required|string',
            'totalDistance' => 'required|numeric',
            'feedbackForms' => 'required|array',
        ]);

        // Extract variables from request
        $cart = $validatedData['cart'];
        $orderId = $validatedData['orderId'];
        $routeDetails = $validatedData['routeDetails'];
        $totalAmount = $validatedData['totalAmount'];
        $discountAmount = $validatedData['discountAmount'];
        $totalAfterDiscount = $validatedData['totalAfterDiscount'];
        $orderStatus = $validatedData['orderStatus'];
        $totalDistance = $validatedData['totalDistance'];
        $feedbackForms = $validatedData['feedbackForms'];

        // Log extracted data after validation
        Log::info('Validated order data', [
            'cart' => $cart,
            'orderId' => $orderId,
            'routeDetails' => $routeDetails,
            'totalAmount' => $totalAmount,
            'discountAmount' => $discountAmount,
            'totalAfterDiscount' => $totalAfterDiscount,
            'orderStatus' => $orderStatus,
            'totalDistance' => $totalDistance,
            'feedbackFormsCount' => count($feedbackForms)
        ]);

        // Format the cart items
        $cartItems = array_map(function ($item) {
            return [
                'productName' => $item['product']['name'],
                'quantity' => $item['quantity'],
                'price' => number_format($item['total_amount'], 2),
                'image' => $item['product']['image'],
                'totalAmount' => number_format($item['total_amount'], 2)
            ];
        }, $cart);

        // Format route details
        $routeDetailsFormatted = array_map(function ($route) {
            return [
                'routeName' => $route['route_name'],
                'supplier' => $route['supplier_name'] ?? 'N/A',
                'warehouse' => $route['warehouse_name_1'] ?? 'N/A',
                'destination' => $route['end_location'],
                'estimatedTime' => $route['estimated_time'],
                'distance' => $route['distance']
            ];
        }, $routeDetails);

        // Prepare summary information
        $orderSummary = [
            'orderId' => $orderId ?: 'N/A',
            'totalAmount' => number_format($totalAmount, 2),
            'discountAmount' => $discountAmount > 0 ? number_format($discountAmount, 2) : '0.00',
            'totalAfterDiscount' => number_format($totalAfterDiscount, 2),
            'orderStatus' => $orderStatus ?: 'Pending',
            'totalDistance' => $totalDistance ?: '0',
            'feedbackFormsAvailable' => count($feedbackForms) > 0 ? count($feedbackForms) : 0,
        ];

        // Log order summary before sending email
        Log::info('Order summary prepared', $orderSummary);

        // Return the structured order data
        $orderData = [
            'orderSummary' => $orderSummary,
            'cartItems' => $cartItems,
            'routeDetails' => $routeDetailsFormatted,
            'feedbackFormsAvailable' => count($feedbackForms) > 0,
        ];

        // Send the order confirmation email
        try {
            Mail::to('nguyendanghieu0608@gmail.com') // Replace with the recipient's email
                ->send(new OrderConfirmationMail($orderData));

            Log::info('Email sent successfully to nguyen...@gmail.com');
            return response()->json(['message' => 'Order processed and email sent successfully'], 200);
        } catch (\Exception $e) {
            // Log the error if email sending fails
            Log::error('Error sending email', [
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error sending email: ' . $e->getMessage()], 500);
        }
    }
}
