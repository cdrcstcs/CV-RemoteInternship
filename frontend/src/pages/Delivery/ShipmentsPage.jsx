import React, { useState, useEffect } from "react";
import { useShipmentStore } from "../../stores/useShipmentStore";

const ShipmentsPage = ({ onSelectShipment }) => {
  const { shipments, isLoading, fetchShipments } = useShipmentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShipments, setFilteredShipments] = useState(shipments);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Set number of items per page
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Update the filtered and sorted shipments based on search and sorting
  useEffect(() => {
    let filtered = shipments.filter(
      (shipment) =>
        shipment.id.toString().includes(searchQuery) ||
        shipment.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting logic
    filtered = filtered.sort((a, b) => {
      const compareA = a[sortField];
      const compareB = b[sortField];

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredShipments(filtered);
  }, [searchQuery, shipments, sortField, sortOrder]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  // Get current page data for pagination
  const indexOfLastShipment = currentPage * itemsPerPage;
  const indexOfFirstShipment = indexOfLastShipment - itemsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirstShipment, indexOfLastShipment);

  if (isLoading) {
    return <div className="text-emerald-400">Loading shipments...</div>;
  }

  return (
    <div className="text-emerald-400">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Shipment ID or Status"
          className="p-2 border-2 border-white rounded-md w-full text-emerald-400 bg-gray-900"
        />
      </div>

      {/* Shipments Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto rounded-lg shadow-md border-2 border-white bg-gray-900">
          <thead>
            <tr className="bg-gray-900">
              <th
                className="px-4 py-2 cursor-pointer border-2 border-white"
                onClick={() => {
                  setSortField("id");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Shipment ID
              </th>
              <th
                className="px-4 py-2 cursor-pointer border-2 border-white"
                onClick={() => {
                  setSortField("status");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                Status
              </th>
              <th className="px-4 py-2 border-2 border-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentShipments.map((shipment) => (
              <tr key={shipment.id} className="border-b border-white hover:bg-gray-400">
                <td className="px-4 py-2 border-2 border-white">{shipment.id}</td>
                <td className="px-4 py-2 border-2 border-white">{shipment.status}</td>
                <td className="px-4 py-2 border-2 border-white">
                  <button
                    onClick={() => onSelectShipment(shipment)}
                    className="px-4 py-2 bg-gray-900 border-2 border-white text-emerald-400 rounded-md hover:bg-gray-400 hover:text-emerald-500"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        {/* Items per page */}
        <div>
          <label className="mr-2 text-emerald-400">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-2 py-1 border-2 border-white rounded-md bg-gray-900 text-emerald-400"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-900 border-2 border-white text-emerald-400 rounded-md hover:bg-gray-400 hover:text-emerald-500 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-emerald-400">
            Page {currentPage} of {Math.ceil(filteredShipments.length / itemsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredShipments.length / itemsPerPage)}
            className="px-4 py-2 bg-gray-900 border-2 border-white text-emerald-400 rounded-md hover:bg-gray-400 hover:text-emerald-500 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsPage;
