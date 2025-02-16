import React from 'react';
import { Link } from 'react-router-dom';
import BankCard from './BankCard';
import Category from './Category';
import { countTransactionCategories } from '../../lib/utils';
const RightSidebar = ({ user, transactions, banks }) => {
  const categories = countTransactionCategories(transactions);

  return (
    <aside className="right-sidebar p-6">
      <section className="flex flex-col pb-8">
        <div className="profile-banner mb-4 bg-gray-200 h-40 w-full" />
        <div className="profile flex items-center space-x-4">
          <div className="profile-img flex items-center justify-center bg-blue-500 rounded-full w-16 h-16">
            <span className="text-5xl font-bold text-white">
              {user.first_name[0]}
            </span>
          </div>

          <div className="profile-details">
            <h1 className="profile-name text-xl font-semibold">
              {user.first_name} {user.last_name}
            </h1>
            <p className="profile-email text-gray-600">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-2xl font-semibold">My Banks</h2>
          <Link to="/" className="flex gap-2 items-center text-gray-600">
            <img
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
              className="w-5 h-5"
            />
            <h2 className="text-14 font-semibold">Add Bank</h2>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5 mt-4">
            <div className="relative z-10">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.first_name} ${user.last_name}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.first_name} ${user.last_name}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="text-2xl font-semibold">Top categories</h2>

          <div className="space-y-5 mt-4">
            {categories.map((category) => (
              <Category key={category.name} category={category} />
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;
