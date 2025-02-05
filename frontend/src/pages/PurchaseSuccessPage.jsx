import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useOrderStore } from "../stores/useOrderStore";
import { useFeedbackFormStore } from "../stores/useFeedbackFormStore";
import Confetti from "react-confetti";
import FeedbackFormPublicView from "./FeedbackForm/FeedbackFormPublicView";
import { Receipt,NotebookPenIcon,Package,Truck,Home,Calendar,Factory,CheckCircle, XCircleIcon } from "lucide-react";
const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [currentFormIndex, setCurrentFormIndex] = useState(0); // Track which form is displayed
  const { cart, orderId, clearCart, routeDetails, totalDistance, totalAmount, discountAmount, totalAfterDiscount } = useCartStore();
  const { getFeedbackFormsForOrder, isLoadingForm, feedbackForms } = useFeedbackFormStore();
  const { orderStatus, getOrderStatusById, listenForOrderStatusUpdates, isLoading, errorMessage } = useOrderStore(state => ({
    orderStatus: state.orderStatus,
    getOrderStatusById: state.getOrderStatusById,
    listenForOrderStatusUpdates: state.listenForOrderStatusUpdates,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage
  }));

  const { orderIdFromURL } = useParams();

  const statuses = ['Route Optimization Created', 'Paid', 'Pending', 'Confirmed', 'Packed', 'Delivery Maintenance Checked', 'On Delivery', 'Delivered', 'Canceled'];

  const getStatusClass = (status) => {
    const index = statuses.indexOf(status);
    const currentIndex = statuses.indexOf(orderStatus);
    return currentIndex >= index
      ? "bg-emerald-400 text-white"
      : "bg-gray-500 text-gray-300";
  };

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

    // Fetch the feedback forms
    const fetchFeedbackForms = async () => {
      try {
        await getFeedbackFormsForOrder(id);
      } catch (err) {
        console.error('Error fetching feedback forms:', err);
      }
    };

    if (id) {
      fetchFeedbackForms(); // Fetch the feedback forms for this order
    }
  }, [orderId, orderIdFromURL, getOrderStatusById, listenForOrderStatusUpdates]); // Re-run if orderId or orderIdFromURL changes

  if (isProcessing || isLoading || isLoadingForm) return <div>Processing...</div>;

  if (errorMessage) return <div>{`Error: ${errorMessage}`}</div>;

  const handleContinueForm = () => {
    if (currentFormIndex < feedbackForms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1); // Skip to the next form
    } else {
      setCurrentFormIndex(feedbackForms.length); // End the form process
    }
  };

  const handleSkipAll = () => {
    setCurrentFormIndex(feedbackForms.length); // Skip to the end of all forms
  };

  const handleBackToForm = () => {
    setCurrentFormIndex(0); // Skip to the end of all forms
  };

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
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-400 w-20 h-20 mb-6 animate-bounce" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-emerald-400 mb-4">Purchase Successful!</h1>
          <p className="text-gray-300 text-center mb-4">Thank you for your order. We're processing it now.</p>
          <p className="text-emerald-400 text-center text-lg mb-8">Check your email for order details and updates.</p>

          {/* Loop through feedback forms */}
          {console.log(feedbackForms)}
          {feedbackForms && (
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-4">Feedback Forms</h4>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                {/* Display the current feedback form */}
                {currentFormIndex <= feedbackForms.length - 1 && (<FeedbackFormPublicView currentFeedbackForm={feedbackForms[currentFormIndex]} continueIndex={setCurrentFormIndex}/>)}

                {/* Skip button */}

                {currentFormIndex <= feedbackForms.length - 1 && (<div className="mt-4">
                  <button
                    onClick={handleContinueForm}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    Continue
                  </button>
                </div>)}

                {/* Skip All Button */}
                {currentFormIndex <= feedbackForms.length - 1 && (<div className="mt-4">
                  <button
                    onClick={handleSkipAll}
                    className="w-full bg-emerald-400 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    Skip All Forms
                  </button>
                </div>)}

                {currentFormIndex == feedbackForms.length && (<div className="mt-4">
                  <button
                    onClick={handleBackToForm}
                    className="w-full bg-emerald-400 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    Back To Forms
                  </button>
                </div>)}


              </div>
            </div>
          )}

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
          <div className="p-6 bg-gray-700 rounded-md shadow-md my-4">
              <p className="text-xl font-semibold">Total Amount: ${totalAmount.toFixed(2)}</p>
              {discountAmount > 0 && (
                <>
                  <p className="text-lg">Discount Applied: -${discountAmount.toFixed(2)}</p>
                  <p className="text-lg font-semibold">Total After Discount: ${totalAfterDiscount.toFixed(2)}</p>
                </>
              )}
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
              Thanks for trusting us!
            </button>

            <Link
              to="/"
              className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
