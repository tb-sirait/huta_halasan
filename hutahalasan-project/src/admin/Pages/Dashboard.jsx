// src/admin/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useOutletContext }    from 'react-router-dom';
import { useAuth }             from '../hooks/useAuth';
import { InteraksiService, KontenService, PengetahuanService } from '../services/index.js';
import { formatNumber, truncate } from '../utils/helpers';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const { toast }                             = useOutletContext();
  const { user, isPengembang, isManajer }     = useAuth();

  const [insight, setInsight]   = useState([]);
  const [stats, setStats]       = useState({ views: 0, likes: 0, komentar: 0, konten: 0 });
  const [tipe, setTipe]         = useState('');
  const [loading, setLoading]   = useState(true);

  const canViewInsight = isPengembang || isManajer;

  const fetchData = useCallback(async () => {
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
        setStats({
          views:   rows.reduce((s, r) => s + (r.total_view     || 0), 0),
          likes:   rows.reduce((s, r) => s + (r.total_like     || 0), 0),
          komentar: rows.reduce((s, r) => s + (r.total_komentar || 0), 0),
          konten:  (kontenRes.total || 0) + (pengetRes.total || 0),
        });
      } else {
        const kontenRes = await KontenService.getAll({ id_user: user?.id_user, limit: 1 });
        setStats((s) => ({ ...s, konten: kontenRes.total || 0 }));
      }
    } catch (err) {
      toast.error(err.message || 'Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipe, user, isPengembang, isManajer, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const maxView = Math.max(...insight.map((r) => r.total_view || 0), 1);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {canViewInsight
              ? 'Ringkasan insight seluruh konten platform'
              : `Selamat datang, ${user?.nama_user || 'Admin'}`}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      {canViewInsight && (
        <div className="dashboard-stats">
          {[
            { icon: '👁', cls: 'dashboard-stat-icon-view',   label: 'Total Views',    val: formatNumber(stats.views) },
            { icon: '❤️', cls: 'dashboard-stat-icon-like',   label: 'Total Likes',    val: formatNumber(stats.likes) },
            { icon: '💬', cls: 'dashboard-stat-icon-komen',  label: 'Total Komentar', val: formatNumber(stats.komentar) },
            { icon: '📄', cls: 'dashboard-stat-icon-konten', label: 'Total Konten',   val: formatNumber(stats.konten) },
          ].map(({ icon, cls, label, val }) => (
            <div key={label} className="dashboard-stat-card">
              <div className={`dashboard-stat-icon ${cls}`}>{icon}</div>
              <div>
                <div className="dashboard-stat-label">{label}</div>
                <div className="dashboard-stat-value">{val}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insight table */}
      {canViewInsight && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <span className="dashboard-section-title">Insight Konten — Top 10 Views</span>
            <div className="dashboard-filter-tabs">
              {[['', 'Semua'], ['konten', 'Konten'], ['pengetahuan', 'Pengetahuan']].map(([val, lbl]) => (
                <button
                  key={val}
                  className={`dashboard-filter-tab${tipe === val ? ' active' : ''}`}
                  onClick={() => setTipe(val)}
                >{lbl}</button>
              ))}
            </div>
          </div>

          <div>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="dashboard-bar-row">
                    <div className="dashboard-skeleton" style={{ width: 160, height: 14 }} />
                    <div className="dashboard-bar-track">
                      <div className="dashboard-skeleton" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="dashboard-skeleton" style={{ width: 40, height: 14 }} />
                  </div>
                ))
              : insight.length === 0
                ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">📊</div>
                      <p>Belum ada data insight.</p>
                    </div>
                  )
                : insight.map((row) => (
                    <div key={row.target_id} className="dashboard-bar-row">
                      <div className="dashboard-bar-label" title={row.judul_atau_nama}>
                        {truncate(row.judul_atau_nama, 32)}
                      </div>
                      <div className="dashboard-bar-track">
                        <div
                          className="dashboard-bar-fill"
                          style={{ width: `${Math.round(((row.total_view || 0) / maxView) * 100)}%` }}
                        />
                      </div>
                      <div className="dashboard-bar-count">{formatNumber(row.total_view || 0)}</div>
                      <div style={{ display:'flex', gap:10, marginLeft:8, fontSize:11, color:'var(--warm-mid)', flexShrink:0 }}>
                        <span>❤️ {formatNumber(row.total_like || 0)}</span>
                        <span>💬 {formatNumber(row.total_komentar || 0)}</span>
                      </div>
                    </div>
                  ))
            }
          </div>
        </div>
      )}

      {/* Pesan untuk Jurnalis/Validator */}
      {!canViewInsight && (
        <div className="dashboard-section">
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--warm-mid)' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>
              {user?.subrole === 'Validator' ? '✓' : '✍'}
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--earth)', fontFamily: 'var(--font-display)' }}>
              Selamat datang, {user?.subrole}
            </p>
            <p style={{ fontSize: 13 }}>
              {user?.subrole === 'Validator'
                ? 'Gunakan menu Antrian Validasi untuk memvalidasi konten.'
                : 'Gunakan menu Konten untuk mengelola artikel dan file pengetahuan.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};