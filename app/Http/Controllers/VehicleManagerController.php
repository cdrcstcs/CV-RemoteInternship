<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Order;
use App\Models\Shipment;
use App\Models\Route;
use App\Events\OrderStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class VehicleManagerController extends Controller
{
    /**
     * Get all vehicles with their associated vehicle management for the authenticated vehicle manager.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVehiclesWithVehicleManagement(Request $request)
    {
        // Retrieve the authenticated user
        $user = $request->user();

        // Log user info
        Log::info('VehicleManagerController@getVehiclesWithVehicleManagement - Authenticated user info', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
        ]);

        // Log the incoming request data
        Log::info('VehicleManagerController@getVehiclesWithVehicleManagement - Incoming Request Data', [
            'request_data' => $request->all(),
        ]);

        // Get all vehicles associated with the authenticated user, along with their vehicle management data
        try {
            $vehicles = Vehicle::with('vehicleManagement') // Eager load the vehicleManagement relationship
                ->whereHas('vehicleManagement', function ($query) use ($user) {
                    // Ensure that the vehicle management is associated with the current user
                    $query->where('users_id', $user->id);
                })
                ->get();

            // Log the vehicles retrieved
            Log::info('VehicleManagerController@getVehiclesWithVehicleManagement - Vehicles Retrieved', [
                'vehicles_count' => $vehicles->count(),
                'vehicle_ids' => $vehicles->pluck('id')->toArray(),
            ]);
        } catch (\Exception $e) {
            // Log error in case of failure
            Log::error('VehicleManagerController@getVehiclesWithVehicleManagement - Error retrieving vehicles', [
                'error_message' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            // Return a response indicating error
            return response()->json(['error' => 'Failed to retrieve vehicles.'], 500);
        }

        // Return the response with the vehicles along with their vehicle management
        return response()->json($vehicles);
    }

    /**
     * Update vehicle and its associated vehicle management for the authenticated vehicle manager.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $vehicleId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateVehicleWithManagement(Request $request, $vehicleId)
    {
        // Retrieve the authenticated user
        $user = $request->user();

        // Log user info
        Log::info('VehicleManagerController@updateVehicleWithManagement - Authenticated user info', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
        ]);

        // Log the incoming request data
        Log::info('VehicleManagerController@updateVehicleWithManagement - Incoming Request Data', [
            'request_data' => $request->all(),
        ]);

        // Find the vehicle by ID
        $vehicle = Vehicle::with('vehicleManagement')->find($vehicleId);

        if (!$vehicle) {
            // Log if the vehicle is not found
            Log::error('VehicleManagerController@updateVehicleWithManagement - Vehicle not found', [
                'vehicle_id' => $vehicleId,
                'user_id' => $user->id,
            ]);
            return response()->json(['error' => 'Vehicle not found.'], 404);
        }

        // Check if the vehicle is associated with the authenticated user's vehicle management
        if ($vehicle->vehicleManagement->users_id !== $user->id) {
            // Log unauthorized access
            Log::warning('VehicleManagerController@updateVehicleWithManagement - Unauthorized access attempt', [
                'vehicle_id' => $vehicleId,
                'user_id' => $user->id,
            ]);
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }

        // Validate the incoming data (all fields)
        $validator = Validator::make($request->all(), [
            // Vehicle fields
            'license_plate' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'driver_id' => 'nullable|exists:users,id',
            'capacity' => 'nullable|numeric',
            'fuel_capacity' => 'nullable|numeric',
            'current_location' => 'nullable|string|max:255',
            'last_serviced' => 'nullable|date',
            'last_fuel_refill' => 'nullable|date',
            'last_location_update' => 'nullable|date',
            'mileage' => 'nullable|numeric',
            'maintenance_logs' => 'nullable|string',
            'fuel_interval' => 'nullable|numeric',
            'fuel_type' => 'nullable|string|max:50',
            'vin' => 'nullable|string|max:50',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'year_of_manufacture' => 'nullable|numeric',
            
            // Vehicle management fields
            'vehicle_management' => 'nullable|array', // Expecting nested data for vehicle management
            'vehicle_management.fuel_consumption' => 'nullable|numeric',
            'vehicle_management.distance_traveled' => 'nullable|numeric',
            'vehicle_management.maintenance_status' => 'nullable|string|max:255',
            'vehicle_management.last_maintenance_date' => 'nullable|date',
            'vehicle_management.maintenance_schedule' => 'nullable|string|max:255',
            'vehicle_management.maintenance_cost' => 'nullable|numeric',
        ]);

        // Log validation errors if they occur
        if ($validator->fails()) {
            Log::warning('VehicleManagerController@updateVehicleWithManagement - Validation Failed', [
                'errors' => $validator->errors(),
                'user_id' => $user->id,
            ]);
            return response()->json(['error' => 'Validation failed.', 'details' => $validator->errors()], 422);
        }

        // Log successful validation
        Log::info('VehicleManagerController@updateVehicleWithManagement - Validation Passed', [
            'user_id' => $user->id,
        ]);

        // Update the vehicle details
        try {
            // Log before updating the vehicle
            Log::info('VehicleManagerController@updateVehicleWithManagement - Updating Vehicle', [
                'vehicle_id' => $vehicleId,
                'new_data' => $request->only([
                    'license_plate', 'type', 'status', 'driver_id', 'capacity', 'fuel_capacity',
                    'current_location', 'last_serviced', 'last_fuel_refill', 'last_location_update',
                    'mileage', 'maintenance_logs', 'fuel_interval', 'fuel_type', 'vin', 'brand', 'model',
                    'year_of_manufacture'
                ]),
            ]);

            // Update the Vehicle model with all the fields from the request
            $vehicle->update([
                'license_plate' => $request->license_plate,
                'type' => $request->type,
                'status' => $request->status,
                'driver_id' => $request->driver_id,
                'capacity' => $request->capacity,
                'fuel_capacity' => $request->fuel_capacity,
                'current_location' => $request->current_location,
                'last_serviced' => $request->last_serviced,
                'last_fuel_refill' => $request->last_fuel_refill,
                'last_location_update' => $request->last_location_update,
                'mileage' => $request->mileage,
                'maintenance_logs' => $request->maintenance_logs,
                'fuel_interval' => $request->fuel_interval,
                'fuel_type' => $request->fuel_type,
                'vin' => $request->vin,
                'brand' => $request->brand,
                'model' => $request->model,
                'year_of_manufacture' => $request->year_of_manufacture,
            ]);

            // Log the update for vehicle management
            if ($request->has('vehicle_management')) {
                Log::info('VehicleManagerController@updateVehicleWithManagement - Updating Vehicle Management', [
                    'vehicle_id' => $vehicleId,
                    'new_vehicle_management_data' => $request->vehicle_management,
                ]);

                $vehicleManagement = $vehicle->vehicleManagement;

                $vehicleManagement->update([
                    'fuel_consumption' => $request->vehicle_management['fuel_consumption'] ?? $vehicleManagement->fuel_consumption,
                    'distance_traveled' => $request->vehicle_management['distance_traveled'] ?? $vehicleManagement->distance_traveled,
                    'maintenance_status' => $request->vehicle_management['maintenance_status'] ?? $vehicleManagement->maintenance_status,
                    'last_maintenance_date' => $request->vehicle_management['last_maintenance_date'] ?? $vehicleManagement->last_maintenance_date,
                    'maintenance_schedule' => $request->vehicle_management['maintenance_schedule'] ?? $vehicleManagement->maintenance_schedule,
                    'maintenance_cost' => $request->vehicle_management['maintenance_cost'] ?? $vehicleManagement->maintenance_cost,
                ]);
            }

            // Handle orders and shipment maintenance check
            $orders = Order::all();
            foreach ($orders as $order) {
                $shipment = Shipment::where('orders_id', $order->id)->first();
                if ($shipment) {
                    $routes = Route::where('shipments_id', $shipment->id)->get();
                    $isAllMaintenance = true;
                    $vehicle = null;
                    foreach ($routes as $route) {
                        $vehicle = Vehicle::find($route->vehicles_id);
                        $vehicleManagement = $vehicle->vehicleManagement;
                        $isAllMaintenance = $isAllMaintenance && ($vehicleManagement->maintenance_status === 'Delivery Maintenance Checked');
                        if($vehicleManagement->maintenance_status === 'Delivery Maintenance Checked'){
                            $vehicle->status = 'Delivery Maintenance Checked';
                            $vehicle->save();
                        }
                    }

                    if ($isAllMaintenance) {
                        $order->status = 'Delivery Maintenance Checked';
                        $order->save();
                        event(new OrderStatusUpdated($order));
                    }
                }
            }

            // Log the successful update
            Log::info('VehicleManagerController@updateVehicleWithManagement - Vehicle updated successfully', [
                'vehicle_id' => $vehicleId,
                'user_id' => $user->id,
            ]);
        } catch (\Exception $e) {
            // Log any errors during the update
            Log::error('VehicleManagerController@updateVehicleWithManagement - Error updating vehicle', [
                'error_message' => $e->getMessage(),
                'vehicle_id' => $vehicleId,
                'user_id' => $user->id,
            ]);
            return response()->json(['error' => 'Failed to update vehicle.'], 500);
        }

        // Return the updated vehicle along with its management details
        return response()->json($vehicle->load('vehicleManagement'));
    }
}
