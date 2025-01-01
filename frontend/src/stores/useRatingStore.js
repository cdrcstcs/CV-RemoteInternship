import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useRatingStore = create((set, get) => ({
  ratings: [],
  ratingLoading: false,
  isSubmitting: false,
  isError: false,
  errorMessage: "",
  selectedProductId: null, // For storing the currently selected product ID
  feedback: "",
  ratingValue: 0,

  fetchRatings: async (productId) => {
    set({ ratingLoading: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.get(`/products/${productId}/ratings`);
      set({ ratings: response.data, ratingLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch ratings";
      set({ ratingLoading: false, isError: true, errorMessage });
      toast.error(errorMessage);
    }
  },

  submitRating: async (productId, ratingValue, feedback, shipmentId) => {
    set({ isSubmitting: true });

    try {
      const response = await axiosInstance.post(`/products/${productId}/ratings`, {
        rating_value: ratingValue,
        feedback,
        shipments_id: shipmentId, // Assuming you have shipmentId available
      });
      
      set((state) => ({
        ratings: [...state.ratings, response.data.rating], // Update the ratings list
        feedback: "", // Clear feedback after submission
        ratingValue: 0, // Reset rating value
      }));
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit feedback";
      toast.error(errorMessage);
    } finally {
      set({ isSubmitting: false });
    }
  },

  setFeedback: (feedback) => set({ feedback }),
  setRatingValue: (ratingValue) => set({ ratingValue }),
  setSelectedProductId: (productId) => set({ selectedProductId: productId }),

  reset: () => set({
    ratings: [],
    feedback: "",
    ratingValue: 0,
    selectedProductId: null,
  }),

}));

export default useRatingStore;
