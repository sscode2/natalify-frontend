import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, User, Calendar } from 'lucide-react';

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock order data for demonstration
  const mockOrders = {
    'NAT-2024-001': {
      orderNumber: 'NAT-2024-001',
      status: 'shipped',
      customer: {
        name: 'John Doe',
        phone: '+8801712345678',
        address: 'House 15, Road 7, Dhanmondi, Dhaka-1205, Bangladesh'
      },
      items: [
        {
          name: 'Samsung Galaxy A54 5G',
          price: 45000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'
        }
      ],
      totalAmount: 45000,
      paymentMethod: 'Cash on Delivery',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-20',
      tracking: [
        {
          status: 'Order Placed',
          date: '2024-01-15 10:30 AM',
          description: 'Your order has been placed successfully',
          completed: true
        },
        {
          status: 'Order Confirmed',
          date: '2024-01-15 02:15 PM',
          description: 'Your order has been confirmed and is being prepared',
          completed: true
        },
        {
          status: 'Shipped',
          date: '2024-01-17 09:45 AM',
          description: 'Your order has been shipped and is on the way',
          completed: true
        },
        {
          status: 'Out for Delivery',
          date: 'Expected: 2024-01-20',
          description: 'Your order is out for delivery',
          completed: false
        },
        {
          status: 'Delivered',
          date: 'Expected: 2024-01-20',
          description: 'Your order has been delivered',
          completed: false
        }
      ]
    },
    'NAT-2024-002': {
      orderNumber: 'NAT-2024-002',
      status: 'confirmed',
      customer: {
        name: 'Sarah Ahmed',
        phone: '+8801798765432',
        address: 'Flat 3B, House 25, GEC Circle, Chittagong-4000, Bangladesh'
      },
      items: [
        {
          name: 'Premium Cotton T-Shirt',
          price: 1200,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'
        }
      ],
      totalAmount: 2400,
      paymentMethod: 'Cash on Delivery',
      orderDate: '2024-01-16',
      estimatedDelivery: '2024-01-22',
      tracking: [
        {
          status: 'Order Placed',
          date: '2024-01-16 11:20 AM',
          description: 'Your order has been placed successfully',
          completed: true
        },
        {
          status: 'Order Confirmed',
          date: '2024-01-16 03:30 PM',
          description: 'Your order has been confirmed and is being prepared',
          completed: true
        },
        {
          status: 'Shipped',
          date: 'Processing...',
          description: 'Your order is being prepared for shipment',
          completed: false
        },
        {
          status: 'Out for Delivery',
          date: 'Expected: 2024-01-22',
          description: 'Your order is out for delivery',
          completed: false
        },
        {
          status: 'Delivered',
          date: 'Expected: 2024-01-22',
          description: 'Your order has been delivered',
          completed: false
        }
      ]
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const order = mockOrders[orderNumber.toUpperCase()];
      
      if (order && order.customer.phone === phoneNumber) {
        setOrderData(order);
        setError('');
      } else {
        setOrderData(null);
        setError('Order not found. Please check your order number and phone number.');
      }
      
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    
    switch (status.toLowerCase()) {
      case 'order placed':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'order confirmed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-orange-500" />;
      case 'out for delivery':
        return <Truck className="w-6 h-6 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your order number and phone number to track your order status and delivery information.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., NAT-2024-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., +8801712345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Order Numbers:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Order: <span className="font-mono">NAT-2024-001</span> | Phone: <span className="font-mono">+8801712345678</span></p>
              <p>Order: <span className="font-mono">NAT-2024-002</span> | Phone: <span className="font-mono">+8801798765432</span></p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">অর্ডার তথ্য</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status === 'delivered' ? 'ডেলিভার হয়েছে' :
                   selectedOrder.status === 'shipped' ? 'শিপমেন্ট করা হয়েছে' :
                   selectedOrder.status === 'confirmed' ? 'নিশ্চিত করা হয়েছে' :
                   selectedOrder.status === 'cancelled' ? 'বাতিল' :
                   'পেন্ডিং'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">অর্ডার নম্বর</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">অর্ডারের তারিখ</p>
                    <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString('bn-BD')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">প্রত্যাশিত ডেলিভারি</p>
                    <p className="font-medium">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString('bn-BD')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 text-2xl">৳</span>
                  <div>
                    <p className="text-sm text-gray-600">মোট পরিমাণ</p>
                    <p className="font-medium">৳{selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-medium">{orderData.customer.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{orderData.customer.phone}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">{orderData.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">৳{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{orderData.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Tracking */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">অর্ডার স্থিতি প্রগতি</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8">
                  {selectedOrder.tracking.map((step, index) => {
                    const isActive = step.completed;
                    const isNext = !step.completed && index > 0 && selectedOrder.tracking[index - 1]?.completed;
                    
                    return (
                      <div key={index} className="relative flex items-start">
                        {/* Status Icon */}
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                          isActive 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isNext 
                            ? 'bg-orange-100 border-orange-400 text-orange-600'
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}>
                          {getStatusIcon(step.status, step.completed)}
                        </div>
                        
                        {/* Status Content */}
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold ${
                              isActive ? 'text-green-700' : isNext ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                              {step.status === 'Order Placed' ? 'অর্ডার দেওয়া হয়েছে' :
                               step.status === 'Order Confirmed' ? 'অর্ডার নিশ্চিত' :
                               step.status === 'Shipped' ? 'পাঠানো হয়েছে' :
                               step.status === 'Out for Delivery' ? 'ডেলিভারির জন্য বের হয়েছে' :
                               step.status === 'Delivered' ? 'ডেলিভার হয়েছে' :
                               step.status}
                            </h4>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              isActive 
                                ? 'bg-green-100 text-green-700'
                                : isNext
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isActive ? 'সম্পন্ন' : isNext ? 'চলমান' : 'অপেক্ষামাণ'}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${
                            isActive ? 'text-green-600' : isNext ? 'text-orange-600' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                          <p className={`text-xs ${
                            isActive ? 'text-green-600 font-medium' : isNext ? 'text-orange-600' : 'text-gray-400'
                          }`}>
                            {step.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Status Summary */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">বর্তমান স্থিতি</h4>
                    <p className={`text-sm font-semibold ${
                      selectedOrder.status === 'delivered' ? 'text-green-600' :
                      selectedOrder.status === 'shipped' ? 'text-orange-600' :
                      selectedOrder.status === 'confirmed' ? 'text-blue-600' :
                      selectedOrder.status === 'cancelled' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {selectedOrder.status === 'delivered' ? 'ডেলিভার হয়েছে' :
                       selectedOrder.status === 'shipped' ? 'শিপমেন্ট করা হয়েছে' :
                       selectedOrder.status === 'confirmed' ? 'নিশ্চিত করা হয়েছে' :
                       selectedOrder.status === 'cancelled' ? 'বাতিল' :
                       'পেন্ডিং'}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    selectedOrder.status === 'shipped' ? 'bg-orange-100 text-orange-700' :
                    selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedOrder.status === 'delivered' ? '✓ ডেলিভার সম্পন্ন' :
                     selectedOrder.status === 'shipped' ? '🚛 পরিবহনে' :
                     selectedOrder.status === 'confirmed' ? '📦 প্রস্তুত করা হচ্ছে' :
                     selectedOrder.status === 'cancelled' ? '❌ বাতিল' :
                     '⏳ অপেক্ষামাণ'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;