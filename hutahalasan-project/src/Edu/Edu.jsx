// src/Edu/Edu.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import { Helmet } from "react-helmet";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import { useKontenList, fmtNum, timeAgo, parseGambar } from "../hooks/useKonten.js";
import "../styles/konten-shared.css";

const Education = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");
  const [sortBy,    setSortBy]    = useState("Latest");

  const {
    data: allKonten, loading, error, total,
    search: searchTerm, setSearch: setSearchTerm,
  } = useKontenList({ jenis_konten: "Edukasi", limit: 50 });

  const processed = useMemo(() => {
    let list = [...allKonten];
    if (activeTab === "new") {
      const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
      list = list.filter((k) => new Date(k.tanggal_dibuat).getTime() > weekAgo);
    }
    if (sortBy === "Popular")
      list.sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0));
    else if (sortBy === "Oldest")
      list.sort((a, b) => new Date(a.tanggal_dibuat) - new Date(b.tanggal_dibuat));
    else
      list.sort((a, b) => new Date(b.tanggal_dibuat) - new Date(a.tanggal_dibuat));
    return list;
  }, [allKonten, activeTab, sortBy]);

  const trending = useMemo(() =>
    [...allKonten]
      .sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0))
      .slice(0, 5),
    [allKonten]
  );

  const featured = processed[0] || null;
  const rest     = processed.slice(1);

  const getImg = (k) => {
    const imgs = parseGambar(k?.id_gambar);
    return imgs?.[0] || null;
  };

  return (
    <div style={{ background: "var(--k-bg)", minHeight: "100vh", fontFamily: "var(--k-font)" }}>
      <Helmet>
        <title>Parsiajaran | Parmalim Bale Pasogit Huta Halasan</title>
        <meta name="description" content="Perdalam pengetahuan dengan belajar tentang moralitas dan nilai-nilai kehidupan dalam Ugamo Malim." />
      </Helmet>
      <Header />

      {/* ── Hero ── */}
      <div className="k-hero">
        <img src={imgHutaHalasan} alt="Huta Halasan" className="k-hero-img" />
        <div className="k-hero-overlay" />
        <div className="k-hero-content">
          <span className="k-hero-label">📚 Konten Edukasi</span>
          <h1 className="k-hero-title">Edukasi</h1>
          <p className="k-hero-sub">
            {loading ? "Memuat…" : `${total} materi edukasi tersedia`}
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
              placeholder="Cari materi edukasi…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Tabs */}
        <div className="k-tabs">
          <button
            className={`k-tab${activeTab === "new" ? " active" : ""}`}
            onClick={() => setActiveTab("new")}
          >🆕 Terbaru</button>
          <button
            className={`k-tab${activeTab === "trending" ? " active" : ""}`}
            onClick={() => setActiveTab("trending")}
          >🔥 Trending</button>
        </div>

        <div style={{ borderTop: "1.5px solid var(--k-border)", paddingTop: 1 }}>
          <div className="k-layout">

            {/* Main */}
            <div>
              {error && <div className="k-error">⚠️ {error}</div>}

              {/* Featured */}
              {loading ? (
                <div className="k-skeleton" style={{ height: 280, borderRadius: 20, marginBottom: 24, marginTop: 24 }} />
              ) : featured && activeTab === "new" ? (
                <div style={{ marginTop: 24 }}>
                  <div className="k-section-label">✦ Unggulan</div>
                  <div
                    className="k-featured"
                    onClick={() => navigate(`/education/${featured.id_konten}`)}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`/education/${featured.id_konten}`)}
                  >
                    <div className="k-featured-img">
                      {getImg(featured)
                        ? <img src={getImg(featured)} alt={featured.judul} />
                        : <div className="k-featured-img-placeholder">📚</div>
                      }
                      <span className="k-featured-badge">UNGGULAN</span>
                    </div>
                    <div className="k-featured-body">
                      <span className="k-featured-cat">{featured.jenis_konten}</span>
                      <h2 className="k-featured-title">{featured.judul}</h2>
                      {featured.tagline && (
                        <p className="k-featured-sub">{featured.tagline}</p>
                      )}
                      <div className="k-featured-meta">
                        <span>✍ {featured.penulis}</span>
                        <span>·</span>
                        <span>🕐 {timeAgo(featured.tanggal_dibuat)}</span>
                        <span>·</span>
                        <span>👁 {fmtNum(featured.total_interaksi || 0)}</span>
                      </div>
                      <span className="k-featured-cta">Pelajari Selengkapnya →</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Grid */}
              <div style={{ marginTop: 24 }}>
                <div className="k-section-label">
                  {activeTab === "new" ? "📋 Semua Materi" : "🔥 Trending"}
                </div>
                <div className="k-card-grid">
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                          <div className="k-skeleton" style={{ height: 180, borderRadius: 12 }} />
                          <div className="k-skeleton" style={{ height: 16, borderRadius: 4, marginTop: 12, width: "80%" }} />
                          <div className="k-skeleton" style={{ height: 12, borderRadius: 4, marginTop: 8, width: "50%" }} />
                        </div>
                      ))
                    : (activeTab === "trending" ? trending : rest).map((item) => (
                        <div
                          key={item.id_konten}
                          className="k-card"
                          onClick={() => navigate(`/education/${item.id_konten}`)}
                          role="button" tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && navigate(`/education/${item.id_konten}`)}
                        >
                          <div className="k-card-img-wrap">
                            {getImg(item)
                              ? <img src={getImg(item)} alt={item.judul} />
                              : <div className="k-card-img-placeholder">📚</div>
                            }
                            <span className="k-card-badge">{item.jenis_konten}</span>
                          </div>
                          <div className="k-card-body">
                            <span className="k-card-cat">{item.jenis_konten}</span>
                            <h3 className="k-card-title">{item.judul}</h3>
                            {item.tagline && (
                              <p style={{ fontSize: 12, color: "var(--k-text-muted)", margin: 0 }}>{item.tagline}</p>
                            )}
                            <div className="k-card-meta">
                              <span className="k-card-meta-item">✍ {item.penulis}</span>
                              <span className="k-card-meta-item">🕐 {timeAgo(item.tanggal_dibuat)}</span>
                              <span className="k-card-meta-item">👁 {fmtNum(item.total_interaksi || 0)}</span>
                            </div>
                            <div className="k-card-footer">
                              <span className="k-card-read">Pelajari →</span>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>

                {!loading && !error && processed.length === 0 && (
                  <div className="k-empty">
                    <div className="k-empty-icon">🔍</div>
                    <h3>Tidak ada materi ditemukan</h3>
                    <p>Coba kata kunci yang berbeda atau ganti tab.</p>
                    <button className="k-empty-btn"
                      onClick={() => { setSearchTerm(""); setActiveTab("new"); }}>
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="k-sidebar">
              <div className="k-sidebar-box">
                <div className="k-sidebar-head">
                  <span className="k-sidebar-head-icon">🔥</span>
                  <h3 className="k-sidebar-head-title">Trending Edukasi</h3>
                </div>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{ padding: "14px 18px", borderBottom: "1px solid var(--k-border)" }}>
                        <div className="k-skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 6 }} />
                        <div className="k-skeleton" style={{ height: 11, borderRadius: 4, width: "60%" }} />
                      </div>
                    ))
                  : trending.map((item, i) => (
                      <div key={item.id_konten} className="k-trending-item"
                        onClick={() => navigate(`/education/${item.id_konten}`)}>
                        <span className="k-trending-rank">{i + 1}</span>
                        <div className="k-trending-body">
                          <p className="k-trending-title">{item.judul}</p>
                          <div className="k-trending-meta">
                            <span>✍ {item.penulis}</span>
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
      </div>

      <Footer />
    </div>
  );
};

export default Education;