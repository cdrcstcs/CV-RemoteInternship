import React, { useEffect, useState } from "react";
import useVehicleStore from "../../stores/useVehicleStore";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"; // For collapsible arrow

const VehicleListPage = () => {
  const { vehicles, isLoading, isError, errorMessage, fetchVehicles, updateVehicle } = useVehicleStore();
  const [search, setSearch] = useState("");
  const [sortedVehicles, setSortedVehicles] = useState(vehicles || []);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // For sorting
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  // For editing vehicle
  const [editVehicle, setEditVehicle] = useState(null);
  const [updatedVehicleData, setUpdatedVehicleData] = useState({
    license_plate: "",
    type: "",
    status: "",
    driver_id: "",
    capacity: "",
    fuel_capacity: "",
    current_location: "",
    last_serviced: "",
    last_fuel_refill: "",
    last_location_update: "",
    vehicle_management_id: "",
    fuel_interval: "",
    fuel_type: "",
    vin: "",
    brand: "",
    model: "",
    year_of_manufacture: "",
    mileage: "",
    vehicle_management: {
      maintenance_status: "",
      last_maintenance_date: "",
      maintenance_schedule: "",
      maintenance_cost: "",
      fuel_consumption: "",
      distance_traveled: "",
    },
  });

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    setSortedVehicles(vehicles || []);
  }, [vehicles]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Sorting vehicles
  const sortedAndFilteredVehicles = [...vehicles].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    return 0;
  });

  // Filtering vehicles by search
  const filteredVehicles = sortedAndFilteredVehicles.filter((vehicle) => {
    return (
      Object.keys(vehicle).some((key) => {
        if (typeof vehicle[key] === "string") {
          return vehicle[key].toLowerCase().includes(search.toLowerCase());
        }
        return false;
      }) ||
      Object.keys(vehicle.vehicle_management || {}).some((key) => {
        if (typeof vehicle.vehicle_management[key] === "string") {
          return vehicle.vehicle_management[key].toLowerCase().includes(search.toLowerCase());
        }
        return false;
      })
    );
  });

  const indexOfLastVehicle = currentPage * itemsPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // If it's a vehicle management field, update that section
    if (name.startsWith("vehicle_management.")) {
      const field = name.split(".")[1];
      setUpdatedVehicleData((prevData) => ({
        ...prevData,
        vehicle_management: {
          ...prevData.vehicle_management,
          [field]: value,
        },
      }));
    } else {
      // Update the top-level fields
      setUpdatedVehicleData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editVehicle) return;

    await updateVehicle(editVehicle.id, updatedVehicleData);
    setEditVehicle(null);
  };

  const handleEdit = (vehicle) => {
    setEditVehicle(vehicle);

    const vehicleManagement = vehicle.vehicle_management || {};

    setUpdatedVehicleData({
      license_plate: vehicle.license_plate || "",
      type: vehicle.type || "",
      status: vehicle.status || "",
      driver_id: vehicle.driver_id || "",
      capacity: vehicle.capacity || "",
      fuel_capacity: vehicle.fuel_capacity || "",
      current_location: vehicle.current_location || "",
      last_serviced: vehicle.last_serviced || "",
      last_fuel_refill: vehicle.last_fuel_refill || "",
      last_location_update: vehicle.last_location_update || "",
      vehicle_management_id: vehicle.vehicle_management_id || "",
      fuel_interval: vehicle.fuel_interval || "",
      fuel_type: vehicle.fuel_type || "",
      vin: vehicle.vin || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year_of_manufacture: vehicle.year_of_manufacture || "",
      mileage: vehicle.mileage || "",
      vehicle_management: {
        maintenance_status: vehicleManagement.maintenance_status || "",
        last_maintenance_date: vehicleManagement.last_maintenance_date || "",
        maintenance_schedule: vehicleManagement.maintenance_schedule || "",
        maintenance_cost: vehicleManagement.maintenance_cost || "",
        fuel_consumption: vehicleManagement.fuel_consumption || "",
        distance_traveled: vehicleManagement.distance_traveled || "",
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-12 h-12 border-t-4 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold text-red-600">{errorMessage}</div>
      </div>
    );
  }

  if (!vehicles || filteredVehicles.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold text-emerald-400">No vehicles found.</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 rounded-lg shadow-md">
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vehicles by any field (brand, model, vin, etc.)"
          className="p-4 rounded-lg border border-gray-300 bg-gray-900 w-full text-emerald-400 shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sort buttons */}
      <div className="flex space-x-4 mb-6">
        {["year_of_manufacture", "mileage", "brand", "model", "license_plate", "vin"].map((field) => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`text-sm font-semibold ${sortField === field ? "text-emerald-900" : "text-emerald-400"} hover:text-emerald-900 transition duration-200`}
          >
            Sort by {field.replace(/_/g, " ")}
            {sortField === field && (sortOrder === "asc" ? " ↑" : " ↓")}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {currentVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-emerald-400 flex justify-between items-center">
              {vehicle.brand} {vehicle.model} ({vehicle.year_of_manufacture})
              <button
                onClick={() => setExpandedVehicleId(expandedVehicleId === vehicle.id ? null : vehicle.id)}
                className="text-emerald-400 hover:text-emerald-400"
              >
                {expandedVehicleId === vehicle.id ? <IoIosArrowDown /> : <IoIosArrowUp />}
              </button>
            </h3>

            {/* Editable or Display Mode */}
            {editVehicle?.id === vehicle.id ? (
              <div className="mt-4 space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
                <h4 className="text-lg text-emerald-400 font-bold">Edit Vehicle Details</h4>
                <form onSubmit={handleUpdateSubmit}>
                  {/* Vehicle Details Editing */}
                  {Object.keys(updatedVehicleData).map((key) => {
                    if (key !== "vehicle_management") {
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-emerald-400 font-semibold">{key.replace(/_/g, " ").toUpperCase()}:</label>
                          <input
                            type="text"
                            name={key}
                            value={updatedVehicleData[key]}
                            onChange={handleEditChange}
                            className="w-full p-3 border border-gray-500 rounded-lg bg-gray-900 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                        </div>
                      );
                    }
                  })}

                  {/* Vehicle Management Editing */}
                  <div className="mt-4 space-y-4">
                    <h4 className="text-lg text-emerald-400 font-bold">Edit Vehicle Management</h4>
                    {Object.keys(updatedVehicleData.vehicle_management).map((key) => (
                      <div key={key} className="space-y-2">
                        <label className="text-emerald-400 font-semibold">{key.replace(/_/g, " ").toUpperCase()}:</label>
                        <input
                          type="text"
                          name={`vehicle_management.${key}`}  // Name includes the vehicle_management prefix
                          value={updatedVehicleData.vehicle_management[key]}  // Use the vehicle_management value
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-500 rounded-lg bg-gray-900 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Save Changes Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Display Vehicle Information */}
                {Object.keys(vehicle).map((key) => (
                  key !== "vehicle_management" && (
                    <div key={key} className="space-y-2">
                      <label className="text-emerald-400 font-semibold">{key.replace(/_/g, " ").toUpperCase()}:</label>
                      <p className="text-white">{vehicle[key]}</p>
                    </div>
                  )
                ))}

                {/* Vehicle Management Information */}
                {expandedVehicleId === vehicle.id && vehicle.vehicle_management && (
                  <div className="mt-4 space-y-4 p-4 border-2 border-white rounded-xl">
                    <h4 className="text-lg text-emerald-400 font-bold">Vehicle Management</h4>
                    {Object.keys(vehicle.vehicle_management).map((key) => (
                      <div key={key} className="space-y-2">
                        <label className="text-emerald-400 font-semibold">{key.replace(/_/g, " ").toUpperCase()}:</label>
                        <p className="text-white">{vehicle.vehicle_management[key]}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Edit Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="text-white bg-emerald-400 py-2 px-4 rounded-lg"
                  >
                    Edit Vehicle
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 text-sm font-semibold bg-emerald-400 text-white rounded-md disabled:bg-gray-600"
        >
          Prev
        </button>
        <div className="px-4 py-2 text-sm font-semibold text-emerald-400">
          Page {currentPage} of {totalPages}
        </div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-sm font-semibold bg-emerald-400 text-white rounded-md disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VehicleListPage;
