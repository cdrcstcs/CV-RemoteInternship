import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useTwoFactorAuthenticationStore = create((set, get) => ({
  sendLoading: false,          // Loading state for sending 2FA code
  verifyLoading: false,        // Loading state for verifying 2FA code
  sendError: null,             // Error state for sending 2FA code
  verifyError: null,           // Error state for verifying 2FA code
  is2FAComplete: false,        // Track if the 2FA process has been completed

  // Send 2FA code to the user
  sendTwoFactorCode: async (phoneNumber) => {
    set({ sendLoading: true, sendError: null });

    try {
      const res = await axiosInstance.post("/send-2fa-code", { phone_number: phoneNumber });

      toast.success("Verification code sent to your phone!");
      set({ sendLoading: false }); // Reset send loading state

    } catch (error) {
      set({ sendLoading: false, sendError: error.response?.data?.message || "An error occurred while sending the 2FA code" });
      toast.error(error.response?.data?.message || "An error occurred while sending the 2FA code");
    }
  },

  // Verify 2FA code entered by the user
  verifyTwoFactorCode: async (code) => {
    set({ verifyLoading: true, verifyError: null });

    try {
      const res = await axiosInstance.post("/verify-2fa-code", { code });

      set({ verifyLoading: false, is2FAComplete: true });  // Mark 2FA as complete
      toast.success("2FA code verified successfully!");

    } catch (error) {
      set({ verifyLoading: false, verifyError: error.response?.data?.message || "An error occurred while verifying the 2FA code" });
      toast.error(error.response?.data?.message || "An error occurred while verifying the 2FA code");
    }
  },

  // Reset 2FA errors and loading state
  resetTwoFactorAuthentication: () => {
    set({ sendLoading: false, verifyLoading: false, sendError: null, verifyError: null, is2FAComplete: false });
  }
}));
