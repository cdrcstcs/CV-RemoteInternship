import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useShipmentStore = create((set, get) => ({
  shipments: [],          // To store the list of shipments
  orders: [],             // To store the list of orders
  routes: [],             // To store the list of routes
  vehicles: [],           // To store the list of vehicles
  isLoading: false,       // To track the loading state for fetching data
  isError: false,         // To track if an error occurs
  errorMessage: "",       // To store the error message

  // Fetch all orders data
  fetchOrders: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.get("/orders");
      console.log("Orders Response:", response); // Log the raw response for debugging

      if (response.data && Array.isArray(response.data)) {
        set({ orders: response.data, isLoading: false });
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      handleError(set, error, "Failed to fetch orders data");
    }
  },

  // Fetch shipments data
  fetchShipments: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.get("/shipments");
      console.log("Shipments Response:", response); // Log the raw response for debugging

      if (response.data && Array.isArray(response.data)) {
        set({ shipments: response.data, isLoading: false });
      } else if (response.data && Array.isArray(response.data.data)) {
        set({ shipments: response.data.data, isLoading: false });
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      handleError(set, error, "Failed to fetch shipments data");
    }
  },

  // Create a new shipment for a specific order
  createShipment: async (orderId, shipmentData) => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.post(`/shipment/${orderId}`, shipmentData);
      console.log("Create Shipment Response:", response); // Log the response

      if (response.data) {
        set((state) => ({
          shipments: [...state.shipments, response.data],
          isLoading: false,
        }));

        toast.success("Shipment created successfully!");
      } else {
        throw new Error("Failed to create shipment");
      }
    } catch (error) {
      handleError(set, error, "Failed to create shipment");
    }
  },

  // Fetch available vehicles
  fetchVehicles: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.get("/shipment/vehicles");
      console.log("Vehicles Response:", response); // Log the response for debugging

      if (response.data && Array.isArray(response.data)) {
        set({ vehicles: response.data, isLoading: false });
      } else if (response.data && Array.isArray(response.data.data)) {
        set({ vehicles: response.data.data, isLoading: false });
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      handleError(set, error, "Failed to fetch vehicles data");
    }
  },

  // Fetch all routes
  fetchRoutes: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.get("/shipment/routes");
      console.log("Routes Response:", response);

      if (response.data && Array.isArray(response.data)) {
        set({ routes: response.data, isLoading: false });
      } else if (response.data && Array.isArray(response.data.data)) {
        set({ routes: response.data.data, isLoading: false });
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      handleError(set, error, "Failed to fetch routes data");
    }
  },

  // Create a new route and link it to the shipment
  createRoute: async (routeData) => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.post(`/createroute`, routeData);
      console.log("Create Route Response:", response); // Log the response for debugging

      if (response.data) {
        set((state) => ({
          routes: [...state.routes, response.data],
          isLoading: false,
        }));

        toast.success("Route created successfully!");
      } else {
        throw new Error("Failed to create route");
      }
    } catch (error) {
      handleError(set, error, "Failed to create route");
    }
  },

  // Assign a vehicle to a route
  assignVehicleToRoute: async (routeId, vehicleId) => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.post(`/shipment/${routeId}/assign-vehicle`, { vehicle_id: vehicleId });
      console.log("Assign Vehicle Response:", response); // Log the response
      set({ isLoading: false });
      if (response.data) {
        toast.success("Vehicle assigned to route successfully!");
      } else {
        throw new Error("Failed to assign vehicle to route");
      }
    } catch (error) {
      handleError(set, error, "Failed to assign vehicle to route");
    }
  }
}));

// Helper function to handle errors
const handleError = (set, error, defaultMessage) => {
  let errorMessage = defaultMessage;

  if (error.response) {
    console.error("Error Response Data:", error.response.data); // Log the full response for debugging
    errorMessage = error.response?.data?.message || errorMessage;
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Set error state and show toast
  set({ isLoading: false, isError: true, errorMessage });
  toast.error(errorMessage);
};
