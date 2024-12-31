import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";
export const useExpensesStore = create((set, get) => ({
  expenses: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  selectedCategory: "All",
  startDate: "",
  endDate: "",
  
  fetchExpenses: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    const { selectedCategory, startDate, endDate } = get();
    console.log("Selected Category:", selectedCategory);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    try {
      const response = await axiosInstance.post("/expense", {
        category: selectedCategory === "All" ? undefined : selectedCategory,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });

      // Convert the response data (which is an object) into an array
      const expensesArray = Object.values(response.data).map(item => ({
        name: item.name,
        amount: item.amount,
      }));

      set({ expenses: expensesArray, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch expenses";
      set({ isLoading: false, isError: true, errorMessage });
      toast.error(errorMessage);
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  resetFilters: () => set({ selectedCategory: "All", startDate: "", endDate: "", expenses: [] }),
}));
