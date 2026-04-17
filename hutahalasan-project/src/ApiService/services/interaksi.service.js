// ============================================================
// services/interaksi.service.js
// View, Like, Komentar, dan Insight konten
// Semua orang (login / tidak) bisa berinteraksi
// ============================================================

import { api } from "../api.config.js";

// Session ID untuk pengunjung yang belum login
// Disimpan di localStorage agar konsisten selama satu sesi browser
const getSessionId = () => {
  let sid = localStorage.getItem("session_id");
  if (!sid) {
    sid = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("session_id", sid);
  }
  return sid;
};

const InteraksiService = {
  // ── Catat view konten ────────────────────────────────────────────────────
  // Panggil saat user membuka halaman detail konten / file
  recordView: async ({ id_konten = null, id_file = null }) => {
    const body = { session_id: getSessionId() };
    if (id_konten) body.id_konten = id_konten;
    if (id_file) body.id_file = id_file;

    return await api.post("/interaksi/view", body);
    // Response: { success: true, message: 'View dicatat.', session_id: '...' }
  },

  // ── Toggle like (like / unlike) ──────────────────────────────────────────
  // Return: { liked: true/false, total: 42 }
  toggleLike: async ({ id_konten = null, id_file = null }) => {
    const body = { session_id: getSessionId() };
    if (id_konten) body.id_konten = id_konten;
    if (id_file) body.id_file = id_file;

    return await api.post("/interaksi/like", body);
    // Response: { success: true, liked: true, total: 43, session_id: '...' }
  },

  // ── Ambil total like suatu konten / file ─────────────────────────────────
  getLikeCount: async ({ id_konten = null, id_file = null }) => {
    const query = new URLSearchParams();
    if (id_konten) query.set("id_konten", id_konten);
    if (id_file) query.set("id_file", id_file);

    return await api.get(`/interaksi/like?${query.toString()}`);
    // Response: { success: true, total: 42 }
  },

  // ── Tambah komentar ──────────────────────────────────────────────────────
  // Siapapun bisa komentar (login / tidak)
  addKomentar: async ({ id_konten = null, id_file = null, isi_komentar }) => {
    const body = { isi_komentar, session_id: getSessionId() };
    if (id_konten) body.id_konten = id_konten;
    if (id_file) body.id_file = id_file;

    return await api.post("/interaksi/komentar", body);
    // Response: { success: true, message: 'Komentar berhasil ditambahkan.', session_id: '...' }
  },

  // ── Ambil komentar aktif (publik) ────────────────────────────────────────
  getKomentar: async ({
    id_konten = null,
    id_file = null,
    page = 1,
    limit = 20,
  }) => {
    const query = new URLSearchParams({ page, limit });
    if (id_konten) query.set("id_konten", id_konten);
    if (id_file) query.set("id_file", id_file);

    return await api.get(`/interaksi/komentar?${query.toString()}`);
    // Response: { success: true, data: [{ id_interaksi, isi_komentar, nama_user, waktu_interaksi }], total, page, limit }
  },

  // ── Semua komentar termasuk yang dihapus (Manajer / Pengembang) ──────────
  getAllKomentar: async ({
    id_konten = null,
    id_file = null,
    page = 1,
    limit = 20,
  }) => {
    const query = new URLSearchParams({ page, limit });
    if (id_konten) query.set("id_konten", id_konten);
    if (id_file) query.set("id_file", id_file);

    return await api.get(`/interaksi/komentar/semua?${query.toString()}`);
    // Response: { success: true, data: [{ ..., status_komentar: 'aktif'|'dihapus' }] }
  },

  // ── Hapus komentar (Manajer / Pengembang) ────────────────────────────────
  deleteKomentar: async (id_interaksi) => {
    return await api.delete(`/interaksi/komentar/${id_interaksi}`);
    // Response: { success: true, message: 'Komentar berhasil dihapus.' }
  },

  // ── Insight akumulasi semua konten (Manajer / Pengembang) ────────────────
  // tipe: 'konten' | 'pengetahuan' | (kosong = semua)
  getInsightAll: async ({ page = 1, limit = 20, tipe = "" } = {}) => {
    const query = new URLSearchParams({ page, limit });
    if (tipe) query.set("tipe", tipe);

    return await api.get(`/interaksi/insight?${query.toString()}`);
    // Response: { success: true, data: [{ target_id, tipe, judul_atau_nama, total_view, total_like, total_komentar, komentar_aktif, komentar_dihapus }] }
  },

  // ── Insight konten spesifik (Manajer / Pengembang) ───────────────────────
  // target_id: id_konten atau id_file
  getInsightByTarget: async (target_id) => {
    return await api.get(`/interaksi/insight/${target_id}`);
    // Response: { success: true, insight: { target_id, tipe, total_view, total_like, total_komentar, ... } }
  },
};

export default InteraksiService;
