// src/BalePartonggoan/BalePartonggoanDetail.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../Navbar/Header.jsx";
import Footer from "../../Footer/Footer.jsx";
import { balePartonggoanData } from "./balePartonggoan";
import "../../styles/bale-partonggoan-detail.css";

const BalePartonggoanDetail = ({ isPasogit }) => {
  const { nama } = useParams(); // untuk cabang
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil");

  // Cari data berdasarkan tipe dan slug
  const bale = isPasogit
    ? balePartonggoanData.find((b) => b.jenis === "Bale Pasogit")
    : balePartonggoanData.find((b) => b.slug === `bale-parsantian-${nama}`);

  if (!bale) {
    return (
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <div className="bpd-notfound">
          <div className="bpd-notfound-icon">🔍</div>
          <h2>Tempat ibadah tidak ditemukan</h2>
          <button className="bpd-btn-back" onClick={() => navigate(-1)}>
            ← Kembali
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { key: "profil", label: "Profil", icon: "🏛" },
    { key: "sejarah", label: "Sejarah", icon: "📜" },
    { key: "kegiatan", label: "Kegiatan", icon: "📅" },
    { key: "lokasi", label: "Lokasi", icon: "📍" },
  ];

  return (
    <div className="bpd-page">
      <Helmet>
        <title>{bale.nama} | Parmalim Bale Pasogit Huta Halasan</title>
        <meta
          name="description"
          content={`Detail informasi ${bale.nama} – ${bale.alamat}`}
        />
      </Helmet>

      <Header />

      {/* ── Hero ── */}
      <div className="bpd-hero">
        <img src={bale.gambar} alt={bale.nama} className="bpd-hero-img" />
        <div className="bpd-hero-overlay" />
        <div className="bpd-hero-content">
          <button className="bpd-breadcrumb" onClick={() => navigate(-1)}>
            ← Kembali ke Pengetahuan
          </button>
          <span
            className={`bpd-jenis-badge ${bale.jenis === "Bale Pasogit" ? "bpd-badge-pasogit" : "bpd-badge-parsantian"}`}
          >
            {bale.jenis}
          </span>
          <h1 className="bpd-hero-title">{bale.nama}</h1>
          <p className="bpd-hero-sub">
            {bale.jemaat.kk} KK · {bale.jemaat.orang} Jemaat
          </p>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bpd-tabs-wrap">
        <div className="bpd-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`bpd-tab ${activeTab === tab.key ? "bpd-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="bpd-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bpd-container">
        {/* ── PROFIL ── */}
        {activeTab === "profil" && (
          <section className="bpd-section bpd-profil">
            <div className="bpd-profil-grid">
              {/* Foto */}
              <div className="bpd-profil-img-wrap">
                <img
                  src={bale.gambar}
                  alt={bale.nama}
                  className="bpd-profil-img"
                />
                <div className="bpd-profil-img-caption">{bale.nama}</div>
              </div>

              {/* Info */}
              <div className="bpd-profil-info">
                <h2 className="bpd-profil-nama">{bale.nama}</h2>
                <div className="bpd-info-rows">
                  <div className="bpd-info-row">
                    <span className="bpd-info-label">Jenis</span>
                    <span
                      className={`bpd-jenis-tag ${bale.jenis === "Bale Pasogit" ? "bpd-tag-pasogit" : "bpd-tag-parsantian"}`}
                    >
                      {bale.jenis}
                    </span>
                  </div>
                  <div className="bpd-info-row">
                    <span className="bpd-info-label">Jumlah Jemaat</span>
                    <div className="bpd-jemaat-inline">
                      <span className="bpd-jemaat-chip">
                        <span className="bpd-jemaat-chip-val">
                          {bale.jemaat.kk}
                        </span>
                        <span className="bpd-jemaat-chip-lbl">KK</span>
                      </span>
                      <span className="bpd-jemaat-chip">
                        <span className="bpd-jemaat-chip-val">
                          {bale.jemaat.orang}
                        </span>
                        <span className="bpd-jemaat-chip-lbl">Orang</span>
                      </span>
                    </div>
                  </div>
                  <div className="bpd-info-row">
                    <span className="bpd-info-label">Alamat</span>
                    <span className="bpd-info-value">{bale.alamat}</span>
                  </div>
                  <div className="bpd-info-row">
                    <span className="bpd-info-label">Ulu Punguan</span>
                    <span className="bpd-info-value bpd-ulu">
                      {bale.uluPunguan}
                    </span>
                  </div>
                  <div className="bpd-info-row">
                    <span className="bpd-info-label">Koordinat</span>
                    <span className="bpd-info-value bpd-koordinat">
                      {bale.koordinat.lat}, {bale.koordinat.lng}
                    </span>
                  </div>
                  <div className="bpd-info-row">
                    <span className="bpd-info-label">Tanggal Peresmian</span>
                    <span className="bpd-info-value">
                      {bale.sejarah.tanggalPeresmian}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── SEJARAH ── */}
        {activeTab === "sejarah" && (
          <section className="bpd-section">
            <h2 className="bpd-section-title">Sejarah Punguan</h2>

            <div className="bpd-sejarah-wrap">
              {/* Milestones */}
              <div className="bpd-timeline">
                <div className="bpd-timeline-item">
                  <div className="bpd-timeline-dot bpd-dot-1" />
                  <div className="bpd-timeline-content">
                    <span className="bpd-timeline-label">
                      Peletakan Batu Pertama
                    </span>
                    <span className="bpd-timeline-date">
                      {bale.sejarah.tanggalBatuPertama}
                    </span>
                  </div>
                </div>
                <div className="bpd-timeline-item">
                  <div className="bpd-timeline-dot bpd-dot-2" />
                  <div className="bpd-timeline-content">
                    <span className="bpd-timeline-label">
                      Peresmian & Turpuk
                    </span>
                    <span className="bpd-timeline-date">
                      {bale.sejarah.tanggalPeresmian}
                    </span>
                  </div>
                </div>
                <div className="bpd-timeline-item">
                  <div className="bpd-timeline-dot bpd-dot-3" />
                  <div className="bpd-timeline-content">
                    <span className="bpd-timeline-label">
                      Pardebataan Punguan & Turpuk
                    </span>
                    <span className="bpd-timeline-date">
                      {bale.sejarah.tanggalPardebataan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Narasi */}
              <div className="bpd-narasi">
                <p>
                  <strong>{bale.nama}</strong> merupakan salah satu tempat
                  peribadatan dalam lingkungan Parmalim yang berkedudukan di{" "}
                  {bale.alamat}. Proses pembangunan{" "}
                  {bale.jenis === "Bale Pasogit"
                    ? "Bale Pasogit"
                    : "Bale Parsantian"}{" "}
                  ini dimulai dengan peletakan batu pertama pada tanggal{" "}
                  <strong>{bale.sejarah.tanggalBatuPertama}</strong>, yang
                  menjadi tonggak awal bagi terwujudnya tempat ibadah yang
                  dinantikan oleh seluruh umat Parmalim di wilayah ini.
                </p>
                <p>
                  Setelah melalui proses pembangunan yang penuh semangat
                  kebersamaan, {bale.nama} secara resmi diresmikan dan
                  dipangomgomhon tu Bale Pasogit pada tanggal{" "}
                  <strong>{bale.sejarah.tanggalPeresmian}</strong>. Peresmian
                  ini menjadi momen bersejarah yang dihadiri oleh seluruh warga
                  punguan beserta tokoh-tokoh Parmalim dari berbagai daerah.
                </p>
                <p>
                  Selanjutnya, ditetapkan pula Pardebataan Punguan dan Turpuk
                  pada tanggal{" "}
                  <strong>{bale.sejarah.tanggalPardebataan}</strong>, yang
                  menandai kematangan organisasi punguan secara administratif
                  dan spiritual. Sejak saat itu, {bale.nama} telah menjalankan
                  fungsinya sebagai pusat kegiatan ibadah, pembinaan rohani,
                  serta kegiatan sosial-budaya bagi seluruh umat Parmalim di
                  lingkungan {bale.dataRuas}.
                </p>
                <p>
                  Hingga saat ini, {bale.nama} dipimpin oleh{" "}
                  <strong>{bale.uluPunguan}</strong> yang mengemban amanah
                  sebagai Ulu Punguan dengan penuh dedikasi dan tanggung jawab
                  kepada seluruh umat yang bernaung di bawah punguan ini.
                </p>
              </div>

              {/* Daftar Ulu Punguan */}
              <div className="bpd-ulu-list-wrap">
                <h3 className="bpd-sub-title">
                  Daftar Ulu Punguan yang Pernah Menjabat
                </h3>
                <div className="bpd-ulu-list">
                  {bale.sejarah.daftarUluPunguan.map((ulu, i) => (
                    <div key={i} className="bpd-ulu-item">
                      <span className="bpd-ulu-no">{i + 1}</span>
                      <div className="bpd-ulu-info">
                        <span className="bpd-ulu-nama">{ulu.nama}</span>
                        <span className="bpd-ulu-periode">{ulu.periode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── KEGIATAN ── */}
        {activeTab === "kegiatan" && (
          <section className="bpd-section">
            <h2 className="bpd-section-title">Daftar Kegiatan Punguan</h2>
            <p className="bpd-section-desc">
              Berikut adalah kegiatan-kegiatan yang berlangsung secara rutin
              maupun berkala di {bale.nama}.
            </p>
            <div className="bpd-kegiatan-grid">
              {bale.kegiatan.map((k, i) => (
                <div key={k.id} className="bpd-kegiatan-card">
                  <div className="bpd-kegiatan-no">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="bpd-kegiatan-body">
                    <h3 className="bpd-kegiatan-nama">{k.nama}</h3>
                    <p className="bpd-kegiatan-waktu">
                      <span className="bpd-icon">🕐</span> {k.tanggal}
                    </p>
                    <p className="bpd-kegiatan-ket">{k.keterangan}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── LOKASI ── */}
        {activeTab === "lokasi" && (
          <section className="bpd-section">
            <h2 className="bpd-section-title">Detail Lokasi</h2>

            <div className="bpd-lokasi-wrap">
              {/* Info Alamat */}
              <div className="bpd-alamat-box">
                <div className="bpd-alamat-header">
                  <span className="bpd-alamat-icon">📍</span>
                  <h3 className="bpd-alamat-title">Alamat Lengkap</h3>
                </div>
                <p className="bpd-alamat-text">{bale.alamat}</p>

                <div className="bpd-koordinat-row">
                  <div className="bpd-koordinat-item">
                    <span className="bpd-koordinat-label">Latitude</span>
                    <span className="bpd-koordinat-val">
                      {bale.koordinat.lat}
                    </span>
                  </div>
                  <div className="bpd-koordinat-item">
                    <span className="bpd-koordinat-label">Longitude</span>
                    <span className="bpd-koordinat-val">
                      {bale.koordinat.lng}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${bale.koordinat.lat},${bale.koordinat.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bpd-gmaps-btn"
                >
                  🗺 Buka di Google Maps
                </a>
              </div>

              {/* Google Maps Embed */}
              <div className="bpd-map-wrap">
                <div className="bpd-map-label">Peta Lokasi</div>
                <iframe
                  className="bpd-map-iframe"
                  title={`Peta ${bale.nama}`}
                  src={`https://maps.google.com/maps?q=${bale.koordinat.lat},${bale.koordinat.lng}&z=16&output=embed`}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BalePartonggoanDetail;
