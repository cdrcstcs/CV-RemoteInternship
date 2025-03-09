import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useGiftStore } from '../../stores/useGiftStore';

const GiftSelector = () => {
  const {
    isPaymentProcessing, 
    stripeClientSecret, 
    createStripePaymentIntent,
  } = useGiftStore(); // Accessing your cart store

  const [price, setPrice] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  // Define a default set of images with associated prices
  const images = [
    { src: '/hat.png', alt: 'Hat', price: 2 },
    { src: '/rose.png', alt: 'Rose', price: 1 },
    { src: '/cowboy.png', alt: 'Cowboy', price: 3 },
    { src: '/donut.png', alt: 'Donut', price: 4 },
  ];

  const stripe = useStripe();
  const elements = useElements();

  // Handle image selection and price update
  const handleImageClick = (image) => {
    setPrice(image.price);
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe has not loaded yet');
      return;
    }

    // Create payment intent on the backend and get client secret
    await createStripePaymentIntent('USD', price);

    // Confirm the payment with Stripe
    const cardElement = elements.getElement(CardElement);
    
    if (stripeClientSecret) {
      const { error, paymentIntent } = await stripe.confirmCardPayment(stripeClientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            address: {
              postal_code: '118560', // Include the postal code here
            },
          },
        },
      });

      if (error) {
        console.error(error.message);
        alert(error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setIsPaid(true);
      }
    }
  };

  useEffect(() => {
    if (isPaid) {
      console.log('Payment was successful');
      // You can redirect to a success page or show a success message
    }
  }, [isPaid]);

  return (
    <div >
      <div className="container mx-auto max-w-md  text-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6">
          {/* Left Section: Select Gift */}
          <div className="p-4 bg-gray-900 rounded-md shadow-md">
            <div className="flex justify-center gap-4 mb-4">
              {images.map((image) => (
                <div
                  key={image.alt}
                  onClick={() => handleImageClick(image)}
                  className="cursor-pointer transform hover:scale-110 transition-all text-center"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-12 h-12 rounded-md shadow-md object-cover mx-auto"
                  />
                  {/* Displaying price below the image */}
                  <p className="mt-2 text-sm text-emerald-400">${image.price}</p>
                </div>
              ))}
            </div>

            {price > 0 && (
              <div className="mt-2 text-center">
                <p className="text-sm">Selected Price: ${price}</p>
              </div>
            )}
          </div>

          {/* Right Section: Payment Form */}
          <div className="bg-gray-900 p-4 rounded-md shadow-md">

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* Card Element for Stripe */}
              {price > 0 && (
                <div>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          color: '#fff',
                          fontSize: '14px',
                          fontFamily: 'sans-serif',
                          '::placeholder': {
                            color: '#aaa',
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}

              {/* Payment Button */}
              <button
                type="submit"
                disabled={isPaymentProcessing}
                className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:bg-gray-600 transition-all"
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

export default GiftSelector;
