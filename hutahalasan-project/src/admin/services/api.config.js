// src/admin/services/api.config.js
export const API_BASE_URL = "https://api.parmalimhutahalasan.com/api";

export const TokenService = {
  get: () => localStorage.getItem("token"),
  set: (token) => localStorage.setItem("token", token),
  remove: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  decode: (token) => {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  },
  isValid: () => {
    const token = TokenService.get();
    if (!token) return false;
    const payload = TokenService.decode(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 > Date.now();
  },
  getUser: () => {
    const t = TokenService.get();
    return t ? TokenService.decode(t) : null;
  },
  isAdmin: () => TokenService.getUser()?.role === "Admin",
  isSubrole: (s) => TokenService.getUser()?.subrole === s,
  isPengembang: () => TokenService.isSubrole("Pengembang"),
  isManajer: () => TokenService.isSubrole("Manajer"),
  isValidator: () => TokenService.isSubrole("Validator"),
  isJurnalis: () => TokenService.isSubrole("Jurnalis"),
};

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const apiFetch = async (endpoint, options = {}) => {
  const token = TokenService.get();
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const isFormData = options.body instanceof FormData;
  if (isFormData) delete defaultHeaders["Content-Type"];

  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Coba parse JSON — kalau gagal (misal HTML error page), tangani gracefully
    let data;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // eslint-disable-next-line no-unused-vars
      const text = await response.text();
      // Server mengembalikan non-JSON (misal HTML 500 page)
      throw new ApiError(
        `Server error (${response.status}). Coba lagi nanti.`,
        response.status,
      );
    }

    // 401 hanya dispatch auth:expired jika BUKAN di halaman login
    if (response.status === 401) {
      const isLoginPage = window.location.pathname.includes("/login");
      if (!isLoginPage) {
        TokenService.remove();
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
      // Selalu throw ApiError dengan pesan yang jelas
      throw new ApiError(
        data.message || "Email atau password salah.",
        401,
        data,
      );
    }

    // 404 — kembalikan sebagai ApiError, jangan crash
    if (response.status === 404) {
      throw new ApiError(data.message || "Data tidak ditemukan.", 404, data);
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `Terjadi kesalahan (${response.status}).`,
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Network error / fetch gagal sama sekali
    throw new ApiError(
      "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      0,
    );
  }
};

export const api = {
  get: (endpoint, opts = {}) => apiFetch(endpoint, { method: "GET", ...opts }),
  post: (endpoint, body, opts = {}) =>
    apiFetch(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),
  put: (endpoint, body, opts = {}) =>
    apiFetch(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),
  patch: (endpoint, body, opts = {}) =>
    apiFetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...opts,
    }),
  delete: (endpoint, opts = {}) =>
    apiFetch(endpoint, { method: "DELETE", ...opts }),
};
