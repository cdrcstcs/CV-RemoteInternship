import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Assuming you have axiosInstance configured
import { toast } from "react-hot-toast";

export const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  
  // Function to fetch orders for the user warehouse
  fetchOrders: async () => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    try {
      const response = await axiosInstance.get('/warehouse/orders');
      set({ orders: response.data }); // Store orders in the state
    } catch (err) {
      const message = err.response?.data?.message || 'Error fetching orders.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to update the status of an order
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    try {
      const response = await axiosInstance.post(`/orders/${orderId}/status`, { status });
      
      // Update the local orders state with the new order data
      set((state) => {
        const updatedOrders = state.orders.map((order) => 
          order.id === orderId ? { ...order, status } : order
        );
        return { orders: updatedOrders };
      });

      // Show success toast
      toast.success('Order status updated successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Error updating order status.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to reset the store values (if needed)
  reset: () => set({
    orders: [],
    isLoading: false,
    isError: false,
    errorMessage: '',
  }),
}));

export default useOrderStore;
