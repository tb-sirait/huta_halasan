// src/admin/pages/Users.jsx
import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserService, KontenService } from "../services/index.js";
import {
  formatDate,
  getInitials,
  subroleColor,
  truncate,
} from "../utils/helpers";
import "../styles/user.css";

const PER_PAGE = 15;
const ADMIN_ROLES = ["Validator", "Jurnalis", "Pengembang", "Manajer"];
const ROLE_COLORS = {
  Pengembang: "#2980b9",
  Manajer: "#27ae60",
  Validator: "#d4561c",
  Jurnalis: "#8b6f47",
  User: "#a0a0a0",
};

export const Users = () => {
  const { toast } = useOutletContext();
  const { isPengembang, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // List state
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Konten user drawer
  const [showKonten, setShowKonten] = useState(false);
  const [kontenUser, setKontenUser] = useState(null);
  const [kontenList, setKontenList] = useState([]);
  const [loadKonten, setLoadKonten] = useState(false);

  const searchTimer = useRef(null);

  // Guard: hanya Pengembang
  useEffect(() => {
    // Tunggu auth selesai loading sebelum cek isPengembang
    // Tanpa ini, saat pertama render user masih null → selalu redirect
    if (!authLoading && !isPengembang) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [authLoading, isPengembang, navigate]);

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

  // ── Lihat konten user ────────────────────────────────────────────────────────
  const openKonten = async (u) => {
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

  // ── Hapus user ────────────────────────────────────────────────────────────────
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
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola User</h1>
          <p className="page-subtitle">{total} akun terdaftar dalam sistem</p>
        </div>
        <div className="page-header-right">
          <button
            className="btn btn-accent"
            onClick={() => setShowCreate(true)}
          >
            + Buat Akun Baru
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
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

      {/* ── Tabel ── */}
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
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--earth)",
                          }}
                        >
                          {u.nama_user || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--warm-mid)" }}>
                    {u.email}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          u.role === "Admin"
                            ? "rgba(92,61,30,0.12)"
                            : "rgba(160,160,160,0.12)",
                        color: u.role === "Admin" ? "var(--earth)" : "#888",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className="user-subrole-badge"
                      style={{
                        background: `${ROLE_COLORS[u.subrole] || "#888"}18`,
                        color: ROLE_COLORS[u.subrole] || "#888",
                      }}
                    >
                      {u.subrole}
                    </span>
                  </td>
                  <td
                    style={{
                      fontSize: 12,
                      color: "var(--warm-mid)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(u.created_at)}
                  </td>
                  <td>
                    <div className="user-actions">
                      {/* Edit */}
                      <button
                        className="user-action-btn user-action-btn-edit"
                        title="Edit Akun"
                        onClick={() => {
                          setEditUser(u);
                          setShowEdit(true);
                        }}
                      >
                        ✎
                      </button>
                      {/* Lihat konten */}
                      {u.role === "Admin" && (
                        <button
                          className="user-action-btn user-action-btn-view"
                          title="Lihat Konten User"
                          onClick={() => openKonten(u)}
                        >
                          📄
                        </button>
                      )}
                      {/* Hapus */}
                      <button
                        className="user-action-btn user-action-btn-delete"
                        title="Hapus Akun"
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

      {/* ── Pagination ── */}
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

      {/* ── Modal: Buat Akun Baru ── */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            fetchList(1);
            toast.success("Akun berhasil dibuat.");
          }}
          toast={toast}
        />
      )}

      {/* ── Modal: Edit User ── */}
      {showEdit && editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            fetchList(page);
            toast.success("Akun berhasil diperbarui.");
          }}
          toast={toast}
        />
      )}

      {/* ── Drawer: Konten User ── */}
      {showKonten && kontenUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42,31,20,0.4)",
            zIndex: 150,
            display: "flex",
            justifyContent: "flex-end",
            animation: "user-overlay-in 0.2s ease",
          }}
          onClick={() => setShowKonten(false)}
        >
          <div
            style={{
              width: 480,
              maxWidth: "95vw",
              height: "100%",
              background: "var(--cream)",
              borderLeft: "1.5px solid var(--border)",
              overflowY: "auto",
              animation: "konten-drawer-in 0.28s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header drawer */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                background: "var(--parchment)",
                zIndex: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--earth)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Konten oleh {kontenUser.nama_user}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--warm-mid)",
                    marginTop: 2,
                  }}
                >
                  {kontenUser.email} · {kontenUser.subrole}
                </div>
              </div>
              <button
                className="user-modal-close"
                onClick={() => setShowKonten(false)}
              >
                ✕
              </button>
            </div>

            {/* Body drawer */}
            <div style={{ padding: 24 }}>
              {loadKonten ? (
                <div style={{ color: "var(--warm-mid)", fontSize: 13 }}>
                  Memuat konten…
                </div>
              ) : kontenList.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📄</div>
                  <p>User ini belum membuat konten.</p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--warm-mid)",
                      marginBottom: 14,
                    }}
                  >
                    {kontenList.length} konten ditemukan
                  </div>
                  {kontenList.map((k) => (
                    <div
                      key={k.id_konten}
                      style={{
                        padding: "13px 0",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--earth)",
                            marginBottom: 5,
                          }}
                        >
                          {truncate(k.judul, 52)}
                        </div>
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          <span
                            className="badge badge-berita"
                            style={
                              k.jenis_konten === "Edukasi"
                                ? {
                                    background: "rgba(139,111,71,0.12)",
                                    color: "var(--bark)",
                                  }
                                : {}
                            }
                          >
                            {k.jenis_konten}
                          </span>
                          <span className={`badge badge-${k.status_validasi}`}>
                            {k.status_validasi === "sudah" ? "✓" : "⏳"}{" "}
                            {k.status_validasi}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--warm-mid)",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {formatDate(k.tanggal_dibuat)}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm: Hapus User ── */}
      {confirmDelete && (
        <div className="user-modal-overlay">
          <div className="user-confirm-box">
            <div className="user-confirm-icon">⚠️</div>
            <div className="user-confirm-title">Hapus Akun?</div>
            <div className="user-confirm-msg">
              Akun <strong>{confirmDelete.nama_user}</strong>
              <br />
              <span style={{ fontSize: 12, color: "var(--warm-mid)" }}>
                {confirmDelete.email}
              </span>
              <br />
              <br />
              Tindakan ini tidak dapat dibatalkan. Semua konten yang dimiliki
              user ini tidak dapat diakses.
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
                {deleting ? "Menghapus…" : "Ya, Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Modal: Buat Akun Baru
   ──────────────────────────────────────────────────────────── */
const CreateUserModal = ({ onClose, onSuccess, toast }) => {
  const [form, setForm] = useState({
    nama_user: "",
    email: "",
    password: "",
    role: "User",
    subrole: "User",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === "role")
        next.subrole = value === "User" ? "User" : "Jurnalis";
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_user || !form.email || !form.password) {
      toast.warning("Nama, email, dan password wajib diisi.");
      return;
    }
    if (form.password.length < 6) {
      toast.warning("Password minimal 6 karakter.");
      return;
    }
    setSaving(true);
    try {
      // Gunakan endpoint register dari auth
      const { api } = await import("../services/api.config.js");
      await api.post("/auth/register", form);
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
          <span className="user-modal-title">Buat Akun Baru</span>
          <button className="user-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="user-modal-body">
            {/* Info */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(139,111,71,0.08)",
                border: "1px solid rgba(139,111,71,0.2)",
                fontSize: 13,
                color: "var(--warm-mid)",
                lineHeight: 1.6,
              }}
            >
              💡 Akun yang dibuat di sini langsung aktif dan bisa login ke
              sistem.
            </div>

            <div className="field-group">
              <label>Nama Lengkap *</label>
              <input
                className="field-input"
                name="nama_user"
                value={form.nama_user}
                onChange={handleChange}
                placeholder="Nama lengkap user"
              />
            </div>

            <div className="field-group">
              <label>Email *</label>
              <input
                className="field-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@parmalim.com"
              />
            </div>

            <div className="field-group">
              <label>Password * (min. 6 karakter)</label>
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
                    ADMIN_ROLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Preview role */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "var(--parchment)",
                border: "1px solid var(--border)",
                fontSize: 12,
                color: "var(--warm-mid)",
              }}
            >
              <strong style={{ color: "var(--earth)" }}>
                Ringkasan akses:
              </strong>
              <div style={{ marginTop: 6 }}>
                {form.role === "User" &&
                  "• Bisa membaca konten dan berkomentar"}
                {form.subrole === "Jurnalis" &&
                  "• Bisa membuat dan mengelola konten sendiri"}
                {form.subrole === "Validator" &&
                  "• Bisa memvalidasi konten yang dikirim"}
                {form.subrole === "Manajer" &&
                  "• Bisa melihat insight dan moderasi komentar"}
                {form.subrole === "Pengembang" &&
                  "• Akses penuh: semua fitur + kelola user"}
              </div>
            </div>
          </div>

          <div className="user-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-accent" disabled={saving}>
              {saving ? "Membuat…" : "+ Buat Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Modal: Edit User
   ──────────────────────────────────────────────────────────── */
const EditUserModal = ({ user, onClose, onSuccess, toast }) => {
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
      if (name === "role")
        next.subrole = value === "User" ? "User" : "Jurnalis";
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_user || !form.email) {
      toast.warning("Nama dan email wajib diisi.");
      return;
    }
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
          <span className="user-modal-title">Edit Akun</span>
          <button className="user-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Info user */}
        <div
          style={{
            padding: "14px 24px",
            background: "var(--parchment)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            className="user-avatar-cell"
            style={{ width: 40, height: 40, fontSize: 14 }}
          >
            {getInitials(user.nama_user || user.email)}
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 14, color: "var(--earth)" }}
            >
              {user.nama_user}
            </div>
            <div style={{ fontSize: 12, color: "var(--warm-mid)" }}>
              Bergabung {formatDate(user.created_at)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="user-modal-body">
            <div className="field-group">
              <label>Nama Lengkap *</label>
              <input
                className="field-input"
                name="nama_user"
                value={form.nama_user}
                onChange={handleChange}
                placeholder="Nama lengkap"
              />
            </div>

            <div className="field-group">
              <label>Email *</label>
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
                    ADMIN_ROLES.map((s) => (
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
