<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;

// Apply CORS middleware globally on all routes in this file
Route::middleware('custom_cors')->group(function () {

    // Auth Routes
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware(['auth:sanctum','role:Administration,Warehouse Manager,Delivery Driver,Customer,Customer Support Staff,Finance Manager,Product Saler'])->get('/me', [AuthController::class, 'getCurrentUser']);

    Route::middleware(['role:Administration,Customer,Customer Support Staff,Product Saler'])->group(function () {
        Route::get('/products/featured', [ProductController::class, 'getFeaturedProducts']);
        Route::get('/products/category/{category}', [ProductController::class, 'getProductsByCategory']);
        Route::get('/products/recommendations', [ProductController::class, 'getRecommendedProducts']);
    });

    // Protected Routes
    Route::middleware(['auth:sanctum','role:Administration,Customer,Customer Support Staff,Product Saler'])->group(function () {
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
        Route::post('/cart', [CartController::class, 'addToCart']);
        Route::delete('/cart', [CartController::class, 'removeCartItem']);
        Route::put('/cart/quantity', [CartController::class, 'updateOrderItemQuantity']);
        Route::post('/coupon', [CouponController::class, 'getMyCoupon']);
        Route::post('/coupon/apply', [CouponController::class, 'applyCoupon']);
        Route::post('/payment/process', [PaymentController::class, 'processPayment']);
    });
    // Product Routes (Admin only)
    Route::get('/products', [ProductController::class, 'getAllProducts']);
    Route::post('/products', [ProductController::class, 'createProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
    Route::patch('/products/{id}', [ProductController::class, 'toggleFeaturedProduct']);
    Route::get('/analytics', [AnalyticsController::class, 'getAnalyticsData']);
});
