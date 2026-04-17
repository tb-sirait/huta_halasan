// ============================================================
// services/konten.service.js
// CRUD konten biasa (Berita / Edukasi)
// ============================================================

import { api } from "../api.config.js";

const KontenService = {
  // ── List konten (publik) ─────────────────────────────────────────────────
  // Params: page, limit, jenis_konten ('Berita'|'Edukasi'), search, status_validasi (Admin only)
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    if (params.jenis_konten) query.set("jenis_konten", params.jenis_konten);
    if (params.search) query.set("search", params.search);
    if (params.status_validasi)
      query.set("status_validasi", params.status_validasi);
    if (params.id_user) query.set("id_user", params.id_user);

    return await api.get(`/konten?${query.toString()}`);
    // Response: { success: true, data: [...], total: 100, page: 1, limit: 10 }
  },

  // ── Detail konten ────────────────────────────────────────────────────────
  getById: async (id_konten) => {
    return await api.get(`/konten/${id_konten}`);
    // Response: { success: true, konten: { id_konten, judul, isi_konten, penulis, ... } }
  },

  // ── Buat konten baru (Admin: Jurnalis / Pengembang) ──────────────────────
  // Mendukung upload gambar (maks 3 file)
  create: async ({
    judul,
    penulis,
    isi_konten,
    jenis_konten,
    tagline,
    gambar = [],
  }) => {
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("penulis", penulis);
    formData.append("isi_konten", isi_konten);
    formData.append("jenis_konten", jenis_konten); // 'Berita' atau 'Edukasi'
    if (tagline) formData.append("tagline", tagline);

    // Tambahkan file gambar (input type="file" multiple, maks 3)
    gambar.forEach((file) => formData.append("gambar", file));

    return await api.post("/konten", formData);
    // Response: { success: true, message: 'Konten berhasil dibuat.', id_konten: 'kid-xxx' }
  },

  // ── Update konten (pemilik atau Pengembang) ───────────────────────────────
  update: async (
    id_konten,
    { judul, penulis, isi_konten, jenis_konten, tagline },
  ) => {
    const body = {};
    if (judul) body.judul = judul;
    if (penulis) body.penulis = penulis;
    if (isi_konten) body.isi_konten = isi_konten;
    if (jenis_konten) body.jenis_konten = jenis_konten;
    if (tagline !== undefined) body.tagline = tagline;

    return await api.put(`/konten/${id_konten}`, body);
    // Response: { success: true, message: 'Konten berhasil diperbarui.' }
  },

  // ── Ubah status validasi (Admin: Validator) ───────────────────────────────
  // status_validasi: 'sudah' | 'belum'
  updateValidasi: async (id_konten, status_validasi) => {
    return await api.patch(`/konten/${id_konten}/validasi`, {
      status_validasi,
    });
    // Response: { success: true, message: 'Konten berhasil diubah statusnya...' }
  },

  // ── Hapus konten (pemilik / Pengembang / Manajer) ────────────────────────
  delete: async (id_konten) => {
    return await api.delete(`/konten/${id_konten}`);
    // Response: { success: true, message: 'Konten berhasil dihapus.' }
  },

  // ── Lihat siapa yang merancang konten (Pengembang / Manajer) ─────────────
  getRancang: async (id_konten) => {
    return await api.get(`/konten/${id_konten}/rancang`);
    // Response: { success: true, data: [{ id_rancang, nama_user, email, tanggal_isi_konten }] }
  },
};

export default KontenService;
