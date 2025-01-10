import React, { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';

const ChangePasswordPage = () => {
  const { changePassword } = useUserStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    changePassword(currentPassword, newPassword, confirmPassword);
  };

  return (
    <div className="w-full bg-transparent text-emerald-400 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            className="w-full p-4 bg-transparent text-emerald-400 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={passwordData.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            className="w-full p-4 bg-transparent text-emerald-400 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={passwordData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full p-4 bg-transparent text-emerald-400 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={passwordData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg mt-4 transition duration-200"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
