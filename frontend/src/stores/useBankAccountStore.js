import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';

// Zustand store to manage bank account state and related actions
export const useBankAccountStore = create((set) => ({
  banks: [],
  transactions: [],
  currentBank: null,
  loading: false,
  error: null,
  plaidLinkToken: null,
  dwollaCustomer: null,
  accounts: [],
  // Action to create a Plaid link token
  createPlaidLinkToken: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/create-link-token');
      set({ plaidLinkToken: response.data.link_token, loading: false });
      toast.success('Plaid link token created successfully!');
    } catch (error) {
      set({ error: 'Unable to create Plaid link token', loading: false });
      toast.error('Error creating Plaid link token');
    }
  },

  // Action to exchange the public token for an access token
  exchangePublicToken: async (publicToken) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/exchange-public-token', { public_token: publicToken });
      set({ loading: false });
      toast.success('Public token exchanged successfully!');
    } catch (error) {
      set({ error: 'Unable to exchange public token', loading: false });
      toast.error('Error exchanging public token');
    }
  },

  // Action to fetch all user's bank accounts
  fetchBanks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/get-banks');
      set({ banks: response.data, loading: false });
      toast.success('Banks fetched successfully!');
    } catch (error) {
      set({ error: 'Unable to fetch bank accounts', loading: false });
      toast.error('Error fetching bank accounts');
    }
  },

  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/get-accounts');
      set({ accounts: response.data, loading: false });
      toast.success('Bank accounts fetched successfully!');
    } catch (error) {
      set({ error: 'Unable to fetch bank accounts', loading: false });
      toast.error('Error fetching bank accounts');
    }
  },

  // Action to fetch transactions by bank ID
  fetchTransactions: async (bankId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/get-transactions-by-bank/${bankId}`);
      set({ transactions: response.data, loading: false });
      toast.success('Transactions fetched successfully!');
    } catch (error) {
      set({ error: 'Unable to fetch transactions', loading: false });
      toast.error('Error fetching transactions');
    }
  },

  // Action to select a bank account
  selectBank: (bank) => {
    set({ currentBank: bank });
  },

  // Action to create a transaction
  createTransaction: async (transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/create-transaction', transactionData);
      set((state) => ({
        transactions: [...state.transactions, response.data],
        loading: false,
      }));
      toast.success('Transaction created successfully!');
    } catch (error) {
      set({ error: 'Unable to create transaction', loading: false });
      toast.error('Error creating transaction');
    }
  },

  // Action to create a bank account
  createBankAccount: async (bankAccountData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/create-bank-account', bankAccountData);
      set((state) => ({
        banks: [...state.banks, response.data.bank],
        loading: false,
      }));
      toast.success('Bank account created successfully!');
    } catch (error) {
      set({ error: 'Unable to create bank account', loading: false });
      toast.error('Error creating bank account');
    }
  },

  // Action to fetch a bank account by its account ID
  fetchBankByAccountId: async (accountId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/get-bank-by-account/${accountId}`);
      set({ currentBank: response.data, loading: false });
      toast.success('Bank account fetched successfully!');
    } catch (error) {
      set({ error: 'Unable to fetch bank account by ID', loading: false });
      toast.error('Error fetching bank account by ID');
    }
  },

  // Action to create an on-demand authorization with Dwolla
  createOnDemandAuthorization: async (authorizationData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/create-on-demand-authorization', authorizationData);
      set({ loading: false });
      toast.success('On-demand authorization created successfully!');
    } catch (error) {
      set({ error: 'Unable to create on-demand authorization', loading: false });
      toast.error('Error creating on-demand authorization');
    }
  },

  // Action to create a transfer with Dwolla
  createTransfer: async (transferData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/create-transfer', transferData);
      set({ loading: false });
      toast.success('Transfer created successfully!');
    } catch (error) {
      set({ error: 'Unable to create transfer', loading: false });
      toast.error('Error creating transfer');
    }
  },

  // Action to add a Dwolla funding source
  addFundingSource: async (fundingSourceData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/add-funding-source', fundingSourceData);
      set({ loading: false });
      toast.success('Funding source added successfully!');
    } catch (error) {
      set({ error: 'Unable to add funding source', loading: false });
      toast.error('Error adding funding source');
    }
  },

  // Action to create a Dwolla customer
  createDwollaCustomer: async (customerData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/create-dwolla-customer', customerData);
      set({ dwollaCustomer: response.data, loading: false });
      toast.success('Dwolla customer created successfully!');
    } catch (error) {
      set({ error: 'Unable to create Dwolla customer', loading: false });
      toast.error('Error creating Dwolla customer');
    }
  },

  // Action to create a Dwolla funding source
  createDwollaFundingSource: async (fundingSourceData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/create-funding-source', fundingSourceData);
      set({ loading: false });
      toast.success('Dwolla funding source created successfully!');
    } catch (error) {
      set({ error: 'Unable to create Dwolla funding source', loading: false });
      toast.error('Error creating Dwolla funding source');
    }
  },

  // Action to get account information from Plaid and sort transactions
  getAccountInfo: async (appwriteItemId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/get-account/${appwriteItemId}`);
      set({ transactions: response.data.transactions, loading: false });
      toast.success('Account information fetched successfully!');
    } catch (error) {
      set({ error: 'Unable to get account information from Plaid', loading: false });
      toast.error('Error getting account information from Plaid');
    }
  },

  // Action to fetch institution information from Plaid
  fetchInstitutionInfo: async (institutionId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/get-institution/${institutionId}`);
      set({ loading: false });
      toast.success('Institution information fetched successfully!');
    } catch (error) {
      set({ error: 'Unable to fetch institution information', loading: false });
      toast.error('Error fetching institution information');
    }
  },

  // Action to fetch transactions from Plaid
  fetchTransactionsPlaid: async (accessToken) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/get-transactions/${accessToken}`);
      set({ transactions: response.data, loading: false });
      toast.success('Plaid transactions fetched successfully!');
    } catch (error) {
      set({ error: 'Unable to fetch transactions from Plaid', loading: false });
      toast.error('Error fetching transactions from Plaid');
    }
  },
}));
