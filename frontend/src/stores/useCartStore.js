import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  orderId: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  isOrderChanged: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    toast.success("Coupon removed");
  },

  clearCart: async () => {
    try {
      await axios.delete(`/allfromcart`);
      set({ cart: [], orderId: null, isOrderChanged: !get().isOrderChanged }); // Reset cart and orderId
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  },

  addToCart: async (productId) => {
    try {
      const { orderId } = get(); // Get the current orderId
      const response = await axios.post("/cart", { productId, orderId }); // Send orderId with productId
      const { orderId: newOrderId, orderItems } = response.data;
      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
      });
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    try {
      const { orderId } = get(); // Get the current orderId
      const response = await axios.delete("/cart", { data: { productId, orderId } }); // Send data as part of request body
      const { orderId: newOrderId, orderItems } = response.data;
      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
      });
      toast.success("Product removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  // Update quantity of a product in the cart
  updateQuantity: async (productId, isIncrement) => {
    try {
      const { orderId } = get(); // Get the current orderId
      const response = await axios.put("/cart/quantity", { productId, orderId, isIncrement }); // Sending the isIncrement flag
      const { orderId: newOrderId, orderItems } = response.data;
      
      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
      });
      
      toast.success(isIncrement ? "Quantity increased" : "Quantity decreased");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while updating quantity");
    }
  },
}));
