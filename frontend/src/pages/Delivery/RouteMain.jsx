import React, { useState } from "react";
import ShipmentsPage from "./ShipmentsPage"; // Import the ShipmentsPage
import CreateRouteForm from "./CreateRouteForm"; // Import the CreateRouteForm

const RouteMain = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [routeCreated, setRouteCreated] = useState(false); // Track if route is created

  // Handle shipment selection
  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment); // Store selected shipment
  };

  // Handle after route is created
  const handleRouteCreated = () => {
    setRouteCreated(true); // Set route creation to true
    setSelectedShipment(null); // Clear selected shipment
  };

  // Handle cancelling the route creation
  const handleCancelRouteCreation = () => {
    setSelectedShipment(null); // Clear selected shipment
  };

  return (
    <div className="w-full mx-auto p-6 shadow-md rounded-lg border-2 border-white">
      <h1 className="text-2xl font-semibold text-emerald-400 mb-4">Shipments</h1>

      {/* Conditional Rendering */}
      {!selectedShipment ? (
        // If no shipment is selected and no route created, show the ShipmentsPage
        <ShipmentsPage onSelectShipment={handleSelectShipment} />
      ) : (
        // If a shipment is selected, show the CreateRouteForm
        <CreateRouteForm
          shipmentId={selectedShipment ? selectedShipment.id : null}
          onRouteCreated={handleRouteCreated}
          onCancel={handleCancelRouteCreation}
        />
      )}
    </div>
  );
};

export default RouteMain;
