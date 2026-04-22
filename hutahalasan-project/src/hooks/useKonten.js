// src/hooks/useKonten.js
// Custom hook untuk mengambil data konten (Berita/Edukasi) dari API
import { useState, useEffect, useCallback, useRef } from 'react';
import { KontenService } from '../ApiService/services/konten.service.js';

// ── Hook: list konten dengan filter ──────────────────────────────────────────
export const useKontenList = ({ jenis_konten, limit = 10 } = {}) => {
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const timer                 = useRef(null);

  const fetchData = useCallback(async (pg = 1, q = search) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: pg, limit, jenis_konten };
      if (q) params.search = q;
      const res = await KontenService.getAll(params);
      setData(res.data || []);
      setTotal(res.total || 0);
      setPage(pg);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [jenis_konten, limit, search]);

  // Auto-fetch saat search berubah (debounced)
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchData(1, search), 400);
    return () => clearTimeout(timer.current);
  }, [search]);

  // Fetch pertama
  useEffect(() => { fetchData(1); }, [jenis_konten]);

  return {
    data, total, page, loading, error, search,
    setSearch,
    goToPage: (pg) => fetchData(pg),
    refresh:  () => fetchData(page),
    totalPages: Math.ceil(total / limit),
  };
};

// ── Hook: detail satu konten + interaksi ─────────────────────────────────────
export const useKontenDetail = (id_konten) => {
  const [konten, setKonten]     = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [loadKomen, setLoadKomen] = useState(false);
  const [error, setError]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id_konten) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailRes, likeRes] = await Promise.all([
          KontenService.getById(id_konten),
          KontenService.getLikeCount(id_konten),
        ]);
        setKonten(detailRes.konten);
        setLikeCount(likeRes.total || 0);
        // Catat view otomatis
        KontenService.recordView(id_konten).catch(() => {});
        // Ambil komentar
        setLoadKomen(true);
        const komen = await KontenService.getKomentar(id_konten);
        setKomentar(komen.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadKomen(false);
      }
    };
    load();
  }, [id_konten]);

  const handleLike = async () => {
    try {
      const res = await KontenService.toggleLike(id_konten);
      setLiked(res.liked);
      setLikeCount(res.total);
    } catch { /* silent */ }
  };

  const handleKomentar = async (isi_komentar) => {
    if (!isi_komentar?.trim()) return false;
    setSubmitting(true);
    try {
      await KontenService.addKomentar(id_konten, isi_komentar.trim());
      // Reload komentar
      const komen = await KontenService.getKomentar(id_konten);
      setKomentar(komen.data || []);
      return true;
    } catch { return false; }
    finally { setSubmitting(false); }
  };

  return {
    konten, komentar, likeCount, liked, loading, loadKomen, error, submitting,
    handleLike, handleKomentar,
  };
};

// ── Helper: format isi_konten menjadi array paragraf ─────────────────────────
export const parseParagraphs = (text = '') =>
  text.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);

// ── Helper: parse id_gambar JSON → array URL ──────────────────────────────────
export const parseGambar = (id_gambar, baseUrl = 'https://api.parmalimhutahalasan.com/uploads/images') => {
  try {
    const arr = typeof id_gambar === 'string' ? JSON.parse(id_gambar) : id_gambar;
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr.map((id) => `${baseUrl}/${id}`);
  } catch {
    return null;
  }
};

// ── Helper: format angka ──────────────────────────────────────────────────────
export const fmtNum = (n = 0) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'Jt';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'k';
  return String(n);
};

// ── Helper: format tanggal ────────────────────────────────────────────────────
export const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

// ── Helper: relative time ─────────────────────────────────────────────────────
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)  return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7)   return `${d} hari lalu`;
  return fmtDate(dateStr);
};
