import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Assuming you have axiosInstance configured
import { toast } from "react-hot-toast";
export const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  orderStatus: null, // To hold the status of a specific order
  
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

  // Function to get the status of an order by its ID
  getOrderStatusById: async (orderId) => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading
    try {
      const response = await axiosInstance.get(`/orders/${orderId}/status`);
      
      // Store the status in the state
      set({ orderStatus: response.data });

      // Optionally show success toast
      toast.success('Order status fetched successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Error fetching order status.';
      set({ isError: true, errorMessage: message }); // Set error state
      toast.error(message); // Display error toast
    } finally {
      set({ isLoading: false }); // Set loading state to false
    }
  },

  // Function to listen for real-time order status updates using WebSockets
  listenForOrderStatusUpdates: (orderId) => {
    console.log(orderId)
    const channel = Echo.channel(`order-status.${orderId}`);
    console.log(channel)
    // Listen for OrderStatusUpdated event
    channel.listen('OrderStatusUpdated', (event) => {
        console.log(event);
      set({ orderStatus: event.status });
      toast.success(`Order status updated to: ${event.status}`);
    });

    return () => {
      // Cleanup: Stop listening when the component unmounts
      channel.stopListening('OrderStatusUpdated');
    };
  },

  // Function to reset the store values (if needed)
  reset: () => set({
    orders: [],
    isLoading: false,
    isError: false,
    errorMessage: '',
    orderStatus: null, // Reset orderStatus as well
  }),
}));

export default useOrderStore;
