import React from 'react';
import { useUserStore } from '../stores/useUserStore';

const ProfilePage = () => {
  const { user, loading } = useUserStore();
  
  if (loading) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Profile</h2>
      {user ? (
        <div className="space-y-4 text-gray-300">
          <div>
            <span className="font-semibold">Name:</span> {user.first_name} {user.last_name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {user.phone_number}
          </div>
          <div>
            <span className="font-semibold">Language:</span> {user.language}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">Please log in to view your profile.</div>
      )}
    </div>
  );
};

export default ProfilePage;