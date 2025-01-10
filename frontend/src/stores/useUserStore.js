import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  userAddresses: [], // Store user addresses
  userAddresses: [],
  userRoles: [],  // Add userRoles to the state
  userPermissions: [],  // Add userPermissions to the state
  userOrders: [],  // Add userOrders to the state
  userInvoices: [],
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

  logout: async () => {
    try {
      // Step 1: Send logout request to the server
      const response = await axiosInstance.post("/logout");
      
      // Step 2: If the server responds successfully, remove the token
      if (response.status === 200) {
        localStorage.removeItem("access_token");
        set({ user: null }); // Update user state to null
  
        // Show success message
        toast.success("Logged out successfully!");
      } else {
        // Handle unexpected response
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      // Handle any error that occurs during logout
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true }); // Set checkingAuth to true when checking authentication
  
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      set({ checkingAuth: false }); // Set checkingAuth to false if no token exists
      return; // No token, can't check auth
    }
  
    try {
      // Fetch the user data, including roles, permissions, and orders
      const res = await axiosInstance.get("/me");
      console.log(res.data)
      // Assuming the API response includes user roles, permissions, and orders
      set({
        user: res.data.user,             // Set the user data
        userRoles: res.data.roles,       // Set the user roles
        userPermissions: res.data.permissions, // Set the user permissions
        userOrders: res.data.orders,     // Set the user orders
        userInvoices: res.data.invoices, // Set the user invoices (if provided)
        checkingAuth: false,             // Set checkingAuth to false
      });
    } catch (error) {
      localStorage.removeItem("access_token");
      set({ user: null, checkingAuth: false }); // Set user to null and checkingAuth to false
    }
  },
  

  updateProfile: async (updatedData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put("/user/profile", updatedData);
      set({ user: res.data, loading: false });
      toast.success("Profile updated successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred while updating the profile");
    }
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    set({ loading: true });
    if (newPassword !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axiosInstance.post("/user/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred while changing the password");
    }
  },

  // Get user addresses
  getUserAddresses: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/user/addresses");
      set({ userAddresses: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred while fetching addresses");
    }
  },

  // Store user address
  storeUserAddress: async (addressData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/user/addresses", addressData);
      set((state) => ({
        userAddresses: [...state.userAddresses, res.data], // Add the new address to the state
        loading: false
      }));
      toast.success("Address added successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred while adding the address");
    }
  },

  // Update user address
  updateUserAddress: async (addressId, updatedData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put(`/user/addresses/${addressId}`, updatedData);
      set((state) => ({
        userAddresses: state.userAddresses.map((address) =>
          address.id === addressId ? res.data : address // Replace the updated address in the list
        ),
        loading: false
      }));
      toast.success("Address updated successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred while updating the address");
    }
  },
}));
