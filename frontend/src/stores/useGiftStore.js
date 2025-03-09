import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useGiftStore = create((set, get) => ({
  stripeClientSecret: "", // Stores the Stripe client secret for the payment
  isPaymentProcessing: false, // State to manage if the payment is being processed

  createStripePaymentIntent: async (currency, totalAfterDiscount) => {
    try {
      set({ isPaymentProcessing: true }); // Set isPaymentProcessing to true when the request starts

      // Create a Stripe payment intent on the backend
      const response = await axiosInstance.post("/create-payment-intent-gift", {
        amount: totalAfterDiscount, // Send the amount after discount
        currency: currency,
      });

      if (response.data.clientSecret) {
        set({ stripeClientSecret: response.data.clientSecret });
      }

      toast.success("Stripe payment intent created successfully.");
    } catch (error) {
      toast.error("Failed to create payment intent. Please try again.");
    } finally {
      set({ isPaymentProcessing: false }); // Set isPaymentProcessing to false when done or on error
    }
  },
}));
