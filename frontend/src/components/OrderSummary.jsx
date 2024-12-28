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
  const { cart, orderId, totalAmount, discountAmount, totalAfterDiscount, isCouponApplied, coupon, applyCoupon } = useCartStore();

  // Calculate total, savings, and total directly in the component
  const formattedTotal = totalAmount.toFixed(2);
  const formattedDiscountAmount = discountAmount.toFixed(2);
  const formattedTotalAfterDiscount = totalAfterDiscount.toFixed(2);

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
    // Ensure coupon is only applied once, and only when the cart has items
    if (orderId && cart.length > 0 && !isCouponApplied && coupon) {
      applyCoupon(coupon.id);  // Apply coupon if not already applied
    }
  }, [cart, totalAmount, orderId, isCouponApplied, coupon, applyCoupon]); // Only re-run when necessary

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
            <dl key={item.product.id} className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">{item.product.name}</dt>
              <dd className="text-base font-medium text-white">${item.total_amount.toFixed(2)}</dd>
            </dl>
          ))}

		<dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
		<dt className="text-base font-bold text-white">Total</dt>
		<dd className="text-base font-bold text-emerald-400">${formattedTotal}</dd>
		</dl>
          {/* Conditionally display Discount Amount and Total After Discount if Coupon is Applied */}
          {isCouponApplied && (
            <>
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-300">Discount Applied</dt>
                <dd className="text-base font-medium text-emerald-400">-${formattedDiscountAmount}</dd>
              </dl>

            </>
          )}

          {/* Display the final total */}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total After Discount</dt>
            <dd className="text-base font-bold text-emerald-400">${formattedTotalAfterDiscount}</dd>
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
