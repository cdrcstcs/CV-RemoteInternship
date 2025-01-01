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
    <div>
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm">Current Password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            value={passwordData.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            value={passwordData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            value={passwordData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg mt-4"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
