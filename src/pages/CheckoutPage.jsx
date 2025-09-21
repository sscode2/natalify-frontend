import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { orderService } from '../services/api';
import { ShoppingBag, MapPin, CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import StripeProvider from '../components/StripeProvider';
import StripePaymentForm from '../components/StripePaymentForm';
import BkashPaymentForm from '../components/BkashPaymentForm';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { createOrUpdateProfile } = useProfile();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    division: 'Dhaka',
    district: '',
    upazila: '',
    address: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');
  
  // Bangladesh divisions with delivery charges
  const divisions = [
    { value: 'Dhaka', label: 'ঢাকা', charge: 70 },
    { value: 'Chattogram', label: 'চট্টগ্রাম', charge: 120 },
    { value: 'Khulna', label: 'খুলনা', charge: 120 },
    { value: 'Rajshahi', label: 'রাজশাহী', charge: 120 },
    { value: 'Rangpur', label: 'রংপুর', charge: 120 },
    { value: 'Barishal', label: 'বরিশাল', charge: 120 },
    { value: 'Sylhet', label: 'সিলেট', charge: 120 },
    { value: 'Mymensingh', label: 'ময়মনসিংহ', charge: 120 }
  ];
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate('/cart');
    }
  }, [items, navigate, success]);
  
  const getDeliveryCharge = () => {
    const division = divisions.find(d => d.value === customerData.division);
    return division ? division.charge : 120;
  };
  
  const getPaymentFees = () => {
    const total = getSubtotal() + getDeliveryCharge();
    if (paymentMethod === 'Stripe') {
      return Math.round(total * 0.029 + 30); // 2.9% + 30 BDT
    } else if (paymentMethod === 'bKash') {
      return Math.round(total * 0.018); // 1.8%
    }
    return 0;
  };
  
  const getSubtotal = () => getCartTotal();
  const getTotalAmount = () => getSubtotal() + getDeliveryCharge() + getPaymentFees();
  
  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };
  
  const validateForm = () => {
    if (!customerData.name.trim()) {
      setError('নাম প্রয়োজন');
      return false;
    }
    if (!customerData.phone.trim()) {
      setError('ফোন নম্বর প্রয়োজন');
      return false;
    }
    if (!customerData.district.trim()) {
      setError('জেলা প্রয়োজন');
      return false;
    }
    if (!customerData.upazila.trim()) {
      setError('উপজেলা প্রয়োজন');
      return false;
    }
    if (!customerData.address.trim()) {
      setError('ঠিকানা প্রয়োজন');
      return false;
    }
    return true;
  };
  
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        customer: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: `${customerData.address}, ${customerData.upazila}, ${customerData.district}, ${customerData.division}`
        },
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: getTotalAmount(),
        paymentMethod: paymentMethod,
        deliveryCharge: getDeliveryCharge(),
        notes: notes
      };
      
      const response = await orderService.createOrder(orderData);
      
      // Store order ID for payment processing
      setCreatedOrderId(response.data.order._id || response.data.order.id);
      setOrderNumber(response.data.order.orderNumber);
      
      if (paymentMethod === 'COD') {
        // For COD, complete the order immediately
        createOrUpdateProfile(customerData, {
          orderNumber: response.data.order.orderNumber,
          totalAmount: getTotalAmount(),
          paymentMethod: paymentMethod,
          items: items,
          estimatedDelivery: response.data.order.estimatedDelivery
        });
        
        setSuccess(true);
        clearCart();
      } else {
        // For online payments, show payment form
        setShowPaymentForm(true);
      }
      
    } catch (error) {
      console.error('Order creation failed:', error);
      setError(error.response?.data?.message || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = (paymentData) => {
    setPaymentProcessing(false);
    
    // Update profile with successful order
    createOrUpdateProfile(customerData, {
      orderNumber: orderNumber,
      totalAmount: getTotalAmount(),
      paymentMethod: paymentMethod,
      items: items,
      transactionId: paymentData.transactionId
    });
    
    setSuccess(true);
    clearCart();
  };
  
  const handlePaymentError = (errorMessage) => {
    setPaymentProcessing(false);
    setError(errorMessage || 'Payment failed. Please try again.');
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">অর্ডার সফল!</h2>
            <p className="text-gray-600 mb-4">
              আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। অর্ডার নম্বর: <span className="font-semibold text-primary-600">{orderNumber}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব এবং ৩-৫ কার্যদিবসের মধ্যে পণ্য ডেলিভার করব।
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                অর্ডার ট্র্যাক করুন
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                হোমে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">চেকআউট</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                ব্যক্তিগত তথ্য
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">নাম *</label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="আপনার পূর্ণ নাম"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="০১৭xxxxxxxx"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ইমেইল (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-primary-600" />
                ডেলিভারি ঠিকানা
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">বিভাগ *</label>
                  <select
                    value={customerData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {divisions.map(division => (
                      <option key={division.value} value={division.value}>
                        {division.label} (ডেলিভারি চার্জ: ৳{division.charge})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">জেলা *</label>
                    <input
                      type="text"
                      value={customerData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="যেমন: ঢাকা"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">উপজেলা/থানা *</label>
                    <input
                      type="text"
                      value={customerData.upazila}
                      onChange={(e) => handleInputChange('upazila', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="যেমন: ধানমন্ডি"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">বিস্তারিত ঠিকানা *</label>
                  <textarea
                    value={customerData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    placeholder="বাড়ি/অফিসের নাম, রোড নম্বর, এলাকা"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                পেমেন্ট পদ্ধতি
              </h2>
              
              <PaymentMethodSelector 
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                totalAmount={getSubtotal() + getDeliveryCharge()}
              />
            </div>
            
            {/* Order Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">অতিরিক্ত নোট (ঐচ্ছিক)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="কোন বিশেষ নির্দেশনা থাকলে এখানে লিখুন..."
              />
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-primary-600" />
                অর্ডার সামারি
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">৳{item.price.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">সাবটোটাল</span>
                  <span className="text-gray-900">৳{getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ডেলিভারি চার্জ</span>
                  <span className="text-gray-900">৳{getDeliveryCharge()}</span>
                </div>
                {getPaymentFees() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Fee ({paymentMethod})</span>
                    <span className="text-gray-900">৳{getPaymentFees()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">মোট</span>
                  <span className="text-primary-600">৳{getTotalAmount().toLocaleString()}</span>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="w-full mt-6 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    অর্ডার করা হচ্ছে...
                  </>
                ) : (
                  <>অর্ডার কনফার্ম করুন</>
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                অর্ডার কনফার্ম করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।
              </p>
            </div>
          </div>
        </div>
        
        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Complete Payment - ৳{getTotalAmount().toLocaleString()}
                  </h2>
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                {paymentMethod === 'Stripe' ? (
                  <StripeProvider>
                    <StripePaymentForm
                      amount={getTotalAmount()}
                      orderId={createdOrderId}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      customerInfo={customerData}
                    />
                  </StripeProvider>
                ) : paymentMethod === 'bKash' ? (
                  <BkashPaymentForm
                    amount={getTotalAmount()}
                    orderId={createdOrderId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    customerInfo={customerData}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;