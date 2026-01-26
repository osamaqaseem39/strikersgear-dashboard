const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://strikersgear-api.vercel.app';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
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
  login: (password) => apiRequest('/auth/login', { method: 'POST', body: { password } }),
};
