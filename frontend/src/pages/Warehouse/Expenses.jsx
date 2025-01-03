import { useEffect, useMemo } from "react";
import { useExpensesStore } from "../../stores/useExpensesStore";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const Expenses = () => {
  // Get states and actions from the store
  const {
    expenses,
    isLoading,
    isError,
    fetchExpenses,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useExpensesStore();

  // Fetch expenses whenever the startDate or endDate changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchExpenses(); // Fetch expenses whenever the filters are set
    }
  }, [startDate, endDate, fetchExpenses]);

  const aggregatedData = useMemo(() => {
    // The expenses are now in the correct format, an array with name and amount
    return expenses.map((item) => ({
      name: item.name,
      amount: item.amount,
    }));
  }, [expenses]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* You can customize this loader with Tailwind or use an external loader */}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-4">
        <p>Error fetching data</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 p-8 rounded-2xl shadow-lg">
      {/* Filters for date range */}
      <div className="mb-6 space-y-4 bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white">Filter Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-white">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-white">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="my-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Expense Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={aggregatedData}
              cx="50%"
              cy="50%"
              label
              outerRadius={150}
              fill="#8884d8"
              dataKey="amount"
            >
              {aggregatedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Expenses;
