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
    selectedCategory,
    setSelectedCategory,
    setStartDate,
    setEndDate,
  } = useExpensesStore();

  useEffect(() => {
    fetchExpenses(); // Fetch expenses whenever any filter changes
  }, [selectedCategory, setStartDate, setEndDate, fetchExpenses]);

  const aggregatedData = useMemo(() => {
    return expenses.map((item) => ({
      name: item.name,
      amount: item.amount,
      categories: item.categories.join(", "),
    }));
  }, [expenses]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      {/* Filters for category and date range */}
      <div className="filters">
        <label>
          Category
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All">All</option>
            <option value="Office">Office</option>
            <option value="Professional">Professional</option>
            <option value="Salaries">Salaries</option>
          </select>
        </label>

        <label>
          Start Date
          <input
            type="date"
            value={setStartDate}
            onChange={handleStartDateChange}
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={setEndDate}
            onChange={handleEndDateChange}
          />
        </label>
      </div>

      {/* Pie Chart */}
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Expenses;
