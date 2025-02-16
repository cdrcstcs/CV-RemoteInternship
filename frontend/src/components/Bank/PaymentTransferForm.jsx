import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useBankAccountStore } from "../../stores/useBankAccountStore";
import { decryptId } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = () => {
  const { accounts, loading: accountsLoading, fetchAccounts, createTransfer, createTransaction, getBank, getBankByAccountId } = useBankAccountStore();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  // Fetch accounts if they are not already loaded
  if (!accounts.length && !accountsLoading) {
    fetchAccounts();
  }

  const submit = async (data) => {
    setIsLoading(true);

    try {
      // Decrypt the receiver's account ID
      const receiverAccountId = decryptId(data.sharableId);
      // Get the receiver bank details by accountId
      const receiverBank = await getBankByAccountId({ accountId: receiverAccountId });
      // Get the sender bank details by documentId
      const senderBank = await getBank({ documentId: data.senderBank });

      // Transfer params for creating a transfer
      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };

      // Create the transfer
      const transfer = await createTransfer(transferParams);

      if (transfer) {
        // Create the transaction record
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        // Create the transaction in the system
        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          // Reset form values after successful transaction
          setValue("name", "");
          setValue("email", "");
          setValue("amount", "");
          setValue("senderBank", "");
          setValue("sharableId", "");

          // Redirect or show a success message here
          // router.push("/"); // If you're using React Router or Next.js
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-6">
      {/* Sender Bank Selection */}
      <div className="border-t border-gray-200 pt-5 pb-6">
        <label className="text-sm font-medium text-gray-700">Select Source Bank</label>
        <p className="text-xs text-gray-600">Select the bank account you want to transfer funds from</p>
        <select
          {...register("senderBank")}
          className="mt-2 p-2 border rounded-md w-full"
        >
          <option value="">Select Bank</option>
          {accounts?.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {errors.senderBank && <p className="text-xs text-red-500">{errors.senderBank.message}</p>}
      </div>

      {/* Transfer Note */}
      <div className="border-t border-gray-200 pt-5 pb-6">
        <label className="text-sm font-medium text-gray-700">Transfer Note (Optional)</label>
        <p className="text-xs text-gray-600">Please provide any additional information or instructions related to the transfer</p>
        <textarea
          {...register("name")}
          className="mt-2 p-2 border rounded-md w-full"
          placeholder="Write a short note here"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Bank account details</h2>
        <p className="text-sm text-gray-600">Enter the bank account details of the recipient</p>
      </div>

      {/* Recipient Email */}
      <div className="border-t border-gray-200 pt-5 pb-6">
        <label className="text-sm font-medium text-gray-700">Recipient's Email Address</label>
        <input
          {...register("email")}
          className="mt-2 p-2 border rounded-md w-full"
          placeholder="ex: johndoe@gmail.com"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Sharable ID */}
      <div className="border-t border-gray-200 pt-5 pb-6">
        <label className="text-sm font-medium text-gray-700">Receiver's Plaid Sharable Id</label>
        <input
          {...register("sharableId")}
          className="mt-2 p-2 border rounded-md w-full"
          placeholder="Enter the public account number"
        />
        {errors.sharableId && <p className="text-xs text-red-500">{errors.sharableId.message}</p>}
      </div>

      {/* Amount */}
      <div className="border-t border-gray-200 pt-5 pb-6">
        <label className="text-sm font-medium text-gray-700">Amount</label>
        <input
          {...register("amount")}
          className="mt-2 p-2 border rounded-md w-full"
          placeholder="ex: 5.00"
        />
        {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
            </>
          ) : (
            "Transfer Funds"
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentTransferForm;
