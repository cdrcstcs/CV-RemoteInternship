import React, { useState, useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';

const EditProfilePage = () => {
  const { user, updateProfile, loading } = useUserStore();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    language: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        language: user.language,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full bg-transparent text-emerald-400 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-300">
              {key.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
            </label>
            <input
              id={key}
              name={key}
              type={key === 'email' ? 'email' : 'text'}
              className="w-full p-4 bg-transparent text-emerald-400 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
