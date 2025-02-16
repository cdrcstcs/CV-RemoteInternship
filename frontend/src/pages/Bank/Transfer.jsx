import HeaderBox from '../../components/Bank/HeaderBox';
import PaymentTransferForm from '../../components/Bank/PaymentTransferForm';
import { useBankAccountStore } from '../../stores/useBankAccountStore';
import { useUserStore } from '../../stores/useUserStore';
import React, { useEffect } from 'react';

const Transfer = () => {
  const { user } = useUserStore(); // Access user from the user store
  const { accounts, fetchAccounts } = useBankAccountStore(); // Access accounts and fetchAccounts action from the bank account store

  useEffect(() => {
    if (user) {
      fetchAccounts(); // Fetch accounts when user is logged in
    }
  }, [user, fetchAccounts]);

  if (!accounts || accounts.length === 0) return null; // Return nothing if no accounts are available

  return (
    <section className="payment-transfer px-6 py-8">
      <HeaderBox 
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <section className="pt-5">
        <PaymentTransferForm accounts={accounts} /> {/* Pass accounts to PaymentTransferForm */}
      </section>
    </section>
  );
};

export default Transfer;
