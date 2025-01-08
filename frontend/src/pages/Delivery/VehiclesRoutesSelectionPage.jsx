import React, { useEffect, useState } from 'react';
import { useShipmentStore } from '../../stores/useShipmentStore';
import { toast } from 'react-hot-toast';

const VehiclesRoutesSelectionPage = () => {
  // Get the state and functions from Zustand store
  const { vehicles, routes, fetchVehicles, fetchRoutes, assignVehicleToRoute, isLoading, errorMessage } = useShipmentStore();
  
  // State to track selected vehicle and route
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // State to store the search queries for vehicles and routes
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [routeSearch, setRouteSearch] = useState('');

  // Fetch vehicles and routes on component mount
  useEffect(() => {
    fetchVehicles();
    fetchRoutes();
  }, [fetchVehicles, fetchRoutes]);

  // Update selected vehicle and route whenever IDs change
  useEffect(() => {
    // Only update when the vehicle ID or route ID has been set (not null)
    if (selectedVehicleId && selectedRouteId) {
      const vehicle = vehicles.find(vehicle => vehicle.id == selectedVehicleId);
      const route = routes.find(route => route.id == selectedRouteId);
      
      setSelectedVehicle(vehicle);
      setSelectedRoute(route);
    }
  }, [selectedVehicleId, selectedRouteId, vehicles, routes]);

  // Handle the assignment of the selected vehicle to the selected route
  const handleAssignVehicle = () => {
    if (!selectedVehicleId || !selectedRouteId) {
      toast.error('Please select both a vehicle and a route');
      return;
    }

    assignVehicleToRoute(selectedRouteId, selectedVehicleId);
  };

  // Filtered vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) => {
    return vehicle.license_plate.toLowerCase().includes(vehicleSearch.toLowerCase()) || 
           `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(vehicleSearch.toLowerCase());
  });

  // Filtered routes based on search query
  const filteredRoutes = routes.filter((route) => {
    return route.route_name.toLowerCase().includes(routeSearch.toLowerCase()) ||
           `${route.origin} to ${route.destination}`.toLowerCase().includes(routeSearch.toLowerCase());
  });

  return (
    <div className="container mx-auto p-6 h-full">
      <h1 className="text-3xl font-bold mb-4 text-emerald-400 text-center">Assign Vehicle to Route</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center mb-4">
          <span className="text-lg text-gray-700">Loading...</span>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search for Vehicles */}
      <div className="space-y-4 mb-4">
        <div>
          <label htmlFor="vehicle-search" className="block text-lg font-medium mb-2 text-emerald-400">Search Vehicle</label>
          <input
            type="text"
            id="vehicle-search"
            value={vehicleSearch}
            onChange={(e) => setVehicleSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            placeholder="Search by License Plate or Brand/Model"
          />
        </div>
      </div>

      {/* Search for Routes */}
      <div className="space-y-4 mb-4">
        <div>
          <label htmlFor="route-search" className="block text-lg font-medium mb-2 text-emerald-400">Search Route</label>
          <input
            type="text"
            id="route-search"
            value={routeSearch}
            onChange={(e) => setRouteSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
            placeholder="Search by Route Name or Start/End Location"
          />
        </div>
      </div>

      {/* Vehicle and Route Selection */}
      <div className="space-y-4">
        {/* Vehicle Dropdown */}
        <div>
          <label htmlFor="vehicle" className="block text-lg font-medium mb-2 text-emerald-400">Select Vehicle</label>
          <select
            id="vehicle"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select a Vehicle</option>
            {filteredVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.license_plate} ({vehicle.brand} {vehicle.model})
              </option>
            ))}
          </select>
        </div>

        {/* Route Dropdown */}
        <div>
          <label htmlFor="route" className="block text-lg font-medium mb-2 text-emerald-400">Select Route</label>
          <select
            id="route"
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select a Route</option>
            {filteredRoutes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.route_name} ({route.origin} to {route.destination})
              </option>
            ))}
          </select>
        </div>

        {/* Assign Button */}
        <div className="mt-4">
          <button
            onClick={handleAssignVehicle}
            className="w-full bg-emerald-400 text-white py-2 px-4 rounded-lg hover:bg-emerald-600"
          >
            Assign Vehicle to Route
          </button>
        </div>
      </div>

      {/* Display Vehicle and Route Details */}
    {selectedVehicle && selectedRoute && (
    <div className="mt-6 p-4 bg-transparent border-2 border-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Selected Details</h3>

        {/* Vehicle Details */}
        <div className="mb-6">
        <h4 className="text-lg font-medium text-emerald-400">Vehicle Details</h4>
        <p className="text-emerald-400"><strong>License Plate:</strong> {selectedVehicle.license_plate}</p>
        <p className="text-emerald-400"><strong>Brand:</strong> {selectedVehicle.brand}</p>
        <p className="text-emerald-400"><strong>Model:</strong> {selectedVehicle.model}</p>
        <p className="text-emerald-400"><strong>Year of Manufacture:</strong> {selectedVehicle.year_of_manufacture}</p>
        <p className="text-emerald-400"><strong>Fuel Capacity:</strong> {selectedVehicle.fuel_capacity} liters</p>
        <p className="text-emerald-400"><strong>Mileage:</strong> {selectedVehicle.mileage} km</p>
        <p className="text-emerald-400"><strong>Current Location:</strong> {selectedVehicle.current_location}</p>
        <p className="text-emerald-400"><strong>Status:</strong> {selectedVehicle.status}</p>
        <p className="text-emerald-400"><strong>Last Serviced:</strong> {new Date(selectedVehicle.last_serviced).toLocaleDateString()}</p>
        <p className="text-emerald-400"><strong>Fuel Type:</strong> {selectedVehicle.fuel_type}</p>
        </div>

        {/* Route Details */}
        <div>
        <h4 className="text-lg font-medium text-emerald-400">Route Details</h4>
        <p className="text-emerald-400"><strong>Route Name:</strong> {selectedRoute.route_name}</p>
        <p className="text-emerald-400"><strong>Start Location:</strong> {selectedRoute.origin}</p>
        <p className="text-emerald-400"><strong>End Location:</strong> {selectedRoute.destination}</p>
        <p className="text-emerald-400"><strong>Estimated Time:</strong> {selectedRoute.estimated_time}</p>
        <p className="text-emerald-400"><strong>Distance:</strong> {selectedRoute.distance} km</p>
        <p className="text-emerald-400"><strong>Route Type:</strong> {selectedRoute.route_type}</p>
        <p className="text-emerald-400"><strong>Traffic Condition:</strong> {selectedRoute.traffic_condition}</p>
        <p className="text-emerald-400"><strong>Route Status:</strong> {selectedRoute.route_status}</p>
        <p className="text-emerald-400"><strong>Last Optimized:</strong> {new Date(selectedRoute.last_optimized).toLocaleDateString()}</p>
        </div>
    </div>
    )}

    </div>
  );
};

export default VehiclesRoutesSelectionPage;
