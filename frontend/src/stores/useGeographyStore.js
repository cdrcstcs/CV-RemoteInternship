import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useGeographyStore = create((set, get) => ({
  geographyData: [],   // To store aggregated warehouse count by country
  isLoading: false,     // To track loading state
  isError: false,       // To track error state
  errorMessage: "",     // Error message

  // Fetch geography data
  fetchGeography: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    try {
      // Make the API request to fetch data
      const response = await axiosInstance.get("/warehouse/geography");
      console.log(response.data);
      // Check if the response data is valid and structure it correctly
      if (response.data && Array.isArray(response.data)) {
        set({ geographyData: response.data, isLoading: false });
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      // Handle the error gracefully
      let errorMessage = "Failed to fetch geography data";

      // Check if the error is related to the response
      if (error.response) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error.message) {
        // Handle cases where the error is thrown manually (e.g., invalid data format)
        errorMessage = error.message;
      }

      // Update the state with the error and show a toast notification
      set({ isLoading: false, isError: true, errorMessage });
      toast.error(errorMessage);
    }
  },
}));
