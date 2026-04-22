// src/hooks/usePengetahuan.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { PengetahuanService } from '../ApiService/services/pengetahuan.service.js';
import { fmtDate, timeAgo, fmtNum } from './useKonten.js';

// ── Hook: list file pengetahuan ───────────────────────────────────────────────
export const usePengetahuanList = ({ limit = 10 } = {}) => {
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
      const params = { page: pg, limit };
      if (q) params.search = q;
      const res = await PengetahuanService.getAll(params);
      setData(res.data || []);
      setTotal(res.total || 0);
      setPage(pg);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit, search]);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchData(1, search), 400);
    return () => clearTimeout(timer.current);
  }, [search]);

  useEffect(() => { fetchData(1); }, []);

  return {
    data, total, page, loading, error, search,
    setSearch,
    goToPage: (pg) => fetchData(pg),
    refresh:  () => fetchData(page),
    totalPages: Math.ceil(total / limit),
  };
};

// ── Hook: detail satu file pengetahuan ───────────────────────────────────────
export const usePengetahuanDetail = (id_file) => {
  const [item, setItem]         = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [loadKomen, setLoadKomen] = useState(false);
  const [error, setError]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id_file) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [res, likeRes] = await Promise.all([
          PengetahuanService.getById(id_file),
          PengetahuanService.getLikeCount(id_file),
        ]);
        setItem(res.pengetahuan);
        setLikeCount(likeRes.total || 0);
        PengetahuanService.recordView(id_file).catch(() => {});
        setLoadKomen(true);
        const komen = await PengetahuanService.getKomentar(id_file);
        setKomentar(komen.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadKomen(false);
      }
    };
    load();
  }, [id_file]);

  const handleLike = async () => {
    try {
      const res = await PengetahuanService.toggleLike(id_file);
      setLiked(res.liked);
      setLikeCount(res.total);
    } catch { /* silent */ }
  };

  const handleKomentar = async (isi_komentar) => {
    if (!isi_komentar?.trim()) return false;
    setSubmitting(true);
    try {
      await PengetahuanService.addKomentar(id_file, isi_komentar.trim());
      const komen = await PengetahuanService.getKomentar(id_file);
      setKomentar(komen.data || []);
      return true;
    } catch { return false; }
    finally { setSubmitting(false); }
  };

  // Parse tagline dari JSON string → array
  const taglineArr = (() => {
    if (!item?.tagline) return [];
    try {
      return typeof item.tagline === 'string'
        ? JSON.parse(item.tagline)
        : item.tagline;
    } catch { return []; }
  })();

  return {
    item, komentar, likeCount, liked, loading, loadKomen, error, submitting,
    taglineArr, handleLike, handleKomentar,
  };
};

export { fmtDate, timeAgo, fmtNum };
