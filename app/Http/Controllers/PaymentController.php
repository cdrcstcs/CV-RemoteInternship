<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipment;
use App\Models\Payment;
use App\Models\RouteOptimization;
use App\Models\RouteDetail;
use App\Models\OrderItem;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

$trackingNumber = 'TRACK-' . strtoupper(Str::random(10));  // Generate a random tracking number

class PaymentController extends Controller
{
    protected $mapboxApiKey;

    // Injecting the necessary keys and URLs
    public function __construct()
    {
        // Set your Mapbox API key here
        $this->mapboxApiKey = env('MAPBOX_API_KEY');  // Updated to the correct Mapbox token name
        
    }

    /**
     * Geocode an address using Mapbox Geocoding API
     *
     * @param string $address
     * @return array|null
     */
    public function geocodeAddress($address)
    {
        // Check if the address is valid (non-empty)
        if (empty($address)) {
            Log::error('Geocoding failed, empty address', ['address' => $address]);
            return null;  // or return some error message if necessary
        }

        // Log the received address for debugging
        Log::info('Geocoding address received', ['address' => $address]);

        // Check if the address is already cached
        $cacheKey = 'geocode_' . md5($address);  // Create a unique cache key based on the address

        // Try to get the geocoded data from cache
        $result = Cache::get($cacheKey);

        if ($result) {
            // If the result is cached, return it directly
            Log::info('Returning geocoded address from cache', ['address' => $address]);
            return $result;
        }

        // If the result is not cached, perform the geocoding API call
        $url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' . urlencode($address) . '.json';

        // Perform geocoding API call
        $response = Http::get($url, [
            'access_token' => $this->mapboxApiKey,
            'limit' => 1,  // Adjust the limit to control how many results you want
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $result = $response->json()['features'][0] ?? null;

            if ($result) {
                // Extract the geocoded coordinates (longitude, latitude)
                $longitude = $result['geometry']['coordinates'][0];
                $latitude = $result['geometry']['coordinates'][1];

                // Check if the coordinates fall within the valid bounds for Mapbox
                if (!$this->isValidCoordinates($latitude, $longitude)) {
                    // If not valid, adjust them (optional: you could set a default fallback location or adjust to nearest valid point)
                    Log::warning('Coordinates are out of Mapbox bounds, adjusting coordinates.', [
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                    ]);

                    // Adjust the coordinates to fit within Mapbox bounds
                    // Latitude between -85 and 85
                    // Longitude between -180 and 180
                    $latitude = max(min($latitude, 85), -85);  
                    $longitude = max(min($longitude, 180), -180);

                    // Optionally, log the adjustment
                    Log::info('Adjusted coordinates to be within Mapbox bounds.', [
                        'adjusted_latitude' => $latitude,
                        'adjusted_longitude' => $longitude,
                    ]);

                    // Update the result coordinates to the adjusted ones
                    $result['geometry']['coordinates'] = [$longitude, $latitude];
                }

                // Cache the result for 24 hours (or any duration you prefer)
                Cache::put($cacheKey, $result, now()->addHours(24));

                return $result;  // Return the geocoded result
            }
        } else {
            // Handle API failure
            Log::error('Mapbox Geocoding failed', [
                'address' => $address,
                'response_status' => $response->status(),
                'response_body' => $response->body(),
            ]);
        }

        return null;  // Return null if no result
    }


    /**
     * Check if coordinates are within valid Mapbox bounds.
     *
     * @param float $latitude
     * @param float $longitude
     * @return bool
     */
    private function isValidCoordinates($latitude, $longitude)
    {
        // Valid latitude range: -85 to 85
        // Valid longitude range: -180 to 180
        return $latitude >= -85 && $latitude <= 85 && $longitude >= -180 && $longitude <= 180;
    }


    /**
     * Get the distance between two coordinates using Mapbox Directions API
     *
     * @param array $originLatLng (lat, lon)
     * @param array $destinationLatLng (lat, lon)
     * @return float|null  Distance in kilometers
     */

    public function getDistance($originLatLng, $destinationLatLng)
    {
        // Extract latitude and longitude from the input arrays
        $originLat = $originLatLng['center'][1];  // Latitude is at index 1
        $originLon = $originLatLng['center'][0];  // Longitude is at index 0
    
        $destinationLat = $destinationLatLng['center'][1];  // Latitude is at index 1
        $destinationLon = $destinationLatLng['center'][0];  // Longitude is at index 0
    
        // Convert degrees to radians
        $originLat = deg2rad($originLat);
        $originLon = deg2rad($originLon);
        $destinationLat = deg2rad($destinationLat);
        $destinationLon = deg2rad($destinationLon);
    
        // Haversine formula
        $dLat = $destinationLat - $originLat;
        $dLon = $destinationLon - $originLon;
    
        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos($originLat) * cos($destinationLat) *
            sin($dLon / 2) * sin($dLon / 2);
    
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    
        // Earth radius in kilometers (mean radius = 6,371 km)
        $R = 6371;
    
        // Calculate the distance
        $distance = $R * $c;
    
        // Return the distance in kilometers
        return $distance;
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

        $order->status = 'Paid';
        $order->save();

        // Return a successful response with the payment details
        return response()->json(['success' => 'Payment processed successfully', 'payment' => $payment]);
    }


    public function prepareDelivery(Request $request)
    {


        // Validate input data
        Log::info('Validating input data for order and user location.');
        $validatedData = $request->validate([
            'orderId' => 'required|exists:orders,id',
            'userLocation' => 'required'
        ]);

        $orderId = $validatedData['orderId'];
        $userLocation = $validatedData['userLocation'];

        Log::info('Input validated.', ['order_id' => $orderId, 'user_location' => $userLocation]);

        // Step 1: Get all supplier locations for the given order
        Log::info('Fetching supplier locations for order ID: ' . $orderId);
            // Single query to fetch order items with related product and supplier data
        $results = OrderItem::where('orders_id', $orderId)
        ->with(['product.supplier']) // Eager load product and supplier
        ->get()
        ->map(function ($orderItem) {
            $product = $orderItem->product;
            $supplier = $product ? $product->supplier : null;

            return [
                'product' => $product,
                'supplier_location' => $supplier ? $supplier : null,
            ];
        });

        // Separate the results into two variables: one for supplier locations, one for products
        $supplierLocations = $results->pluck('supplier_location')->filter();
        $productsInOrder = $results->pluck('product')->filter();

        Log::info('Found suppliers for the order.', ['suppliers' => $supplierLocations->toArray()]);

        $warehouses = Warehouse::whereHas('inventory', function ($query) use ($productsInOrder) {
            // Filter warehouses that have inventory for any of the products in the order
            $query->whereIn('products_id', $productsInOrder->pluck('id'));
        })->get();

        Log::info('Fetching warehouses with inventory for the products in the order.', [
            'warehouses' => $warehouses->toArray()
        ]);
        Log::info('Warehouses loaded for route calculations.', ['warehouses_count' => $warehouses->count()]);

        // Initialize variables
        $routeDetails = [];
        $routeDetailModels = [];
        $totalDistance = 0;
        $timeSum = 0;  // Track cumulative estimated time
        $nearestWarehouses = [];  // Array to store the nearest warehouses
        $shipment = Shipment::create([
            'providers_id' => 1,
            'orders_id' => $orderId,
        ]);
        $shipmentId = $shipment->id;    
        $routeOptimization = RouteOptimization::create([
            'shipments_id' => $shipmentId,
            'total_distance' => 0,
        ]);
        $routeIds = [];
        $nowDate = Carbon::now();
        // Step 3: For each supplier, calculate the nearest warehouse
        Log::info('Calculating the nearest warehouse for each supplier.');

        foreach ($supplierLocations as $supplier) {
            Log::info('Processing supplier: ' . $supplier->first_name . $supplier->last_name);
            $supplierLocation = $supplier->getPrimaryAddress();


            // Step 3.1: Geocode the supplier location using OpenStreetMap
            $supplierLatLng = $this->geocodeAddress($supplierLocation);
            if (!$supplierLatLng) {
                Log::warning('Supplier location geocoding failed.', ['supplier_name' => $supplier->first_name . $supplier->last_name]);
                continue;
            }

            // Step 3.2: Find the nearest warehouse
            $nearestWarehouse = $warehouses->map(function ($warehouse) use ($supplierLatLng) {
                $warehouseLatLng = $this->geocodeAddress($warehouse->location);
                if ($warehouseLatLng) {
                    $distance = $this->getDistance($supplierLatLng, $warehouseLatLng);
                    return [
                        'warehouse' => $warehouse,
                        'distance' => $this->parseDistance($distance)
                    ];
                }
                return null;
            })->filter()->sortBy('distance')->first();  // Get the nearest warehouse to this supplier

            if (!$nearestWarehouse) {
                Log::warning('No warehouse found for supplier.', ['supplier_name' => $supplier->first_name . $supplier->last_name]);
                continue;
            }

            $nearestWarehouses[] = $nearestWarehouse;

            Log::info('Nearest warehouse found for supplier.', [
                'warehouse_name' => $nearestWarehouse['warehouse']->warehouse_name,
                'distance' => $nearestWarehouse['distance']
            ]);

            // Step 4: Calculate estimated time for this route and update timeSum
            $estimatedTimeVariable = $this->estimateTime($nearestWarehouse['distance'], $timeSum,$nowDate);
            Log::info('Estimated time for supplier-to-warehouse route.', ['estimated_time' => $estimatedTimeVariable]);
            $timeSum = $estimatedTimeVariable;

            // Step 5: Store route details for the supplier to warehouse
            $routeDetails[] = [
                'route_name' => 'Supplier ' . $supplier->first_name . $supplier->last_name . ' to ' . $nearestWarehouse['warehouse']->warehouse_name,
                'supplier_name' => $supplier->first_name . $supplier->last_name,
                'warehouse_name_1' => $nearestWarehouse['warehouse']->warehouse_name,
                'distance' => $nearestWarehouse['distance'],
                'start_location' => $supplierLocation,
                'end_location' => $nearestWarehouse['warehouse']->location,
                'estimated_time' => $estimatedTimeVariable,
            ];

            // Create RouteDetail records for each route optimization
            Log::info('Creating RouteDetail records for route optimization.');
            $routeDetail = RouteDetail::create([
                'route_optimization_id' => $routeOptimization->id,  // This will be updated later
                'route_name' => 'Supplier ' . $supplier->first_name . $supplier->last_name . ' to ' . $nearestWarehouse['warehouse']->warehouse_name,
                'supplier_name' => $supplier->first_name . $supplier->last_name,
                'warehouse_name_1' => $nearestWarehouse['warehouse']->warehouse_name,
                'distance' => $nearestWarehouse['distance'],
                'start_location' => $supplierLocation,
                'end_location' => $nearestWarehouse['warehouse']->location,
                'start_latitude' => $this->geocodeAddress($supplierLocation)['center'][1],
                'start_longitude' => $this->geocodeAddress($supplierLocation)['center'][0],
                'end_latitude' => $this->geocodeAddress($nearestWarehouse['warehouse']->location)['center'][1],
                'end_longitude' => $this->geocodeAddress($nearestWarehouse['warehouse']->location)['center'][0],
                'estimated_time' => $estimatedTimeVariable,
            ]);

            $routeDetailModels[] = $routeDetail;

            // Update total distance
            $totalDistance += $nearestWarehouse['distance'];
            Log::info('Updated total distance after supplier to warehouse.', ['total_distance' => $totalDistance]);
        }

        $nearestWarehouses = collect($nearestWarehouses)->unique(function ($item) {
            return $item['warehouse']->warehouse_name;
        })->values()->all();

        Log::info('Nearest warehouses', ['warehouses' => $nearestWarehouses]);

        // Step 6: Sum distances between the nearest warehouses
        Log::info('Summing distances between nearest warehouses.');

        for ($i = 0; $i < count($nearestWarehouses) - 1; $i++) {
            $currentWarehouse = $nearestWarehouses[$i];
            $nextWarehouse = $nearestWarehouses[$i + 1];

            $currentWarehouseLatLng = $this->geocodeAddress($currentWarehouse['warehouse']->location);
            $nextWarehouseLatLng = $this->geocodeAddress($nextWarehouse['warehouse']->location);

            Log::info('current warehouse', ['warehouse' => $nearestWarehouse['warehouse']->location]);
            Log::info('next warehouse', ['warehouse' => $nextWarehouse]);

            // Step 6.1: Calculate the distance between the current warehouse and the next warehouse
            $distanceBetweenWarehouses = $this->getDistance(
                $currentWarehouseLatLng,
                $nextWarehouseLatLng,
            );

            Log::info('distance', ['distance' => $distanceBetweenWarehouses]);

            $distanceBetweenWarehouses = $this->parseDistance($distanceBetweenWarehouses);

            // Step 6.2: Update total distance
            $totalDistance += $distanceBetweenWarehouses;

            $estimatedTimeVariable = $this->estimateTime($distanceBetweenWarehouses, $timeSum, $nowDate);
            Log::info('Estimated time for supplier-to-warehouse route.', ['estimated_time' => $estimatedTimeVariable]);
            $timeSum = $estimatedTimeVariable;
            // Step 6.3: Create a RouteDetail for the warehouse-to-warehouse leg
            $routeDetail = RouteDetail::create([
                'route_optimization_id' => $routeOptimization->id,
                'route_name' => 'Warehouse ' . $currentWarehouse['warehouse']->warehouse_name . ' to ' . $nextWarehouse['warehouse']->warehouse_name,
                'warehouse_name_1' => $currentWarehouse['warehouse']->warehouse_name,
                'warehouse_name_2' => $nextWarehouse['warehouse']->warehouse_name,
                'distance' => $distanceBetweenWarehouses,
                'start_location' => $currentWarehouse['warehouse']->location,
                'end_location' => $nextWarehouse['warehouse']->location,
                'start_latitude' => $this->geocodeAddress($currentWarehouse['warehouse']->location)['center'][1],
                'start_longitude' => $this->geocodeAddress($currentWarehouse['warehouse']->location)['center'][0],
                'end_latitude' => $this->geocodeAddress($nextWarehouse['warehouse']->location)['center'][1],
                'end_longitude' => $this->geocodeAddress($nextWarehouse['warehouse']->location)['center'][0],
                'estimated_time' => $estimatedTimeVariable,
            ]);


            $routeDetails[] = [
                'route_name' => 'Warehouse ' . $currentWarehouse['warehouse']->warehouse_name . ' to ' . $nextWarehouse['warehouse']->warehouse_name,
                'warehouse_name_1' => $currentWarehouse['warehouse']->warehouse_name,
                'warehouse_name_2' => $nextWarehouse['warehouse']->warehouse_name,
                'distance' => $distanceBetweenWarehouses,
                'start_location' => $currentWarehouse['warehouse']->location,
                'end_location' => $nextWarehouse['warehouse']->location,
                'estimated_time' => $estimatedTimeVariable,
            ];

            $routeDetailModels[] = $routeDetail;

            Log::info('Distance between warehouses:', [
                'from_warehouse' => $currentWarehouse['warehouse']->warehouse_name,
                'to_warehouse' => $nextWarehouse['warehouse']->warehouse_name,
                'distance' => $distanceBetweenWarehouses,
            ]);
        }

        // Step 7: Calculate the nearest warehouse to the user's location
        Log::info('Calculating nearest warehouse to the user location.');
        $nearestWarehouseToUser = $warehouses->map(function ($warehouse) use ($userLocation) {

            $warehouseLatLng = $this->geocodeAddress($warehouse->location);
            $userLatLng = $this->geocodeAddress($userLocation);

            $distance = $this->getDistance($warehouseLatLng, $userLatLng);
            return [
                'warehouse' => $warehouse,
                'distance' => $this->parseDistance($distance)
            ];
        })->sortBy('distance')->first();  // Nearest warehouse to the user

        Log::info('Nearest warehouse to user location:', [
            'warehouse_name' => $nearestWarehouseToUser['warehouse']->warehouse_name,
            'distance' => $nearestWarehouseToUser['distance']
        ]);

        // Step 8: Calculate estimated time for the second route (warehouse to user)
        $estimatedTimeVariable2 = $this->estimateTime($nearestWarehouseToUser['distance'], $timeSum,$nowDate);
        Log::info('Estimated time for warehouse-to-user route.', ['estimated_time' => $estimatedTimeVariable2]);
        $timeSum = $estimatedTimeVariable2;


        // Create a RouteDetail for warehouse-to-user route
        $routeDetail = RouteDetail::create([
            'route_optimization_id' => $routeOptimization->id,
            'route_name' => 'Warehouse ' . $nearestWarehouseToUser['warehouse']->warehouse_name . ' to User',
            'warehouse_name_1' => $nearestWarehouseToUser['warehouse']->warehouse_name,
            'distance' => $nearestWarehouseToUser['distance'],
            'start_location' => $nearestWarehouseToUser['warehouse']->location,
            'end_location' => $userLocation,
            'start_latitude' => $this->geocodeAddress($nearestWarehouseToUser['warehouse']->location)['center'][1],
            'start_longitude' => $this->geocodeAddress($nearestWarehouseToUser['warehouse']->location)['center'][0],
            'end_latitude' => $this->geocodeAddress($userLocation)['center'][1],
            'end_longitude' => $this->geocodeAddress($userLocation)['center'][0],
            'estimated_time' => $estimatedTimeVariable2,
        ]);

        $routeDetails[] = [
            'route_name' => 'Warehouse ' . $nearestWarehouseToUser['warehouse']->warehouse_name . ' to you',
            'warehouse_name_1' => $nearestWarehouseToUser['warehouse']->warehouse_name,
            'distance' => $nearestWarehouseToUser['distance'],
            'start_location' => $nearestWarehouseToUser['warehouse']->location,
            'end_location' => $userLocation,
            'estimated_time' => $estimatedTimeVariable2,
        ];

        $routeDetailModels[] = $routeDetail;


        // Add the distance from the warehouse to the user
        $totalDistance += $nearestWarehouseToUser['distance'];

        // Step 10: Create the Shipment record
        Log::info('Creating shipment record.');
        $trackingNumber = 'TRACK-' . strtoupper(Str::random(10));  // Generate a random tracking number

        $shipment->update([
            'status' => 'in_transit',
            'estimated_arrival' => $estimatedTimeVariable2,
            'origin' => $supplierLocations->first()->location,
            'destination' => $userLocation,
            'shipment_method' => 'standard',
            'tracking_number' => $trackingNumber,
            'last_updated' => now(),
            'total_amount' => $totalDistance / 100,
        ]);

        Log::info('Updating route optimization record.');
        $routeOptimization->update([
            'total_distance' => $totalDistance
        ]);

        // Step 13: Return the results
        Log::info('Delivery preparation complete, returning response.');
        return response()->json([
            'route_details' => $routeDetails,
            'total_distance' => $totalDistance,
        ]);
    }

    
    // Method to parse distance to the required format
    private function parseDistance($distance)
    {
        Log::info('Parsing distance.', ['raw_distance' => $distance]);
        return floatval($distance);  // Example: Return the parsed distance (adjust according to Google Maps API response)
    }
    
    // Method to estimate the time for the route
    private function estimateTime($distance, $previousTime, $nowDate)
    {
        Log::info('Estimating time for the route.', ['distance' => $distance, 'previous_time' => $previousTime]);
        $timePerKm = 10;  // Example: 10 minutes per km
        $estimatedTime = $distance * $timePerKm;
        if ($previousTime instanceof Carbon) {
            $combinedTime = $this->carbonToInt($previousTime, $nowDate) + (int) $estimatedTime;
            return $nowDate->addMinutes($combinedTime);        
        } else {
            $combinedTime = $previousTime + (int) $estimatedTime;
            return $nowDate->addMinutes($combinedTime);        

        }        
    }
    private function carbonToInt(Carbon $carbonDate,$nowDate)
    {

        // Calculate the difference between now and the given Carbon instance
        // You can use diffInMinutes, diffInSeconds, or other methods based on your requirement
        $diffInMinutes = $nowDate->diffInMinutes($carbonDate);

        // Return the result as an integer (in minutes)
        return (int) $diffInMinutes;
    }
}
