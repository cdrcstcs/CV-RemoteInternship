import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useShipmentStore } from "../../stores/useShipmentStore";
const CreateRouteForm = ({ shipmentId, onRouteCreated, onCancel }) => {
  const [routeName, setRouteName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [distance, setDistance] = useState("");
  const [routeType, setRouteType] = useState("");
  const [trafficCondition, setTrafficCondition] = useState("");
  const [routeStatus, setRouteStatus] = useState("");
  const {createRoute} = useShipmentStore();
  console.log(shipmentId)
  const handleSubmit = (e) => {
    e.preventDefault();

    const routeData = {
      route_name: routeName,
      start_location: startLocation,
      end_location: endLocation,
      estimated_time: estimatedTime + " 00:00:00",
      distance,
      route_type: routeType,
      traffic_condition: trafficCondition,
      route_status: routeStatus,
      shipments_id: shipmentId,
    };
    createRoute(routeData);
    // Simulate route creation
    // Replace this with your actual route creation logic
    toast.success("Route created successfully!");
    onRouteCreated(); // Notify the parent that the route is created
  };

  return (
    <div className="flex items-center justify-center w-full text-emerald-400">
      <div className="rounded-lg shadow-lg w-full bg-transparent">
        <h2 className="text-2xl font-semibold mb-6">
          Create Route for Shipment #{shipmentId}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Name */}
          <div>
            <label htmlFor="routeName" className="block text-sm font-medium mb-2">
              Route Name
            </label>
            <input
              id="routeName"
              type="text"
              placeholder="Route Name"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Start Location */}
          <div>
            <label htmlFor="startLocation" className="block text-sm font-medium mb-2">
              Start Location
            </label>
            <input
              id="startLocation"
              type="text"
              placeholder="Start Location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* End Location */}
          <div>
            <label htmlFor="endLocation" className="block text-sm font-medium mb-2">
              End Location
            </label>
            <input
              id="endLocation"
              type="text"
              placeholder="End Location"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Estimated Time */}
          <div>
            <label htmlFor="estimatedTime" className="block text-sm font-medium mb-2">
              Estimated Time
            </label>
            <input
              id="estimatedTime"
              type="date"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Distance */}
          <div>
            <label htmlFor="distance" className="block text-sm font-medium mb-2">
              Distance
            </label>
            <input
              id="distance"
              type="text"
              placeholder="Distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Route Type */}
          <div>
            <label htmlFor="routeType" className="block text-sm font-medium mb-2">
              Route Type
            </label>
            <input
              id="routeType"
              type="text"
              placeholder="Route Type"
              value={routeType}
              onChange={(e) => setRouteType(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Traffic Condition */}
          <div>
            <label htmlFor="trafficCondition" className="block text-sm font-medium mb-2">
              Traffic Condition
            </label>
            <input
              id="trafficCondition"
              type="text"
              placeholder="Traffic Condition"
              value={trafficCondition}
              onChange={(e) => setTrafficCondition(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Route Status */}
          <div>
            <label htmlFor="routeStatus" className="block text-sm font-medium mb-2">
              Route Status
            </label>
            <input
              id="routeStatus"
              type="text"
              placeholder="Route Status"
              value={routeStatus}
              onChange={(e) => setRouteStatus(e.target.value)}
              required
              className="w-full p-3 border-2 border-white rounded-md text-emerald-400 bg-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-transparent border-2 border-white text-emerald-400 font-semibold rounded-md hover:bg-emerald-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-md hover:bg-emerald-600 transition duration-300"
            >
              Create Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRouteForm;
