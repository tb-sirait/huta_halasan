// src/News/News.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import { Helmet } from "react-helmet";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import {
  useKontenList,
  fmtNum,
  timeAgo,
  parseGambar,
} from "../hooks/useKonten.js";
import "../styles/konten-shared.css";

const NewsPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("Latest");
  const [selectedSort, setSelectedSort] = useState("Latest");

  const {
    data,
    total,
    loading,
    error,
    search: searchQuery,
    setSearch: setSearchQuery,
  } = useKontenList({ jenis_konten: "Berita", limit: 50 });

  const getSorted = () => {
    let s = [...data];
    if (selectedSort === "Oldest")
      s.sort((a, b) => new Date(a.tanggal_dibuat) - new Date(b.tanggal_dibuat));
    else if (selectedSort === "Most Viewed" || selectedFilter === "Popular")
      s.sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0));
    else
      s.sort((a, b) => new Date(b.tanggal_dibuat) - new Date(a.tanggal_dibuat));
    return s;
  };

  const sorted = getSorted();
  const featured = sorted[0] || null;
  const regular = sorted.slice(1);
  const trending = [...data]
    .sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0))
    .slice(0, 5);

  const getImg = (item) => {
    const imgs = parseGambar(item?.id_gambar);
    return imgs?.[0] || null;
  };

  return (
    <div
      style={{
        background: "var(--k-bg)",
        minHeight: "100vh",
        fontFamily: "var(--k-font)",
      }}
    >
      <Helmet>
        <title>Berita | Parmalim Bale Pasogit Huta Halasan</title>
        <meta
          name="description"
          content="Berita terbaru dari komunitas Parmalim Bale Pasogit Huta Halasan."
        />
      </Helmet>
      <Header />

      {/* ── Hero ── */}
      <div className="k-hero">
        <img src={imgHutaHalasan} alt="Huta Halasan" className="k-hero-img" />
        <div className="k-hero-overlay" />
        <div className="k-hero-content">
          <span className="k-hero-label">📰 Kabar Terkini</span>
          <h1 className="k-hero-title">Berita</h1>
          <p className="k-hero-sub">
            {loading ? "Memuat…" : `${total} artikel berita tersedia`}
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
              placeholder="Cari berita…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="k-select"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="Latest">Terbaru</option>
            <option value="Popular">Terpopuler</option>
          </select>
          <select
            className="k-select"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="Latest">⬆ Latest</option>
            <option value="Oldest">⬇ Oldest</option>
            <option value="Most Viewed">👁 Most Viewed</option>
          </select>
        </div>
      </div>

      {/* ── Konten ── */}
      <div className="k-container">
        <div className="k-layout">
          {/* Main */}
          <div>
            {error && <div className="k-error">⚠️ {error}</div>}

            {/* Featured */}
            {loading ? (
              <div
                className="k-skeleton"
                style={{ height: 280, borderRadius: 20, marginBottom: 24 }}
              />
            ) : featured ? (
              <>
                <div className="k-section-label">✦ Featured</div>
                <div
                  className="k-featured"
                  onClick={() => navigate(`/news/${featured.id_konten}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/news/${featured.id_konten}`)
                  }
                >
                  <div className="k-featured-img">
                    {getImg(featured) ? (
                      <img src={getImg(featured)} alt={featured.judul} />
                    ) : (
                      <div className="k-featured-img-placeholder">📰</div>
                    )}
                    <span className="k-featured-badge">FEATURED</span>
                  </div>
                  <div className="k-featured-body">
                    <span className="k-featured-cat">
                      {featured.jenis_konten}
                    </span>
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
                    <span className="k-featured-cta">Baca Selengkapnya →</span>
                  </div>
                </div>
              </>
            ) : null}

            {/* Grid artikel */}
            {regular.length > 0 && (
              <>
                <div className="k-section-label" style={{ marginTop: 28 }}>
                  📋 Semua Berita
                </div>
                <div className="k-card-grid">
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                          <div
                            className="k-skeleton"
                            style={{ height: 180, borderRadius: 12 }}
                          />
                          <div
                            className="k-skeleton"
                            style={{
                              height: 16,
                              borderRadius: 4,
                              marginTop: 12,
                              width: "80%",
                            }}
                          />
                          <div
                            className="k-skeleton"
                            style={{
                              height: 12,
                              borderRadius: 4,
                              marginTop: 8,
                              width: "50%",
                            }}
                          />
                        </div>
                      ))
                    : regular.map((item) => (
                        <div
                          key={item.id_konten}
                          className="k-card"
                          onClick={() => navigate(`/news/${item.id_konten}`)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            navigate(`/news/${item.id_konten}`)
                          }
                        >
                          <div className="k-card-img-wrap">
                            {getImg(item) ? (
                              <img src={getImg(item)} alt={item.judul} />
                            ) : (
                              <div className="k-card-img-placeholder">📰</div>
                            )}
                            <span className="k-card-badge">
                              {item.jenis_konten}
                            </span>
                          </div>
                          <div className="k-card-body">
                            <span className="k-card-cat">
                              {item.jenis_konten}
                            </span>
                            <h3 className="k-card-title">{item.judul}</h3>
                            {item.tagline && (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "var(--k-text-muted)",
                                  margin: 0,
                                }}
                              >
                                {item.tagline}
                              </p>
                            )}
                            <div className="k-card-meta">
                              <span className="k-card-meta-item">
                                ✍ {item.penulis}
                              </span>
                              <span className="k-card-meta-item">
                                🕐 {timeAgo(item.tanggal_dibuat)}
                              </span>
                              <span className="k-card-meta-item">
                                👁 {fmtNum(item.total_interaksi || 0)}
                              </span>
                            </div>
                            <div className="k-card-footer">
                              <span className="k-card-read">Baca →</span>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </>
            )}

            {!loading && !error && sorted.length === 0 && (
              <div className="k-empty">
                <div className="k-empty-icon">🔍</div>
                <h3>Tidak ada berita ditemukan</h3>
                <p>Coba kata kunci yang berbeda atau hapus filter.</p>
                <button
                  className="k-empty-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="k-sidebar">
            <div className="k-sidebar-box">
              <div className="k-sidebar-head">
                <span className="k-sidebar-head-icon">🔥</span>
                <h3 className="k-sidebar-head-title">Trending</h3>
              </div>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "14px 18px",
                        borderBottom: "1px solid var(--k-border)",
                      }}
                    >
                      <div
                        className="k-skeleton"
                        style={{ height: 14, borderRadius: 4, marginBottom: 6 }}
                      />
                      <div
                        className="k-skeleton"
                        style={{ height: 11, borderRadius: 4, width: "60%" }}
                      />
                    </div>
                  ))
                : trending.map((item, i) => (
                    <div
                      key={item.id_konten}
                      className="k-trending-item"
                      onClick={() => navigate(`/news/${item.id_konten}`)}
                    >
                      <span className="k-trending-rank">{i + 1}</span>
                      <div className="k-trending-body">
                        <p className="k-trending-title">{item.judul}</p>
                        <div className="k-trending-meta">
                          <span>✍ {item.penulis}</span>
                          <span>👁 {fmtNum(item.total_interaksi || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;
