import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useInventoryStore = create((set, get) => ({
  isSubmitting: false,
  isError: false,
  stock: 0,
  weightPerUnit: 0,
  productDetails: {
    name: '',
    description: '',
    price: '',
    image: null,
    category: '',
    isFeatured: false
  },
  setProductDetails: (details) => set({ productDetails: { ...get().productDetails, ...details } }),
  setInventoryDetails: (details) => set({ ...details }),
  createInventory: async () => {
    set({ isSubmitting: true});
    const { productDetails, stock, weightPerUnit } = get();

    const formData = new FormData();
    // Add product details to FormData
    Object.keys(productDetails).forEach((key) => {
      formData.append(`product[${key}]`, productDetails[key]);
    });
    formData.append('inventory[stock]', stock);
    formData.append('inventory[weightPerUnit]', weightPerUnit);
    if (productDetails.image) {
      formData.append('product[image]', productDetails.image);
    }
    try {
      const response = await axiosInstance.post('/warehouse/create-inventory', formData);
      set({
        stock: 0,
        weightPerUnit: 0,
        productDetails: { ...productDetails, name: '', description: '', price: '', image: null, category: '', isFeatured: false },
      });
      toast.success('Product and inventory created successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating product and inventory.';
      toast.error(errorMessage);
    } finally {
      set({ isSubmitting: false });
    }
  },
  reset: () => set({
    productDetails: { name: '', description: '', price: '', image: null, category: '', isFeatured: false },
    stock: 0,
    weightPerUnit: 0,
  }),
}));

export default useInventoryStore;
