<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;

// Apply CORS middleware globally on all routes in this file
Route::middleware('custom_cors')->group(function () {

    // Auth Routes
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'getCurrentUser']);

    // Public Product Routes
    Route::get('/products/featured', [ProductController::class, 'getFeaturedProducts']);
    Route::get('/products/category/{category}', [ProductController::class, 'getProductsByCategory']);
    Route::get('/products/recommendations', [ProductController::class, 'getRecommendedProducts']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
        
        // Cart Routes (Authenticated users)
        Route::post('/cart', [CartController::class, 'addToCart']);
        Route::delete('/allfromcart', [CartController::class, 'removeAllFromCart']);
        Route::delete('/cart', [CartController::class, 'removeCartItem']);
        Route::put('/cart/quantity', [CartController::class, 'updateOrderItemQuantity']);

        // Coupon Routes (Authenticated users)
        Route::post('/coupon', [CouponController::class, 'getMyCoupon']);
        Route::post('/coupon/apply', [CouponController::class, 'applyCoupon']);

        // Payment Routes (Authenticated users)
        Route::post('/payment/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);
        Route::post('/payment/checkout-success', [PaymentController::class, 'checkoutSuccess']);
        Route::put('/payment/update-total', [PaymentController::class, 'updateOrderTotal']);

        // Product Routes (Admin only)
        Route::get('/products', [ProductController::class, 'getAllProducts']);
        Route::post('/products', [ProductController::class, 'createProduct']);
        Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
        Route::patch('/products/{id}', [ProductController::class, 'toggleFeaturedProduct']);

        // Analytics Routes (Admin only)
        Route::get('/analytics', [AnalyticsController::class, 'getAnalyticsData']);

    });
});
