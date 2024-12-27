import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51KZYccCoOZF2UhtOwdXQl3vcizup20zqKqT9hVUIsVzsdBrhqbUI2fE0ZdEVLdZfeHjeyFXtqaNsyCJCmZWnjNZa00PzMAjlcL"
);

const OrderSummary = () => {
  // Get the cart and orderId from the store
  const { cart, orderId } = useCartStore();

  // Calculate subtotal, savings, and total directly in the component
  const subtotal = cart.reduce((acc, item) => acc + item.total_amount, 0);
  console.log(subtotal);
  const couponDiscount = cart.reduce((acc, item) => acc + item.discount, 0); // Assuming each item might have a discount
  const total = subtotal - couponDiscount;

  const savings = subtotal - total;
  const formattedSubtotal = subtotal;
  const formattedTotal = total;
  const formattedSavings = savings;

  // Handle payment
  const handlePayment = async () => {
    try {

      // Initialize Stripe and proceed with the checkout
      const stripe = await stripePromise;
      const res = await axios.post("/payment/create-checkout-session", {
        products: cart,
      });

      const session = res.data;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  // Listen for cart changes and update the total amount on the server
  useEffect(() => {
    if (orderId && cart.length > 0) {
      const updateTotal = async () => {
        try {
          // Update the total amount on the backend
          await axios.put("/payment/update-total", { orderId, totalAmount: total });
        } catch (error) {
          console.error("Error updating order total:", error);
        }
      };

      // Update total when cart changes
      updateTotal();
    }
  }, [cart, total, orderId]); // Only re-run when cart or total changes

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        {/* Display Order Items */}
        <div className="space-y-2">
          {cart.map((item) => (
            <dl key={item.product_id} className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">{item.product.name}</dt>
              <dd className="text-base font-medium text-white">${item.total_amount}</dd>
            </dl>
          ))}

          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">Original price</dt>
            <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">-${formattedSavings}</dd>
            </dl>
          )}

          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">${formattedTotal}</dd>
          </dl>
        </div>

        {/* Proceed to Checkout */}
        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
