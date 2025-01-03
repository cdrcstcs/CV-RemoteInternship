import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance instance
import { toast } from "react-hot-toast";

// Utility function to format date to 'yyyy-mm-dd'
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two digits
  const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits
  return `${year}-${month}-${day}`;
};

export const useLineChartStore = create((set, get) => ({
  data: [],
  loading: false,
  isError: false,
  errorMessage: "",
  totalShipmentAmount: 0,
  totalMaintenanceCost: 0,
  totalProductExpenses: 0,
  startDate: null,
  endDate: null,

  // Fetch line chart data
  fetchLineChartData: async (startDate = null, endDate = null) => {
    set({
      loading: true,
      isError: false,
      errorMessage: "",
      startDate,
      endDate,
    });

    try {
      const response = await axiosInstance.post("/warehouse/line-chart", { start_date: startDate, end_date: endDate });
      
      // Group the data by date (ensure dates are formatted as yyyy-mm-dd)
      const groupedData = response.data.reduce((acc, item) => {
        const date = formatDate(item.date); // Format date to 'yyyy-mm-dd'
        
        // Initialize the accumulator object for the date if it doesn't exist
        if (!acc[date]) {
          acc[date] = {
            date,
            total_shipment_amount: 0,
            total_maintenance_cost: 0,
            total_product_expenses: 0,
          };
        }

        // Accumulate the values for each date
        acc[date].total_shipment_amount += item.total_shipment_amount;
        acc[date].total_maintenance_cost += item.total_maintenance_cost;
        acc[date].total_product_expenses += item.total_product_expenses;

        return acc;
      }, {});

      // Convert the object back to an array and accumulate totals
      const accumulatedData = Object.values(groupedData).map((item, index, arr) => {
        const previousItem = arr[index - 1] || { 
          total_shipment_amount: 0, 
          total_maintenance_cost: 0, 
          total_product_expenses: 0 
        };

        return {
          ...item,
          total_shipment_amount: previousItem.total_shipment_amount + item.total_shipment_amount,
          total_maintenance_cost: previousItem.total_maintenance_cost + item.total_maintenance_cost,
          total_product_expenses: previousItem.total_product_expenses + item.total_product_expenses,
        };
      });

      set({
        data: accumulatedData,
        loading: false,
        totalShipmentAmount: accumulatedData[accumulatedData.length - 1]?.total_shipment_amount || 0,
        totalMaintenanceCost: accumulatedData[accumulatedData.length - 1]?.total_maintenance_cost || 0,
        totalProductExpenses: accumulatedData[accumulatedData.length - 1]?.total_product_expenses || 0,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch line chart data";
      set({ loading: false, isError: true, errorMessage });
      toast.error(errorMessage);
    }
  },

  // Reset the store to its initial state
  reset: () => set({
    data: [],
    loading: false,
    isError: false,
    errorMessage: "",
    totalShipmentAmount: 0,
    totalMaintenanceCost: 0,
    totalProductExpenses: 0,
    startDate: null,
    endDate: null,
  }),

}));

export default useLineChartStore;
