import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance
import { toast } from "react-hot-toast";

export const useCouponStore = create((set, get) => ({
  // State for creating a coupon
  couponData: null, // Store the created coupon data
  isProcessingCoupon: false, // Flag to track if the coupon is being created
  isErrorCoupon: false, // Flag to track if there's an error during coupon creation
  errorMessageCoupon: "", // Error message if any
  isSuccessCoupon: false, // Flag to track if the coupon was created successfully

  // State for fetching user coupons
  userCoupons: [], // Store the user's coupons
  isProcessingGetCoupons: false, // Flag to track if fetching coupons is in progress
  isErrorGetCoupons: false, // Flag to track if there's an error while fetching coupons
  errorMessageGetCoupons: "", // Error message if any
  isSuccessGetCoupons: false, // Flag to track if the coupons were fetched successfully

  // Function to create a coupon and assign it to the authenticated user and products
  createCoupon: async (couponData) => {
    const { isProcessingCoupon, userCoupons } = get();

    // Prevent creating coupon if one is already being processed
    if (isProcessingCoupon) return;

    set({
      isProcessingCoupon: true,
      isErrorCoupon: false,
      errorMessageCoupon: "",
      isSuccessCoupon: false,
    });

    try {
      // Send the coupon data to the backend to create it
      const response = await axiosInstance.post("/create-coupon", couponData); // Replace with your backend URL

      set({
        couponData: response.data, // Store the created coupon data
        isProcessingCoupon: false,
        isSuccessCoupon: true,
        userCoupons: [...userCoupons, response.data], // Correctly add the new coupon to the list
      });

      toast.success("Coupon created successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating coupon";
      set({
        isProcessingCoupon: false,
        isErrorCoupon: true,
        errorMessageCoupon: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  // Function to fetch the coupons of the authenticated user
  getUserCoupons: async () => {
    const { isProcessingGetCoupons } = get();

    // Prevent fetching if already in progress
    if (isProcessingGetCoupons) return;

    set({
      isProcessingGetCoupons: true,
      isErrorGetCoupons: false,
      errorMessageGetCoupons: "",
      isSuccessGetCoupons: false,
    });

    try {
      // Send request to fetch user's coupons from the backend
      const response = await axiosInstance.get("/get-my-coupons"); // Replace with your backend URL

      set({
        userCoupons: response.data, // Store the fetched coupons
        isProcessingGetCoupons: false,
        isSuccessGetCoupons: true,
      });

      toast.success("Coupons fetched successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching coupons";
      set({
        isProcessingGetCoupons: false,
        isErrorGetCoupons: true,
        errorMessageGetCoupons: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  // Function to reset the state
  reset: () => set({
    couponData: null,
    isProcessingCoupon: false,
    isErrorCoupon: false,
    errorMessageCoupon: "",
    isSuccessCoupon: false,

    userCoupons: [],
    isProcessingGetCoupons: false,
    isErrorGetCoupons: false,
    errorMessageGetCoupons: "",
    isSuccessGetCoupons: false,
  }),
}));

export default useCouponStore;
