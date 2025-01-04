import React, { useEffect } from "react";
import useOrderStore from "../../stores/useOrderStore";
import { toast } from "react-hot-toast";

const WarehouseOrders = () => {
  const { orders, isLoading, isError, errorMessage, fetchOrders, updateOrderStatus } = useOrderStore(state => ({
    orders: state.orders,
    isLoading: state.isLoading,
    isError: state.isError,
    errorMessage: state.errorMessage,
    fetchOrders: state.fetchOrders,
    updateOrderStatus: state.updateOrderStatus, // Added updateOrderStatus
  }));

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle order status update
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-red-500">{errorMessage}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Order Date</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Total Amount</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Update Status</th> {/* New column for updating status */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="py-2 px-4 text-sm text-gray-800">{order.id}</td>
              <td className="py-2 px-4 text-sm text-gray-800">{order.order_date}</td>
              <td className="py-2 px-4 text-sm text-gray-800">{order.total_amount}</td>
              <td className="py-2 px-4 text-sm text-gray-800">{order.status}</td>

              {/* Dropdown for updating status */}
              <td className="py-2 px-4 text-sm text-gray-800">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border border-gray-300 rounded-md p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseOrders;
