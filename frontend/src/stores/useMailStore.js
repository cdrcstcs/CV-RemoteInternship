import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useMailStore = create((set, get) => ({
  orderData: null, // Store the order data
  isProcessingMail: false, // Flag to track if the order is being processed
  isErrorMail: false, // Flag to track if there's an error
  errorMessageMail: "", // Error message if any
  isSuccessMail: false, // Flag to track if the order was processed successfully

  // Function to process the order and send the email
  sendMail: async (orderData) => {
    const { isProcessingMail } = get();

    // Prevent sending mail if one is already being processed
    if (isProcessingMail) return;

    set({ isProcessingMail: true, isErrorMail: false, errorMessageMail: "", isSuccessMail: false });

    try {
      // Send the order data to the backend
      const response = await axiosInstance.post("/send-email", orderData); // Replace with your backend URL

      set({
        orderData: response.data, // Store the order data in the state
        isProcessingMail: false,
        isSuccessMail: true,
      });
      toast.success("Email sent successfully!");
    
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error sending mail";
      set({
        isProcessingMail: false,
        isErrorMail: true,
        errorMessageMail: errorMessage,
      });
      toast.error(errorMessage);
    }
  },

  reset: () => set({
    orderData: null,
    isProcessingMail: false,
    isErrorMail: false,
    errorMessageMail: "",
    isSuccessMail: false,
  }),
}));

export default useMailStore;
