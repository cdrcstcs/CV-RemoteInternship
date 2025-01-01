import React, { useState, useEffect } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const {
    cart,
    totalAmount,
    discountAmount,
    totalAfterDiscount,
    processPayment,
    isPaymentProcessing,
    paymentMessage,
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [currency, setCurrency] = useState('USD');
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  // Handle payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsPaid(false);
    processPayment(paymentMethod, paymentGateway, currency); // Call the store method to process the payment
    setIsPaid(true);
  };

  useEffect(() => {
    console.log(paymentMessage);
    if (paymentMessage === 'ok' && isPaid) {
      navigate('/purchase-success');
    }
  }, [paymentMessage]);

  return (
    <div className="w-full h-full p-8">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 text-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Left Section: Order Details */}
          <div className="space-y-6">
            <div className="mb-4 p-4 bg-gray-800 rounded-md shadow-md">
              <p className="text-lg">Total Amount: ${totalAmount.toFixed(2)}</p>
              {discountAmount > 0 && (
                <>
                  <p className="text-lg">Discount Applied: -${discountAmount.toFixed(2)}</p>
                  <p className="text-lg font-semibold">Total After Discount: ${totalAfterDiscount.toFixed(2)}</p>
                </>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Order Details</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.products_id} className="flex justify-between items-center bg-gray-800 p-3 rounded-md shadow-lg transform transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover mr-4 rounded-md"
                      />
                      <span className="text-lg">{item.product.name}</span>
                    </div>
                    <div className="text-lg">
                      {item.quantity} x ${item.total_amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Payment Form */}
          <div className="bg-gray-800 p-6 rounded-md shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Payment Information</h3>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
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

              <button
                type="submit"
                disabled={isPaymentProcessing}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:bg-gray-600 transition duration-150 transform hover:scale-105"
              >
                {isPaymentProcessing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
