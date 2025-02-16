import React from 'react';

const BankInfo = ({ account, appwriteItemId, type }) => {
  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('id', account?.appwriteItemId);
    window.history.pushState({}, '', '?' + urlParams.toString());
  };

  const getAccountTypeColors = (type) => {
    // You can replace this function with the actual logic for returning colors based on account type.
    const colors = {
      bg: 'bg-blue-200',
      lightBg: 'bg-blue-100',
      title: 'text-blue-800',
      subText: 'text-blue-600'
    };
    return colors;
  };

  const colors = getAccountTypeColors(account?.type);

  return (
    <div
      onClick={handleBankChange}
      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${colors.bg} 
        ${isActive && 'shadow-sm border-blue-700'} 
        ${type === 'card' ? 'rounded-xl hover:shadow-sm' : ''}
      `}
    >
      <figure className={`flex justify-center items-center h-10 w-10 rounded-full ${colors.lightBg}`}>
        <img
          src="/icons/connect-bank.svg"
          alt={account.subtype}
          width={20}
          height={20}
          className="m-2"
        />
      </figure>

      <div className="flex flex-col justify-center flex-1 gap-1">
        <div className="bank-info_content">
          <h2 className={`text-lg font-bold text-blue-900 ${colors.title}`}>
            {account.name}
          </h2>
          {type === 'full' && (
            <p
              className={`text-xs rounded-full px-3 py-1 font-medium text-blue-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p className={`text-lg font-medium ${colors.subText}`}>
          {new Intl.NumberFormat().format(account.currentBalance)} {/* Format balance */}
        </p>
      </div>
    </div>
  );
};

export default BankInfo;
