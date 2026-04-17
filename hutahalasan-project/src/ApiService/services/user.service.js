// ============================================================
// services/user.service.js
// Manajemen user — khusus Admin Pengembang & Manajer
// ============================================================

import { api } from "../api.config.js";

const UserService = {
  // ── List semua user (Pengembang / Manajer) ───────────────────────────────
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    if (params.role) query.set("role", params.role);
    if (params.subrole) query.set("subrole", params.subrole);

    return await api.get(`/users?${query.toString()}`);
    // Response: { success: true, data: [...], total, page, limit }
  },

  // ── Detail user ──────────────────────────────────────────────────────────
  getById: async (id_user) => {
    return await api.get(`/users/${id_user}`);
    // Response: { success: true, user: { id_user, nama_user, email, role, subrole, created_at } }
  },

  // ── Update user (Pengembang — bisa ubah role/subrole) ────────────────────
  // role: 'Admin' | 'User'
  // subrole: 'Validator' | 'Jurnalis' | 'Pengembang' | 'Manajer' | 'User'
  update: async (id_user, { nama_user, email, password, role, subrole }) => {
    const body = {};
    if (nama_user) body.nama_user = nama_user;
    if (email) body.email = email;
    if (password) body.password = password;
    if (role) body.role = role;
    if (subrole) body.subrole = subrole;

    return await api.put(`/users/${id_user}`, body);
    // Response: { success: true, message: 'User berhasil diperbarui.' }
  },

  // ── Hapus user (Pengembang) ───────────────────────────────────────────────
  delete: async (id_user) => {
    return await api.delete(`/users/${id_user}`);
    // Response: { success: true, message: 'User berhasil dihapus.' }
  },
};

export default UserService;
