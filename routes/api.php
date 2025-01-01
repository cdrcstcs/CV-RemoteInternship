<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\UserProfileController;

// Apply CORS middleware globally on all routes in this file
Route::middleware('custom_cors')->group(function () {

    // Auth Routes
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware(['auth:sanctum', 'role:Administration,WarehouseManager,DeliveryDriver,Customer,CustomerSupportStaff,FinanceManager,ProductSaler'])->group(function () {
        Route::get('/me', [AuthController::class, 'getCurrentUser']);
        Route::put('/user/profile', [UserProfileController::class, 'updateDetails']);
        Route::post('/user/change-password', [UserProfileController::class, 'updatePassword']);
    });

    // Route::middleware(['role:Administration,Customer,Customer Support Staff,Product Saler'])->group(function () {
    // });
    Route::get('/products/featured', [ProductController::class, 'getFeaturedProducts']);
    Route::get('/products/category/{category}', [ProductController::class, 'getProductsByCategory']);
    Route::get('/products/recommendations', [ProductController::class, 'getRecommendedProducts']);

    // Protected Routes
    Route::middleware(['auth:sanctum','role:Administration,Customer,CustomerSupportStaff,ProductSaler'])->group(function () {
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

    Route::middleware(['auth:sanctum','role:Administration,WarehouseManager'])->group(function () {
        Route::post('/expense', [ExpenseController::class, 'filterExpenses']);
    });

});
