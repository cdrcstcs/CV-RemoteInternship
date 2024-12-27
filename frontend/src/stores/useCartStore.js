import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  orderId: null,
  isCouponApplied: false,
  isOrderChanged: false,
  coupon: null, // Selected coupon
  userCoupons: [], // List of user coupons

  // Fetch all user coupons and include the cart items
  getMyCoupons: async () => {
    try {
      const { cart } = get(); // Get the current cart items
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty. Unable to fetch coupons.");
        return;
      }

      const productIds = cart.map(item => item.product_id); // Extract the product IDs from cart items

      const response = await axiosInstance.get(`/coupons`, {
        params: { productIds }, // Pass productIds (cart items) to the backend
      });

      set({ userCoupons: response.data }); // Store the list of user coupons
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error(error.response?.data?.message || "Failed to fetch coupons. Please try again.");
    }
  },

  // Apply a coupon, update cart and totals
  applyCoupon: async (couponId) => {
    try {
      const { cart, orderId } = get(); // Get the current cart and orderId
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty. Cannot apply coupon.");
        return;
      }

      const productIds = cart.map(item => item.product_id); // Extract the product IDs from cart items

      // Send the coupon id, product IDs, and orderId to validate the coupon
      const response = await axiosInstance.post("/coupons/apply", { couponId, productIds, orderId });

      // Update the state with the coupon data, and the updated cart and totals
      set({
        cart: response.data.cart, // Update the cart with the new items (with the coupon applied)
        isCouponApplied: true, // Mark coupon as applied
        coupon: response.data.coupon, // Set the applied coupon
      });

      toast.success("Coupon applied successfully");
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon. Please try again.");
    }
  },

  // Remove the coupon and reset cart totals
  removeCoupon: () => {
    const { cart } = get();
    try {
      // Reset cart, total, and subtotal when coupon is removed
      set({
        isCouponApplied: false,
        coupon: null, // Remove the applied coupon
        userCoupons: [], // Optionally clear the user coupons list
      });

      toast.success("Coupon removed");
    } catch (error) {
      console.error("Error removing coupon:", error);
      toast.error("Failed to remove coupon. Please try again.");
    }
  },

  // Clear the cart, reset orderId, and reset coupon states
  clearCart: async () => {
    try {
      await axiosInstance.delete(`/allfromcart`);
      set({ cart: [], orderId: null, isCouponApplied: false }); // Reset cart and coupon state
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error(error.response?.data?.message || "Failed to clear cart. Please try again.");
    }
  },

  // Add a product to the cart
  addToCart: async (productId) => {
    try {
      const { orderId } = get(); // Get the current orderId
      const response = await axiosInstance.post("/cart", { productId, orderId }); // Send orderId with productId
      const { orderId: newOrderId, orderItems } = response.data;

      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
      });

      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add product to cart. Please try again.");
    }
  },

  // Remove a product from the cart
  removeFromCart: async (productId) => {
    try {
      const { orderId } = get(); // Get the current orderId
      const response = await axiosInstance.delete("/cart", { data: { productId, orderId } }); // Send data as part of request body
      const { orderId: newOrderId, orderItems } = response.data;

      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
      });

      toast.success("Product removed from cart");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error(error.response?.data?.message || "Failed to remove product from cart. Please try again.");
    }
  },

  // Update quantity of a product in the cart
  updateQuantity: async (productId, isIncrement) => {
    try {
      const { orderId } = get(); // Get the current orderId
      const response = await axiosInstance.put("/cart/quantity", { productId, orderId, isIncrement }); // Sending the isIncrement flag
      const { orderId: newOrderId, orderItems } = response.data;

      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
      });

      toast.success(isIncrement ? "Quantity increased" : "Quantity decreased");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update quantity. Please try again.");
    }
  },
}));
