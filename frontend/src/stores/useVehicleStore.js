import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Assuming you have axiosInstance configured
import { toast } from "react-hot-toast";

export const useVehicleStore = create((set, get) => ({
  vehicles: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  
  // Function to fetch vehicles and user data
  fetchVehicles: async () => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    try {
      const response = await axiosInstance.get('/vehicles');
      const vehicles = response.data; // Destructure user and vehicles from the response
      console.log(vehicles);
      set({
        vehicles: vehicles, // Store vehicles in the state
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Error fetching vehicles.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to update a vehicle
  updateVehicle: async (vehicleId, vehicleData) => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    console.log(vehicleData);
    try {
      // Send the update request
      const response = await axiosInstance.put(`/vehicles/${vehicleId}`, vehicleData);
      
      // Update the vehicle in the store
      const updatedVehicle = response.data;
      set((state) => {
        const updatedVehicles = state.vehicles.map((vehicle) => 
          vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        );
        return { vehicles: updatedVehicles }; // Update the specific vehicle in the state
      });

      toast.success('Vehicle updated successfully'); // Success toast
    } catch (err) {
      const message = err.response?.data?.message || 'Error updating vehicle.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to reset the store values (if needed)
  reset: () => set({
    vehicles: [],
    isLoading: false,
    isError: false,
    errorMessage: '',
  }),
}));

export default useVehicleStore;
