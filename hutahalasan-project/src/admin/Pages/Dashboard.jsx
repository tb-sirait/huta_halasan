// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import {
  InteraksiService,
  KontenService,
  PengetahuanService,
} from "../services/index.js";
import { formatNumber, truncate } from "../utils/helpers.js";
import "../styles/dashboard.css";

export const Dashboard = () => {
  const { toast } = useOutletContext();
  const { user, isPengembang, isManajer } = useAuth();

  const [insight, setInsight] = useState([]);
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    komentar: 0,
    konten: 0,
  });
  const [tipe, setTipe] = useState("");
  const [loading, setLoading] = useState(true);

  const canViewInsight = isPengembang || isManajer;

  const fetchData = async () => {
    setLoading(true);
    try {
      if (canViewInsight) {
        const [insightRes, kontenRes, pengetRes] = await Promise.all([
          InteraksiService.getInsightAll({ limit: 10, tipe }),
          KontenService.getAll({ limit: 1 }),
          PengetahuanService.getAll({ limit: 1 }),
        ]);

        const rows = insightRes.data || [];
        setInsight(rows);

        const totalViews = rows.reduce((s, r) => s + (r.total_view || 0), 0);
        const totalLikes = rows.reduce((s, r) => s + (r.total_like || 0), 0);
        const totalKomen = rows.reduce(
          (s, r) => s + (r.total_komentar || 0),
          0,
        );
        const totalKonten = (kontenRes.total || 0) + (pengetRes.total || 0);
        setStats({
          views: totalViews,
          likes: totalLikes,
          komentar: totalKomen,
          konten: totalKonten,
        });
      } else {
        // Jurnalis / Validator: tampilkan konten milik sendiri
        const kontenRes = await KontenService.getAll({
          id_user: user?.id_user,
          limit: 1,
        });
        setStats((s) => ({ ...s, konten: kontenRes.total || 0 }));
      }
    } catch (err) {
      toast.error(err.message || "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tipe]);

  const maxView = Math.max(...insight.map((r) => r.total_view || 0), 1);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {canViewInsight
              ? "Ringkasan insight seluruh konten platform"
              : `Selamat datang, ${user?.nama_user || "Admin"}`}
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {canViewInsight && (
        <div className="dashboard-stats">
          <StatCard
            icon="👁"
            iconClass="dashboard-stat-icon-view"
            label="Total Views"
            value={formatNumber(stats.views)}
          />
          <StatCard
            icon="❤️"
            iconClass="dashboard-stat-icon-like"
            label="Total Likes"
            value={formatNumber(stats.likes)}
          />
          <StatCard
            icon="💬"
            iconClass="dashboard-stat-icon-komen"
            label="Total Komentar"
            value={formatNumber(stats.komentar)}
          />
          <StatCard
            icon="📄"
            iconClass="dashboard-stat-icon-konten"
            label="Total Konten"
            value={formatNumber(stats.konten)}
          />
        </div>
      )}

      {/* ── Insight table (Pengembang & Manajer) ── */}
      {canViewInsight && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <span className="dashboard-section-title">
              Insight Konten — Top 10 Views
            </span>
            <div className="dashboard-filter-tabs">
              {[
                ["", "Semua"],
                ["konten", "Konten"],
                ["pengetahuan", "Pengetahuan"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  className={`dashboard-filter-tab${tipe === val ? " active" : ""}`}
                  onClick={() => setTipe(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="dashboard-section-body">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="dashboard-bar-row">
                  <div
                    className="dashboard-skeleton"
                    style={{ width: 160, height: 14 }}
                  />
                  <div className="dashboard-bar-track">
                    <div
                      className="dashboard-skeleton"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div
                    className="dashboard-skeleton"
                    style={{ width: 40, height: 14 }}
                  />
                </div>
              ))
            ) : insight.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p>Belum ada data insight.</p>
              </div>
            ) : (
              insight.map((row) => (
                <div key={row.target_id} className="dashboard-bar-row">
                  <div
                    className="dashboard-bar-label"
                    title={row.judul_atau_nama}
                  >
                    {truncate(row.judul_atau_nama, 30)}
                  </div>
                  <div className="dashboard-bar-track">
                    <div
                      className="dashboard-bar-fill"
                      style={{
                        width: `${Math.round(((row.total_view || 0) / maxView) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="dashboard-bar-count">
                    {formatNumber(row.total_view || 0)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginLeft: 8,
                      fontSize: 12,
                      color: "var(--c-text-muted)",
                      flexShrink: 0,
                    }}
                  >
                    <span>❤️ {formatNumber(row.total_like || 0)}</span>
                    <span>💬 {formatNumber(row.total_komentar || 0)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Pesan untuk Jurnalis / Validator */}
      {!canViewInsight && (
        <div className="dashboard-section">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--c-text-muted)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              {user?.subrole === "Validator" ? "✓" : "✍"}
            </div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--c-text)",
              }}
            >
              Selamat datang, {user?.subrole}
            </p>
            <p style={{ fontSize: 13 }}>
              {user?.subrole === "Validator"
                ? "Gunakan menu Antrian Validasi untuk memvalidasi konten yang masuk."
                : "Gunakan menu Konten untuk mengelola artikel dan file pengetahuan Anda."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, iconClass, label, value }) => (
  <div className="dashboard-stat-card">
    <div className={`dashboard-stat-icon ${iconClass}`}>{icon}</div>
    <div className="dashboard-stat-body">
      <div className="dashboard-stat-label">{label}</div>
      <div className="dashboard-stat-value">{value}</div>
    </div>
  </div>
);
