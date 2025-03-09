import React, { useEffect } from "react";
import useCouponStore from "../../stores/useCouponStore";

const CouponComponent = ({ couponData, isDataChanged }) => {
  const {
    createCoupon,
    getUserCoupons,
    userCoupons,
    isProcessingCoupon,
    isErrorCoupon,
    errorMessageCoupon,
    isSuccessCoupon,
    isProcessingGetCoupons,
    isErrorGetCoupons,
    errorMessageGetCoupons,
    isSuccessGetCoupons,
  } = useCouponStore();

  // Fetch user's coupons when the component mounts
  useEffect(() => {
    getUserCoupons();
  }, [getUserCoupons]);

  // Auto-create a new coupon whenever couponData changes and isDataChanged is true
  useEffect(() => {
    if (couponData && isDataChanged) {
      createCoupon(couponData);
    }
  }, [couponData, isDataChanged, createCoupon]); // Dependency on couponData and isDataChanged

  return (
    <div className="max-w-4xl mx-auto p-6 bg-transparent shadow-lg rounded-lg border-2 border-white h-96 overflow-y-auto w-96">
      <h1 className="text-2xl font-semibold text-center text-emerald-400 mb-6">My Coupons</h1>

      {isProcessingCoupon && (
        <div className="flex justify-center mb-6">
          <p className="text-lg text-emerald-400">Creating Coupon</p>
        </div>
      )}
      {/* Coupon Creation Success or Error Message */}
      {isSuccessCoupon && (
        <div className="flex justify-center mb-6">
          <p className="text-lg text-emerald-400">Coupon created successfully!</p>
        </div>
      )}
      {isErrorCoupon && (
        <div className="flex justify-center mb-6">
          <p className="text-lg text-red-500">Error: {errorMessageCoupon}</p>
        </div>
      )}

      {/* Fetching Coupons State */}
      {isProcessingGetCoupons ? (
        <div className="flex justify-center">
          <p className="text-lg text-emerald-400">Loading your coupons...</p>
        </div>
      ) : isErrorGetCoupons ? (
        <div className="flex justify-center">
          <p className="text-lg text-red-500">Error: {errorMessageGetCoupons}</p>
        </div>
      ) : isSuccessGetCoupons && userCoupons.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-lg text-emerald-400">You have no coupons yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {userCoupons.map((coupon) => (
            <li key={coupon.id} className="p-4 bg-gray-100 rounded-lg border border-gray-300 flex justify-between items-center">
              <span className="text-xl text-emerald-400">{coupon.discount}% Off</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CouponComponent;
