// ApiService/services/konten.service.js
// Digunakan oleh halaman News (jenis_konten=Berita)
// dan Education (jenis_konten=Edukasi)
import { publicApi, getSessionId } from "../api.config.js";

export const KontenService = {
  // ── List konten (hanya yang sudah divalidasi) ─────────────────────────────
  // params: { page, limit, jenis_konten, search }
  getAll: (params = {}) => {
    const q = new URLSearchParams({ status_validasi: "sudah" });
    if (params.page) q.set("page", params.page);
    if (params.limit) q.set("limit", params.limit);
    if (params.jenis_konten) q.set("jenis_konten", params.jenis_konten);
    if (params.search) q.set("search", params.search);
    return publicApi.get(`/konten?${q}`);
    // Response: { success: true, data: [...], total, page, limit }
  },

  // ── Detail konten by ID ───────────────────────────────────────────────────
  getById: (id_konten) => publicApi.get(`/konten/${id_konten}`),
  // Response: { success: true, konten: { id_konten, judul, penulis, isi_konten,
  //   jenis_konten, tagline, status_validasi, tanggal_dibuat, id_gambar,
  //   nama_penulis, nama_validator, total_interaksi } }

  // ── Catat view ────────────────────────────────────────────────────────────
  recordView: (id_konten) =>
    publicApi.post("/interaksi/view", {
      id_konten,
      session_id: getSessionId(),
    }),

  // ── Toggle like ───────────────────────────────────────────────────────────
  toggleLike: (id_konten) =>
    publicApi.post("/interaksi/like", {
      id_konten,
      session_id: getSessionId(),
    }),
  // Response: { success: true, liked: true/false, total: 42 }

  // ── Jumlah like ───────────────────────────────────────────────────────────
  getLikeCount: (id_konten) =>
    publicApi.get(`/interaksi/like?id_konten=${id_konten}`),

  // ── Ambil komentar aktif ──────────────────────────────────────────────────
  getKomentar: (id_konten, page = 1, limit = 20) =>
    publicApi.get(
      `/interaksi/komentar?id_konten=${id_konten}&page=${page}&limit=${limit}`,
    ),
  // Response: { success: true, data: [{ id_interaksi, nama_user, isi_komentar, waktu_interaksi }] }

  // ── Kirim komentar (anonim boleh) ─────────────────────────────────────────
  addKomentar: (id_konten, isi_komentar) =>
    publicApi.post("/interaksi/komentar", {
      id_konten,
      isi_komentar,
      session_id: getSessionId(),
    }),
};
