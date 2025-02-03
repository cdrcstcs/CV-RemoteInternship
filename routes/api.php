<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\VehicleManagerController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\LicensePlateController;
use App\Http\Controllers\StreamTokenController;

// Apply CORS middleware globally on all routes in this file
Route::middleware('custom_cors')->group(function () {

    // Auth Routes
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware(['auth:sanctum', 'role:Administration,WarehouseManager,DeliveryDriver,Customer,CustomerSupportStaff,FinanceManager,ProductSaler,VehicleManager,ShipmentManager,DeliveryMan'])->group(function () {
        Route::get('/me', [UserProfileController::class, 'getCurrentUser']);
        Route::put('/user/profile', [UserProfileController::class, 'updateDetails']);
        Route::post('/user/change-password', [UserProfileController::class, 'updatePassword']);
        Route::get('/products/{productId}/ratings', [RatingController::class, 'getProductRatings']);
        Route::post('/products/{productId}/ratings', [RatingController::class, 'storeRating']);
        Route::get('/user/addresses', [UserProfileController::class, 'getUserAddresses']);  // Get all addresses
        Route::post('/user/addresses', [UserProfileController::class, 'storeUserAddress']); // Create a new address
        Route::put('/user/addresses/{id}', [UserProfileController::class, 'updateUserAddress']); // Update an existing address
        Route::get('/get-token', [StreamTokenController::class, 'getToken']);
    });
    
    // Route::middleware(['role:Administration,Customer,Customer Support Staff,Product Saler'])->group(function () {
    // });
    Route::get('/products/single/{id}', [ProductController::class, 'fetchProductById']);
    Route::get('/products/featured', [ProductController::class, 'getFeaturedProducts']);
    Route::post('/products/categories', [ProductController::class, 'getProductsByCategory']);
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
        Route::post('/payment/delivery/prepare', [PaymentController::class, 'prepareDelivery']);
        Route::get('/orders/{orderId}/status', [OrderController::class, 'getOrderStatusById']);
        Route::post('/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
    });
    // Product Routes (Admin only)
    Route::get('/products', [ProductController::class, 'getAllProducts']);
    Route::post('/products', [ProductController::class, 'createProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
    Route::patch('/products/{id}', [ProductController::class, 'toggleFeaturedProduct']);
    Route::get('/analytics', [AnalyticsController::class, 'getAnalyticsData']);

    Route::middleware(['auth:sanctum','role:Administration,WarehouseManager'])->group(function () {
        Route::post('/expense', [WarehouseController::class, 'filterExpenses']);
        Route::post('/warehouse/inventories', [WarehouseController::class, 'getInventoriesForWarehouse']);
        Route::put('/warehouse/inventories', [WarehouseController::class, 'updateInventory']);
        Route::post('/warehouse/line-chart', [WarehouseController::class, 'lineChart']);
        Route::get('/warehouse/geography', [WarehouseController::class, 'getGeography']);
        Route::post('/warehouse/create-inventory', [WarehouseController::class, 'createInventory']);
        Route::get('/warehouse/capacity', [WarehouseController::class, 'getTotalInventoryWeightForUserWarehouse']);
        Route::get('/warehouse/orders', [WarehouseController::class, 'getOrdersByUserWarehouse']);
        Route::post('/orders/{orderId}/status', [WarehouseController::class, 'updateOrderStatus']);
        Route::post('/process-license-plate', [LicensePlateController::class, 'processLicensePlate']);
    });

    Route::middleware(['auth:sanctum','role:Administration,VehicleManager'])->group(function () {
        Route::get('/vehicles', [VehicleManagerController::class, 'getVehiclesWithVehicleManagement']);
        Route::put('/vehicles/{vehicleId}', [VehicleManagerController::class, 'updateVehicleWithManagement']);

    });

    Route::middleware(['auth:sanctum','role:Administration,DeliveryMan'])->group(function () {
        Route::get('/shipments/with-details', [DeliveryController::class, 'getShipmentsWithRouteDetails']);
        Route::put('/route-details/{routeDetailId}', [DeliveryController::class, 'assignVehicle']);
        Route::get('/user/vehicle', [DeliveryController::class, 'getVehicleForAuthenticatedUser']);
    });

});
