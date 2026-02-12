import React, { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';

const ProfilePage = () => {
  const { 
    user, 
    loading, 
    userOrders, 
    userInvoices,
    userRoles,
    userPermissions
  } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [sortField, setSortField] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('asc');

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-emerald-400">
        Please log in to view your profile.
      </div>
    );
  }

  /* =========================
     SEARCH
  ========================== */

  const filteredOrders = userOrders?.filter(order => (
    order.id.toString().includes(searchQuery) ||
    order.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_date?.includes(searchQuery)
  )) || [];

  /* =========================
     SORT
  ========================== */

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = sortField === 'orderDate'
      ? new Date(a.order_date)
      : a[sortField];

    const bValue = sortField === 'orderDate'
      ? new Date(b.order_date)
      : b[sortField];

    return sortOrder === 'asc'
      ? aValue - bValue
      : bValue - aValue;
  });

  /* =========================
     PAGINATION
  ========================== */

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const displayedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-gray-900 text-emerald-400 p-6">
      <h2 className="text-4xl font-bold text-center mb-8">Profile</h2>

      <div className="space-y-8">

        {/* =========================
           USER INFO
        ========================== */}

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">User Information</h3>

          <div><span className="font-semibold">Name:</span> {user.first_name} {user.last_name}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">Phone:</span> {user.phone_number}</div>
          <div><span className="font-semibold">Language:</span> {user.language}</div>

          {/* =========================
             ROLES (FIXED)
          ========================== */}

          <div className="mt-6">
            <span className="font-semibold text-lg">Roles:</span>

            {userRoles?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {userRoles.map((role, index) => (
                  <span
                    key={index}
                    className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {role.role_name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 mt-2">No roles assigned</div>
            )}
          </div>

          {/* =========================
             PERMISSIONS
          ========================== */}

          <div className="mt-6">
            <span className="font-semibold text-lg">Permissions:</span>

            {userPermissions?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {userPermissions.map((permission, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 border border-emerald-500 px-3 py-1 rounded-full text-sm"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 mt-2">No permissions assigned</div>
            )}
          </div>
        </div>

        {/* =========================
           SEARCH
        ========================== */}

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Search Orders</h3>
          <input 
            type="text" 
            placeholder="Search by Order ID, Status, or Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-full bg-transparent border-2 border-emerald-400 text-emerald-400 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* =========================
           ORDERS
        ========================== */}

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4">Orders</h3>

          {displayedOrders.length > 0 ? (
            displayedOrders.map((order) => (
              <div key={order.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div><span className="font-semibold">Order ID:</span> {order.id}</div>
                <div><span className="font-semibold">Status:</span> {order.status}</div>
                <div><span className="font-semibold">Order Date:</span> {order.order_date}</div>
                <div><span className="font-semibold">Total Amount:</span> ${order.total_amount}</div>
                <div><span className="font-semibold">Tracking Number:</span> {order.tracking_number}</div>
              </div>
            ))
          ) : (
            <div>No orders found</div>
          )}
        </div>

        {/* =========================
           PAGINATION
        ========================== */}

        <div className="flex justify-between mt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-transparent border-2 border-white text-emerald-400 p-2 rounded-lg hover:bg-emerald-400 hover:text-gray-900 transition"
          >
            Previous
          </button>

          <span>Page {currentPage} of {totalPages || 1}</span>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-transparent border-2 border-white text-emerald-400 p-2 rounded-lg hover:bg-emerald-400 hover:text-gray-900 transition"
          >
            Next
          </button>
        </div>

        {/* =========================
           INVOICES
        ========================== */}

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Invoices</h3>

          {userInvoices?.length > 0 ? (
            userInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-gray-800 p-6 rounded-lg shadow-md mb-4">
                <div><span className="font-semibold">Invoice ID:</span> {invoice.id}</div>
                <div><span className="font-semibold">Total Amount:</span> ${invoice.total_amount}</div>
                <div><span className="font-semibold">Payment Status:</span> {invoice.payment_status}</div>
              </div>
            ))
          ) : (
            <div>No invoices found</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
