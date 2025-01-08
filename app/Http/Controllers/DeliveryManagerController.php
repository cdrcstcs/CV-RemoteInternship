<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipment;
use App\Models\Route;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class DeliveryManagerController extends Controller
{
    // Fetch all orders
    public function getAllOrders()
    {
        // Log when fetching orders
        Log::info('Fetching all orders.');

        try {
            // Fetch all orders (no need for ->get() after all())
            $orders = Order::all();

            // Log the number of orders fetched
            Log::info('Fetched ' . $orders->count() . ' orders.');

            // Return the orders as a JSON response
            return response()->json($orders);

        } catch (\Exception $e) {
            // Log the error if fetching orders fails
            Log::error('Failed to fetch orders: ' . $e->getMessage());

            // Return error response
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch orders: ' . $e->getMessage()
            ], 500);
        }
    }

    // Create a new shipment and associate it with an order
    public function createShipment($orderId, Request $request)
    {
        // Log the attempt to create a shipment
        Log::info("Attempting to create shipment for order ID: {$orderId}");

        // Validate incoming data
        $validator = Validator::make($request->all(), [
            'status' => 'required|string',
            'estimated_arrival' => 'required|date',
            'origin' => 'required|string',
            'destination' => 'required|string',
            'shipment_method' => 'required|string',
            'tracking_number' => 'required|string',
            'total_amount' => 'required|numeric',
            'providers_id' => 'required|exists:providers,id' // Assuming you have a 'providers' table
        ]);

        // Log validation errors if they exist
        if ($validator->fails()) {
            Log::error('Validation failed for shipment creation: ', $validator->errors()->toArray());

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Begin a database transaction to ensure data consistency
        DB::beginTransaction();

        try {
            // Log that we are trying to find the order
            Log::info("Finding order with ID: {$orderId}");

            // Find the order by its ID
            $order = Order::findOrFail($orderId);

            // Log the order details that were found
            Log::info("Found order with ID: {$order->id}, Status: {$order->status}");

            // Create a new shipment and associate it with the order
            $shipment = new Shipment([
                'status' => $request->status,
                'estimated_arrival' => $request->estimated_arrival,
                'origin' => $request->origin,
                'destination' => $request->destination,
                'shipment_method' => $request->shipment_method,
                'tracking_number' => $request->tracking_number,
                'total_amount' => $request->total_amount,
                'providers_id' => $request->providers_id,
                'orders_id' => $order->id, // Associate with the order
            ]);

            // Log the details of the shipment that is about to be created
            Log::info("Creating shipment with Tracking Number: {$shipment->tracking_number}, Status: {$shipment->status}");

            // Save the shipment
            $shipment->save();

            // Commit the transaction
            DB::commit();

            // Log success message
            Log::info("Shipment created successfully for Order ID: {$orderId} with Shipment ID: {$shipment->id}");

            // Return success response
            return response()->json($shipment);

        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();

            // Log the exception
            Log::error('Failed to create shipment for Order ID: ' . $orderId . '. Error: ' . $e->getMessage());

            // Return error response
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create shipment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new route and assign a shipment ID.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createRoute(Request $request)
    {
        // Validation of incoming request data
        $validator = Validator::make($request->all(), [
            'route_name' => 'required|string|max:255',
            'start_location' => 'required|string|max:255',
            'end_location' => 'required|string|max:255',
            'estimated_time' => 'required|date',
            'distance' => 'required|numeric',
            'route_type' => 'required|string|max:50',
            'traffic_condition' => 'required|string|max:50',
            'route_status' => 'required|string|max:50',
            'shipments_id' => 'required|exists:shipments,id',  // Ensures the shipment ID exists
        ]);

        // If validation fails, return the error messages
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        // Retrieve the shipment
        $shipment = Shipment::find($request->shipments_id);

        if (!$shipment) {
            return response()->json([
                'success' => false,
                'message' => 'Shipment not found'
            ], 404);
        }

        // Create a new route and assign the shipment ID
        $route = new Route();
        $route->route_name = $request->route_name;
        $route->start_location = $request->start_location;
        $route->end_location = $request->end_location;
        $route->estimated_time = $request->estimated_time;
        $route->distance = $request->distance;
        $route->route_type = $request->route_type;
        $route->traffic_condition = $request->traffic_condition;
        $route->route_status = $request->route_status;
        $route->shipments_id = $shipment->id; // Assigning the shipment ID

        // Save the route
        $route->save();

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Route created successfully',
            'data' => $route
        ], 201);
    }

    /**
     * Fetch all shipments (for use in a dropdown, etc.)
     *
     * @return \Illuminate\Http\Response
     */
    public function getShipments()
    {
        // Fetch all shipments
        $shipments = Shipment::all();

        return response()->json([
            'success' => true,
            'data' => $shipments
        ], 200);
    }

    /**
     * Display a listing of all vehicles.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllVehicles()
    {
        try {
            // Retrieve all vehicles from the database
            $vehicles = Vehicle::all();

            // Log the action of fetching all vehicles
            Log::info('Fetched all vehicles', [
                'vehicles_count' => $vehicles->count(),
                'timestamp' => now()->toDateTimeString()
            ]);

            // Return vehicles as a JSON response
            return response()->json($vehicles);
        } catch (Exception $e) {
            // Log the error
            Log::error('Error fetching all vehicles', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
                'timestamp' => now()->toDateTimeString()
            ]);

            return response()->json(['message' => 'An error occurred while fetching vehicles'], 500);
        }
    }

    /**
     * Display a listing of all routes.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllRoutes()
    {
        try {
            // Retrieve all routes from the database
            $routes = Route::all();

            // Log the action of fetching all routes
            Log::info('Fetched all routes', [
                'routes_count' => $routes->count(),
                'timestamp' => now()->toDateTimeString()
            ]);

            // Return routes as a JSON response
            return response()->json($routes);
        } catch (Exception $e) {
            // Log the error
            Log::error('Error fetching all routes', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
                'timestamp' => now()->toDateTimeString()
            ]);

            return response()->json(['message' => 'An error occurred while fetching routes'], 500);
        }
    }

    /**
     * Assign a vehicle to a route.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $routeId
     * @return \Illuminate\Http\Response
     */
    public function assignVehicleToRoute(Request $request, $routeId)
    {
        try {
            // Log the incoming request data
            Log::info('Assigning vehicle to route', [
                'route_id' => $routeId,
                'vehicle_id' => $request->vehicle_id,
                'request_data' => $request->all(),
                'timestamp' => now()->toDateTimeString()
            ]);

            // Validate the incoming request
            $request->validate([
                'vehicle_id' => 'required|exists:vehicles,id', // Ensure the vehicle exists
            ]);

            // Find the route by ID
            $route = Route::find($routeId);

            if (!$route) {
                Log::warning('Route not found', [
                    'route_id' => $routeId,
                    'timestamp' => now()->toDateTimeString()
                ]);
                return response()->json(['message' => 'Route not found'], 404);
            }

            // Find the vehicle by ID
            $vehicle = Vehicle::find($request->vehicle_id);

            if (!$vehicle) {
                Log::warning('Vehicle not found', [
                    'vehicle_id' => $request->vehicle_id,
                    'timestamp' => now()->toDateTimeString()
                ]);
                return response()->json(['message' => 'Vehicle not found'], 404);
            }

            // Assign the vehicle to the route
            $route->vehicle()->associate($vehicle);
            $route->save();

            // Log the successful assignment
            Log::info('Vehicle assigned to route successfully', [
                'route_id' => $routeId,
                'vehicle_id' => $request->vehicle_id,
                'vehicle_license_plate' => $vehicle->license_plate,
                'timestamp' => now()->toDateTimeString()
            ]);

            // Return a success response
            return response()->json();
        } catch (Exception $e) {
            // Log the error in case of any exception
            Log::error('Error assigning vehicle to route', [
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
                'route_id' => $routeId,
                'vehicle_id' => $request->vehicle_id,
                'timestamp' => now()->toDateTimeString()
            ]);

            return response()->json(['message' => 'An error occurred while assigning the vehicle to the route'], 500);
        }
    }
}
