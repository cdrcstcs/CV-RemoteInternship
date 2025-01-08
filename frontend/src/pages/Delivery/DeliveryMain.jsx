import React, { useState } from "react";
import OrderList from "./OrderList";
import CreateShipmentForm from "./CreateShipmentForm";
const DeliveryMain = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shipment, setShipment] = useState(null);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleShipmentCreated = (newShipment) => {
    setShipment(newShipment);
    setSelectedOrder(null);
  };
  console.log(shipment);
  return (
    <div>
      {!selectedOrder ? (
        <OrderList onSelectOrder={handleSelectOrder} />
      ) : (
        <CreateShipmentForm
          order={selectedOrder}
          onShipmentCreated={handleShipmentCreated}
        />
      )}

    </div>
  );
};

export default DeliveryMain;
