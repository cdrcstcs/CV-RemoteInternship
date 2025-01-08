import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useShipmentStore = create((set, get) => ({
  shipments: [],          // To store the list of shipments
  orders: [],             // To store the list of orders
  routes: [],             // To store the list of routes (newly added)
  vehicles: [],           // To store the list of vehicles (newly added)
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

      // If the response has a data field which contains an array of shipments
      if (response.data && Array.isArray(response.data)) {
        set({ shipments: response.data, isLoading: false });
      } else if (response.data && Array.isArray(response.data.data)) {
        // Handle nested data (e.g., response.data.data)
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
      const response = await axiosInstance.post(`/shipment/${orderId}`, shipmentData); // Corrected the endpoint
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

  // Fetch available vehicles (newly added to support route creation)
  fetchVehicles: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.get("/vehicles");  // Adjust the endpoint as needed
      console.log("Vehicles Response:", response); // Log the response for debugging

      if (response.data && Array.isArray(response.data)) {
        set({ vehicles: response.data, isLoading: false });
      } else if (response.data && Array.isArray(response.data.data)) {
        // Handle nested data
        set({ vehicles: response.data.data, isLoading: false });
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      handleError(set, error, "Failed to fetch vehicles data");
    }
  },

  // Create a new route and link it to the shipment
  createRoute: async (routeData) => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    console.log(routeData);
    try {
      const response = await axiosInstance.post(`/create-route`, routeData);  // Send the raw data directly
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
