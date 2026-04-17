// src/pages/Pengetahuan.jsx
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { PengetahuanService } from "../services/index.js";
import { formatDate, truncate } from "../utils/helpers.js";
import "../styles/konten.css";

const PER_PAGE = 10;

export const Pengetahuan = () => {
  const { toast } = useOutletContext();
  const { user, canUpload, canValidate, isPengembang, isManajer } = useAuth();

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const searchTimer = useRef(null);

  const fetchList = async (pg = page) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: PER_PAGE };
      if (search) params.search = search;
      if (status) params.status_validasi = status;
      if (!isPengembang && !isManajer && !canValidate)
        params.id_user = user?.id_user;
      const res = await PengetahuanService.getAll(params);
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
  }, [search, status]);

  useEffect(() => {
    fetchList(page);
  }, [page]);

  const openDetail = async (item) => {
    setDetailData(null);
    setShowDetail(true);
    try {
      const res = await PengetahuanService.getById(item.id_file);
      setDetailData(res.pengetahuan);
    } catch {
      setDetailData(item);
    }
  };

  const handleValidasi = async (id_file, current) => {
    const next = current === "sudah" ? "belum" : "sudah";
    try {
      await PengetahuanService.updateValidasi(id_file, next);
      toast.success(`Status validasi diubah ke "${next}".`);
      fetchList(page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await PengetahuanService.delete(confirmId);
      toast.success("File berhasil dihapus.");
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
          <h1 className="page-title">File Pengetahuan</h1>
          <p className="page-subtitle">{total} file ditemukan</p>
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
              + Upload File
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
            placeholder="Cari nama file…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
              <th>Nama File</th>
              <th>Tagline</th>
              <th>Uploader</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
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
                    <div className="empty-state-icon">📚</div>
                    <p>Belum ada file pengetahuan.</p>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id_file}>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {truncate(item.nama_file, 40)}
                    </div>
                  </td>
                  <td style={{ maxWidth: 180 }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(typeof item.tagline === "string"
                        ? JSON.parse(item.tagline || "[]")
                        : item.tagline || []
                      )
                        .slice(0, 3)
                        .map((t, i) => (
                          <span
                            key={i}
                            className="badge"
                            style={{
                              background: "var(--c-surface2)",
                              color: "var(--c-text-muted)",
                              fontSize: 10,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--c-text-muted)" }}>
                    {item.nama_uploader || "—"}
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
                    {formatDate(item.tanggal_upload)}
                  </td>
                  <td>
                    <div className="konten-actions">
                      <button
                        className="konten-action-btn konten-action-btn-info"
                        title="Detail"
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
                              ? "Batalkan"
                              : "Validasi"
                          }
                          onClick={() =>
                            handleValidasi(item.id_file, item.status_validasi)
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
                          onClick={() => setConfirmId(item.id_file)}
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

      {/* Form Modal */}
      {showForm && (
        <PengetahuanFormModal
          initial={editData}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchList(page);
            toast.success(
              editData ? "File diperbarui." : "File berhasil diupload.",
            );
          }}
          toast={toast}
        />
      )}

      {/* Detail Drawer */}
      {showDetail && (
        <div
          className="konten-detail-overlay"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="konten-detail-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="konten-detail-header">
              <span style={{ fontWeight: 700, fontSize: 15 }}>Detail File</span>
              <button
                className="konten-modal-close"
                onClick={() => setShowDetail(false)}
              >
                ✕
              </button>
            </div>
            <div className="konten-detail-body">
              {!detailData ? (
                <div style={{ color: "var(--c-text-muted)", padding: 20 }}>
                  Memuat…
                </div>
              ) : (
                <>
                  <div className="konten-detail-section">
                    <div className="konten-detail-section-label">Nama File</div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      {detailData.nama_file}
                    </div>
                  </div>
                  <div className="konten-detail-section">
                    <div className="konten-detail-section-label">
                      Status Validasi
                    </div>
                    <span
                      className={`badge badge-${detailData.status_validasi}`}
                    >
                      {detailData.status_validasi === "sudah"
                        ? "✓ Tervalidasi"
                        : "⏳ Menunggu"}
                    </span>
                  </div>
                  <div className="konten-detail-section">
                    <div className="konten-detail-section-label">Tagline</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(typeof detailData.tagline === "string"
                        ? JSON.parse(detailData.tagline || "[]")
                        : detailData.tagline || []
                      ).map((t, i) => (
                        <span
                          key={i}
                          className="badge"
                          style={{
                            background: "var(--c-surface2)",
                            color: "var(--c-text-muted)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="konten-detail-section">
                    <div className="konten-detail-section-label">Deskripsi</div>
                    <div
                      className="konten-detail-text"
                      style={{ maxHeight: 200, overflowY: "auto" }}
                    >
                      {detailData.deskripsi || "—"}
                    </div>
                  </div>
                  <div className="konten-detail-section">
                    <div className="konten-detail-section-label">Link File</div>
                    <a
                      href={detailData.path_file}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "var(--c-accent)",
                        fontSize: 13,
                        wordBreak: "break-all",
                      }}
                    >
                      {detailData.path_file}
                    </a>
                  </div>
                  <div className="konten-detail-section">
                    <div className="konten-detail-section-label">Uploader</div>
                    <div className="konten-detail-text">
                      {detailData.nama_uploader || "—"}
                    </div>
                  </div>
                  <div className="konten-detail-section">
                    <div className="konten-detail-section-label">Validator</div>
                    <div className="konten-detail-text">
                      {detailData.nama_validator || "Belum ada"}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
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
              Hapus File?
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--c-text-muted)",
                marginBottom: 24,
              }}
            >
              File dan seluruh data interaksinya akan terhapus permanen.
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

// ── Form Modal Pengetahuan ────────────────────────────────────────────────────
const PengetahuanFormModal = ({ initial, onClose, onSuccess, toast }) => {
  const isEdit = !!initial;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    nama_file: initial?.nama_file || "",
    deskripsi: initial?.deskripsi || "",
    tagline: (typeof initial?.tagline === "string"
      ? JSON.parse(initial.tagline || "[]")
      : initial?.tagline || []
    ).join(", "),
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_file || !form.deskripsi) {
      toast.warning("Nama file dan deskripsi wajib diisi.");
      return;
    }
    if (!isEdit && !file) {
      toast.warning("File wajib dipilih.");
      return;
    }
    setSaving(true);
    try {
      const taglineArr = form.tagline
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5);
      if (isEdit) {
        await PengetahuanService.update(initial.id_file, {
          ...form,
          tagline: taglineArr,
        });
      } else {
        await PengetahuanService.upload({ ...form, tagline: taglineArr, file });
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
            {isEdit ? "Edit File Pengetahuan" : "Upload File Pengetahuan"}
          </span>
          <button className="konten-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="konten-modal-body">
            <div className="field-group">
              <label>Nama File *</label>
              <input
                className="field-input"
                name="nama_file"
                value={form.nama_file}
                onChange={handleChange}
                placeholder="Judul / nama dokumen…"
              />
            </div>
            <div className="field-group">
              <label>Tagline (pisahkan koma, maks 5)</label>
              <input
                className="field-input"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="AI, Kesehatan, Budaya"
              />
            </div>
            <div className="field-group">
              <label>Deskripsi * (maks 5.000 kata)</label>
              <textarea
                className="field-input konten-textarea"
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi isi dokumen…"
              />
            </div>
            {!isEdit && (
              <div className="field-group">
                <label>File *</label>
                <div
                  className="konten-upload-zone"
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="konten-upload-zone-icon">📄</div>
                  <div className="konten-upload-zone-text">
                    {file ? `✓ ${file.name}` : "Klik untuk pilih file"}
                  </div>
                  <div className="konten-upload-zone-hint">
                    PDF, EPUB, DOCX, PPTX — maks 50MB
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.epub,.docx,.doc,.pptx,.xlsx"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
          <div className="konten-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Menyimpan…" : isEdit ? "Simpan" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
