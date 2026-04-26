// src/Knowledge/Knowledge.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Navbar/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import { Helmet } from "react-helmet";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import { usePengetahuanList, fmtNum, timeAgo } from "../hooks/usePengetahuan.js";
import BalePartonggoanSection from "./BalePartonggoan/BalePartonggoanSection.jsx";
import "../styles/konten-shared.css";

const Knowledge = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Latest");

  const {
    data, total, loading, error,
    search: searchQuery, setSearch: setSearchQuery,
  } = usePengetahuanList({ limit: 50 });

  const getSorted = () => {
    let s = [...data];
    if (sortBy === "Oldest")
      s.sort((a, b) => new Date(a.tanggal_upload) - new Date(b.tanggal_upload));
    else if (sortBy === "Popular")
      s.sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0));
    else
      s.sort((a, b) => new Date(b.tanggal_upload) - new Date(a.tanggal_upload));
    return s;
  };

  const sorted   = getSorted();
  const featured = sorted[0] || null;
  const rest     = sorted.slice(1);
  const trending = [...data]
    .sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0))
    .slice(0, 5);

  const getTagline = (item) => {
    try {
      const arr = typeof item.tagline === "string" ? JSON.parse(item.tagline) : item.tagline;
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  };

  return (
    <div style={{ background: "var(--k-bg)", minHeight: "100vh", fontFamily: "var(--k-font)" }}>
      <Helmet>
        <title>Parbinotoan | Parmalim Bale Pasogit Huta Halasan</title>
        <meta name="description" content="Explore knowledge files and documents of Parmalim Bale Pasogit Huta Halasan." />
      </Helmet>
      <Header />

      {/* ── Hero ── */}
      <div className="k-hero">
        <img src={imgHutaHalasan} alt="Huta Halasan" className="k-hero-img" />
        <div className="k-hero-overlay" />
        <div className="k-hero-content">
          <span className="k-hero-label">📄 File & Dokumen</span>
          <h1 className="k-hero-title">Pengetahuan</h1>
          <p className="k-hero-sub">
            {loading ? "Memuat…" : `${total} dokumen tersedia`}
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="k-toolbar">
        <div className="k-toolbar-inner">
          <div className="k-search-wrap">
            <span className="k-search-icon">🔍</span>
            <input
              className="k-search-input"
              placeholder="Cari dokumen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="k-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Latest">Terbaru</option>
            <option value="Popular">Terpopuler</option>
            <option value="Oldest">Terlama</option>
          </select>
        </div>
      </div>

      {/* ── Konten ── */}
      <div className="k-container">
        <div className="k-layout">

          {/* Main */}
          <div style={{ paddingTop: 28 }}>
            {error && <div className="k-error">⚠️ {error}</div>}

            {/* Featured */}
            {loading ? (
              <div className="k-skeleton" style={{ height: 280, borderRadius: 20, marginBottom: 24 }} />
            ) : featured ? (
              <>
                <div className="k-section-label">✦ Dokumen Unggulan</div>
                <div
                  className="k-featured"
                  onClick={() => navigate(`/knowledge/${featured.id_file}`)}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/knowledge/${featured.id_file}`)}
                >
                  <div className="k-featured-img">
                    <div className="k-featured-img-placeholder">📄</div>
                    <span className="k-featured-badge">UNGGULAN</span>
                  </div>
                  <div className="k-featured-body">
                    <span className="k-featured-cat">File Pengetahuan</span>
                    <h2 className="k-featured-title">{featured.nama_file}</h2>
                    {getTagline(featured).length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {getTagline(featured).map((t, i) => (
                          <span key={i} className="k-tag">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="k-featured-meta">
                      <span>✍ {featured.nama_uploader || "Admin"}</span>
                      <span>·</span>
                      <span>🕐 {timeAgo(featured.tanggal_upload)}</span>
                      <span>·</span>
                      <span>👁 {fmtNum(featured.total_interaksi || 0)}</span>
                    </div>
                    <span className="k-featured-cta">Buka Dokumen →</span>
                  </div>
                </div>
              </>
            ) : null}

            {/* Grid */}
            {rest.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div className="k-section-label">📋 Semua Dokumen</div>
                <div className="k-card-grid">
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                          <div className="k-skeleton" style={{ height: 160, borderRadius: 12 }} />
                          <div className="k-skeleton" style={{ height: 14, borderRadius: 4, marginTop: 12, width: "80%" }} />
                        </div>
                      ))
                    : rest.map((item) => (
                        <div
                          key={item.id_file}
                          className="k-card"
                          onClick={() => navigate(`/knowledge/${item.id_file}`)}
                          role="button" tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && navigate(`/knowledge/${item.id_file}`)}
                        >
                          <div className="k-card-img-wrap">
                            <div className="k-card-img-placeholder">📄</div>
                            <span className="k-card-badge">Dokumen</span>
                          </div>
                          <div className="k-card-body">
                            <span className="k-card-cat">File Pengetahuan</span>
                            <h3 className="k-card-title">{item.nama_file}</h3>
                            {getTagline(item).length > 0 && (
                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                {getTagline(item).slice(0, 2).map((t, i) => (
                                  <span key={i} className="k-tag" style={{ fontSize: 10 }}>{t}</span>
                                ))}
                              </div>
                            )}
                            <div className="k-card-meta">
                              <span className="k-card-meta-item">✍ {item.nama_uploader || "Admin"}</span>
                              <span className="k-card-meta-item">🕐 {timeAgo(item.tanggal_upload)}</span>
                              <span className="k-card-meta-item">👁 {fmtNum(item.total_interaksi || 0)}</span>
                            </div>
                            <div className="k-card-footer">
                              <span className="k-card-read">Buka →</span>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}

            {!loading && !error && sorted.length === 0 && (
              <div className="k-empty">
                <div className="k-empty-icon">🔍</div>
                <h3>Tidak ada dokumen ditemukan</h3>
                <p>Coba kata kunci yang berbeda.</p>
                <button className="k-empty-btn" onClick={() => setSearchQuery("")}>Reset Pencarian</button>
              </div>
            )}

            {/* ── Bale Partonggoan Section ── */}
            <BalePartonggoanSection />

          </div>

          {/* Sidebar */}
          <div className="k-sidebar" style={{ paddingTop: 28 }}>
            <div className="k-sidebar-box">
              <div className="k-sidebar-head">
                <span className="k-sidebar-head-icon">🔥</span>
                <h3 className="k-sidebar-head-title">Trending</h3>
              </div>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ padding: "14px 18px", borderBottom: "1px solid var(--k-border)" }}>
                      <div className="k-skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 6 }} />
                      <div className="k-skeleton" style={{ height: 11, borderRadius: 4, width: "60%" }} />
                    </div>
                  ))
                : trending.map((item, i) => (
                    <div key={item.id_file} className="k-trending-item"
                      onClick={() => navigate(`/knowledge/${item.id_file}`)}>
                      <span className="k-trending-rank">{i + 1}</span>
                      <div className="k-trending-body">
                        <p className="k-trending-title">{item.nama_file}</p>
                        <div className="k-trending-meta">
                          <span>{timeAgo(item.tanggal_upload)}</span>
                          <span>👁 {fmtNum(item.total_interaksi || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Knowledge;