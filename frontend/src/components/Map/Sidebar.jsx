import React from "react";
import { Menu } from "lucide-react"; // Assuming you're using Menu for the sidebar button

const Sidebar = ({ shipments, isLoading, errorMessage, setSelectedShipment }) => {
  return (
    <div className="flex flex-col transition-all duration-300 shadow-md z-40">
      {/* TOP LOGO */}
      <div className="flex gap-3 justify-between md:justify-normal items-center pt-8 px-8">
        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-gray-900"
          onClick={() => {}}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Shipments List (Scrollable part) */}
      <div className="mt-4 px-6 flex-1 overflow-y-auto"> {/* Make this part scrollable */}        
        {/* Show loading indicator or error if available */}
        {isLoading ? (
          <p className="text-white">Loading shipments...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <ul className="space-y-3 mt-4 text-sm text-gray-200">
            {shipments.length === 0 ? (
              <p className="text-white">No shipments available</p>
            ) : (
              shipments.map((shipment) => (
                <li
                  key={shipment.id}
                  className="hover:bg-emerald-700 p-2 rounded-md transition-all border-2 border-white"
                  onClick={() => setSelectedShipment(shipment)} // Call the callback when clicked
                >
                  <div className="font-medium">Shipment {shipment.shipment.id}</div>
                  <div>Status: {shipment.shipment.status}</div>
                  <div>Origin: {shipment.shipment.origin}</div>
                  <div>Destination: {shipment.shipment.destination}</div>
                  <div>Estimated Arrival: {shipment.shipment.estimated_arrival}</div>
                  <div>Tracking Number: {shipment.shipment.tracking_number}</div>

                  {/* Route Optimizations */}
                  {shipment.routeOptimizations?.map((routeOptimization) => (
                    <div key={routeOptimization.routeOptimization.id}>
                      <h4 className="font-medium mt-2">Route Optimization</h4>
                      <div>Distance: {routeOptimization.routeOptimization.total_distance} km</div>

                      {/* Route Details */}
                      {routeOptimization.routeDetails?.map((routeDetail) => (
                        <div key={routeDetail.routeDetail.id} className="mt-2">
                          <h5>Route Detail: {routeDetail.routeDetail.route_name}</h5>
                          <div>Supplier: {routeDetail.routeDetail.supplier_name}</div>
                          <div>Warehouse 1: {routeDetail.routeDetail.warehouse_name_1}</div>
                          <div>Start Location: {routeDetail.routeDetail.start_location}</div>
                          <div>End Location: {routeDetail.routeDetail.end_location}</div>

                          {/* Route Condition */}
                          {routeDetail.routeCondition && (
                            <div>
                              <h6>Route Condition:</h6>
                              <p>Weather: {routeDetail.routeCondition.weather}</p>
                              <p>Road Condition: {routeDetail.routeCondition.road_condition}</p>
                              <p>Traffic Condition: {routeDetail.routeCondition.traffic_condition}</p>
                              <p>Accident: {routeDetail.routeCondition.has_accident ? "Yes" : "No"}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
