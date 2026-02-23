import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
};

// Product API
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
    getFeatured: () => api.get('/products/featured'),
    getDeals: () => api.get('/products/deals'),
    getBestsellers: () => api.get('/products/bestsellers'),
    getNewArrivals: () => api.get('/products/new-arrivals'),
};

// Category API
export const categoryAPI = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    getCount: () => api.get('/cart/count'),
    add: (data) => api.post('/cart/add', data),
    update: (id, data) => api.put(`/cart/${id}`, data),
    remove: (id) => api.delete(`/cart/${id}`),
    clear: () => api.delete('/cart'),
};

// Order API
export const orderAPI = {
    create: (data) => api.post('/orders', data),
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id, data) => api.put(`/orders/${id}/cancel`, data),
    track: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
};

// Review API
export const reviewAPI = {
    getByProduct: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
    markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};

// Wishlist API
export const wishlistAPI = {
    get: () => api.get('/wishlist'),
    add: (data) => api.post('/wishlist', data),
    remove: (productId) => api.delete(`/wishlist/${productId}`),
    check: (productId) => api.get(`/wishlist/check/${productId}`),
};

// Address API
export const addressAPI = {
    getAll: () => api.get('/addresses'),
    add: (data) => api.post('/addresses', data),
    update: (id, data) => api.put(`/addresses/${id}`, data),
    delete: (id) => api.delete(`/addresses/${id}`),
    setDefault: (id) => api.put(`/addresses/${id}/default`),
};

// Search API
export const searchAPI = {
    search: (params) => api.get('/search', { params }),
    suggestions: (q) => api.get('/search/suggestions', { params: { q } }),
};

// Seller API
export const sellerAPI = {
    getDashboard: () => api.get('/seller/dashboard'),
    getProducts: (params) => api.get('/seller/products', { params }),
    createProduct: (data) => api.post('/seller/products', data),
    updateProduct: (id, data) => api.put(`/seller/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/seller/products/${id}`),
    getOrders: (params) => api.get('/seller/orders', { params }),
    updateOrderStatus: (itemId, data) => api.put(`/seller/orders/${itemId}/status`, data),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
    getOrders: (params) => api.get('/admin/orders', { params }),
    updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
    updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
    getProducts: (params) => api.get('/admin/products', { params }),
    toggleFeatured: (id) => api.put(`/admin/products/${id}/featured`),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

export default api;
