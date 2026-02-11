const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://strikersgear-api.vercel.app';
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'https://fl.osamaqaseem.online/upload.php';

/**
 * Upload image file to upload.php (cPanel). Returns the image URL.
 * Set VITE_UPLOAD_URL to your upload.php endpoint, e.g. https://yourdomain.com/upload.php
 * Response format: { success, message, data: { url, filename, ... } }
 */
export async function uploadImage(file) {
  if (!UPLOAD_URL) {
    throw new Error('VITE_UPLOAD_URL is not set. Configure it to your upload.php endpoint.');
  }
  const endpoint = UPLOAD_URL.replace(/\/$/, '');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(endpoint, { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || data.error || 'Upload failed');
  }
  const url = data.data?.url ?? data.url;
  if (!url) throw new Error('Upload response missing URL');
  return url;
}

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null;
  if (token && !endpoint.startsWith('/auth/')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { ...options, headers };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem('admin_token');
      window.location.href = '/login';
      throw new Error(data.message || 'Unauthorized');
    }
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Brands
export const brandsApi = {
  getAll: (activeOnly = false) => apiRequest(`/brands?activeOnly=${activeOnly}`),
  getById: (id) => apiRequest(`/brands/${id}`),
  create: (data) => apiRequest('/brands', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/brands/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/brands/${id}`, { method: 'DELETE' }),
};

// Categories
export const categoriesApi = {
  getAll: (activeOnly = false) => apiRequest(`/categories?activeOnly=${activeOnly}`),
  getById: (id) => apiRequest(`/categories/${id}`),
  create: (data) => apiRequest('/categories', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/categories/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
  getSizeTypes: (id) => apiRequest(`/categories/${id}/size-types`),
  addSizeType: (id, sizeTypeId) => apiRequest(`/categories/${id}/size-types`, { method: 'POST', body: { sizeTypeId } }),
};

// Sizes
export const sizesApi = {
  getSizeTypes: () => apiRequest('/sizes/types'),
  createSizeType: (data) => apiRequest('/sizes/types', { method: 'POST', body: data }),
  getAll: (sizeTypeId) => apiRequest(`/sizes${sizeTypeId ? `?sizeTypeId=${sizeTypeId}` : ''}`),
  getById: (id) => apiRequest(`/sizes/${id}`),
  create: (data) => apiRequest('/sizes', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/sizes/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/sizes/${id}`, { method: 'DELETE' }),
};

// Products
export const productsApi = {
  getAll: (categoryId, activeOnly) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (activeOnly) params.append('activeOnly', 'true');
    return apiRequest(`/products?${params.toString()}`);
  },
  getById: (id) => apiRequest(`/products/${id}`),
  create: (data) => apiRequest('/products', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/products/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  addImage: (id, imageUrl) => apiRequest(`/products/${id}/images`, { method: 'POST', body: { imageUrl } }),
  removeImage: (id, imageUrl) => apiRequest(`/products/${id}/images`, { method: 'DELETE', body: { imageUrl } }),
};

// Banners
export const bannersApi = {
  getAll: (activeOnly = false) => apiRequest(`/banners?activeOnly=${activeOnly}`),
  getById: (id) => apiRequest(`/banners/${id}`),
  create: (data) => apiRequest('/banners', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/banners/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/banners/${id}`, { method: 'DELETE' }),
};

// Stock
export const stockApi = {
  getAll: (productId) => apiRequest(`/stock${productId ? `?productId=${productId}` : ''}`),
  getById: (id) => apiRequest(`/stock/${id}`),
  getByProductAndSize: (productId, sizeId) => apiRequest(`/stock/product/${productId}/size/${sizeId}`),
  create: (data) => apiRequest('/stock', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/stock/${id}`, { method: 'PATCH', body: data }),
  updateStock: (productId, sizeId, quantity) => apiRequest(`/stock/product/${productId}/size/${sizeId}`, { method: 'PATCH', body: { quantity } }),
  delete: (id) => apiRequest(`/stock/${id}`, { method: 'DELETE' }),
};

// Orders
export const ordersApi = {
  getAll: (status) => apiRequest(`/orders${status ? `?status=${status}` : ''}`),
  getById: (id) => apiRequest(`/orders/${id}`),
  update: (id, data) => apiRequest(`/orders/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
};

// Auth
export const authApi = {
  getStatus: () => apiRequest('/auth/status'),
  register: (password) => apiRequest('/auth/register', { method: 'POST', body: { password } }),
  login: (password) => apiRequest('/auth/login', { method: 'POST', body: { password } }),
};
