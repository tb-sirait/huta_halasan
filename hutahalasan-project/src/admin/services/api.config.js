// src/services/api.config.js
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
    const token = TokenService.get();
    if (!token) return null;
    return TokenService.decode(token);
  },
  isAdmin: () => TokenService.getUser()?.role === "Admin",
  isSubrole: (subrole) => TokenService.getUser()?.subrole === subrole,
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
    const data = await response.json();
    if (response.status === 401) {
      TokenService.remove();
      window.dispatchEvent(new CustomEvent("auth:expired"));
      throw new ApiError(data.message || "Sesi habis.", 401);
    }
    if (!response.ok)
      throw new ApiError(
        data.message || "Terjadi kesalahan.",
        response.status,
        data,
      );
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Tidak dapat terhubung ke server.", 0);
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
