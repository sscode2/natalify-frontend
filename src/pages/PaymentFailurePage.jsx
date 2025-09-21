import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home, HelpCircle, Phone } from 'lucide-react';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get order details from URL params
    const orderNumber = searchParams.get('orderNumber');
    const amount = searchParams.get('amount');
    const paymentMethod = searchParams.get('paymentMethod');
    const errorMessage = searchParams.get('error');

    if (orderNumber) {
      setOrderDetails({
        orderNumber,
        amount: amount ? parseFloat(amount) : 0,
        paymentMethod: paymentMethod || 'Unknown',
        errorMessage: errorMessage || 'Payment processing failed'
      });
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Navigate back to checkout with order details
    navigate('/checkout', { 
      state: { 
        retryOrder: orderDetails?.orderNumber,
        retryPayment: true 
      } 
    });
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Failure Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-lg text-gray-600 mb-4">
            We encountered an issue processing your payment.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">
              Order Number: {orderDetails.orderNumber}
            </p>
            <p className="text-red-700 text-sm mt-1">
              Error: {orderDetails.errorMessage}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-bold text-lg">
                ৳{orderDetails.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span className="font-medium text-red-600">Failed ✗</span>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-orange-600" />
            Common Issues & Solutions
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-medium text-gray-900">Insufficient Balance</h4>
              <p className="text-sm text-gray-600">
                Make sure you have sufficient balance in your account or card.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-medium text-gray-900">Network Issue</h4>
              <p className="text-sm text-gray-600">
                Check your internet connection and try again.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-medium text-gray-900">Card/Account Limit</h4>
              <p className="text-sm text-gray-600">
                Your daily/monthly transaction limit might have been exceeded.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-medium text-gray-900">Bank/Gateway Issue</h4>
              <p className="text-sm text-gray-600">
                The payment gateway might be temporarily unavailable.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry Payment
          </button>
          
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try Different Payment Method
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Shopping
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Need Help?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Call us:</strong> <a href="tel:+8801234567890" className="underline">+880 1234-567890</a>
            </p>
            <p>
              <strong>WhatsApp:</strong> <a href="https://wa.me/8801234567890" className="underline">+880 1234-567890</a>
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:support@natalify.com" className="underline">support@natalify.com</a>
            </p>
            <p className="text-blue-600 font-medium mt-3">
              Our support team is available 24/7 to help you complete your order.
            </p>
          </div>
        </div>

        {/* Order Status Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Your order has been created but payment is pending. 
            You can retry payment or choose Cash on Delivery by contacting our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;