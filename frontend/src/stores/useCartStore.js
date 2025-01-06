import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Inertia } from '@inertiajs/inertia';

// Load Stripe outside the store for reusability
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC);

export const useCartStore = create((set, get) => ({
  cart: [],
  orderId: null,
  isCouponApplied: false,
  isOrderChanged: false,
  coupon: null, // Selected coupon
  userCoupons: [], // List of user coupons
  totalAmount: 0, // Total amount before discount
  discountAmount: 0, // Discount applied
  totalAfterDiscount: 0, // Total after discount
  isPaymentProcessing: false, // Flag for payment processing status
  paymentMessage: '', // Payment status message

  // Fetch cart by orderId
  getCartByOrderId: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/order-items/${orderId}`);
      if (response.data) {
        set({ cart: response.data });
        toast.success("Cart loaded successfully.");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(error.response?.data?.message || "Failed to fetch cart. Please try again.");
    }
  },

  // Payment processing logic moved to the store
  processPayment: async (paymentMethod, paymentGateway, currency) => {
    const { orderId } = get(); // Get the current orderId and total amount

    if (!orderId) {
      toast.error("Order not found. Please try again.");
      return;
    }

    set({ isPaymentProcessing: true, paymentMessage: "Processing payment..." }); // Set loading state

    try {
      // Call backend to create the Stripe Checkout session
      const sessionId = await get().createCheckoutSession(orderId, paymentMethod, paymentGateway, currency);
      
      // After we get the session ID, redirect the user to Stripe Checkout
      await get().redirectToStripeCheckout(sessionId);

      set({ isPaymentProcessing: false, paymentMessage: "" });
    } catch (error) {
      toast.error("An error occurred while processing the payment.");
      set({ paymentMessage: "An error occurred while processing the payment." });
      set({ isPaymentProcessing: false });
    }
  },

  // Create a Stripe Checkout session
  createCheckoutSession: async (orderId, paymentMethod, gateway, currency) => {
    try {
      const { data } = await axiosInstance.post("/payment/process", {
        orderId,
        payment_method: paymentMethod,
        gateway,
        currency,
      });

      // The session ID is returned from the backend
      return data.id; // Stripe checkout session ID
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      throw new Error("Failed to create checkout session");
    }
  },

  // Redirect to Stripe Checkout page
  redirectToStripeCheckout: async (sessionId) => {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error("Error redirecting to Stripe Checkout:", error);
      toast.error("Error redirecting to Stripe Checkout.");
    }
  },

  // Fetch payment status from the backend
  fetchPaymentOrderId: async () => {
    set({ paymentMessage: "Verifying payment..." });

    try {
      // Using Inertia's get method to call the backend route
      const response = await Inertia.get('/payment/stripe-success', {}, {
        preserveState: false, // Adjust based on whether you want to preserve the page state
        onFinish: () => set({ paymentMessage: "" }), // Reset the loading message when request is finished
      });

      // Check if the response contains success status (this depends on your response structure)
      if (response.success) {
        set({ paymentStatus: "success", paymentMessage: "Payment successful!", orderId: response.orderId });
        toast.success("Payment successful!");
      } else {
        set({ paymentStatus: "failed", paymentMessage: "Payment verification failed." });
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      set({ paymentStatus: "error", paymentMessage: "Error verifying payment." });
      toast.error("Error verifying payment.");
    }
  },


  // Fetch all user coupons and include the cart items
  getMyCoupons: async () => {
    try {
      const { cart } = get();
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty. Unable to fetch coupons.");
        return;
      }

      const productIds = cart.map(item => item.products_id);
      const response = await axiosInstance.post(`/coupon`, { productIds });

      set({ userCoupons: response.data, isCouponApplied: false });
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  },

  // Apply a coupon, update cart and totals
  applyCoupon: async (couponId) => {
    try {
      const { cart, orderId } = get();
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty. Cannot apply coupon.");
        return;
      }

      const productIds = cart.map(item => item.products_id);

      const response = await axiosInstance.post("/coupon/apply", { couponId, productIds, orderId });

      set({
        cart: response.data.order_items,
        orderId: response.data.order_id,
        isCouponApplied: true,
        coupon: response.data.coupon,
        totalAmount: response.data.total_amount,
        discountAmount: response.data.discount_amount,
        totalAfterDiscount: response.data.total_after_discount,
      });

      toast.success("Coupon applied successfully");
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon. Please try again.");
    }
  },

  // Clear the cart, reset orderId, and reset coupon states
  clearCart: () => {
    set({
      cart: [],
      orderId: null,
      isCouponApplied: false,
      coupon: null,
      userCoupons: [],
      totalAmount: 0,
      discountAmount: 0,
      totalAfterDiscount: 0,
    });

    toast.success("Cart cleared successfully");
  },

  // Add a product to the cart
  addToCart: async (productId) => {
    try {
      const { orderId } = get();
      const response = await axiosInstance.post("/cart", { productId, orderId });
      const { orderId: newOrderId, orderItems, totalAmount } = response.data;

      set({
        orderId: newOrderId,
        cart: orderItems,
        isOrderChanged: !get().isOrderChanged,
        totalAmount: totalAmount,
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
      const { orderId } = get();
      const response = await axiosInstance.delete("/cart", { data: { productId, orderId } });
      const { orderId: newOrderId, orderItems, totalAmount } = response.data;

      set({
        orderId: newOrderId,
        cart: orderItems,
        isOrderChanged: !get().isOrderChanged,
        totalAmount: totalAmount,
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
      const { orderId } = get();
      const response = await axiosInstance.put("/cart/quantity", { productId, orderId, isIncrement });
      const { orderId: newOrderId, orderItems, totalAmount } = response.data;

      set({
        orderId: newOrderId,
        cart: orderItems,
        isOrderChanged: !get().isOrderChanged,
        totalAmount: totalAmount,
      });

      toast.success(isIncrement ? "Quantity increased" : "Quantity decreased");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update quantity. Please try again.");
    }
  },
}));
