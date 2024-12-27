import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
  const { userCoupons, isCouponApplied, applyCoupon, removeCoupon, getMyCoupons, coupon } = useCartStore();
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Track the selected coupon

  useEffect(() => {
    getMyCoupons(); // Fetch the list of coupons when the component mounts
  }, [getMyCoupons]);

  const handleApplyCoupon = (couponId) => {
    if (couponId) {
      applyCoupon(couponId); // Apply the selected coupon
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon(); // Remove the applied coupon
    setSelectedCoupon(null); // Reset selected coupon
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-300">
          Select a Coupon:
        </label>

        <select
          id="voucher"
          className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
          value={selectedCoupon?.id || ""}
          onChange={(e) => setSelectedCoupon(userCoupons.find(coupon => coupon.id === e.target.value))}
        >
          <option value="" disabled>Select a coupon</option>
          {userCoupons.map((coupon) => (
            <option key={coupon.id} value={coupon.id}>
              {coupon.code} - {coupon.discount}% off
            </option>
          ))}
        </select>

        <motion.button
          type="button"
          className="w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleApplyCoupon(selectedCoupon?.id)}
        >
          Apply Code
        </motion.button>
      </div>

      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discount}% off
          </p>

          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
