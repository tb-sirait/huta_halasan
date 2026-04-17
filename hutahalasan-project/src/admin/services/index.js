// src/services/index.js
import { api, TokenService } from "./api.config.js";

// ── Auth ─────────────────────────────────────────────────────────────────────
export const AuthService = {
  login: async ({ email, password }) => {
    const data = await api.post("/auth/login", { email, password });
    if (data.token) TokenService.set(data.token);
    return data;
  },
  logout: () => TokenService.remove(),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (body) => api.put("/auth/profile", body),
  verifyToken: () => TokenService.isValid(),
  getCurrentUser: () => TokenService.getUser(),
};

// ── Konten ───────────────────────────────────────────────────────────────────
export const KontenService = {
  getAll: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && v !== "" && q.set(k, v),
    );
    return api.get(`/konten?${q}`);
  },
  getById: (id) => api.get(`/konten/${id}`),
  create: ({
    judul,
    penulis,
    isi_konten,
    jenis_konten,
    tagline,
    gambar = [],
  }) => {
    const fd = new FormData();
    fd.append("judul", judul);
    fd.append("penulis", penulis);
    fd.append("isi_konten", isi_konten);
    fd.append("jenis_konten", jenis_konten);
    if (tagline) fd.append("tagline", tagline);
    gambar.forEach((f) => fd.append("gambar", f));
    return api.post("/konten", fd);
  },
  update: (id, body) => api.put(`/konten/${id}`, body),
  updateValidasi: (id, status_validasi) =>
    api.patch(`/konten/${id}/validasi`, { status_validasi }),
  delete: (id) => api.delete(`/konten/${id}`),
  getRancang: (id) => api.get(`/konten/${id}/rancang`),
};

// ── Pengetahuan ───────────────────────────────────────────────────────────────
export const PengetahuanService = {
  getAll: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && v !== "" && q.set(k, v),
    );
    return api.get(`/pengetahuan?${q}`);
  },
  getById: (id) => api.get(`/pengetahuan/${id}`),
  upload: ({ nama_file, deskripsi, tagline = [], file }) => {
    const fd = new FormData();
    fd.append("nama_file", nama_file);
    fd.append("deskripsi", deskripsi);
    fd.append("tagline", JSON.stringify(tagline));
    fd.append("file", file);
    return api.post("/pengetahuan", fd);
  },
  update: (id, body) => api.put(`/pengetahuan/${id}`, body),
  updateValidasi: (id, status_validasi) =>
    api.patch(`/pengetahuan/${id}/validasi`, { status_validasi }),
  delete: (id) => api.delete(`/pengetahuan/${id}`),
};

// ── Interaksi ─────────────────────────────────────────────────────────────────
export const InteraksiService = {
  getInsightAll: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && v !== "" && q.set(k, v),
    );
    return api.get(`/interaksi/insight?${q}`);
  },
  getInsightByTarget: (id) => api.get(`/interaksi/insight/${id}`),
  getKomentar: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && v !== "" && q.set(k, v),
    );
    return api.get(`/interaksi/komentar?${q}`);
  },
  getAllKomentar: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && v !== "" && q.set(k, v),
    );
    return api.get(`/interaksi/komentar/semua?${q}`);
  },
  deleteKomentar: (id) => api.delete(`/interaksi/komentar/${id}`),
};

// ── User ─────────────────────────────────────────────────────────────────────
export const UserService = {
  getAll: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && v !== "" && q.set(k, v),
    );
    return api.get(`/users?${q}`);
  },
  getById: (id) => api.get(`/users/${id}`),
  update: (id, body) => api.put(`/users/${id}`, body),
  delete: (id) => api.delete(`/users/${id}`),
};

export { TokenService } from "./api.config.js";
