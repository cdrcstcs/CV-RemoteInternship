<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get all the products in the cart with quantities.
     */
    public function getCartProducts(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user

            // Fetch products from the database where the product ID is in the cartItems
            $products = Product::whereIn('id', $user->cartItems->pluck('id'))->get();

            // Add quantity to each product in the cart
            $cartItems = $products->map(function ($product) use ($user) {
                $item = $user->cartItems->firstWhere('id', $product->id);
                return array_merge($product->toArray(), ['quantity' => $item['quantity']]);
            });

            return response()->json($cartItems);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Add product to the user's cart.
     */
    public function addToCart(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user
            $productId = $request->input('productId');

            // Check if the product is already in the cart
            $existingItem = $user->cartItems->firstWhere('id', $productId);

            if ($existingItem) {
                // Increment the quantity if the product exists in the cart
                $existingItem['quantity'] += 1;
            } else {
                // Add the product to the cart with quantity 1
                $user->cartItems->push(['id' => $productId, 'quantity' => 1]);
            }

            $user->save();  // Save the updated cartItems

            return response()->json($user->cartItems);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove a product or all products from the user's cart.
     */
    public function removeAllFromCart(Request $request)
    {
        try {
            $user = $request->user();  // Get the authenticated user
            $productId = $request->input('productId');

            if (!$productId) {
                // If no productId is provided, clear all items in the cart
                $user->cartItems = [];
            } else {
                // Remove the specific product from the cart
                $user->cartItems = $user->cartItems->filter(function ($item) use ($productId) {
                    return $item['id'] !== $productId;
                });
            }

            $user->save();  // Save the updated cartItems

            return response()->json($user->cartItems);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the quantity of a product in the user's cart.
     */
    public function updateQuantity(Request $request, $productId)
    {
        try {
            $user = $request->user();  // Get the authenticated user
            $quantity = $request->input('quantity');

            // Find the item in the user's cart
            $existingItem = $user->cartItems->firstWhere('id', $productId);

            if ($existingItem) {
                if ($quantity == 0) {
                    // If quantity is 0, remove the product from the cart
                    $user->cartItems = $user->cartItems->filter(function ($item) use ($productId) {
                        return $item['id'] !== $productId;
                    });
                } else {
                    // Otherwise, update the quantity
                    $existingItem['quantity'] = $quantity;
                }

                $user->save();  // Save the updated cartItems

                return response()->json($user->cartItems);
            } else {
                return response()->json(['message' => 'Product not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }
}
