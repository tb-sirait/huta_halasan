// src/pages/Konten.jsx
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { KontenService, InteraksiService } from "../services/index.js";
import { formatDate, truncate, getInitials } from "../utils/helpers.js";
import "../styles/konten.css";

const JENIS = ["", "Berita", "Edukasi"];
const STATUS = ["", "sudah", "belum"];
const PER_PAGE = 10;

export const Konten = () => {
  const { toast } = useOutletContext();
  const {
    user,
    canUpload,
    canValidate,
    isPengembang,
    isManajer,
    canDeleteKomentar,
  } = useAuth();

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [jenis, setJenis] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal form buat/edit
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Drawer detail
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [loadKomen, setLoadKomen] = useState(false);

  // Confirm hapus
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const searchTimer = useRef(null);

  const fetchList = async (pg = page) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: PER_PAGE };
      if (search) params.search = search;
      if (jenis) params.jenis_konten = jenis;
      if (status) params.status_validasi = status;
      // Jurnalis hanya lihat konten miliknya
      if (!isPengembang && !isManajer && !canValidate)
        params.id_user = user?.id_user;

      const res = await KontenService.getAll(params);
      setList(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchList(1);
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [search, jenis, status]);

  useEffect(() => {
    fetchList(page);
  }, [page]);

  // ── Detail drawer ──
  const openDetail = async (item) => {
    setDetailData(item);
    setShowDetail(true);
    setKomentar([]);
    setLoadKomen(true);
    try {
      const params = canDeleteKomentar
        ? { id_konten: item.id_konten }
        : { id_konten: item.id_konten };
      const fn = canDeleteKomentar
        ? InteraksiService.getAllKomentar
        : InteraksiService.getKomentar;
      const res = await fn(params);
      setKomentar(res.data || []);
    } catch {
      /* silent */
    }
    setLoadKomen(false);
  };

  const handleDeleteKomen = async (id_interaksi) => {
    try {
      await InteraksiService.deleteKomentar(id_interaksi);
      setKomentar((prev) =>
        prev.map((k) =>
          k.id_interaksi === id_interaksi
            ? { ...k, status_komentar: "dihapus", isi_komentar: "[Dihapus]" }
            : k,
        ),
      );
      toast.success("Komentar dihapus.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Validasi ──
  const handleValidasi = async (id_konten, current) => {
    const next = current === "sudah" ? "belum" : "sudah";
    try {
      await KontenService.updateValidasi(id_konten, next);
      toast.success(`Status validasi diubah ke "${next}".`);
      fetchList(page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Hapus ──
  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await KontenService.delete(confirmId);
      toast.success("Konten berhasil dihapus.");
      setConfirmId(null);
      fetchList(page);
    } catch (err) {
      toast.error(err.message);
    }
    setDeleting(false);
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Konten Berita & Edukasi</h1>
          <p className="page-subtitle">{total} konten ditemukan</p>
        </div>
        {canUpload && (
          <div className="page-header-right">
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditData(null);
                setShowForm(true);
              }}
            >
              + Buat Konten
            </button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="konten-toolbar">
        <div className="konten-search-wrap">
          <span className="konten-search-icon">⌕</span>
          <input
            className="konten-search-input"
            placeholder="Cari judul konten…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="konten-filter-select"
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
        >
          <option value="">Semua Jenis</option>
          <option value="Berita">Berita</option>
          <option value="Edukasi">Edukasi</option>
        </select>
        <select
          className="konten-filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="sudah">Sudah Validasi</option>
          <option value="belum">Belum Validasi</option>
        </select>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => fetchList(page)}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div className="konten-table-wrap">
        <table className="shared-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Jenis</th>
              <th>Penulis</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}>
                      <div
                        className="dashboard-skeleton"
                        style={{ height: 14, width: "80%" }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📄</div>
                    <p>Belum ada konten.</p>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id_konten}>
                  <td style={{ maxWidth: 240 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}
                    >
                      {truncate(item.judul, 50)}
                    </div>
                    {item.tagline && (
                      <div style={{ fontSize: 11, color: "var(--c-text-dim)" }}>
                        {item.tagline}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge badge-${item.jenis_konten?.toLowerCase()}`}
                    >
                      {item.jenis_konten}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--c-text-muted)" }}>
                    {item.penulis}
                  </td>
                  <td>
                    <span className={`badge badge-${item.status_validasi}`}>
                      {item.status_validasi === "sudah"
                        ? "✓ Tervalidasi"
                        : "⏳ Menunggu"}
                    </span>
                  </td>
                  <td
                    style={{
                      fontSize: 12,
                      color: "var(--c-text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(item.tanggal_dibuat)}
                  </td>
                  <td>
                    <div className="konten-actions">
                      <button
                        className="konten-action-btn konten-action-btn-info"
                        title="Lihat Detail"
                        onClick={() => openDetail(item)}
                      >
                        👁
                      </button>
                      {canUpload &&
                        (isPengembang || item.id_user === user?.id_user) && (
                          <button
                            className="konten-action-btn konten-action-btn-edit"
                            title="Edit"
                            onClick={() => {
                              setEditData(item);
                              setShowForm(true);
                            }}
                          >
                            ✎
                          </button>
                        )}
                      {canValidate && (
                        <button
                          className="konten-action-btn konten-action-btn-valid"
                          title={
                            item.status_validasi === "sudah"
                              ? "Batalkan Validasi"
                              : "Validasi"
                          }
                          onClick={() =>
                            handleValidasi(item.id_konten, item.status_validasi)
                          }
                        >
                          {item.status_validasi === "sudah" ? "✗" : "✓"}
                        </button>
                      )}
                      {(isPengembang ||
                        isManajer ||
                        item.id_user === user?.id_user) && (
                        <button
                          className="konten-action-btn konten-action-btn-delete"
                          title="Hapus"
                          onClick={() => setConfirmId(item.id_konten)}
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(1)}>
            «
          </button>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = page <= 4 ? i + 1 : page - 3 + i;
            if (pg < 1 || pg > totalPages) return null;
            return (
              <button
                key={pg}
                className={page === pg ? "active" : ""}
                onClick={() => setPage(pg)}
              >
                {pg}
              </button>
            );
          })}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            »
          </button>
        </div>
      )}

      {/* ── Modal Form Buat / Edit ── */}
      {showForm && (
        <KontenFormModal
          initial={editData}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchList(page);
            toast.success(
              editData ? "Konten diperbarui." : "Konten berhasil dibuat.",
            );
          }}
          toast={toast}
        />
      )}

      {/* ── Drawer Detail ── */}
      {showDetail && detailData && (
        <div
          className="konten-detail-overlay"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="konten-detail-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="konten-detail-header">
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                Detail Konten
              </span>
              <button
                className="konten-modal-close"
                onClick={() => setShowDetail(false)}
              >
                ✕
              </button>
            </div>
            <div className="konten-detail-body">
              <div className="konten-detail-section">
                <div className="konten-detail-section-label">Judul</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--c-text)",
                  }}
                >
                  {detailData.judul}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div className="konten-detail-section">
                  <div className="konten-detail-section-label">Jenis</div>
                  <span
                    className={`badge badge-${detailData.jenis_konten?.toLowerCase()}`}
                  >
                    {detailData.jenis_konten}
                  </span>
                </div>
                <div className="konten-detail-section">
                  <div className="konten-detail-section-label">Status</div>
                  <span className={`badge badge-${detailData.status_validasi}`}>
                    {detailData.status_validasi === "sudah"
                      ? "✓ Tervalidasi"
                      : "⏳ Menunggu"}
                  </span>
                </div>
                <div className="konten-detail-section">
                  <div className="konten-detail-section-label">Penulis</div>
                  <div className="konten-detail-text">{detailData.penulis}</div>
                </div>
                <div className="konten-detail-section">
                  <div className="konten-detail-section-label">Tanggal</div>
                  <div className="konten-detail-text">
                    {formatDate(detailData.tanggal_dibuat)}
                  </div>
                </div>
              </div>
              {detailData.tagline && (
                <div className="konten-detail-section">
                  <div className="konten-detail-section-label">Tagline</div>
                  <div className="konten-detail-text">{detailData.tagline}</div>
                </div>
              )}
              <div className="konten-detail-section">
                <div className="konten-detail-section-label">Isi Konten</div>
                <div
                  className="konten-detail-text"
                  style={{ maxHeight: 200, overflowY: "auto" }}
                >
                  {detailData.isi_konten || "—"}
                </div>
              </div>

              {/* Komentar */}
              <div className="konten-detail-section">
                <div
                  className="konten-detail-section-label"
                  style={{ marginBottom: 12 }}
                >
                  Komentar ({komentar.length})
                </div>
                {loadKomen ? (
                  <div style={{ color: "var(--c-text-muted)", fontSize: 13 }}>
                    Memuat komentar…
                  </div>
                ) : komentar.length === 0 ? (
                  <div style={{ color: "var(--c-text-dim)", fontSize: 13 }}>
                    Belum ada komentar.
                  </div>
                ) : (
                  komentar.map((k) => (
                    <div
                      key={k.id_interaksi}
                      className={`konten-detail-komentar-item${k.status_komentar === "dihapus" ? " konten-detail-komentar-deleted" : ""}`}
                    >
                      <div className="konten-detail-komentar-avatar">
                        {getInitials(k.nama_user)}
                      </div>
                      <div className="konten-detail-komentar-body">
                        <div className="konten-detail-komentar-name">
                          {k.nama_user}
                        </div>
                        <div className="konten-detail-komentar-text">
                          {k.isi_komentar}
                        </div>
                        <div className="konten-detail-komentar-time">
                          {formatDate(k.waktu_interaksi)}
                        </div>
                      </div>
                      {canDeleteKomentar && k.status_komentar === "aktif" && (
                        <button
                          className="konten-action-btn konten-action-btn-delete"
                          style={{ flexShrink: 0 }}
                          onClick={() => handleDeleteKomen(k.id_interaksi)}
                          title="Hapus komentar"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm delete ── */}
      {confirmId && (
        <div className="konten-modal-overlay">
          <div
            style={{
              background: "var(--c-surface)",
              border: "1px solid var(--c-border2)",
              borderRadius: "var(--r-lg)",
              padding: 32,
              maxWidth: 360,
              width: "90%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 16 }}>🗑</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              Hapus Konten?
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--c-text-muted)",
                marginBottom: 24,
              }}
            >
              Tindakan ini tidak dapat dibatalkan. Seluruh interaksi konten juga
              akan terhapus.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmId(null)}
              >
                Batal
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Menghapus…" : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-komponen: Form Modal ──────────────────────────────────────────────────
const KontenFormModal = ({ initial, onClose, onSuccess, toast }) => {
  const { user } = useAuth();
  const isEdit = !!initial;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    judul: initial?.judul || "",
    penulis: initial?.penulis || user?.nama_user || "",
    isi_konten: initial?.isi_konten || "",
    jenis_konten: initial?.jenis_konten || "Berita",
    tagline: initial?.tagline || "",
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files).slice(0, 3);
    setFiles(picked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul || !form.isi_konten || !form.jenis_konten) {
      toast.warning("Judul, isi konten, dan jenis konten wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await KontenService.update(initial.id_konten, form);
      } else {
        await KontenService.create({ ...form, gambar: files });
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="konten-modal-overlay">
      <div className="konten-modal-box">
        <div className="konten-modal-header">
          <span className="konten-modal-title">
            {isEdit ? "Edit Konten" : "Buat Konten Baru"}
          </span>
          <button className="konten-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="konten-modal-body">
            <div className="field-group">
              <label>Judul *</label>
              <input
                className="field-input"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                placeholder="Judul konten…"
              />
            </div>
            <div className="konten-modal-row">
              <div className="field-group">
                <label>Penulis *</label>
                <input
                  className="field-input"
                  name="penulis"
                  value={form.penulis}
                  onChange={handleChange}
                  placeholder="Nama penulis"
                />
              </div>
              <div className="field-group">
                <label>Jenis Konten *</label>
                <select
                  className="field-input"
                  name="jenis_konten"
                  value={form.jenis_konten}
                  onChange={handleChange}
                >
                  <option value="Berita">Berita</option>
                  <option value="Edukasi">Edukasi</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <label>Tagline</label>
              <input
                className="field-input"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Contoh: Upacara, Tradisi, Parmalim"
              />
            </div>
            <div className="field-group">
              <label>Isi Konten * (min. 3 paragraf, maks 10.000 kata)</label>
              <textarea
                className="field-input konten-textarea"
                name="isi_konten"
                value={form.isi_konten}
                onChange={handleChange}
                placeholder={
                  "Paragraf pertama...\n\nParagraf kedua...\n\nParagraf ketiga..."
                }
              />
            </div>
            {!isEdit && (
              <div className="field-group">
                <label>Gambar (maks. 3 file)</label>
                <div
                  className="konten-upload-zone"
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="konten-upload-zone-icon">🖼</div>
                  <div className="konten-upload-zone-text">
                    Klik untuk pilih gambar
                  </div>
                  <div className="konten-upload-zone-hint">
                    JPG, PNG, WEBP — maks 50MB
                  </div>
                  {files.length > 0 && (
                    <div className="konten-upload-preview">
                      {files.map((f, i) => (
                        <span key={i} className="konten-upload-preview-item">
                          📷 {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          <div className="konten-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? "Menyimpan…"
                : isEdit
                  ? "Simpan Perubahan"
                  : "Buat Konten"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
