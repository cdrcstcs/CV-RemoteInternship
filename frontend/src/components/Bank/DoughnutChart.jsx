import React from "react";

const DoughnutChart = ({ accounts }) => {
  const accountNames = accounts.map((a) => a.name);
  const balances = accounts.map((a) => a.currentBalance);

  // Calculate total balance and the percentage for each account
  const totalBalance = balances.reduce((total, balance) => total + balance, 0);
  const percentages = balances.map((balance) => (balance / totalBalance) * 100);

  const colors = ['#0747b6', '#2265d8', '#2f91fa']; // Add more colors as needed

  return (
    <div className="relative flex justify-center items-center">
      <div className="relative w-48 h-48">
        <svg
          className="absolute top-0 left-0"
          width="100%"
          height="100%"
          viewBox="0 0 36 36"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {percentages.map((percent, index) => {
            const strokeDasharray = `${(percent / 100) * 100} 100`;
            const color = colors[index % colors.length];
            const offset = percentages.slice(0, index).reduce((sum, val) => sum + val, 0);

            return (
              <circle
                key={index}
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={offset}
                className="transition-all"
              />
            );
          })}
        </svg>

        {/* Inner Circle */}
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-full flex justify-center items-center text-center">
          <div>
            <p className="text-lg font-semibold">Total Balance</p>
            <p className="text-xl font-bold">{totalBalance}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-4 text-center">
        {accountNames.map((name, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-4 h-4"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></span>
            <p className="text-sm">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
