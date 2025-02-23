import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useMailStore = create((set, get) => ({
  orderData: null, // Store the order data
  isProcessing: false, // Flag to track if the order is being processed
  isError: false, // Flag to track if there's an error
  errorMessage: "", // Error message if any
  isSuccess: false, // Flag to track if the order was processed successfully

  // Function to process the order and send the email
  sendMail: async (orderData) => {
    set({ isProcessing: true, isError: false, errorMessage: "", isSuccess: false });

    try {
      // Send the order data to the backend
      const response = await axiosInstance.post("/send-email", orderData); // Replace with your backend URL

      if (response.status === 200) {
        set({
          orderData: response.data, // Store the order data in the state
          isProcessing: false,
          isSuccess: true,
        });
        toast.success("Email sent successfully!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error sending mail";
      set({
        isProcessing: false,
        isError: true,
        errorMessage: errorMessage,
      });
      toast.error(errorMessage);
    }
  },

  reset: () => set({
    orderData: null,
    isProcessing: false,
    isError: false,
    errorMessage: "",
    isSuccess: false,
  }),
}));

export default useMailStore;
