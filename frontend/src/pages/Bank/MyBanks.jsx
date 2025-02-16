import BankCard from '../../components/Bank/BankCard';
import HeaderBox from '../../components/Bank/HeaderBox';
import { useBankAccountStore } from '../../stores/useBankAccountStore';
import { useUserStore } from '../../stores/useUserStore';
import PlaidLink from '../../components/Bank/PlaidLink';
import React, { useEffect } from 'react';

const MyBanks = () => {
  const { user } = useUserStore();
  const { accounts, fetchAccounts, loading } = useBankAccountStore();

  // Fetch banks when the component mounts
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <section className="flex flex-col p-6 space-y-6">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">Your Cards</h2>

          {/* Show a loading spinner if loading */}
          {loading ? (
            <div className="flex justify-center items-center h-40 text-xl text-gray-500">
              <span>Loading your bank accounts...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts && accounts.length > 0 ? (
                accounts.map((a) => (
                  <BankCard
                    key={a.id}
                    account={a}
                    userName={user?.first_name}
                  />
                ))
              ) : (
                <div className="text-center text-lg text-gray-500">No bank accounts found.</div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <PlaidLink user={user} variant="primary" />
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
