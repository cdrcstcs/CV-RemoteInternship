import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	currentProduct: null, // Add a state for the current product
	inventories: [],
	setProducts: (products) => set({ products }),

	fetchProductById: async (id) => {
		set({ loading: true });
		try {
		  const response = await axiosInstance.get(`/products/single/${id}`);
		  set({ currentProduct: response.data, loading: false });
		} catch (error) {
		  set({ loading: false });
		  toast.error(error.response?.data?.error || "Failed to fetch product details");
		}
	  },
	
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axiosInstance.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axiosInstance.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	getInventoriesForWarehouse: async () => {
		set({ loading: true });
		try {
			const response = await axiosInstance.get("/warehouse/inventories");
			set({ inventories: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	updateInventoriesForWarehouse: async (inventoryUpdates) => {
		set({ loading: true });
		try {
			const response = await axiosInstance.put("/warehouse/inventories", {
				inventory_updates: inventoryUpdates,
			});
	
			// Update the inventories by replacing the updated ones
			set((state) => {
				const updatedInventories = [...state.inventories];
	
				// Loop through the updated inventories from the server response
				response.data.updated_inventories.forEach((updatedInventory) => {
					// Find the index of the inventory that matches the updated inventory ID
					const index = updatedInventories.findIndex(
						(inventory) => inventory.id === updatedInventory.id
					);
	
					// If a match is found, replace the inventory with the updated one
					if (index !== -1) {
						updatedInventories[index] = updatedInventory;
					}
				});
	
				// Return updated state with the updated inventories
				return {
					inventories: updatedInventories,
					loading: false,
				};
			});
	
			toast.success("Inventory updated successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update inventories");
		}
	},
	
	  
	fetchProductsByCategory: async (categories) => {
		set({ loading: true });
		try {
			const response = await axiosInstance.post("/products/categories",{
				categories: categories,
			});
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axiosInstance.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axiosInstance.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axiosInstance.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));
