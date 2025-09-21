import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Package, Edit, Save, X, Calendar, Truck, CheckCircle, Clock } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { orderService } from '../services/api';

const ProfilePage = () => {
  const { userProfile, updateProfile, hasProfile } = useProfile();
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    division: '',
    district: '',
    upazila: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch orders from backend API
  const fetchOrders = async (phone) => {
    if (!phone || phone === 'Add phone number') return;
    
    setOrdersLoading(true);
    try {
      const response = await orderService.getCustomerOrders(phone);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (hasProfile && userProfile) {
      setEditForm({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        division: userProfile.division || 'Dhaka',
        district: userProfile.district || '',
        upazila: userProfile.upazila || '',
        address: userProfile.address || ''
      });
      setLoading(false);
      
      // Fetch orders from backend API
      if (userProfile.phone && userProfile.phone !== 'Add phone number') {
        fetchOrders(userProfile.phone);
      }
    } else {
      // Show demo data if no profile exists
      const demoProfile = {
        name: 'New User',
        phone: 'Add phone number',
        division: 'Dhaka',
        district: 'Add district',
        upazila: 'Add upazila',
        address: 'Add address',
        totalOrders: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setEditForm({
        name: demoProfile.name,
        phone: demoProfile.phone,
        division: demoProfile.division,
        district: demoProfile.district,
        upazila: demoProfile.upazila,
        address: demoProfile.address
      });
      setLoading(false);
    }
  }, [userProfile, hasProfile]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // Update profile using context
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        division: userProfile.division || 'Dhaka',
        district: userProfile.district || '',
        upazila: userProfile.upazila || '',
        address: userProfile.address || ''
      });
    }
    setIsEditing(false);
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'confirmed':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and order history</p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{userProfile?.name || editForm.name}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{userProfile?.phone || editForm.phone}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {isEditing ? (
                <div className="space-y-3">
                  <select
                    value={editForm.division}
                    onChange={(e) => handleFormChange('division', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => handleFormChange('district', e.target.value)}
                    placeholder="District"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={editForm.upazila}
                    onChange={(e) => handleFormChange('upazila', e.target.value)}
                    placeholder="Upazila/Thana"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <textarea
                    value={editForm.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    placeholder="Home/Office Address"
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-900">
                      {userProfile?.address || editForm.address}, {userProfile?.upazila || editForm.upazila}, {userProfile?.district || editForm.district}, {userProfile?.division || editForm.division}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{orders.length || 0}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">৳{orders.reduce((total, order) => total + (order.totalAmount || 0), 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{new Date(userProfile?.joinDate || new Date()).toLocaleDateString('en-US')}</div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
            {userProfile?.phone && userProfile.phone !== 'Add phone number' && (
              <button
                onClick={() => fetchOrders(userProfile.phone)}
                disabled={ordersLoading}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
              >
                {ordersLoading ? 'Loading...' : 'Refresh'}
              </button>
            )}
          </div>
          
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                <div key={order._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #: {order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Order Date: {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status === 'delivered' ? 'Delivered' :
                         order.status === 'shipped' ? 'Shipped' :
                         order.status === 'confirmed' ? 'Confirmed' :
                         order.status === 'cancelled' ? 'Cancelled' :
                         'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <img
                      src={order.items[0]?.productImage || order.items[0]?.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
                      alt={order.items[0]?.productName || order.items[0]?.name || 'Product'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{order.items[0]?.productName || order.items[0]?.name || 'Product'}</h4>
                      <p className="text-sm text-gray-600">
                        {order.items.length > 1 ? `+${order.items.length - 1} more items` : `Quantity: ${order.items[0]?.quantity || 1}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">৳{(order.totalAmount || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      Status: {order.status === 'delivered' ? 'Delivered' :
                               order.status === 'shipped' ? 'Shipped' :
                               order.status === 'confirmed' ? 'Confirmed' :
                               order.status === 'cancelled' ? 'Cancelled' :
                               'Processing'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Last Updated: {new Date(order.updatedAt || order.createdAt).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600">You haven't placed any orders yet. Start shopping!</p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;