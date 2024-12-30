import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";
export const useExpensesStore = create((set) => ({
  expenses: [],
  loading: false,
  error: null,
  selectedCategory: "All",
  startDate: "",
  endDate: "",
    
  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const { selectedCategory, startDate, endDate } = get();
      const response = await axiosInstance.get("/expenses", {
        category: selectedCategory === "All" ? undefined : selectedCategory,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      set({ expenses: response.data, loading: false });
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || "An error occurred while fetching expenses" });
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    }
  },
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  resetFilters: () => set({ selectedCategory: "All", startDate: "", endDate: "", expenses: [] }),
}));
