// src/admin/pages/Login.jsx
// Sama seperti sebelumnya tapi menerima prop adminBasePath
// agar redirect setelah login mengarah ke /admin/dashboard
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/login.css";

export const Login = ({ adminBasePath = "/admin" }) => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (isAuthenticated)
      navigate(`${adminBasePath}/dashboard`, { replace: true });
  }, [isAuthenticated, navigate, adminBasePath]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(form);
      setUserName(data.user?.nama_user || data.user?.email || "Admin");
      setShowModal(true);
    } catch (err) {
      setError(err.message || "Login gagal. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalContinue = () => {
    setShowModal(false);
    navigate(`${adminBasePath}/dashboard`, { replace: true });
  };

  return (
    <div className="login-root">
      {/* ── Sisi kiri: background placeholder ── */}
      <div className="login-bg">
        <div className="login-bg-image" />
        {/* Untuk pasang gambar: edit .login-bg-image di login.css
            background-image: url('/assets/bg-login.jpg'); */}
        <div className="login-bg-overlay" />
        <div className="login-bg-deco" />
        <div className="login-bg-content">
          <div className="login-bg-logo">
            <span className="login-bg-logo-dot" />
            Parmalim Hutahalasan
          </div>
          <h1 className="login-bg-title">
            Portal Admin
            <br />
            <span>Pengelolaan Konten</span>
          </h1>
          <p className="login-bg-desc">
            Sistem manajemen konten berita, edukasi, dan file pengetahuan
            komunitas Parmalim Hutahalasan.
          </p>
        </div>
      </div>

      {/* ── Sisi kanan: form ── */}
      <div className="login-panel">
        <div className="login-panel-inner">
          <div className="login-panel-header">
            <h2 className="login-panel-title">Masuk ke Dashboard</h2>
            <p className="login-panel-subtitle">
              Gunakan akun admin yang telah terdaftar.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Alamat Email</label>
              <div className="login-field-wrap">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@parmalim.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-field-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error-msg">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Memverifikasi…" : "Masuk"}
            </button>
          </form>

          {/* Tombol kembali ke website utama */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <a
              href="/"
              style={{
                fontSize: 13,
                color: "var(--c-text-muted)",
                textDecoration: "none",
              }}
            >
              ← Kembali ke website utama
            </a>
          </div>
        </div>
      </div>

      {/* ── Modal sukses ── */}
      {showModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-box">
            <div className="login-modal-icon">✓</div>
            <h3 className="login-modal-title">Login Berhasil!</h3>
            <p className="login-modal-msg">
              Selamat datang kembali, <strong>{userName}</strong>.<br />
              Anda akan diarahkan ke dashboard.
            </p>
            <button className="login-modal-btn" onClick={handleModalContinue}>
              Lanjut ke Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
