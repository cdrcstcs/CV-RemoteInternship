import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useFeedbackFormStore = create((set, get) => ({
  currentFeedbackForm: null,
  isLoadingForm: false,
  isError: false,
  errorMessage: "",
  questionTypes: ['text', "select", "radio", "checkbox", "textarea"],
  feedbackForms: [],
  // Get all feedback forms associated with a specific order
  getFeedbackFormsForOrder: async (orderId) => {
    set({ isLoadingForm: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.get(`/feedback-forms/${orderId}`);
      console.log(response.data.feedback_forms);
      set({
        feedbackForms: response.data.feedback_forms, // Assuming the response includes a 'feedback_forms' array
        isLoadingForm: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch feedback forms for this order";
      set({ isLoadingForm: false, isError: true, errorMessage });
      toast.error(errorMessage);
    }
  },
  // Create a new feedback form
  createFeedbackForm: async (feedbackForm) => {
    set({ isLoadingForm: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.post("/feedback-forms", feedbackForm);
      toast.success("Feedback form created successfully!");
      set({ isLoadingForm: false });
      return response.data; // Return the created feedback form
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create feedback form";
      set({ isLoadingForm: false, isError: true, errorMessage });
      toast.error(errorMessage);
    }
  },

  // Update a feedback form by ID
  updateFeedbackForm: async (id, feedbackForm) => {
    set({ isLoadingForm: true, isError: false, errorMessage: "" });

    try {
      const response = await axiosInstance.put(`/feedback-forms/${id}`, feedbackForm);
      toast.success("Feedback form updated successfully!");
      set({ isLoadingForm: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update feedback form";
      set({ isLoadingForm: false, isError: true, errorMessage });
      toast.error(errorMessage);
    }
  },

  // Submit answers to a feedback form
  submitFeedbackForm: async (id, answers) => {
    set({ isLoadingForm: true, isError: false, errorMessage: "" });

    try {
      await axiosInstance.post(`/feedback-forms/${id}/answer`, { answers });
      toast.success("Feedback submitted successfully!");
      set({ isLoadingForm: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit feedback";
      set({ isLoadingForm: false, isError: true, errorMessage });
      toast.error(errorMessage);
      return false;
    }
  },


  // Reset all store data
  resetStore: () => set({ currentFeedbackForm: null, isLoadingForm: false, isError: false, errorMessage: "" }),
}));
