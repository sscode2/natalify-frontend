import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  // Load profile from localStorage on init
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedOrders = localStorage.getItem('userOrders');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('userOrders', JSON.stringify(orders));
    }
  }, [orders]);

  // Create or update user profile from order data
  const createOrUpdateProfile = (customerData, orderData) => {
    const existingProfile = userProfile || {};
    
    // Update profile with new customer data
    const updatedProfile = {
      ...existingProfile,
      name: customerData.name,
      phone: customerData.phone,
      division: customerData.division || existingProfile.division,
      district: customerData.district || existingProfile.district,
      upazila: customerData.upazila || existingProfile.upazila,
      address: customerData.address,
      totalOrders: (existingProfile.totalOrders || 0) + 1,
      totalSpent: (existingProfile.totalSpent || 0) + orderData.totalAmount,
      joinDate: existingProfile.joinDate || new Date().toISOString().split('T')[0]
    };
    
    setUserProfile(updatedProfile);
    
    // Add new order to orders list
    const newOrder = {
      orderNumber: orderData.orderNumber,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: orderData.estimatedDelivery,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    return updatedProfile;
  };

  // Update profile information
  const updateProfile = (updatedData) => {
    const updatedProfile = {
      ...userProfile,
      ...updatedData
    };
    setUserProfile(updatedProfile);
    return updatedProfile;
  };

  // Update order status
  const updateOrderStatus = (orderNumber, newStatus, actualDelivery = null) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.orderNumber === orderNumber 
          ? { 
              ...order, 
              status: newStatus,
              ...(actualDelivery && { actualDelivery })
            }
          : order
      )
    );
  };

  // Get orders by phone number (for backward compatibility)
  const getOrdersByPhone = (phoneNumber) => {
    if (userProfile && userProfile.phone === phoneNumber) {
      return orders;
    }
    return [];
  };

  const value = {
    userProfile,
    orders,
    createOrUpdateProfile,
    updateProfile,
    updateOrderStatus,
    getOrdersByPhone,
    hasProfile: !!userProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;