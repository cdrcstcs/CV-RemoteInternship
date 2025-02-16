import React from 'react';
import { transactionCategoryStyles } from '../../lib/constants';
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '../../lib/utils';
const CategoryBadge = ({ category }) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[category] || transactionCategoryStyles.default;

  return (
    <div className={`${borderColor} ${chipBackgroundColor} flex items-center gap-1 px-2 py-1 rounded-full`}>
      <div className={`${backgroundColor} w-2.5 h-2.5 rounded-full`} />
      <p className={`${textColor} text-xs font-medium`}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-full table-auto">
        <thead className="bg-[#f9fafb]">
          <tr>
            <th className="px-2 py-3 text-left">Transaction</th>
            <th className="px-2 py-3 text-left">Amount</th>
            <th className="px-2 py-3 text-left">Status</th>
            <th className="px-2 py-3 text-left">Date</th>
            <th className="px-2 py-3 text-left hidden sm:table-cell">Channel</th>
            <th className="px-2 py-3 text-left hidden sm:table-cell">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const status = getTransactionStatus(new Date(t.date));
            const amount = formatAmount(t.amount);
            const isDebit = t.type === 'debit';
            const isCredit = t.type === 'credit';

            return (
              <tr key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} border-b`}>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-sm font-semibold text-[#344054] truncate">
                      {removeSpecialCharacters(t.name)}
                    </h1>
                  </div>
                </td>

                <td className={`px-2 py-3 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'}`}>
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </td>

                <td className="px-2 py-3">
                  <CategoryBadge category={status} />
                </td>

                <td className="px-2 py-3">
                  {formatDateTime(new Date(t.date)).dateTime}
                </td>

                <td className="px-2 py-3 capitalize hidden sm:table-cell">
                  {t.paymentChannel}
                </td>

                <td className="px-2 py-3 hidden sm:table-cell">
                  <CategoryBadge category={t.category} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
