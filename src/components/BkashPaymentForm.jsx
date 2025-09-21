import React, { useState } from 'react';
import { paymentService } from '../services/api';
import { Smartphone, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const BkashPaymentForm = ({ amount, orderId, onSuccess, onError, customerInfo }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStep, setPaymentStep] = useState('initiate'); // initiate, redirect, complete

  const handleInitiatePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await paymentService.createBkashPayment({
        amount: amount,
        orderId: orderId,
        callbackURL: `${window.location.origin}/payment/bkash/callback`
      });

      if (response.data.success) {
        setPaymentData(response.data);
        setPaymentStep('redirect');
        
        // Open bKash payment page in popup or redirect
        const paymentWindow = window.open(
          response.data.bkashURL,
          'bkashPayment',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for payment completion
        const checkPaymentStatus = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkPaymentStatus);
            handlePaymentCallback(response.data.paymentID);
          }
        }, 1000);

      } else {
        throw new Error('Failed to initiate bKash payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate bKash payment');
      onError(err.response?.data?.message || 'bKash payment initiation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCallback = async (paymentID) => {
    setProcessing(true);
    setPaymentStep('complete');

    try {
      // Execute the payment
      const response = await paymentService.executeBkashPayment(paymentID);

      if (response.data.success) {
        onSuccess({
          transactionId: response.data.transactionId,
          order: response.data.order
        });
      } else {
        throw new Error('Payment execution failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment execution failed');
      onError(err.response?.data?.message || 'bKash payment execution failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDirectRedirect = () => {
    if (paymentData?.bkashURL) {
      window.location.href = paymentData.bkashURL;
    }
  };

  if (paymentStep === 'redirect') {
    return (
      <div className="text-center space-y-6">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <Smartphone className="h-16 w-16 text-pink-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Complete Payment with bKash
          </h3>
          <p className="text-gray-600 mb-4">
            A popup window should have opened for bKash payment. If it didn't open, click the button below.
          </p>
          
          <button
            onClick={handleDirectRedirect}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Open bKash Payment
          </button>
        </div>

        <div className="text-sm text-gray-500">
          <p>• Complete your payment in the bKash window</p>
          <p>• You will be redirected back after payment</p>
          <p>• Do not close this page during payment</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'complete') {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600">Confirming your bKash payment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* bKash Info */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Smartphone className="h-6 w-6 text-pink-600 mr-2" />
          <span className="font-semibold text-pink-800">bKash Payment</span>
        </div>
        <p className="text-sm text-pink-700">
          You will be redirected to bKash to complete your payment securely.
        </p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Order Amount</span>
          <span className="font-semibold">৳{amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">bKash Fee (1.8%)</span>
          <span className="text-sm">৳{Math.round(amount * 0.018)}</span>
        </div>
        <div className="border-t border-gray-300 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total to Pay</span>
            <span className="font-bold text-lg">৳{(amount + Math.round(amount * 0.018)).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Payment Details</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Name:</strong> {customerInfo.name}</p>
          <p><strong>Phone:</strong> {customerInfo.phone}</p>
          {customerInfo.email && (
            <p><strong>Email:</strong> {customerInfo.email}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Payment Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Payment Instructions:</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Click "Pay with bKash" to open the payment window</li>
          <li>Enter your bKash Mobile Menu PIN</li>
          <li>Confirm the payment amount</li>
          <li>Complete the transaction</li>
          <li>You will be redirected back to our website</li>
        </ol>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleInitiatePayment}
        disabled={processing}
        className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Initiating bKash Payment...
          </>
        ) : (
          <>
            <Smartphone className="h-5 w-5 mr-2" />
            Pay ৳{(amount + Math.round(amount * 0.018)).toLocaleString()} with bKash
          </>
        )}
      </button>

      {/* Trust Indicators */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>🔒 Secure</span>
          <span>📱 Official bKash</span>
          <span>✅ Verified Merchant</span>
        </div>
      </div>
    </div>
  );
};

export default BkashPaymentForm;