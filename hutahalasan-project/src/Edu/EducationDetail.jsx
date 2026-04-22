// src/Edu/EducationDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import {
  useKontenDetail, useKontenList,
  parseParagraphs, parseGambar,
  fmtNum, timeAgo, fmtDate,
} from "../hooks/useKonten.js";
import "../styles/konten-shared.css";

const EducationDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const {
    konten, komentar, likeCount, liked,
    loading, loadKomen, error, submitting,
    handleLike, handleKomentar,
  } = useKontenDetail(id);

  const { data: allEdu } = useKontenList({ jenis_konten: "Edukasi", limit: 20 });
  const trending = [...allEdu]
    .filter((k) => k.id_konten !== id)
    .sort((a, b) => (b.total_interaksi || 0) - (a.total_interaksi || 0))
    .slice(0, 4);
  const related = allEdu.filter((k) => k.id_konten !== id).slice(0, 4);

  const [komentarText, setKomentarText] = useState("");
  const [komentarSent, setKomentarSent] = useState(false);

  const getImg = (k) => {
    const imgs = parseGambar(k?.id_gambar);
    return imgs?.[0] || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await handleKomentar(komentarText);
    if (ok) { setKomentarText(""); setKomentarSent(true); }
  };

  const share = (platform) => {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(konten?.judul || "");
    const map  = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      Twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      WhatsApp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(map[platform]);
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ background: "var(--k-bg)", fontFamily: "var(--k-font)" }}>
      <Header />
      <div className="k-detail-hero" style={{ background: "#e5e7eb" }}>
        <div className="k-skeleton" style={{ width: "100%", height: "100%", borderRadius: 0 }} />
      </div>
      <div className="k-container" style={{ padding: "32px 20px", textAlign: "center", color: "var(--k-text-muted)" }}>
        Memuat materi…
      </div>
      <Footer />
    </div>
  );

  /* ── Error ── */
  if (error || !konten) return (
    <div style={{ background: "var(--k-bg)", fontFamily: "var(--k-font)" }}>
      <Header />
      <div className="k-container" style={{ padding: "60px 20px" }}>
        <div className="k-empty">
          <div className="k-empty-icon">📚</div>
          <h3>{error || "Materi tidak ditemukan"}</h3>
          <p>Materi yang Anda cari tidak tersedia.</p>
          <button className="k-empty-btn" onClick={() => navigate("/edu")}>← Kembali ke Edukasi</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  const paragraphs = parseParagraphs(konten.isi_konten);
  const images     = parseGambar(konten.id_gambar);
  const heroImg    = getImg(konten) || imgHutaHalasan;

  return (
    <div style={{ background: "var(--k-bg)", minHeight: "100vh", fontFamily: "var(--k-font)" }}>
      <Header />

      {/* ── Hero image di atas ── */}
      <div className="k-detail-hero">
        <img src={heroImg} alt={konten.judul} className="k-detail-hero-img" />
        <div className="k-detail-hero-overlay" />
        <div className="k-detail-hero-content">
          <div style={{ maxWidth: "var(--k-container)", width: "100%", margin: "0 auto" }}>
            <span className="k-detail-hero-cat">{konten.jenis_konten}</span>
            <h1 className="k-detail-hero-title">{konten.judul}</h1>
            <div className="k-detail-hero-meta">
              <span>✍ {konten.penulis}</span>
              <span className="k-detail-hero-meta-dot" />
              <span>📅 {fmtDate(konten.tanggal_dibuat)}</span>
              <span className="k-detail-hero-meta-dot" />
              <span>👁 {fmtNum(konten.total_interaksi || 0)}</span>
              <span className="k-detail-hero-meta-dot" />
              <span>💬 {komentar.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="k-breadcrumb">
        <div className="k-breadcrumb-inner">
          <button className="k-breadcrumb-link" onClick={() => navigate("/")}>Beranda</button>
          <span className="k-breadcrumb-sep">/</span>
          <button className="k-breadcrumb-link" onClick={() => navigate("/edu")}>Edukasi</button>
          <span className="k-breadcrumb-sep">/</span>
          <span className="k-breadcrumb-curr"
            style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {konten.judul}
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
                <span className="k-tag">{konten.jenis_konten}</span>
                {konten.tagline && <span className="k-tag k-tag-purple">{konten.tagline}</span>}
                <span className="k-article-meta-sep">·</span>
                <span className="k-article-meta-item">✍ {konten.penulis}</span>
                <span className="k-article-meta-sep">·</span>
                <span className="k-article-meta-item">📅 {fmtDate(konten.tanggal_dibuat)}</span>
              </div>

              {/* Gambar tambahan */}
              {images && images.length > 1 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 8, padding: "16px 24px 0"
                }}>
                  {images.slice(1).map((img, i) => (
                    <img key={i} src={img} alt={`${konten.judul} ${i + 2}`}
                      style={{ width: "100%", borderRadius: 10, objectFit: "cover", aspectRatio: "16/9" }} />
                  ))}
                </div>
              )}

              {/* Isi */}
              <div className="k-article-body">
                {konten.nama_validator && (
                  <span className="k-validator-chip">✓ Divalidasi oleh {konten.nama_validator}</span>
                )}
                <div className="k-article-content">
                  {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>

                {/* Komentar */}
                <div className="k-komentar-section">
                  <h3 className="k-komentar-title">💬 Komentar ({komentar.length})</h3>

                  <div className="k-komentar-form">
                    <p className="k-komentar-form-title">Tinggalkan Komentar</p>
                    {komentarSent && (
                      <div className="k-komentar-success">✓ Komentar berhasil dikirim!</div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <textarea
                        className="k-komentar-textarea"
                        placeholder="Tulis komentar Anda di sini…"
                        value={komentarText}
                        onChange={(e) => { setKomentarText(e.target.value); setKomentarSent(false); }}
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
                    <div style={{ color: "var(--k-text-muted)", fontSize: 13 }}>Memuat komentar…</div>
                  ) : komentar.length === 0 ? (
                    <div style={{ color: "var(--k-text-dim)", fontSize: 13, padding: "12px 0" }}>
                      Belum ada komentar. Jadilah yang pertama!
                    </div>
                  ) : komentar.map((k) => (
                    <div key={k.id_interaksi} className="k-komentar-item">
                      <div className="k-komentar-avatar">
                        {(k.nama_user || "A").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="k-komentar-body">
                        <p className="k-komentar-name">{k.nama_user || "Anonim"}</p>
                        <p className="k-komentar-text">{k.isi_komentar}</p>
                        <p className="k-komentar-time">{timeAgo(k.waktu_interaksi)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="k-article-actions">
                <button
                  className={`k-action-btn k-action-btn-like${liked ? " liked" : ""}`}
                  onClick={handleLike}
                >
                  {liked ? "❤️" : "🤍"} {liked ? "Disukai" : "Suka"} ({fmtNum(likeCount)})
                </button>
                <button className="k-action-btn k-action-btn-share" onClick={() => share("WhatsApp")}>📤 Bagikan</button>
                <button className="k-action-btn k-action-btn-back" onClick={() => navigate("/edu")}>← Kembali ke Edukasi</button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="k-sidebar">
            <div className="k-sidebar-box">
              <div className="k-sidebar-head">
                <span className="k-sidebar-head-icon">🔥</span>
                <h3 className="k-sidebar-head-title">Trending Edukasi</h3>
              </div>
              {trending.map((item, i) => (
                <div key={item.id_konten} className="k-trending-item"
                  onClick={() => navigate(`/education/${item.id_konten}`)}>
                  <span className="k-trending-rank">{i + 1}</span>
                  <div className="k-trending-body">
                    <p className="k-trending-title">{item.judul}</p>
                    <div className="k-trending-meta">
                      <span>{timeAgo(item.tanggal_dibuat)}</span>
                      <span>👁 {fmtNum(item.total_interaksi || 0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="k-sidebar-box">
              <div className="k-sidebar-head">
                <span className="k-sidebar-head-icon">📚</span>
                <h3 className="k-sidebar-head-title">Materi Terkait</h3>
              </div>
              {related.map((item) => (
                <div key={item.id_konten} className="k-related-item"
                  onClick={() => navigate(`/education/${item.id_konten}`)}>
                  {getImg(item)
                    ? <img className="k-related-img" src={getImg(item)} alt={item.judul} />
                    : <div className="k-related-img-placeholder">📚</div>
                  }
                  <div className="k-related-body">
                    <p className="k-related-title">{item.judul}</p>
                    <p className="k-related-date">{timeAgo(item.tanggal_dibuat)}</p>
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
                  <button className="k-share-btn k-share-facebook" onClick={() => share("Facebook")}>Facebook</button>
                  <button className="k-share-btn k-share-twitter"  onClick={() => share("Twitter")}>Twitter</button>
                  <button className="k-share-btn k-share-whatsapp" onClick={() => share("WhatsApp")}>WhatsApp</button>
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

export default EducationDetail;