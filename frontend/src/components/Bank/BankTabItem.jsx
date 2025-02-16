import React from 'react';

const BankTabItem = ({ account, appwriteItemId }) => {
  const [searchParams, setSearchParams] = React.useState(new URLSearchParams(window.location.search));
  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    searchParams.set('id', account?.appwriteItemId);
    window.history.pushState({}, '', '?' + searchParams.toString());
  };

  return (
    <div
      onClick={handleBankChange}
      className={`cursor-pointer p-4 ${isActive ? 'border-blue-600' : ''}`}
    >
      <p
        className={`text-lg font-medium text-gray-500 ${isActive ? 'text-blue-600' : ''}`}
      >
        {account.name}
      </p>
    </div>
  );
};

export default BankTabItem;
