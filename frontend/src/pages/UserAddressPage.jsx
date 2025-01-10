import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";

const UserAddressesPage = () => {
  const { userAddresses, getUserAddresses, storeUserAddress, updateUserAddress } = useUserStore(state => state);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_primary: false,
  });

  useEffect(() => {
    // Fetch addresses when the component mounts
    getUserAddresses();
  }, [getUserAddresses]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle the form submission for creating a new address
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      await storeUserAddress(addressForm);
    } else {
      await updateUserAddress(selectedAddress.id, addressForm);
    }
    setAddressForm({
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_primary: false,
    });
    setSelectedAddress(null);
    setIsAdding(true);
  };

  // Handle selecting an address for editing
  const handleEdit = (address) => {
    setSelectedAddress(address);
    setAddressForm({
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_primary: address.is_primary,
    });
    setIsAdding(false);
  };

  return (
    <div className="mx-auto p-4 h-full bg-transparent text-emerald-400">
      <h2 className="text-3xl font-semibold mb-6">Your Addresses</h2>
      
      <div className="mb-6">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-transparent border-2 border-white text-emerald-400 px-4 py-2 rounded-md hover:bg-gray-800 hover:text-emerald-400"
        >
          Add New Address
        </button>
      </div>

      {/* Address Form */}
      <div className="bg-transparent border-2 border-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{isAdding ? "Add Address" : "Edit Address"}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                id="address_line1"
                name="address_line1"
                value={addressForm.address_line1}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                id="address_line2"
                name="address_line2"
                value={addressForm.address_line2}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={addressForm.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={addressForm.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={addressForm.postal_code}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={addressForm.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border-2 border-white bg-transparent text-emerald-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="is_primary" className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="is_primary"
                  name="is_primary"
                  checked={addressForm.is_primary}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Set as primary address</span>
              </label>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="bg-transparent border-2 border-white text-emerald-400 px-6 py-2 rounded-md hover:bg-gray-800 hover:text-emerald-400"
              >
                {isAdding ? "Add Address" : "Update Address"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Address List */}
      <div className="mt-8 h-full">
        <h3 className="text-xl font-semibold mb-4">Your Saved Addresses</h3>
        <ul className="space-y-4">
          {userAddresses.map((address) => (
            <li key={address.id} className="bg-transparent border-2 border-white p-4 rounded-lg shadow-md">
              <div>
                <p>{address.address_line1}, {address.address_line2 && `${address.address_line2},`}</p>
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
                <p>{address.is_primary ? "Primary Address" : "Secondary Address"}</p>
              </div>
              <button
                onClick={() => handleEdit(address)}
                className="mt-2 text-emerald-400 border-2 border-white p-2 rounded-lg hover:underline"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserAddressesPage;
