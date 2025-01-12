<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAddress;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\OrderItem;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class UserProfileController extends Controller
{

    // Update user details (first name, last name, email, etc.)
    public function updateDetails(Request $request)
    {
        $user = $request->user();

        // Validate the request data
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone_number' => 'nullable|string|max:20',
            'language' => 'nullable|string|max:10',
        ]);

        // Update user details
        $user->update($validated);

        // Return updated user profile as JSON
        return response()->json($user);
    }

    // Update the user's password
    public function updatePassword(Request $request)
    {
        // Validate the password data
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8', // Must be confirmed
        ]);

        $user = $request->user();

        // Check if the current password matches
        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        // Update the password
        $user->update([
            'password' => Hash::make($validated['newPassword']),
        ]);

        // Return success response
        return response()->json(['message' => 'Password updated successfully']);
    }

    /**
     * Display a listing of the user's addresses.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserAddresses(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Get all the addresses for the authenticated user
        $addresses = $user->addresses;  // Assuming the relationship method on the User model is `addresses`

        // Return the addresses as a JSON response
        return response()->json($addresses);
    }

    /**
     * Store a newly created address for the authenticated user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function storeUserAddress(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_primary' => 'nullable|boolean',
        ]);

        // Get the authenticated user
        $user = $request->user();

        // Create the address for the user
        $address = $user->addresses()->create($validated);

        // Return a response with the created address
        return response()->json($address, 201);
    }

    /**
     * Update the specified address for the authenticated user.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function updateUserAddress(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_primary' => 'nullable|boolean',
        ]);

        // Get the authenticated user
        $user = $request->user();

        // Find the address by ID, ensuring it belongs to the authenticated user
        $address = $user->addresses()->findOrFail($id);

        // Update the address
        $address->update($validated);

        // Return a response with the updated address
        return response()->json($address);
    }

    public function getCurrentUser(Request $request)
    {
        // Log the incoming request to verify who is making the request
        Log::info('getCurrentUser request started', ['user_id' => $request->user()->id]);

        // Get the authenticated user
        $user = $request->user();

        // Log user information before eager loading
        Log::info('Authenticated user fetched', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'user_roles' => $user->roles->pluck('role_name'),  // Pluck role names
        ]);

        // Eager load the related roles and permissions
        $userWithDetails = $user->load([
            'roles.permissions',       // Eager load roles and their associated permissions
        ]);

        // Log after eager loading
        Log::info('User data with roles and permissions loaded', [
            'roles_count' => $userWithDetails->roles->count(),
        ]);

        // Format the roles and permissions for frontend expectations
        $userWithDetails->roles = $userWithDetails->roles->map(function ($role) {
            Log::info('Mapping role', ['role_name' => $role->role_name]); // Log each role name
            return [
                'role_name' => $role->role_name,
                'permissions' => $role->permissions->map(function ($permission) {
                    Log::info('Mapping permission', ['permission_name' => $permission->permission_name]); // Log each permission
                    return [
                        'permission_name' => $permission->permission_name,
                    ];
                }),
            ];
        });

        // Log the roles and permissions after mapping
        Log::info('Roles and permissions after mapping', ['roles' => $userWithDetails->roles]);

        // Format the orders and include order_items, products, and payment for frontend expectations
        $userWithDetails->orders = $userWithDetails->orders->map(function ($order) use ($user) {
            Log::info('Mapping order', [
                'order_id' => $order->id,
                'order_status' => $order->status,
                'order_total_amount' => $order->total_amount,
            ]);

            // Query the order items separately using the order_id
            $orderItems = OrderItem::where('orders_id', $order->id)->get();

            $formattedOrderItems = $orderItems->map(function ($orderItem) {
                Log::info('Mapping order item', [
                    'order_item_id' => $orderItem->id,
                    'quantity' => $orderItem->quantity,
                    'total_amount' => $orderItem->total_amount,
                    'product_id' => $orderItem->product_id,
                ]);
                
                // Include the product details for this order item
                $product = $orderItem->product;
                $productDetails = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'image' => $product->image,
                    'description'=> $product->description,
                    'price' => $product->price,
                    'isFeatured' => $product->isFeatured,
                    // Add categories for this product
                    'categories' => $product->categories->map(function ($category) {
                        return [
                            'category_name' => $category->category_name,
                            'category_description' => $category->description,
                        ];
                    }),
                ];

                return [
                    'order_item_id' => $orderItem->id,
                    'quantity' => $orderItem->quantity,
                    'total_amount' => $orderItem->total_amount,
                    'product' => $productDetails, // Include product details
                ];
            });

            // Query the associated payment for the order separately using order_id
            $paymentData = Payment::where('order_id', $order->id)->first();

            $formattedPaymentData = $paymentData ? [
                'payment_id' => $paymentData->id,
                'total_amount' => $paymentData->total_amount,
                'paid_amount' => $paymentData->paid_amount,
                'due_amount' => $paymentData->due_amount,
                'payment_status' => $paymentData->payment_status,
                'payment_method' => $paymentData->payment_method,
                'payment_date' => $paymentData->payment_date,
                'gateway' => $paymentData->gateway,
                'currency' => $paymentData->currency,
            ] : null;
            Log::info('Payment Data', ['payment' => $paymentData]);

            return [
                'id' => $order->id,
                'status' => $order->status,
                'order_date' => $order->order_date,
                'total_amount' => $order->total_amount,
                'tracking_number' => $order->tracking_number,
                'order_items' => $formattedOrderItems, // Include order items in the order data
                'payment' => $formattedPaymentData,    // Include associated payment for the order
            ];
        });

        // Log orders after mapping
        Log::info('Orders after mapping', ['orders' => $userWithDetails->orders]);

        // Now we loop through the invoices and find the payment associated with each invoice
        $invoices = Invoice::all()->map(function ($invoice) {
            Log::info('Mapping invoice', [
                'invoice_id' => $invoice->id,
                'customer_name' => $invoice->customer_name,
                'total_amount' => $invoice->total_amount,
                'paid_amount' => $invoice->paid_amount,
                'payment_status' => $invoice->payment_status,
            ]);

            // Query the associated payment using payment_id
            $paymentData = Payment::where('id', $invoice->payments_id)->first();

            $formattedPaymentData = $paymentData ? [
                'payment_id' => $paymentData->id,
                'payment_status' => $paymentData->payment_status,
                'payment_method' => $paymentData->payment_method,
                'total_amount' => $paymentData->total_amount,
                'paid_amount' => $paymentData->paid_amount,
                'due_amount' => $paymentData->due_amount,
            ] : null;

            return [
                'invoice_id' => $invoice->id,
                'customer_name' => $invoice->customer_name,
                'total_amount' => $invoice->total_amount,
                'paid_amount' => $invoice->paid_amount,
                'due_amount' => $invoice->due_amount,
                'payment_status' => $invoice->payment_status,
                'payment_method' => $invoice->payment_method,
                'created_date' => $invoice->created_date,
                'discount' => $invoice->discount,
                'currency' => $invoice->currency,
                'payment' => $formattedPaymentData, // Include associated payment data
            ];
        });

        // Log invoices after mapping
        Log::info('Invoices after mapping', ['invoices' => $invoices]);

        // Return the formatted user data along with the loaded roles, permissions, orders, payments, and invoices
        Log::info('Returning response with user details', [
            'user' => [
                'id' => $userWithDetails->id,
                'first_name' => $userWithDetails->first_name,
                'last_name' => $userWithDetails->last_name,
                'email' => $userWithDetails->email,
                'phone_number' => $userWithDetails->phone_number,
                'language' => $userWithDetails->language,
            ],
            'roles' => $userWithDetails->roles,
            'permissions' => $userWithDetails->roles->pluck('permissions')->flatten(),
            'orders' => $userWithDetails->orders,
            'invoices' => $invoices,
            'payments' => $userWithDetails->payments, // Include payments for the user
        ]);

        return response()->json([
            'user' => [
                'id' => $userWithDetails->id,
                'first_name' => $userWithDetails->first_name,
                'last_name' => $userWithDetails->last_name,
                'email' => $userWithDetails->email,
                'phone_number' => $userWithDetails->phone_number,
                'language' => $userWithDetails->language,
            ],
            'roles' => $userWithDetails->roles,
            'permissions' => $userWithDetails->roles->pluck('permissions')->flatten(),
            'orders' => $userWithDetails->orders,
            'invoices' => $invoices,
        ]);
    }



}
