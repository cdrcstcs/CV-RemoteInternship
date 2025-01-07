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
    const sorted = [...sortedVehicles].sort((a, b) => {
      if (a[field] > b[field]) return 1;
      if (a[field] < b[field]) return -1;
      return 0;
    });
    setSortedVehicles(sorted);
  };

  const filteredVehicles = sortedVehicles.filter((vehicle) => {
    return (
      vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.license_plate.toLowerCase().includes(search.toLowerCase())
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
    setUpdatedVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editVehicle) return;

    // Update the vehicle details and vehicle management details
    await updateVehicle(editVehicle.id, updatedVehicleData);
    setEditVehicle(null); // Close the edit form after submission
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
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vehicles by brand, model, or license plate"
          className="p-4 rounded-lg border border-gray-300 bg-gray-900 w-full text-emerald-400 shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleSort("year_of_manufacture")}
          className="text-sm font-semibold text-emerald-400 hover:text-emerald-900 transition duration-200"
        >
          Sort by Year
        </button>
        <button
          onClick={() => handleSort("mileage")}
          className="text-sm font-semibold text-emerald-400 hover:text-emerald-900 transition duration-200"
        >
          Sort by Mileage
        </button>
        <button
          onClick={() => handleSort("brand")}
          className="text-sm font-semibold text-emerald-400 hover:text-emerald-900 transition duration-200"
        >
          Sort by Brand
        </button>
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
                {expandedVehicleId === vehicle.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </h3>

            {/* Render Vehicle Details or Editable Form */}
            {editVehicle?.id === vehicle.id ? (
              <div className="mt-4 space-y-2">
                <h4 className="text-lg text-emerald-400">Edit Vehicle</h4>
                <form onSubmit={handleUpdateSubmit}>
                  {Object.keys(updatedVehicleData).map((key) => (
                    key !== "vehicle_management" && (
                      <div key={key}>
                        <label className="text-emerald-400 font-semibold">{key.replace(/_/g, " ").toUpperCase()}:</label>
                        <input
                          type="text"
                          name={key}
                          value={updatedVehicleData[key]}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded-lg bg-gray-900 text-white"
                        />
                      </div>
                    )
                  ))}

                  {/* Save Changes Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-400 text-white rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Display Vehicle Information */}
                {Object.keys(vehicle).map((key) => (
                  key !== "vehicle_management" && (
                    <div key={key}>
                      <label className="text-emerald-400 font-semibold">{key.replace(/_/g, " ").toUpperCase()}:</label>
                      <p className="text-white">{vehicle[key]}</p>
                    </div>
                  )
                ))}

                {/* Vehicle Management Information */}
                {expandedVehicleId === vehicle.id && vehicle.vehicle_management && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-lg text-emerald-400">Vehicle Management</h4>
                    {Object.keys(vehicle.vehicle_management).map((key) => (
                      <div key={key}>
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
