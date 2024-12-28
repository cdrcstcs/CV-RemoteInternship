import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
  const { userCoupons, isCouponApplied, applyCoupon, getMyCoupons } = useCartStore();
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Track the selected coupon

  useEffect(() => {
    getMyCoupons(); // Fetch the list of coupons when the component mounts
  }, [getMyCoupons]);

  const handleApplyCoupon = (couponId) => {
    if (couponId) {
      console.log(couponId);
      applyCoupon(couponId); // Apply the selected coupon
      setSelectedCoupon(userCoupons.find(coupon => coupon.id === couponId)); // Set the selected coupon
    }
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userCoupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              className={`cursor-pointer rounded-lg border p-4 text-center ${
                selectedCoupon?.id === coupon.id ? 'bg-emerald-600 border-emerald-500' : 'bg-gray-700 border-gray-600'
              }`}
              onClick={() => handleApplyCoupon(coupon.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h4 className="text-lg font-medium text-white">{coupon.code}</h4>
              <p className="mt-2 text-sm text-gray-400">{coupon.discount}% off</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optionally display the applied coupon if one is applied */}
      {isCouponApplied && selectedCoupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>
          <p className="mt-2 text-sm text-gray-400">
            {selectedCoupon.code} - {selectedCoupon.discount}% off
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
