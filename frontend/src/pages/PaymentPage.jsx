import React, { useState, useEffect } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

const PaymentPage = () => {
  const {
    cart,
    totalAmount,
    discountAmount,
    totalAfterDiscount,
    processPayment,
    isPaymentProcessing,
    paymentMessage,
    prepareDelivery,
    routeDetails,
    totalDistance,
    resetRouteDetails,
  } = useCartStore();

  const { userAddresses, getUserAddresses } = useUserStore();
  
  useEffect(() => {
    // Fetch addresses when the component mounts
    getUserAddresses();
  }, [getUserAddresses]);

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [currency, setCurrency] = useState('USD');
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [isDeliveryPreparing, setIsDeliveryPreparing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(userAddresses[0] || null);

  // Handle payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsPaid(false);
    processPayment(paymentMethod, paymentGateway, currency);
    setIsPaid(true);
  };

  // Trigger delivery preparation
  const handlePrepareDelivery = () => {
    resetRouteDetails();
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    const userLocation = `${selectedAddress.address_line1}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.postal_code}`;
    setIsDeliveryPreparing(true);
    prepareDelivery(userLocation);
    setIsDeliveryPreparing(false);
  };

  useEffect(() => {
    if (paymentMessage === 'ok' && isPaid) {
      navigate('/purchase-success');
    }
  }, [paymentMessage, isPaid, navigate]);

  return (
    <div className="w-full h-full p-8">
      <div className="container mx-auto max-w-7xl p-6 bg-gray-800 text-white rounded-xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Order Details */}
          <div className="space-y-6">
            <div className="p-6 bg-gray-900 rounded-md shadow-md">
              <p className="text-xl font-semibold">Total Amount: ${totalAmount.toFixed(2)}</p>
              {discountAmount > 0 && (
                <>
                  <p className="text-lg">Discount Applied: -${discountAmount.toFixed(2)}</p>
                  <p className="text-lg font-semibold">Total After Discount: ${totalAfterDiscount.toFixed(2)}</p>
                </>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">Order Details</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.products_id} className="flex justify-between items-center bg-gray-800 p-3 rounded-md shadow-lg hover:bg-gray-700 transition-all">
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover mr-4 rounded-md"
                      />
                      <span className="text-lg">{item.product.name}</span>
                    </div>
                    <div className="text-lg font-medium">
                      {item.quantity} x ${item.total_amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Payment Form */}
          <div className="bg-gray-900 p-6 rounded-md shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Payment Information</h3>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Method */}
              <div>
                <label htmlFor="payment_method" className="block text-lg font-medium mb-2">Payment Method</label>
                <select
                  id="payment_method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">Cash</option>
                </select>
              </div>

              {/* Payment Gateway */}
              <div>
                <label htmlFor="payment_gateway" className="block text-lg font-medium mb-2">Payment Gateway</label>
                <select
                  id="payment_gateway"
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="zalopay">Zalopay</option>
                </select>
              </div>

              {/* Currency Selection */}
              <div>
                <label htmlFor="currency" className="block text-lg font-medium mb-2">Currency</label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              {/* Payment Button */}
              <button
                type="submit"
                disabled={isPaymentProcessing}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:bg-gray-600 transition-all"
              >
                {isPaymentProcessing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </form>

            {/* Delivery Address Selection */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold">Select Delivery Address</h4>
              <select
                value={selectedAddress ? `${selectedAddress.address_line1}, ${selectedAddress.city}, ${selectedAddress.state}` : ''}
                onChange={(e) => {
                  const selected = userAddresses.find(address => 
                    `${address.address_line1}, ${address.city}, ${address.state}` === e.target.value
                  );
                  setSelectedAddress(selected);
                }}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2"
              >
                {userAddresses.map((address) => (
                  <option key={address.id} value={`${address.address_line1}, ${address.city}, ${address.state}`}>
                    {address.address_line1}, {address.city}, {address.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Prepare Delivery Button */}
            <button
              onClick={handlePrepareDelivery}
              disabled={isDeliveryPreparing || isPaymentProcessing || !selectedAddress}
              className="w-full mt-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 disabled:bg-gray-600 transition-all"
            >
              {isDeliveryPreparing ? 'Preparing Delivery...' : 'Prepare Delivery'}
            </button>

            {/* Route Details */}
            {routeDetails.length > 0 && !isDeliveryPreparing && (
              <div className="mt-6">
                <h4 className="text-xl font-semibold">Expected Delivery Routes</h4>
                <ul className="space-y-4 text-white mt-4">
                  {routeDetails.map((route, index) => (
                    <li key={index} className="bg-gray-700 p-3 rounded-md">
                      <p><strong>Route Name:</strong> {route.route_name}</p>
                      {route.supplier_name && (<p><strong>Supplier:</strong> {route.supplier_name}</p>)}
                      <p><strong>Warehouse:</strong> {route.warehouse_name_1}</p>
                      {route.warehouse_name_2 && (<p><strong>Warehouse:</strong> {route.warehouse_name_2}</p>)}
                      <p><strong>Start Location</strong> {route.start_location}</p>
                      <p><strong>Destination Location</strong> {route.end_location}</p>
                      <p><strong>Estimated Time</strong> {route.estimated_time}</p>
                      <p><strong>Distance:</strong> {route.distance} km</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <p><strong>Total Distance:</strong> {totalDistance} km</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
