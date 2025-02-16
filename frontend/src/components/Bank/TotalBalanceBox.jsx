import React from 'react';
import AnimatedCounter from './AnimatedCounter'; // Assuming AnimatedCounter is a custom component
import DoughnutChart from './DoughnutChart'; // Assuming DoughnutChart is a custom component

const TotalBalanceBox = ({ accounts = [], totalBanks, totalCurrentBalance }) => {
  return (
    <section className="total-balance p-6 bg-white rounded-lg shadow-md flex flex-col gap-6">
      {/* Doughnut Chart Section */}
      <div className="total-balance-chart flex justify-center">
        <DoughnutChart accounts={accounts} />
      </div>

      {/* Bank Accounts and Total Current Balance Section */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Bank Accounts: {totalBanks}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Total Current Balance</p>

          <div className="total-balance-amount flex items-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
