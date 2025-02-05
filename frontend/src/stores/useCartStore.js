import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Load your Stripe publishable key
const stripePromise = loadStripe("pk_test_51PMjcCIw69kb65LMm6zd49cWEi1zj4wFnwVbF9mxurJg1JlgoH0S7tOPdJglr0YmyejIYYfDTHhVTFOSgt0SD0rv00YmclMWcR");

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
  paymentMessage: '',
  routeDetails: [], // Stores the route details for delivery
  totalDistance: 0, // Total distance for the delivery
  stripeClientSecret: "", // Stores the Stripe client secret for the payment
  // Prepare delivery: Get the route details and shipment data
  resetRouteDetails: () => set({ routeDetails: [] }),

  processPayment: async (paymentMethod, paymentGateway, currency) => {
    const { orderId } = get(); // Get the current orderId and total amount

    if (!orderId) {
      toast.error("Order not found. Please try again.");
      return;
    }

    set({ isPaymentProcessing: true, paymentMessage: '' }); // Set loading state
    console.log(orderId);
    const formData = {
      orderId: orderId,
      payment_method: paymentMethod,
      gateway: paymentGateway,
      currency: currency,
    };

    try {
      const response = await axiosInstance.post('/payment/process', formData);
      set({ paymentMessage: 'ok' });
      if (response.data.success) {
        toast.success('Payment processed successfully!');
	} else {
        toast.error(`Error: ${response.data.error}`);
      }
    } catch (error) {
      set({ paymentMessage: 'An error occurred while processing the payment.' });
      toast.error('An error occurred while processing the payment.');
    } finally {
      set({ isPaymentProcessing: false });
    }
  },
  prepareDelivery: async (userLocation) => {
    const { orderId } = get(); // Get the current orderId
    if (!orderId) {
      toast.error("Order not found. Cannot prepare delivery.");
      return;
    }

    try {
      // Prepare the delivery data, passing the orderId and userLocation
      const response = await axiosInstance.post('/payment/delivery/prepare', { orderId, userLocation });
      console.log(response.data);
      // Update the route details in the state
      set({
        routeDetails: response.data.route_details,
        totalDistance: response.data.total_distance,
      });

      toast.success("Delivery prepared successfully!");
    } catch (error) {
      console.error("Error preparing delivery:", error);
      toast.error(error.response?.data?.message || "Failed to prepare delivery. Please try again.");
    } finally {
      set({ isPaymentProcessing: false }); // Reset the loading state
    }
  },

  processStripePayment: async (paymentMethod) => {
    const { orderId, stripeClientSecret } = get(); // Get the current orderId and stripeClientSecret
    const stripe = await stripePromise;
    const elements = useElements();

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded correctly. Please try again later.");
      return;
    }

    set({ isPaymentProcessing: true, paymentMessage: '' });

    try {
      // Use Stripe's confirmCardPayment function to handle payment processing
      const { error, paymentIntent } = await stripe.confirmCardPayment(stripeClientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        set({ paymentMessage: error.message });
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
          toast.success("Payment processed successfully!");
      }
    } catch (error) {
      set({ paymentMessage: 'An error occurred while processing the payment.' });
      toast.error('An error occurred while processing the payment.');
    } finally {
      set({ isPaymentProcessing: false });
    }
  },

  createStripePaymentIntent: async (currency) => {
    const { orderId, totalAfterDiscount } = get();
    if (!orderId) {
      toast.error("Order not found. Cannot create payment intent.");
      return;
    }

    try {
      // Create a Stripe payment intent on the backend
      const response = await axiosInstance.post("/create-payment-intent", {
        orderId,
        amount: totalAfterDiscount, // Send the amount after discount
        currency: currency,
      });

      if (response.data.clientSecret) {
        set({ stripeClientSecret: response.data.clientSecret });
      }

      toast.success("Stripe payment intent created successfully.");
    } catch (error) {
      toast.error("Failed to create payment intent. Please try again.");
    }
  },

  // Fetch all user coupons and include the cart items
  getMyCoupons: async () => {
    try {
      const { cart } = get(); // Get the current cart items
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty. Unable to fetch coupons.");
        return;
      }

      const productIds = cart.map(item => item.products_id); // Extract the product IDs from cart items
      const response = await axiosInstance.post(`/coupon`, { productIds });

      set({ userCoupons: response.data, isCouponApplied: false }); // Store the list of user coupons
    } catch (error) {
      console.error("Error fetching coupons:", error);
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

      const productIds = cart.map(item => item.products_id); // Extract the product IDs from cart items

      // Send the coupon id, product IDs, and orderId to validate the coupon
      const response = await axiosInstance.post("/coupon/apply", { couponId, productIds, orderId });

      // Update the state with the coupon data, and the updated cart and totals
      set({
        cart: response.data.order_items, // Update the cart with the new items (with the coupon applied)
        orderId: response.data.order_id, // Ensure the orderId is updated correctly
        isCouponApplied: true, // Mark coupon as applied
        coupon: response.data.coupon, // Set the applied coupon
        totalAmount: response.data.total_amount, // Set the total amount
        discountAmount: response.data.discount_amount, // Set the discount amount
        totalAfterDiscount: response.data.total_after_discount, // Set the total after discount
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
      cart: [], // Clear the cart
      orderId: null, // Reset the orderId
      isCouponApplied: false, // Reset coupon applied status
      coupon: null, // Reset coupon
      userCoupons: [], // Optionally clear user coupons
      totalAmount: 0, // Reset totalAmount
      discountAmount: 0, // Reset discountAmount
      totalAfterDiscount: 0, // Reset totalAfterDiscount
    });

    toast.success("Cart cleared successfully");
  },

  // Add a product to the cart
  addToCart: async (productId) => {
    try {
      const { orderId } = get(); // Get the current orderId
      const response = await axiosInstance.post("/cart", { productId, orderId }); // Send orderId with productId
      const { orderId: newOrderId, orderItems, totalAmount } = response.data;

      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
        totalAmount: totalAmount,
        totalAfterDiscount: totalAmount,
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
      const { orderId: newOrderId, orderItems, totalAmount } = response.data;

      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
        totalAmount: totalAmount,
        totalAfterDiscount: totalAmount,
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
      const { orderId: newOrderId, orderItems, totalAmount } = response.data;

      set({
        orderId: newOrderId, // Update the orderId if changed
        cart: orderItems, // Update the cart with the new items
        isOrderChanged: !get().isOrderChanged, // Toggle the `isOrderChanged` flag
        totalAmount: totalAmount,
        totalAfterDiscount:totalAmount
      });

      toast.success(isIncrement ? "Quantity increased" : "Quantity decreased");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update quantity. Please try again.");
    }
  },
}));
