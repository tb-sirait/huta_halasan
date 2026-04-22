// ApiService/services/pengetahuan.service.js
// Digunakan oleh halaman Knowledge
import { publicApi, getSessionId } from '../api.config.js';

export const PengetahuanService = {

  // ── List file pengetahuan (hanya sudah divalidasi) ────────────────────────
  getAll: (params = {}) => {
    const q = new URLSearchParams({ status_validasi: 'sudah' });
    if (params.page)  q.set('page', params.page);
    if (params.limit) q.set('limit', params.limit);
    if (params.search) q.set('search', params.search);
    return publicApi.get(`/pengetahuan?${q}`);
    // Response: { success: true, data: [...], total, page, limit }
  },

  // ── Detail file by ID ─────────────────────────────────────────────────────
  getById: (id_file) => publicApi.get(`/pengetahuan/${id_file}`),
  // Response: { success: true, pengetahuan: { id_file, nama_file, path_file,
  //   deskripsi, tagline, status_validasi, tanggal_upload,
  //   nama_uploader, nama_validator } }

  // ── Catat view ────────────────────────────────────────────────────────────
  recordView: (id_file) =>
    publicApi.post('/interaksi/view', { id_file, session_id: getSessionId() }),

  // ── Toggle like ───────────────────────────────────────────────────────────
  toggleLike: (id_file) =>
    publicApi.post('/interaksi/like', { id_file, session_id: getSessionId() }),

  // ── Jumlah like ───────────────────────────────────────────────────────────
  getLikeCount: (id_file) =>
    publicApi.get(`/interaksi/like?id_file=${id_file}`),

  // ── Komentar aktif ────────────────────────────────────────────────────────
  getKomentar: (id_file, page = 1, limit = 20) =>
    publicApi.get(`/interaksi/komentar?id_file=${id_file}&page=${page}&limit=${limit}`),

  // ── Kirim komentar ────────────────────────────────────────────────────────
  addKomentar: (id_file, isi_komentar) =>
    publicApi.post('/interaksi/komentar', {
      id_file,
      isi_komentar,
      session_id: getSessionId(),
    }),
};