// ============================================================
// api.config.js
// Konfigurasi base URL dan helper fetch utama
// ============================================================

export const API_BASE_URL = 'https://api.parmalimhutahalasan.com/api';

// ── Token management ─────────────────────────────────────────────────────────
export const TokenService = {
  get: ()           => localStorage.getItem('token'),
  set: (token)      => localStorage.setItem('token', token),
  remove: ()        => localStorage.removeItem('token'),

  // Decode payload JWT tanpa library (tidak verifikasi signature)
  decode: (token) => {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  },

  // Cek apakah token masih valid (belum expired)
  isValid: () => {
    const token = TokenService.get();
    if (!token) return false;
    const payload = TokenService.decode(token);
    if (!payload?.exp) return false;
    // exp dalam detik, Date.now() dalam milidetik
    return payload.exp * 1000 > Date.now();
  },

  // Ambil data user dari payload token
  getUser: () => {
    const token = TokenService.get();
    if (!token) return null;
    return TokenService.decode(token);
  },

  // Cek role user
  isAdmin: () => TokenService.getUser()?.role === 'Admin',
  isSubrole: (subrole) => TokenService.getUser()?.subrole === subrole,
};

// ── Base fetch dengan error handling ─────────────────────────────────────────
const apiFetch = async (endpoint, options = {}) => {
  const token = TokenService.get();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Kalau body adalah FormData, hapus Content-Type agar browser set boundary sendiri
  const isFormData = options.body instanceof FormData;
  if (isFormData) delete defaultHeaders['Content-Type'];

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Token expired / tidak valid → hapus token dan redirect login
    if (response.status === 401) {
      TokenService.remove();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      throw new ApiError(data.message || 'Sesi habis. Silakan login kembali.', 401);
    }

    if (!response.ok) {
      throw new ApiError(data.message || 'Terjadi kesalahan.', response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Network error / server down
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 0);
  }
};

// ── Custom Error class ────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name    = 'ApiError';
    this.status  = status;
    this.data    = data;
  }
}

// ── Shorthand methods ─────────────────────────────────────────────────────────
export const api = {
  get:    (endpoint, options = {})       => apiFetch(endpoint, { method: 'GET', ...options }),
  post:   (endpoint, body, options = {}) => apiFetch(endpoint, { method: 'POST',   body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
  put:    (endpoint, body, options = {}) => apiFetch(endpoint, { method: 'PUT',    body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
  patch:  (endpoint, body, options = {}) => apiFetch(endpoint, { method: 'PATCH',  body: JSON.stringify(body), ...options }),
  delete: (endpoint, options = {})       => apiFetch(endpoint, { method: 'DELETE', ...options }),
};

export default api;
