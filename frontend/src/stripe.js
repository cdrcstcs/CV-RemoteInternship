// src/stripe.js
import { loadStripe } from '@stripe/stripe-js';

// Add your Stripe public key here
const stripePromise = loadStripe('pk_test_51PMjcCIw69kb65LMm6zd49cWEi1zj4wFnwVbF9mxurJg1JlgoH0S7tOPdJglr0YmyejIYYfDTHhVTFOSgt0SD0rv00YmclMWcR');

export { stripePromise };
