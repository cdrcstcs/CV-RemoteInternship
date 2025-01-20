<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\RouteOptimization;
use App\Models\RouteDetail;
use App\Models\RouteCondition;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import the Log facade
use Carbon\Carbon; // For measuring the time taken
use Illuminate\Support\Facades\Validator;
use App\Events\OrderStatusUpdated;

class DeliveryController extends Controller
{
    /**
     * Get all shipments with related route optimizations, route details, and route conditions using where clauses,
     * but only include shipments with non-empty route optimizations.
     *
     * @return \Illuminate\Http\Response
     */
    public function getShipmentsWithRouteDetails()
    {
        // Log the beginning of the request with the timestamp
        Log::info('Fetching shipments with route details and optimizations started at: ' . Carbon::now()->toDateTimeString());

        // Record the start time for performance tracking
        $startTime = microtime(true);

        try {
            // Get all shipments
            $shipments = Shipment::all();

            // Log the number of shipments retrieved
            Log::info('Number of shipments retrieved: ' . $shipments->count());

            // Initialize an array to hold the data with relationships
            $shipmentsWithDetails = [];

            foreach ($shipments as $shipment) {
                // Fetch related route optimizations for the shipment using where clause
                $routeOptimizations = RouteOptimization::where('shipments_id', $shipment->id)->get();

                // Check if there are any related route optimizations for this shipment
                if ($routeOptimizations->isEmpty()) {
                    // Skip shipments that have no route optimizations
                    continue;
                }

                $routeOptimizationsWithDetails = [];

                foreach ($routeOptimizations as $routeOptimization) {
                    // Fetch related route details using where clause
                    $routeDetails = RouteDetail::where('route_optimization_id', $routeOptimization->id)->get();

                    $routeDetailsWithConditions = [];

                    foreach ($routeDetails as $routeDetail) {
                        // Fetch the related route condition using where clause
                        $routeCondition = RouteCondition::where('id', $routeDetail->route_condition_id)->first();

                        // Add route details along with route condition to the list
                        $routeDetailsWithConditions[] = [
                            'routeDetail' => $routeDetail,
                            'routeCondition' => $routeCondition
                        ];
                    }

                    // Add the route details and conditions to the route optimization
                    $routeOptimizationsWithDetails[] = [
                        'routeOptimization' => $routeOptimization,
                        'routeDetails' => $routeDetailsWithConditions
                    ];
                }

                // Add the shipment with its related route optimizations and route details
                $shipmentsWithDetails[] = [
                    'shipment' => $shipment,
                    'routeOptimizations' => $routeOptimizationsWithDetails
                ];
            }

            // Log the shipment details (warning: this can be large data)
            // Option 1: Log the entire shipments with relationships
            Log::info('Shipments data with relationships: ' . json_encode($shipmentsWithDetails));

            // Option 2: Log only a summary of the shipments (e.g., just ids or key attributes)
            // Log::info('Sample shipment data: ' . json_encode(array_column($shipmentsWithDetails, 'shipment.id')));

            // Log the success message and the time taken to fetch the shipments
            $endTime = microtime(true);
            $executionTime = round($endTime - $startTime, 2); // in seconds
            Log::info("Shipments fetched successfully. Time taken: {$executionTime} seconds.");

            // Return the shipments data with their relationships
            return response()->json($shipmentsWithDetails);

        } catch (\Exception $e) {
            // Log any errors that occur
            Log::error('Error fetching shipments: ' . $e->getMessage());

            // Log the full stack trace of the error for debugging
            Log::error('Error stack trace: ' . $e->getTraceAsString());

            // Return an error response
            return response()->json(['error' => 'An error occurred while fetching shipments.'], 500);
        }
    }

    /**
     * Assign a vehicle to a route detail.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $routeDetailId
     * @return \Illuminate\Http\Response
     */
    public function assignVehicle(Request $request, $routeDetailId)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id', // Ensure the vehicle exists
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        // Find the RouteDetail by ID
        $routeDetail = RouteDetail::find($routeDetailId);

        if (!$routeDetail) {
            return response()->json([
                'status' => 'error',
                'message' => 'Route detail not found.',
            ], 404);
        }

        // Check if the route detail already has a vehicle assigned
        if ($routeDetail->vehicle_id && $routeDetail->vehicle_id != $request->vehicle_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'This route detail already has a vehicle assigned.',
            ], 400);
        }

        // Assign the vehicle to the route detail
        $routeDetail->vehicle_id = $request->vehicle_id;
        $routeDetail->save();

        // Check if all RouteDetails for the associated RouteOptimization have a vehicle assigned
        $routeOptimization = $routeDetail->routeOptimization; // Get the associated RouteOptimization
        $allRouteDetailsHaveVehicle = $routeOptimization->routeDetails->every(function ($detail) {
            return !is_null($detail->vehicle_id); // Check if vehicle_id is not null for each RouteDetail
        });

        if ($allRouteDetailsHaveVehicle) {
            // If all RouteDetails have a vehicle assigned, update the Order status
            $shipment = $routeOptimization->shipment; // Get the associated Shipment
            $order = $shipment->order; // Get the associated Order

            // Update the Order status to 'on delivery'
            $order->status = 'On Delivery';
            $order->save();
            event(new OrderStatusUpdated($order));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle assigned successfully.',
            'data' => $routeDetail,
        ]);
    }


    /**
     * Get the vehicle for the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function getVehicleForAuthenticatedUser(Request $request)
    {
        // Ensure the user is authenticated
        $user = $request->user();

        // Check if the user is authenticated
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated user.',
            ], 401);
        }

        // Fetch the vehicle associated with the authenticated user (driver_id).
        $vehicle = Vehicle::where('driver_id', $user->id)->first();

        if (!$vehicle) {
            return response()->json([
                'status' => 'error',
                'message' => 'No vehicle found for this user.',
            ], 404);
        }

        // Return the vehicle details in the response
        return response()->json([
            'status' => 'success',
            'vehicle' => $vehicle,
        ], 200);
    }
}
