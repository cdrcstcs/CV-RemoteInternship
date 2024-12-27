import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: false,

  // Signup user
  signup: async ({ first_name, last_name, phone_number, email, password, confirmPassword, language = "en" }) => {
    set({ loading: true });

    // Basic password confirmation validation
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      // Make the API call for signup
      const res = await axiosInstance.post("/signup", { 
        first_name, 
        last_name, 
        phone_number, 
        email, 
        password, 
        language 
      });

      // Save the access token (you may adjust to store refresh token if needed in the future)
      localStorage.setItem("access_token", res.data.token);

      // Update the user state with the user data returned from the API
      set({ user: res.data.user, loading: false });

      // Show success message
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });

      // Show error message from API response
      toast.error(error.response?.data?.message || "An error occurred during signup");
    }
  },

  // Login user
  login: async (email, password) => {
    set({ loading: true });

    try {
      // Make the API call for login
      const res = await axiosInstance.post("/login", { email, password });

      // Save the access token (store refresh token if necessary in the future)
      localStorage.setItem("access_token", res.data.token);

      // Update the user state with the user data returned from the API
      set({ user: res.data.user, loading: false });

      // Show success message
      toast.success("Logged in successfully!");
    } catch (error) {
      set({ loading: false });

      // Show error message from API response
      toast.error(error.response?.data?.message || "An error occurred during login");
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Make the API call for logout
      await axiosInstance.post("/logout");

      // Clear access token from localStorage (and any other tokens you may store)
      localStorage.removeItem("access_token");

      // Reset user state and set checkingAuth to false
      set({ user: null, checkingAuth: false });

      // Show success message
      toast.success("Logged out successfully!");
    } catch (error) {
      // Handle any error that occurs during logout
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  // Optionally, check authentication on page load (to auto-login if token exists)
  checkAuth: async () => {
    set({ checkingAuth: true });

    const token = localStorage.getItem("access_token");

    if (!token) {
      set({ checkingAuth: false });
      return; // No token, can't check auth
    }

    try {
      // Make a call to the backend to check if the token is still valid
      const res = await axiosInstance.get("/me");

      // Set the user state with the valid user data
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      // If the token is invalid or expired, clear it from localStorage
      localStorage.removeItem("access_token");

      set({ user: null, checkingAuth: false });
    }
  },
}));

