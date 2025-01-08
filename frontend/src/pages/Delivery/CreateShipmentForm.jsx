import React, { useState } from "react";
import { useShipmentStore } from "../../stores/useShipmentStore";

const CreateShipmentForm = ({ order, onShipmentCreated }) => {
  const [status, setStatus] = useState("");
  const [estimatedArrival, setEstimatedArrival] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [shipmentMethod, setShipmentMethod] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [providerId, setProviderId] = useState("");
  const [error, setError] = useState("");
  const { createShipment } = useShipmentStore();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      status,
      estimated_arrival: estimatedArrival,
      origin,
      destination,
      shipment_method: shipmentMethod,
      tracking_number: trackingNumber,
      total_amount: totalAmount,
      providers_id: providerId,
    };

    createShipment(order.id, data);
    onShipmentCreated(); // Call the callback to inform parent component about the shipment creation
    setError(""); // Clear previous errors
  };

  return (
    <div className="w-full mx-auto p-6 border-2 border-white bg-transparent shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-emerald-400 mb-6">Create Shipment for Order #{order.id}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium text-emerald-400 mb-2">Status</label>
            <input
              id="status"
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Estimated Arrival */}
          <div className="flex flex-col">
            <label htmlFor="estimatedArrival" className="text-sm font-medium text-emerald-400 mb-2">Estimated Arrival</label>
            <input
              id="estimatedArrival"
              type="date"
              value={estimatedArrival}
              onChange={(e) => setEstimatedArrival(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin */}
          <div className="flex flex-col">
            <label htmlFor="origin" className="text-sm font-medium text-emerald-400 mb-2">Origin</label>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Destination */}
          <div className="flex flex-col">
            <label htmlFor="destination" className="text-sm font-medium text-emerald-400 mb-2">Destination</label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipment Method */}
          <div className="flex flex-col">
            <label htmlFor="shipmentMethod" className="text-sm font-medium text-emerald-400 mb-2">Shipment Method</label>
            <input
              id="shipmentMethod"
              type="text"
              value={shipmentMethod}
              onChange={(e) => setShipmentMethod(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Tracking Number */}
          <div className="flex flex-col">
            <label htmlFor="trackingNumber" className="text-sm font-medium text-emerald-400 mb-2">Tracking Number</label>
            <input
              id="trackingNumber"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Amount */}
          <div className="flex flex-col">
            <label htmlFor="totalAmount" className="text-sm font-medium text-emerald-400 mb-2">Total Amount</label>
            <input
              id="totalAmount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Provider ID */}
          <div className="flex flex-col">
            <label htmlFor="providerId" className="text-sm font-medium text-emerald-400 mb-2">Provider ID</label>
            <input
              id="providerId"
              type="text"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="p-3 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-transparent text-emerald-400 font-semibold border-2 border-emerald-400 rounded-md shadow-md hover:bg-emerald-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Create Shipment
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <div className="mt-4 text-center text-red-600">{error}</div>}
    </div>
  );
};

export default CreateShipmentForm;
