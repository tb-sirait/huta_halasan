// src/Knowledge/KnowledgeDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Navbar/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import {
  usePengetahuanDetail,
  usePengetahuanList,
  fmtNum,
  timeAgo,
  fmtDate,
} from "../hooks/usePengetahuan.js";
import "../styles/konten-shared.css";

const KnowledgeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    item,
    komentar,
    likeCount,
    liked,
    loading,
    loadKomen,
    error,
    submitting,
    taglineArr,
    handleLike,
    handleKomentar,
  } = usePengetahuanDetail(id);

  const { data: allData } = usePengetahuanList({ limit: 20 });
  const trending = [...allData]
    .filter((k) => k.id_file !== id)
    .sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0))
    .slice(0, 4);
  const related = allData.filter((k) => k.id_file !== id).slice(0, 4);

  const [komentarText, setKomentarText] = useState("");
  const [komentarSent, setKomentarSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await handleKomentar(komentarText);
    if (ok) {
      setKomentarText("");
      setKomentarSent(true);
    }
  };

  /* ── Loading ── */
  if (loading)
    return (
      <div style={{ background: "var(--k-bg)", fontFamily: "var(--k-font)" }}>
        <Header />
        <div className="k-detail-hero" style={{ background: "#e5e7eb" }}>
          <div
            className="k-skeleton"
            style={{ width: "100%", height: "100%", borderRadius: 0 }}
          />
        </div>
        <div
          className="k-container"
          style={{
            padding: "32px 20px",
            textAlign: "center",
            color: "var(--k-text-muted)",
          }}
        >
          Memuat dokumen…
        </div>
        <Footer />
      </div>
    );

  /* ── Error ── */
  if (error || !item)
    return (
      <div style={{ background: "var(--k-bg)", fontFamily: "var(--k-font)" }}>
        <Header />
        <div className="k-container" style={{ padding: "60px 20px" }}>
          <div className="k-empty">
            <div className="k-empty-icon">📄</div>
            <h3>{error || "Dokumen tidak ditemukan"}</h3>
            <p>Dokumen yang Anda cari tidak tersedia.</p>
            <button
              className="k-empty-btn"
              onClick={() => navigate("/knowledge")}
            >
              ← Kembali ke Pengetahuan
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );

  const paragraphs = (item.deskripsi || "")
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        background: "var(--k-bg)",
        minHeight: "100vh",
        fontFamily: "var(--k-font)",
      }}
    >
      <Header />

      {/* ── Hero — pakai background Huta Halasan dengan overlay kuat + icon file di tengah ── */}
      <div className="k-detail-hero">
        <img
          src={imgHutaHalasan}
          alt="Huta Halasan"
          className="k-detail-hero-img"
        />
        <div className="k-detail-hero-overlay" />
        {/* Icon file di tengah hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "2px solid rgba(255,255,255,0.25)",
              borderRadius: 20,
              padding: "20px 32px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 8 }}>📄</div>
            <div
              style={{
                fontFamily: "var(--k-font)",
                fontSize: 14,
                fontWeight: 700,
                opacity: 0.9,
              }}
            >
              Dokumen Pengetahuan
            </div>
          </div>
        </div>
        <div className="k-detail-hero-content">
          <div
            style={{
              maxWidth: "var(--k-container)",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <span className="k-detail-hero-cat">📄 File Pengetahuan</span>
            <h1 className="k-detail-hero-title">{item.nama_file}</h1>
            <div className="k-detail-hero-meta">
              <span>✍ {item.nama_uploader || "Admin"}</span>
              <span className="k-detail-hero-meta-dot" />
              <span>📅 {fmtDate(item.tanggal_upload)}</span>
              <span className="k-detail-hero-meta-dot" />
              <span>👁 {fmtNum(likeCount)}</span>
              <span className="k-detail-hero-meta-dot" />
              <span>💬 {komentar.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="k-breadcrumb">
        <div className="k-breadcrumb-inner">
          <button className="k-breadcrumb-link" onClick={() => navigate("/")}>
            Beranda
          </button>
          <span className="k-breadcrumb-sep">/</span>
          <button
            className="k-breadcrumb-link"
            onClick={() => navigate("/knowledge")}
          >
            Pengetahuan
          </button>
          <span className="k-breadcrumb-sep">/</span>
          <span
            className="k-breadcrumb-curr"
            style={{
              maxWidth: 240,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.nama_file}
          </span>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="k-container">
        <div className="k-detail-layout">
          {/* Artikel */}
          <div>
            <div className="k-article">
              {/* Meta bar */}
              <div className="k-article-meta-bar">
                <span className="k-tag">File Pengetahuan</span>
                {taglineArr.map((t, i) => (
                  <span key={i} className="k-tag k-tag-blue">
                    {t}
                  </span>
                ))}
                <span className="k-article-meta-sep">·</span>
                <span className="k-article-meta-item">
                  ✍ {item.nama_uploader || "Admin"}
                </span>
                <span className="k-article-meta-sep">·</span>
                <span className="k-article-meta-item">
                  📅 {fmtDate(item.tanggal_upload)}
                </span>
              </div>

              <div className="k-article-body">
                {/* Download box */}
                <div className="k-file-box">
                  <div className="k-file-icon">📄</div>
                  <div className="k-file-name">{item.nama_file}</div>
                  {item.path_file && (
                    <a
                      href={item.path_file}
                      target="_blank"
                      rel="noreferrer"
                      className="k-file-download"
                    >
                      ⬇ Unduh / Buka File
                    </a>
                  )}
                </div>

                {item.nama_validator && (
                  <span className="k-validator-chip">
                    ✓ Divalidasi oleh {item.nama_validator}
                  </span>
                )}

                {/* Tagline */}
                {taglineArr.length > 0 && (
                  <div className="k-tags-wrap">
                    {taglineArr.map((t, i) => (
                      <span key={i} className="k-tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Deskripsi */}
                <div className="k-article-content">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Komentar */}
                <div className="k-komentar-section">
                  <h3 className="k-komentar-title">
                    💬 Komentar ({komentar.length})
                  </h3>

                  <div className="k-komentar-form">
                    <p className="k-komentar-form-title">Tinggalkan Komentar</p>
                    {komentarSent && (
                      <div className="k-komentar-success">
                        ✓ Komentar berhasil dikirim!
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <textarea
                        className="k-komentar-textarea"
                        placeholder="Tulis komentar Anda di sini…"
                        value={komentarText}
                        onChange={(e) => {
                          setKomentarText(e.target.value);
                          setKomentarSent(false);
                        }}
                        disabled={submitting}
                      />
                      <button
                        type="submit"
                        className="k-komentar-submit"
                        disabled={submitting || !komentarText.trim()}
                      >
                        {submitting ? "Mengirim…" : "✉ Kirim Komentar"}
                      </button>
                    </form>
                  </div>

                  {loadKomen ? (
                    <div style={{ color: "var(--k-text-muted)", fontSize: 13 }}>
                      Memuat komentar…
                    </div>
                  ) : komentar.length === 0 ? (
                    <div
                      style={{
                        color: "var(--k-text-dim)",
                        fontSize: 13,
                        padding: "12px 0",
                      }}
                    >
                      Belum ada komentar. Jadilah yang pertama!
                    </div>
                  ) : (
                    komentar.map((k) => (
                      <div key={k.id_interaksi} className="k-komentar-item">
                        <div className="k-komentar-avatar">
                          {(k.nama_user || "A").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="k-komentar-body">
                          <p className="k-komentar-name">
                            {k.nama_user || "Anonim"}
                          </p>
                          <p className="k-komentar-text">{k.isi_komentar}</p>
                          <p className="k-komentar-time">
                            {timeAgo(k.waktu_interaksi)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="k-article-actions">
                <button
                  className={`k-action-btn k-action-btn-like${liked ? " liked" : ""}`}
                  onClick={handleLike}
                >
                  {liked ? "❤️" : "🤍"} {liked ? "Disukai" : "Suka"} (
                  {fmtNum(likeCount)})
                </button>
                {item.path_file && (
                  <a
                    href={item.path_file}
                    target="_blank"
                    rel="noreferrer"
                    className="k-action-btn"
                    style={{
                      background: "var(--k-gold-pale)",
                      color: "var(--k-gold)",
                      borderColor: "rgba(201,168,76,0.3)",
                      textDecoration: "none",
                    }}
                  >
                    ⬇ Unduh File
                  </a>
                )}
                <button
                  className="k-action-btn k-action-btn-back"
                  onClick={() => navigate("/knowledge")}
                >
                  ← Kembali
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="k-sidebar">
            <div className="k-sidebar-box">
              <div className="k-sidebar-head">
                <span className="k-sidebar-head-icon">🔥</span>
                <h3 className="k-sidebar-head-title">Trending</h3>
              </div>
              {trending.map((item, i) => (
                <div
                  key={item.id_file}
                  className="k-trending-item"
                  onClick={() => navigate(`/knowledge/${item.id_file}`)}
                >
                  <span className="k-trending-rank">{i + 1}</span>
                  <div className="k-trending-body">
                    <p className="k-trending-title">{item.nama_file}</p>
                    <div className="k-trending-meta">
                      <span>{timeAgo(item.tanggal_upload)}</span>
                      <span>👁 {fmtNum(item.total_interaksi || 0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="k-sidebar-box">
              <div className="k-sidebar-head">
                <span className="k-sidebar-head-icon">📄</span>
                <h3 className="k-sidebar-head-title">Dokumen Terkait</h3>
              </div>
              {related.map((rel) => (
                <div
                  key={rel.id_file}
                  className="k-related-item"
                  onClick={() => navigate(`/knowledge/${rel.id_file}`)}
                >
                  <div className="k-related-img-placeholder">📄</div>
                  <div className="k-related-body">
                    <p className="k-related-title">{rel.nama_file}</p>
                    <p className="k-related-date">
                      {timeAgo(rel.tanggal_upload)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="k-sidebar-box">
              <div className="k-sidebar-head">
                <span className="k-sidebar-head-icon">📤</span>
                <h3 className="k-sidebar-head-title">Bagikan</h3>
              </div>
              <div style={{ padding: "14px 18px" }}>
                <div className="k-share-wrap">
                  <button
                    className="k-share-btn k-share-facebook"
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      )
                    }
                  >
                    Facebook
                  </button>
                  <button
                    className="k-share-btn k-share-twitter"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(item.nama_file)}`,
                      )
                    }
                  >
                    Twitter
                  </button>
                  <button
                    className="k-share-btn k-share-whatsapp"
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(item.nama_file + " " + window.location.href)}`,
                      )
                    }
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default KnowledgeDetail;
