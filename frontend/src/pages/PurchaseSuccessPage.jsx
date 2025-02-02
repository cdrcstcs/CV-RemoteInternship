import { ArrowRight, CheckCircle, HandHeart, Package, Truck, Home, NotebookPenIcon, Factory, Receipt, Calendar, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useOrderStore } from "../stores/useOrderStore"; // Assuming you have this store for fetching orders
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { cart, orderId, clearCart, routeDetails, totalDistance } = useCartStore();
  const { orderStatus, getOrderStatusById, listenForOrderStatusUpdates, isLoading, errorMessage } = useOrderStore(state => ({
    orderStatus: state.orderStatus,
    getOrderStatusById: state.getOrderStatusById,
    listenForOrderStatusUpdates: state.listenForOrderStatusUpdates,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage
  }));

  const { orderIdFromURL } = useParams(); // Use if you pass the orderId in the URL, i.e., '/order/:orderId'

  const statuses = ['Route Optimization Created' ,'Paid', 'Pending', 'Confirmed', 'Packed', 'Delivery Maintenance Checked', 'On Delivery', 'Delivered','Canceled'];

  // Get status class
  const getStatusClass = (status) => {
    const index = statuses.indexOf(status);
    const currentIndex = statuses.indexOf(orderStatus);

    return currentIndex >= index
      ? "bg-emerald-400 text-white"
      : "bg-gray-500 text-gray-300";
  };

  // Get corresponding icon for each order status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <Receipt size={24} />;
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
	  case 'Delivery Scheduled':
		return <Calendar size={24} />;
	  case 'Delivery Maintenance Checked':
		return <Factory size={24} />;
	  case 'Canceled':
		return <XCircleIcon size={24} />;
      default:
        return <Factory size={24} />;
    }
  };

  useEffect(() => {
    const id = orderId || orderIdFromURL;

    if (id) {
      const fetchOrderStatus = async () => {
        try {
          await getOrderStatusById(id); // Fetch status using store
          listenForOrderStatusUpdates(id); // Start listening for real-time updates
        } catch (err) {
          console.error('Error fetching order status:', err);
        }
      };

      fetchOrderStatus();
    }

    // Simulate a delay or processing state if needed
    setTimeout(() => {
      setIsProcessing(false); // Once processing is done, hide loading state
    }, 2000);
  }, [orderId, orderIdFromURL, getOrderStatusById, listenForOrderStatusUpdates]); // Re-run if orderId or orderIdFromURL changes

  if (isProcessing || isLoading) return <div>Processing...</div>;

  if (errorMessage) return <div>{`Error: ${errorMessage}`}</div>;

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
			{/* Route Details */}
			{routeDetails.length > 0  && (
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
          {/* Order Timeline */}
          <div className="flex items-center justify-center space-x-8 mb-8 flex-wrap">
            {statuses.map((status, index) => (
              <div key={status} className="flex items-center justify-center space-x-2 mt-8">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 
                    ${getStatusClass(status)} shadow-lg transform hover:scale-110`}
                >
                  {getStatusIcon(status)}
                </div>

                {/* Line between status circles - only show if orderStatus has reached or passed the current status */}
                {index < statuses.length - 1 && statuses.indexOf(orderStatus) >= index && (
                  <div className="w-16 h-1 bg-emerald-400"></div>
                )}

				{index < statuses.length - 1 && statuses.indexOf(orderStatus) >= index && (orderStatus == 'Canceled') && (
                  <div className="w-16 h-1 bg-red-600"></div>
                )}

                {(index >= statuses.length - 1 || statuses.indexOf(orderStatus) < index) && (
                  <div className="w-16 h-1 bg-white"></div>
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
