// ============================================================
// services/auth.service.js
// Autentikasi: register, login, profil, logout
// ============================================================

import { api, TokenService } from "../api.config.js";

const AuthService = {
  // ── Register akun baru ───────────────────────────────────────────────────
  // role: 'User' | 'Admin'
  // subrole (jika Admin): 'Validator' | 'Jurnalis' | 'Pengembang' | 'Manajer'
  register: async ({ nama_user, email, password, role = "User", subrole }) => {
    const body = { nama_user, email, password, role };
    if (role === "Admin" && subrole) body.subrole = subrole;
    return await api.post("/auth/register", body);
    // Response: { success: true, message: 'Registrasi berhasil.' }
  },

  // ── Login ─────────────────────────────────────────────────────────────────
  login: async ({ email, password }) => {
    const data = await api.post("/auth/login", { email, password });
    // Response: { success: true, token: '...', user: { id_user, nama_user, email, role, subrole } }

    if (data.token) {
      TokenService.set(data.token);
    }
    return data;
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: () => {
    TokenService.remove();
    // Opsional: redirect ke halaman login
    // window.location.href = '/login';
  },

  // ── Ambil profil user yang sedang login ───────────────────────────────────
  getProfile: async () => {
    return await api.get("/auth/profile");
    // Response: { success: true, user: { id_user, nama_user, email, role, subrole, ... } }
  },

  // ── Update profil sendiri (nama / password) ───────────────────────────────
  updateProfile: async ({ nama_user, password }) => {
    const body = {};
    if (nama_user) body.nama_user = nama_user;
    if (password) body.password = password;
    return await api.put("/auth/profile", body);
    // Response: { success: true, message: 'Profil berhasil diperbarui.' }
  },

  // ── Verifikasi token masih valid ──────────────────────────────────────────
  // Gunakan ini di setiap halaman yang butuh login (route guard)
  verifyToken: () => {
    if (!TokenService.isValid()) {
      TokenService.remove();
      return false;
    }
    return true;
  },

  // ── Ambil data user dari token (tanpa request ke server) ──────────────────
  getCurrentUser: () => TokenService.getUser(),

  // ── Cek apakah user punya akses tertentu ─────────────────────────────────
  can: {
    uploadKonten: () =>
      TokenService.isAdmin() &&
      ["Jurnalis", "Pengembang"].includes(TokenService.getUser()?.subrole),
    validateKonten: () =>
      TokenService.isAdmin() && TokenService.isSubrole("Validator"),
    deleteKomentar: () =>
      TokenService.isAdmin() &&
      ["Manajer", "Pengembang"].includes(TokenService.getUser()?.subrole),
    viewInsight: () =>
      TokenService.isAdmin() &&
      ["Manajer", "Pengembang"].includes(TokenService.getUser()?.subrole),
    manageUsers: () =>
      TokenService.isAdmin() && TokenService.isSubrole("Pengembang"),
  },
};

export default AuthService;
