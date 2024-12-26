import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  orderId: null,
  isCouponApplied: false,
  isOrderChanged: false,

  // Fetch coupon data and include the cart items
  getMyCoupon: async () => {
    try {
      const { cart } = get(); // Get the current cart items
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty. Unable to fetch coupon.");
        return;
      }

      const productIds = cart.map(item => item.product_id); // Extract the product IDs from cart items

      const response = await axios.get(`/coupons`, {
        params: { productIds }, // Pass productIds (cart items) to the backend
      });

      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
      toast.error(error.response?.data?.message || "Failed to fetch coupon. Please try again.");
    }
  },

  // Apply a coupon, update cart and totals
  applyCoupon: async (code) => {
    try {
      const { cart, orderId } = get(); // Get the current cart and orderId
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty. Cannot apply coupon.");
        return;
      }

      const productIds = cart.map(item => item.product_id); // Extract the product IDs from cart items

      // Send the coupon code, product IDs, and orderId to validate the coupon
      const response = await axios.post("/coupons/apply", { code, productIds, orderId });

      // Update the state with the coupon data, and the updated cart and totals
      set({
        cart: response.data.cart, // Update the cart with the new items (with the coupon applied)
        isCouponApplied: true, // Mark coupon as applied
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
        coupon: null,
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
      await axios.delete(`/allfromcart`);
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
      const response = await axios.post("/cart", { productId, orderId }); // Send orderId with productId
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
      const response = await axios.delete("/cart", { data: { productId, orderId } }); // Send data as part of request body
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
      const response = await axios.put("/cart/quantity", { productId, orderId, isIncrement }); // Sending the isIncrement flag
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
