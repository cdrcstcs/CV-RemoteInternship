import React, { useState } from "react";
import { Link } from "react-router-dom";
import BankTabItem from './BankTabItem';
import BankInfo from './BankInfo';
import TransactionsTable from './TransactionsTable';
import Pagination from './Pagination';

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  );

  return (
    <section className="recent-transactions p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Recent transactions</h2>
        <Link
          to={`/transaction-history/?id=${appwriteItemId}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all
        </Link>
      </header>

      <div className="w-full">
        <div className="tabs flex border-b-2">
          {accounts.map((account) => (
            <button
              key={account.id}
              className={`tab-trigger px-4 py-2 text-lg font-medium ${
                account.appwriteItemId === appwriteItemId
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              <BankTabItem account={account} appwriteItemId={appwriteItemId} />
            </button>
          ))}
        </div>

        {accounts.map((account) => (
          <div
            key={account.id}
            className={`tab-content space-y-4 p-4 ${
              account.appwriteItemId === appwriteItemId ? "block" : "hidden"
            }`}
          >
            <BankInfo account={account} appwriteItemId={appwriteItemId} type="full" />

            <TransactionsTable transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentTransactions;
