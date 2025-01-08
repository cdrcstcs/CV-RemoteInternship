import React, { useEffect, useState } from "react";
import { useShipmentStore } from "../../stores/useShipmentStore";

const OrderList = ({ onSelectOrder }) => {
  const { orders, isLoading, fetchOrders } = useShipmentStore();
  
  const [searchQuery, setSearchQuery] = useState(""); // Search query by order ID
  const [filteredOrders, setFilteredOrders] = useState(orders); // Orders filtered by search query
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(10); // Items per page
  
  useEffect(() => {
    // Fetch orders when the component mounts
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // Filter orders based on the search query
    if (searchQuery) {
      const filtered = orders.filter((order) => order.id.toString().includes(searchQuery));
      setFilteredOrders(filtered);
      setCurrentPage(1); // Reset to first page when searching
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, searchQuery]);

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 shadow-md rounded-lg border-2 border-white">
      <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Orders</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Order by ID"
          className="p-2 border-2 border-white rounded-md w-full bg-transparent text-emerald-400 focus:outline-none"
        />
      </div>

      {/* Order List */}
      <ul className="space-y-4">
        {currentOrders.map((order) => (
          <li
            key={order.id}
            className="flex justify-between items-center p-4 bg-transparent border-2 border-white rounded-md shadow-sm hover:bg-gray-400"
          >
            <div className="text-emerald-400">
              <span className="font-semibold">Order #{order.id}</span>
              <span className="ml-2 text-sm text-emerald-400">- {order.status}</span>
            </div>
            <button
              onClick={() => onSelectOrder(order)}
              className="px-4 py-2 bg-transparent text-emerald-400 font-semibold border-2 border-emerald-400 rounded-md shadow-md hover:bg-emerald-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Select Order
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-transparent text-emerald-400 font-semibold border-2 border-emerald-400 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-emerald-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-transparent text-emerald-400 font-semibold border-2 border-emerald-400 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderList;
