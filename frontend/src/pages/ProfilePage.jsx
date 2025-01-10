import React, { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';

const ProfilePage = () => {
  const { user, loading, userOrders, userInvoices } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Number of items per page
  const [sortField, setSortField] = useState('orderDate'); // Default sort field
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;

  // Search function
  const filteredOrders = userOrders.filter(order => (
    order.id.toString().includes(searchQuery) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_date.includes(searchQuery)
  ));

  // Sort function
  const sortedOrders = filteredOrders.sort((a, b) => {
    const aValue = sortField === 'orderDate' ? new Date(a.order_date) : a[sortField];
    const bValue = sortField === 'orderDate' ? new Date(b.order_date) : b[sortField];
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const displayedOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full bg-gray-900 text-emerald-400 p-6">
      <h2 className="text-4xl font-bold text-center mb-8">Profile</h2>

      {user ? (
        <div className="space-y-8">
          {/* User Info */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">User Information</h3>
            <div><span className="font-semibold">Name:</span> {user.first_name} {user.last_name}</div>
            <div><span className="font-semibold">Email:</span> {user.email}</div>
            <div><span className="font-semibold">Phone:</span> {user.phone_number}</div>
            <div><span className="font-semibold">Language:</span> {user.language}</div>
          </div>

          {/* Search Orders */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Search Orders</h3>
            <input 
              type="text" 
              placeholder="Search by Order ID, Status, or Tracking Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full bg-transparent border-2 border-emerald-400 text-emerald-400 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sort Orders */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex space-x-4">
              <select 
                onChange={(e) => setSortField(e.target.value)} 
                className="p-2 border-2 border-emerald-400 rounded-lg bg-transparent text-emerald-400"
              >
                <option value="orderDate">Sort by Order Date</option>
                <option value="total_amount">Sort by Total Amount</option>
              </select>
              <select 
                onChange={(e) => setSortOrder(e.target.value)} 
                className="p-2 border-2 border-emerald-400 rounded-lg bg-transparent text-emerald-400"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* User Orders */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Orders</h3>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
                  <div><span className="font-semibold">Order ID:</span> {order.id}</div>
                  <div><span className="font-semibold">Status:</span> {order.status}</div>
                  <div><span className="font-semibold">Order Date:</span> {order.order_date}</div>
                  <div><span className="font-semibold">Total Amount:</span> ${order.total_amount}</div>
                  <div><span className="font-semibold">Tracking Number:</span> {order.tracking_number}</div>

                  {/* Payment Details */}
                  {order.payment ? (
                    <div className="mt-4 bg-gray-700 p-4 rounded-md">
                      <h4 className="font-semibold">Payment Details</h4>
                      <div><span className="font-semibold">Payment ID:</span> {order.payment.payment_id}</div>
                      <div><span className="font-semibold">Amount Paid:</span> ${order.payment.paid_amount}</div>
                      <div><span className="font-semibold">Payment Status:</span> {order.payment.payment_status}</div>
                      <div><span className="font-semibold">Payment Method:</span> {order.payment.payment_method}</div>
                      <div><span className="font-semibold">Gateway:</span> {order.payment.gateway}</div>
                      <div><span className="font-semibold">Currency:</span> {order.payment.currency}</div>
                      <div><span className="font-semibold">Payment Date:</span> {order.payment.payment_date}</div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No payment information available for this order</div>
                  )}

                  {/* Order Items */}
                  <div className="mt-4">
                    <h5 className="font-semibold">Order Items:</h5>
                    <div className="space-y-2 mt-2">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item, idx) => (
                          <div key={idx} className="flex flex-wrap space-x-6 bg-gray-700 p-4 rounded-md">
                            <div className="w-1/4"><span className="font-semibold">Product:</span> {item.product.product_name}</div>
                            <div className="w-1/4"><span className="font-semibold">Description:</span> {item.product.description}</div>
                            <div className="w-1/4"><span className="font-semibold">Quantity:</span> {item.quantity}</div>
                            <div className="w-1/4"><span className="font-semibold">Total:</span> ${item.total_amount}</div>
                            <div className="w-1/4"><span className="font-semibold">Price:</span> ${item.product.price}</div>
                            <div className="w-1/4"><span className="font-semibold">Featured:</span> {item.product.isFeatured ? "Yes" : "No"}</div>
                            <div className="w-1/4">
                              {item.product.image && <img src={item.product.image} alt={item.product.product_name} className="w-32 h-32 object-cover rounded-md" />}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No items in this order</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No orders found</div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="bg-transparent border-2 border-white text-emerald-400 p-2 rounded-lg hover:bg-emerald-400 hover:text-gray-900 transition"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="bg-transparent border-2 border-white text-emerald-400 p-2 rounded-lg hover:bg-emerald-400 hover:text-gray-900 transition"
            >
              Next
            </button>
          </div>

          {/* User Invoices */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Invoices</h3>
            {userInvoices && userInvoices.length > 0 ? (
              userInvoices.map((invoice, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
                  <div><span className="font-semibold">Invoice ID:</span> {invoice.id}</div>
                  <div><span className="font-semibold">Customer Name:</span> {invoice.customer_name}</div>
                  <div><span className="font-semibold">Total Amount:</span> ${invoice.total_amount}</div>
                  <div><span className="font-semibold">Paid Amount:</span> ${invoice.paid_amount}</div>
                  <div><span className="font-semibold">Due Amount:</span> ${invoice.due_amount}</div>
                  <div><span className="font-semibold">Discount:</span> ${invoice.discount}</div>
                  <div><span className="font-semibold">Payment Method:</span> {invoice.payment_method}</div>
                  <div><span className="font-semibold">Payment Status:</span> {invoice.payment_status}</div>
                  <div><span className="font-semibold">Invoice Date:</span> {invoice.created_date}</div>
                  <div><span className="font-semibold">Description:</span> {invoice.description}</div>
                </div>
              ))
            ) : (
              <div>No invoices found</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-emerald-400">Please log in to view your profile.</div>
      )}
    </div>
  );
};

export default ProfilePage;
