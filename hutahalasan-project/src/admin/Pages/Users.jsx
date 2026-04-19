// src/pages/Users.jsx
import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { UserService, KontenService } from "../services/index.js";
import {
  formatDate,
  getInitials,
  subroleColor,
  truncate,
} from "../utils/helpers.js";
import "../styles/user.css";

const PER_PAGE = 15;
const SUBROLES_ADMIN = ["Validator", "Jurnalis", "Pengembang", "Manajer"];

export const Users = () => {
  const { toast } = useOutletContext();
  const { isPengembang } = useAuth();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [editUser, setEditUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [showKonten, setShowKonten] = useState(false);
  const [kontenUser, setKontenUser] = useState(null);
  const [kontenList, setKontenList] = useState([]);
  const [loadKonten, setLoadKonten] = useState(false);

  const searchTimer = useRef(null);

  useEffect(() => {
    if (!isPengembang) {
      navigate("/dashboard", { replace: true });
    }
  }, [isPengembang]);

  const fetchList = async (pg = page) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: PER_PAGE };
      if (roleFilter) params.role = roleFilter;
      const res = await UserService.getAll(params);
      let data = res.data || [];
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(
          (u) =>
            u.nama_user?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q),
        );
      }
      setList(data);
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
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [search, roleFilter]);

  useEffect(() => {
    fetchList(page);
  }, [page]);

  // ── Lihat konten milik user ──
  const openKontenUser = async (u) => {
    setKontenUser(u);
    setShowKonten(true);
    setKontenList([]);
    setLoadKonten(true);
    try {
      const res = await KontenService.getAll({ id_user: u.id_user, limit: 50 });
      setKontenList(res.data || []);
    } catch {
      /* silent */
    }
    setLoadKonten(false);
  };

  // ── Hapus ──
  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await UserService.delete(confirmDelete.id_user);
      toast.success(`User "${confirmDelete.nama_user}" berhasil dihapus.`);
      setConfirmDelete(null);
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
          <h1 className="page-title">Kelola User</h1>
          <p className="page-subtitle">{total} user terdaftar</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="user-toolbar">
        <div className="user-search-wrap">
          <span className="user-search-icon">⌕</span>
          <input
            className="user-search-input"
            placeholder="Cari nama atau email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="user-filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Semua Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => fetchList(page)}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div className="user-table-wrap">
        <table className="shared-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Subrole</th>
              <th>Bergabung</th>
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
                    <div className="empty-state-icon">👤</div>
                    <p>Tidak ada user ditemukan.</p>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((u) => (
                <tr key={u.id_user}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div className="user-avatar-cell">
                        {getInitials(u.nama_user || u.email)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>
                        {u.nama_user || "—"}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--c-text-muted)" }}>
                    {u.email}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          u.role === "Admin"
                            ? "rgba(201,168,76,0.12)"
                            : "rgba(107,114,128,0.12)",
                        color:
                          u.role === "Admin"
                            ? "var(--c-accent)"
                            : "var(--c-text-muted)",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className="user-subrole-badge"
                      style={{
                        background: `${subroleColor(u.subrole)}18`,
                        color: subroleColor(u.subrole),
                      }}
                    >
                      {u.subrole}
                    </span>
                  </td>
                  <td
                    style={{
                      fontSize: 12,
                      color: "var(--c-text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(u.created_at)}
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        className="user-action-btn user-action-btn-edit"
                        title="Edit User"
                        onClick={() => {
                          setEditUser(u);
                          setShowEdit(true);
                        }}
                      >
                        ✎
                      </button>
                      {u.role === "Admin" && (
                        <button
                          className="konten-action-btn konten-action-btn-info"
                          title="Lihat Konten User"
                          onClick={() => openKontenUser(u)}
                        >
                          📄
                        </button>
                      )}
                      <button
                        className="user-action-btn user-action-btn-delete"
                        title="Hapus User"
                        onClick={() => setConfirmDelete(u)}
                      >
                        🗑
                      </button>
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

      {/* ── Edit Modal ── */}
      {showEdit && editUser && (
        <UserEditModal
          user={editUser}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            fetchList(page);
            toast.success("Data user diperbarui.");
          }}
          toast={toast}
        />
      )}

      {/* ── Konten User Drawer ── */}
      {showKonten && kontenUser && (
        <div
          className="konten-detail-overlay"
          onClick={() => setShowKonten(false)}
        >
          <div
            className="konten-detail-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="konten-detail-header">
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                Konten oleh {kontenUser.nama_user}
              </span>
              <button
                className="konten-modal-close"
                onClick={() => setShowKonten(false)}
              >
                ✕
              </button>
            </div>
            <div className="konten-detail-body">
              {loadKonten ? (
                <div style={{ color: "var(--c-text-muted)", fontSize: 13 }}>
                  Memuat konten…
                </div>
              ) : kontenList.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📄</div>
                  <p>User ini belum membuat konten.</p>
                </div>
              ) : (
                kontenList.map((k) => (
                  <div
                    key={k.id_konten}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid var(--c-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {truncate(k.judul, 50)}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span
                          className={`badge badge-${k.jenis_konten?.toLowerCase()}`}
                        >
                          {k.jenis_konten}
                        </span>
                        <span className={`badge badge-${k.status_validasi}`}>
                          {k.status_validasi === "sudah" ? "✓" : "⏳"}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--c-text-dim)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(k.tanggal_dibuat)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete ── */}
      {confirmDelete && (
        <div className="user-modal-overlay">
          <div className="user-confirm-box">
            <div className="user-confirm-icon">⚠️</div>
            <div className="user-confirm-title">Hapus User?</div>
            <div className="user-confirm-msg">
              User <strong>{confirmDelete.nama_user}</strong> (
              {confirmDelete.email}) akan dihapus permanen. Semua konten yang
              dimilikinya tidak bisa diakses.
            </div>
            <div className="user-confirm-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmDelete(null)}
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

// ── Edit User Modal ───────────────────────────────────────────────────────────
const UserEditModal = ({ user, onClose, onSuccess, toast }) => {
  const [form, setForm] = useState({
    nama_user: user.nama_user || "",
    email: user.email || "",
    password: "",
    role: user.role || "User",
    subrole: user.subrole || "User",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Auto-adjust subrole saat role berubah
      if (name === "role") {
        next.subrole = value === "User" ? "User" : "Jurnalis";
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        nama_user: form.nama_user,
        email: form.email,
        role: form.role,
        subrole: form.subrole,
      };
      if (form.password) body.password = form.password;
      await UserService.update(user.id_user, body);
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="user-modal-overlay">
      <div className="user-modal-box">
        <div className="user-modal-header">
          <span className="user-modal-title">Edit User</span>
          <button className="user-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="user-modal-body">
            <div className="field-group">
              <label>Nama Lengkap</label>
              <input
                className="field-input"
                name="nama_user"
                value={form.nama_user}
                onChange={handleChange}
                placeholder="Nama user"
              />
            </div>
            <div className="field-group">
              <label>Email</label>
              <input
                className="field-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="field-group">
              <label>Password Baru (kosongkan jika tidak diubah)</label>
              <input
                className="field-input"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div className="field-group">
                <label>Role</label>
                <select
                  className="field-input"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="field-group">
                <label>Subrole</label>
                <select
                  className="field-input"
                  name="subrole"
                  value={form.subrole}
                  onChange={handleChange}
                  disabled={form.role === "User"}
                >
                  {form.role === "User" ? (
                    <option value="User">User</option>
                  ) : (
                    SUBROLES_ADMIN.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
          <div className="user-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



