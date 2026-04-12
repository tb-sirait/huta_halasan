// ============================================================
// services/pengetahuan.service.js
// CRUD file pengetahuan / E-Book
// ============================================================

import { api } from '../api.config.js';

const PengetahuanService = {

  // ── List file pengetahuan (publik) ───────────────────────────────────────
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page)            query.set('page', params.page);
    if (params.limit)           query.set('limit', params.limit);
    if (params.search)          query.set('search', params.search);
    if (params.status_validasi) query.set('status_validasi', params.status_validasi);
    if (params.id_user)         query.set('id_user', params.id_user);

    return await api.get(`/pengetahuan?${query.toString()}`);
    // Response: { success: true, data: [...], total: 50, page: 1, limit: 10 }
  },

  // ── Detail file pengetahuan ──────────────────────────────────────────────
  getById: async (id_file) => {
    return await api.get(`/pengetahuan/${id_file}`);
    // Response: { success: true, pengetahuan: { id_file, nama_file, path_file, deskripsi, tagline, ... } }
  },

  // ── Upload file pengetahuan baru (Admin: Jurnalis / Pengembang) ───────────
  // tagline: array string maks 5, contoh: ['AI', 'Kesehatan']
  upload: async ({ nama_file, deskripsi, tagline = [], file }) => {
    const formData = new FormData();
    formData.append('nama_file', nama_file);
    formData.append('deskripsi', deskripsi);
    formData.append('tagline', JSON.stringify(tagline));
    formData.append('file', file); // input type="file" (PDF, EPUB, DOCX, dll)

    return await api.post('/pengetahuan', formData);
    // Response: { success: true, message: 'File pengetahuan berhasil diupload.' }
  },

  // ── Update metadata file (pemilik atau Pengembang) ────────────────────────
  update: async (id_file, { nama_file, deskripsi, tagline }) => {
    const body = {};
    if (nama_file)           body.nama_file = nama_file;
    if (deskripsi)           body.deskripsi = deskripsi;
    if (tagline !== undefined) body.tagline = JSON.stringify(tagline);

    return await api.put(`/pengetahuan/${id_file}`, body);
    // Response: { success: true, message: 'File pengetahuan berhasil diperbarui.' }
  },

  // ── Ubah status validasi (Admin: Validator) ───────────────────────────────
  updateValidasi: async (id_file, status_validasi) => {
    return await api.patch(`/pengetahuan/${id_file}/validasi`, { status_validasi });
    // Response: { success: true, message: 'Status validasi diubah...' }
  },

  // ── Hapus file (pemilik / Pengembang / Manajer) ───────────────────────────
  delete: async (id_file) => {
    return await api.delete(`/pengetahuan/${id_file}`);
    // Response: { success: true, message: 'File pengetahuan berhasil dihapus.' }
  },

  // ── Lihat perancang file (Pengembang / Manajer) ───────────────────────────
  getRancang: async (id_file) => {
    return await api.get(`/pengetahuan/${id_file}/rancang`);
    // Response: { success: true, data: [{ id_rancang, nama_user, email, tanggal }] }
  },
};

export default PengetahuanService;
