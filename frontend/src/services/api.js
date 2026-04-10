/**
 * Cliente HTTP centralizado.
 * Todas las llamadas a la API pasan por aquí.
 * El proxy de Vite redirige /api → http://localhost:8000
 */
import axios from 'axios'

// En desarrollo: /api (Vite proxy → localhost:8000)
// En producción: VITE_API_URL apunta al backend en Render
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ─── CATEGORÍAS ──────────────────────────────────────────────────────────────
export const api = {
  // Categorías
  getCategories: () => http.get('/categories/').then(r => r.data),
  createCategory: (data) => http.post('/categories/', data).then(r => r.data),
  deleteCategory: (id) => http.delete(`/categories/${id}`),

  // Productos
  getProducts: (params = {}) => http.get('/products/', { params }).then(r => r.data),
  getProduct: (id) => http.get(`/products/${id}`).then(r => r.data),
  createProduct: (data) => http.post('/products/', data).then(r => r.data),
  updateProduct: (id, data) => http.patch(`/products/${id}`, data).then(r => r.data),
  deleteProduct: (id) => http.delete(`/products/${id}`),
  bulkPriceUpdate: (data) => http.post('/products/bulk-price-update', data).then(r => r.data),

  // Configuración
  getSettings: () => http.get('/settings/').then(r => r.data),
  updateSettings: (data) => http.patch('/settings/', data).then(r => r.data),

  // Cotizaciones
  createQuote: (data) => http.post('/quotes/', data).then(r => r.data),
  getQuotes: () => http.get('/quotes/').then(r => r.data),
  getQuote: (id) => http.get(`/quotes/${id}`).then(r => r.data),
  deleteQuote: (id) => http.delete(`/quotes/${id}`),
}
