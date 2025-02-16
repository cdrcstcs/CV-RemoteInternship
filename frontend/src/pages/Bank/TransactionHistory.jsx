import HeaderBox from '../../components/Bank/HeaderBox';
import Pagination from '../../components/Bank/Pagination';
import TransactionsTable from '../../components/Bank/TransactionsTable';
import { useBankAccountStore } from '../../stores/useBankAccountStore';
import { useUserStore } from '../../stores/useUserStore';
import { formatAmount } from '../../lib/utils';
import React, { useEffect, useState } from 'react';

const TransactionHistory = ({ searchParams: { id, page } }) => {
  const { user } = useUserStore();
  const { accounts, fetchAccounts, loading } = useBankAccountStore();

  const [accountData, setAccountData] = useState(null);
  const currentPage = Number(page) || 1;

  useEffect(() => {
    if (user) {
      fetchAccounts(); // Fetch user's accounts when logged in
    }
  }, [user]);

  useEffect(() => {
    if (accounts.length > 0) {
      const selectedAccount = id
        ? accounts.find((account) => account.appwriteItemId === id)
        : accounts[0]; // Select the account based on `id` or use the first account
      setAccountData(selectedAccount);
    }
  }, [id, accounts]);

  if (!accountData) return null;

  const accountTransactions = accountData.transactions || [];

  const rowsPerPage = 10;
  const totalPages = Math.ceil(accountTransactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = accountTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox 
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-white">{accountData?.data.name}</h2>
            <p className="text-sm text-blue-500">
              {accountData?.data.officialName}
            </p>
            <p className="text-sm font-semibold tracking-wider text-white">
              ●●●● ●●●● ●●●● {accountData?.data.mask}
            </p>
          </div>
          
          <div className='transactions-account-balance'>
            <p className="text-sm">Current balance</p>
            <p className="text-2xl text-center font-bold">{formatAmount(accountData?.data.currentBalance)}</p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable 
            transactions={currentTransactions}
          />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
