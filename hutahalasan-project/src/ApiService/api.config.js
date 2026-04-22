// ApiService/api.config.js
// Base URL API backend
export const API_BASE_URL = 'https://api.parmalimhutahalasan.com/api';

// ── Session ID untuk anonim (like, komentar, view) ────────────────────────────
export const getSessionId = () => {
  let sid = localStorage.getItem('session_id');
  if (!sid) {
    sid = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('session_id', sid);
  }
  return sid;
};

// ── Custom error ──────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
  }
}

// ── Base fetch (public — tidak perlu token) ───────────────────────────────────
const publicFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  };
  try {
    const res  = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new ApiError(data.message || 'Terjadi kesalahan.', res.status);
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Tidak dapat terhubung ke server.', 0);
  }
};

export const publicApi = {
  get:  (endpoint, opts = {}) => publicFetch(endpoint, { method: 'GET', ...opts }),
  post: (endpoint, body, opts = {}) =>
    publicFetch(endpoint, { method: 'POST', body: JSON.stringify(body), ...opts }),
};