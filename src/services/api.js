import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const productService = {
  // Get all products with filters
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },
  
  // Get single product
  getProduct: (id) => {
    return api.get(`/products/${id}`);
  },
  
  // Get related products
  getRelatedProducts: (id) => {
    return api.get(`/products/${id}/related`);
  },
  
  // Search products
  searchProducts: (query, limit = 10) => {
    return api.get(`/products/search/${query}`, { params: { limit } });
  },
  
  // Get categories
  getCategories: () => {
    return api.get('/products/meta/categories');
  }
};

export const orderService = {
  // Create new order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },
  
  // Get order by order number
  getOrder: (orderNumber) => {
    return api.get(`/orders/${orderNumber}`);
  },
  
  // Get customer orders by phone
  getCustomerOrders: (phone) => {
    return api.get(`/orders/customer/${phone}`);
  }
};

export const adminService = {
  // Admin login
  login: (credentials) => {
    return api.post('/admin/login', credentials);
  },
  
  // Get dashboard data
  getDashboard: () => {
    return api.get('/admin/dashboard');
  },
  
  // Get all orders
  getOrders: (params = {}) => {
    return api.get('/admin/orders', { params });
  },
  
  // Update order status
  updateOrderStatus: (orderId, statusData) => {
    return api.patch(`/admin/orders/${orderId}/status`, statusData);
  },
  
  // Get all products (admin)
  getProducts: (params = {}) => {
    return api.get('/admin/products', { params });
  },
  
  // Create product
  createProduct: (productData) => {
    return api.post('/admin/products', productData);
  },
  
  // Update product
  updateProduct: (productId, productData) => {
    return api.put(`/admin/products/${productId}`, productData);
  },
  
  // Delete product
  deleteProduct: (productId) => {
    return api.delete(`/admin/products/${productId}`);
  }
};

export const contactService = {
  // Submit contact form
  submitContact: (contactData) => {
    return api.post('/contact', contactData);
  }
};

export const paymentService = {
  // Stripe payment methods
  createStripePaymentIntent: (paymentData) => {
    return api.post('/payments/stripe/create-payment-intent', paymentData);
  },
  
  confirmStripePayment: (paymentIntentId) => {
    return api.post('/payments/stripe/confirm-payment', { paymentIntentId });
  },
  
  // bKash payment methods
  createBkashPayment: (paymentData) => {
    return api.post('/payments/bkash/create-payment', paymentData);
  },
  
  executeBkashPayment: (paymentID) => {
    return api.post('/payments/bkash/execute-payment', { paymentID });
  },
  
  queryBkashPayment: (paymentID) => {
    return api.get(`/payments/bkash/query-payment/${paymentID}`);
  }
};

export default api;