import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { paymentService } from '../services/api';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#424770',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#9e2146',
    },
  },
  hidePostalCode: true,
};

const StripePaymentForm = ({ amount, orderId, onSuccess, onError, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await paymentService.createStripePaymentIntent({
          amount: amount / 110, // Convert BDT to USD
          currency: 'usd',
          orderId: orderId,
          metadata: {
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerEmail: customerInfo.email || ''
          }
        });
        
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        onError(err.response?.data?.message || 'Payment initialization failed');
      }
    };

    if (amount && orderId && customerInfo) {
      createPaymentIntent();
    }
  }, [amount, orderId, customerInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!clientSecret) {
      setError('Payment not initialized. Please refresh and try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);

    // Confirm payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email || undefined,
          phone: customerInfo.phone || undefined,
        },
      }
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      onError(stripeError.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Confirm payment with our backend
      try {
        const response = await paymentService.confirmStripePayment(paymentIntent.id);
        onSuccess({
          transactionId: paymentIntent.id,
          order: response.data.order
        });
      } catch (err) {
        setError('Payment successful but order confirmation failed. Please contact support.');
        onError(err.response?.data?.message || 'Order confirmation failed');
      }
      setProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading payment form...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Badge */}
      <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
        <Lock className="h-5 w-5 text-green-600 mr-2" />
        <span className="text-sm text-green-800 font-medium">
          Secured by Stripe • SSL Encrypted
        </span>
      </div>

      {/* Card Information */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="inline h-4 w-4 mr-1" />
          Card Information
        </label>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount (USD)</span>
          <span className="font-semibold">${(amount / 110).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">Amount (BDT)</span>
          <span className="text-sm text-gray-600">৳{amount.toLocaleString()}</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          * Exchange rate: 1 USD = 110 BDT (approximate)
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Pay ${(amount / 110).toFixed(2)} USD
          </>
        )}
      </button>

      {/* Trust Indicators */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>🔒 256-bit SSL</span>
          <span>💳 PCI Compliant</span>
          <span>🛡️ Fraud Protected</span>
        </div>
      </div>
    </form>
  );
};

export default StripePaymentForm;