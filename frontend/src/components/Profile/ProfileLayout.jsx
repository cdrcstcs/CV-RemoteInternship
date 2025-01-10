import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const ProfileLayout = () => {
  const [isAddressPage, setIsAddressPage] = useState(false);
  const location = useLocation();  // Use the useLocation hook to track the URL

  // Update isAddressPage whenever the location changes
  useEffect(() => {
    if (location.pathname.includes("address")||(!location.pathname.includes("edit")&&!location.pathname.includes("change"))) {
      setIsAddressPage(true);
    } else {
      setIsAddressPage(false);
    }
  }, [location]); // Dependency on location will trigger the effect on route change

  return (
    <div className={`flex ${isAddressPage ? 'h-full' : 'h-screen'} bg-gray-900`}>
      <div className="w-64 text-white p-6 shadow-lg border-r-2 border-emerald-500">
        <h2 className="text-3xl font-bold mb-8 text-center text-emerald-400">User Profile</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to=""
              className="block text-lg hover:bg-emerald-600 hover:rounded-lg p-2 transition duration-200"
            >
              View Profile
            </Link>
          </li>
          <li>
            <Link
              to="edit"
              className="block text-lg hover:bg-emerald-600 hover:rounded-lg p-2 transition duration-200"
            >
              Edit Profile
            </Link>
          </li>
          <li>
            <Link
              to="change-password"
              className="block text-lg hover:bg-emerald-600 hover:rounded-lg p-2 transition duration-200"
            >
              Change Password
            </Link>
          </li>
          <li>
            <Link
              to="address"
              className="block text-lg hover:bg-emerald-600 hover:rounded-lg p-2 transition duration-200"
            >
              Address
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
