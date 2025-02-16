import React, { useState } from "react";
import Image from "react-image"; // Use an image library or native <img> tag if you prefer.
import { useHistory } from "react-router-dom"; // React Router for navigation

const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles = "",
}) => {
  const history = useHistory();
  const [selected, setSelected] = useState(accounts[0]);

  const handleBankChange = (id) => {
    const account = accounts.find((account) => account.appwriteItemId === id);

    setSelected(account);
    const newUrl = new URLSearchParams({
      ...Object.fromEntries(new URLSearchParams(window.location.search)),
      id: id,
    }).toString();

    history.push(`?${newUrl}`);

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center w-full bg-white gap-3 p-2 rounded-md border ${otherStyles}`}
      >
        <Image
          src="/icons/credit-card.svg"
          width={20}
          height={20}
          alt="account"
          className="object-contain"
        />
        <p className="line-clamp-1 w-full text-left">{selected.name}</p>
        <button className="absolute right-0 p-2 text-gray-600">
          ▼
        </button>
      </div>

      <div className="absolute z-10 bg-white shadow-lg w-full mt-2 rounded-md border">
        <div className="py-2 px-3 font-normal text-gray-500">
          Select a bank to display
        </div>
        <div className="max-h-60 overflow-y-auto">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="cursor-pointer border-t py-2 px-3 hover:bg-gray-100"
              onClick={() => handleBankChange(account.appwriteItemId)}
            >
              <div className="flex flex-col">
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-xs font-medium text-blue-600">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankDropdown;
