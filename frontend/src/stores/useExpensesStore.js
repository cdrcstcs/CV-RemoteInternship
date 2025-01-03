import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

export const useExpensesStore = create((set, get) => ({
  expenses: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  startDate: "",
  endDate: "",
  
  fetchExpenses: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });

    const { startDate, endDate } = get();
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    try {
      const response = await axiosInstance.post("/expense", {
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

  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  resetFilters: () => set({ startDate: "", endDate: "", expenses: [] }),
}));
