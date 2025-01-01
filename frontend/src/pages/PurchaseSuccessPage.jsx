import { ArrowRight, CheckCircle, HandHeart, Package, Truck, Home, NotebookPenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { cart, orderId, clearCart } = useCartStore();
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState('Confirmed'); // Placeholder value for order status

  // Define the order statuses
  const statuses = ['Pending', 'Confirmed', 'Packed', 'On Delivery', 'Delivered'];

  // Order Status Timeline - Add Icons and Styling
  const getStatusClass = (status) => {
    const index = statuses.indexOf(status);
    const currentIndex = statuses.indexOf(orderStatus);

    return currentIndex >= index
      ? "bg-emerald-400 text-white"
      : "bg-gray-500 text-gray-300";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <NotebookPenIcon size={24} />;
      case 'Confirmed':
        return <CheckCircle size={24} />;
      case 'Packed':
        return <Package size={24} />;
      case 'On Delivery':
        return <Truck size={24} />;
	case 'Delivered':
		return <Home size={24} />;
      default:
        return <Package size={24} />;
    }
  };

  useEffect(() => {
    // Simulate a delay or processing state if needed
    setTimeout(() => {
      setIsProcessing(false); // Once processing is done, hide loading state
    }, 2000);
  }, []);

  if (isProcessing) return <div>Processing...</div>;

  if (error) return <div>{`Error: ${error}`}</div>;

  return (
    <div className="h-full flex items-center justify-center">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />
      <div className="w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden relative z-10">
        <div className="p-8 sm:p-10">
          {/* Success Icon */}
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-400 w-20 h-20 mb-6 animate-bounce" />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-emerald-400 mb-4">
            Purchase Successful!
          </h1>

          <p className="text-gray-300 text-center mb-4">
            Thank you for your order. We're processing it now.
          </p>
          <p className="text-emerald-400 text-center text-lg mb-8">
            Check your email for order details and updates.
          </p>

          {/* Order Timeline */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {statuses.map((status, index) => (
              <div key={status} className="flex items-center justify-center space-x-2">
                {/* Circle with status */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 
                    ${getStatusClass(status)} shadow-lg transform hover:scale-110`}
                >
                  {getStatusIcon(status)}
                </div>

                {/* Line between status circles */}
                {index < statuses.length - 1 && (
                  <div className="w-16 h-1 bg-emerald-400"></div>
                )}

                {/* Status Text */}
                <span className="text-sm text-center text-gray-200">
                  {status}
                </span>
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Order Details</h2>
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.products_id}
                  className="flex justify-between items-center bg-gray-800 p-4 rounded-md shadow-md"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover mr-6 rounded-md shadow-md"
                    />
                    <span className="text-xl text-gray-200">{item.product.name}</span>
                  </div>
                  <div className="text-xl text-gray-300">
                    {item.quantity} x ${item.total_amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <button
              onClick={() => clearCart()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center transform hover:scale-105"
            >
              <HandHeart className="mr-3" size={20} />
              Thanks for trusting us!
            </button>

            <Link
              to="/"
              className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center transform hover:scale-105"
            >
              Continue Shopping
              <ArrowRight className="ml-3" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
