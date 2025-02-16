import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // For routing with react-router-dom
import PlaidLink from './PlaidLink'; // Assuming PlaidLink is a separate component
import { sidebarLinks } from '../../lib/constants';

const Sidebar = ({ user }) => {
  const { pathname } = useLocation();

  const cn = (base, conditionals) => {
    const classes = [base];
    for (const [key, value] of Object.entries(conditionals)) {
      if (value) {
        classes.push(key);
      }
    }
    return classes.join(' ');
  };

  return (
    <section className="sidebar w-64 bg-gray-800 text-white h-full p-6 flex flex-col">
      <nav className="flex flex-col gap-4">
        <Link to="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <img
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
            className="w-6 h-6 xl:w-14 xl:h-14"
          />
          <h1 className="sidebar-logo text-xl font-bold">Horizon</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              to={item.route}
              key={item.label}
              className={cn(
                'sidebar-link flex items-center gap-2 p-2 rounded-md transition-all',
                { 'bg-gradient-to-r from-blue-500 to-blue-700': isActive }
              )}
            >
              <div className="relative w-6 h-6">
                <img
                  src={item.imgURL}
                  alt={item.label}
                  className={cn('w-full h-full object-contain', { 'brightness-125 invert': isActive })}
                />
              </div>
              <p className={cn('sidebar-label text-lg', { 'text-white': isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })}

        <PlaidLink user={user} />
      </nav>

    </section>
  );
};

export default Sidebar;
