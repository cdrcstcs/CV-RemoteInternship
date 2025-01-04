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
    updateOrderStatus: state.updateOrderStatus,
  }));

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle order status update
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <span className="text-2xl text-gray-600">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <span className="text-xl text-red-500">{errorMessage}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-6">
      <h1 className="text-3xl font-semibold text-emerald-400 mb-6">Warehouse Orders</h1>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-emerald-400 border-b">
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order ID</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order Date</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Total Amount</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-emerald-200 border-b">
                <td className="py-3 px-6 text-sm text-gray-800">{order.id}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{order.order_date}</td>
                <td className="py-3 px-6 text-sm text-gray-800">${order.total_amount}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{order.status}</td>

                {/* Dropdown for updating status */}
                <td className="py-3 px-6 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
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
    </div>
  );
};

export default WarehouseOrders;
