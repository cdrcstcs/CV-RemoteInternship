import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Assuming you have axiosInstance configured
import { toast } from "react-hot-toast";

export const useDeliveryStore = create((set, get) => ({
  shipments: [],
  vehicle: null,  // Store the vehicle data here
  isLoading: false,
  isError: false,
  errorMessage: '',

  // Function to fetch shipments with related route optimizations, route details, and route conditions
  fetchShipmentsWithRouteDetails: async () => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    try {
      const response = await axiosInstance.get('/shipments/with-details'); // Assuming this route exists on the backend
      const shipments = response.data; // Destructure shipments from the response
      console.log(shipments);
      set({
        shipments: shipments, // Store shipments in the state
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Error fetching shipments.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to save the vehicle ID (consistent with other actions in the store)
  handleSaveVehicleId: async (routeDetailId, assignedVehicleId) => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    try {
      await axiosInstance.put(`/route-details/${routeDetailId}`, { vehicle_id: assignedVehicleId });
      toast.success('Vehicle assigned successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating vehicle ID.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to fetch the vehicle for the authenticated user
  getVehicleForAuthenticatedUser: async () => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    try {
      const response = await axiosInstance.get('/user/vehicle'); // Assuming this is the API endpoint
      const vehicle = response.data.vehicle; // Extract vehicle from the response
      set({
        vehicle: vehicle, // Store vehicle data in the state
      });
      toast.success('Vehicle fetched successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching vehicle.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to reset the store values (if needed)
  reset: () => set({
    shipments: [],
    vehicle: null, // Reset vehicle data as well
    isLoading: false,
    isError: false,
    errorMessage: '',
  }),
}));

export default useDeliveryStore;
