// src/admin/pages/Login.jsx
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
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }
    if (!form.password) {
      setError("Password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await login({
        email: form.email.trim(),
        password: form.password,
      });

      if (data.user?.role !== "Admin") {
        setError("Akun Anda tidak memiliki akses ke dashboard admin.");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      setUserName(data.user?.nama_user || data.user?.email || "Admin");
      setShowModal(true);
    } catch (err) {
      const status = err?.status || 0;
      const message = (err?.message || "").toLowerCase();

      if (
        status === 401 ||
        message.includes("password") ||
        message.includes("email") ||
        message.includes("salah")
      ) {
        setError("Email atau password salah. Silakan periksa kembali.");
      } else if (
        status === 404 ||
        message.includes("tidak ditemukan") ||
        message.includes("not found")
      ) {
        setError("Email atau password salah. Silakan periksa kembali.");
      } else if (
        status === 0 ||
        message.includes("server") ||
        message.includes("terhubung")
      ) {
        setError("Tidak dapat terhubung ke server. Coba beberapa saat lagi.");
      } else if (status === 403) {
        setError("Akun Anda tidak memiliki akses ke dashboard admin.");
      } else {
        setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
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
      {/* ── Sisi kiri ── */}
      <div className="login-bg">
        <div className="login-bg-image" />
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
            komunitas Parmalim Bale Pasogit Huta Halasan.
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

          <form className="login-form" onSubmit={handleSubmit} noValidate>
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
                  style={error ? { borderColor: "var(--danger)" } : {}}
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
                  style={error ? { borderColor: "var(--danger)" } : {}}
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
              <div className="login-error-msg" role="alert">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Memverifikasi…" : "Masuk ke Dashboard"}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <a
              href="/"
              style={{
                fontSize: 13,
                color: "var(--warm-mid)",
                textDecoration: "none",
              }}
            >
              ← Kembali ke Website Utama
            </a>
          </div>
        </div>
      </div>

      {/* ── Modal sukses ── */}
      {showModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-box">
            <div className="login-modal-icon">✓</div>
            <h3 className="login-modal-title">Selamat Datang!</h3>
            <p className="login-modal-msg">
              Horas, <strong>{userName}</strong>!<br />
              Anda berhasil masuk ke dashboard admin.
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
