import React from 'react';
import Copy from './Copy'; // Assuming this is another custom component

const BankCard = ({ account, userName, showBalance = true }) => {

  return (
    <div className="flex flex-col">
      <a href={`/transaction-history/?id=${account.appwriteItemId}`} className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
        <div className="text-white">
          <div>
            <h1 className="text-lg font-semibold">
              {account.name}
            </h1>
            <p className="font-serif font-black text-lg">
              {formatAmount(account.currentBalance)}
            </p>
          </div>

          <article className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between">
              <h1 className="text-sm font-semibold">
                {userName}
              </h1>
              <h2 className="text-sm font-semibold">
                ●● / ●●
              </h2>
            </div>
            <p className="text-base font-semibold tracking-[1.1px]">
              ●●●● ●●●● ●●●● <span className="text-lg">{account?.mask}</span>
            </p>
          </article>
        </div>

        <div className="flex items-center justify-start mt-4">
          <img 
            src="/icons/Paypass.svg"
            width={20}
            height={24}
            alt="pay"
            className="mr-3"
          />
          <img 
            src="/icons/mastercard.svg"
            width={45}
            height={32}
            alt="mastercard"
            className="ml-3"
          />
        </div>

        <img 
          src="/icons/lines.png"
          width={316}
          height={190}
          alt="lines"
          className="absolute top-0 left-0 object-cover w-full h-full"
        />
      </a>

      {showBalance && <Copy title={account?.sharaebleId} />}
    </div>
  );
}

export default BankCard;
