import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import Footer from "../Footer/Footer";
import Header from "../Navbar/Header";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import newsBg from "../assets/1.jpg";
import eduBg from "../assets/2.jpg";
import knowledgeBg from "../assets/gambar_huta_halasan.jpg";
import { Link } from "react-router-dom";
import MaintenanceAlert from "../utils/MaintenanceAlert";
import Calendar from "../utils/Calendar";
import BatakCalendarSEO from "../utils/SEOProject/BatakCalendarSEO";

import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";
import img6 from "../assets/6.jpg";

// ── PDF Legalitas ──
import pdfInventaris from "../assets/inventaris-huta-halasan.pdf";
import pdfSK from "../assets/sk-permohonan-terinventarisasi.pdf";

import Helmet from "react-helmet";

const Home = () => {
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [activePdf, setActivePdf] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const documents = [
    {
      title: "Surat Keterangan Terinventarisasi",
      description:
        "Tanda Inventarisasi No: 15/TI-KMA/06/2025 dari Direktorat Bina Kepercayaan Terhadap Tuhan Yang Maha Esa dan Masyarakat Adat.",
      tag: "SKT",
      file: pdfSK,
      filename: "sk-permohonan-terinventarisasi.pdf",
    },
    {
      title: "Dokumen Inventaris Dinas Pariwisata",
      description:
        "Dokumen inventaris resmi ke Dinas Pariwisata Kabupaten Toba sebagai penghayat kepercayaan berbasis tradisi Ugamo Malim.",
      tag: "Inventaris",
      file: pdfInventaris,
      filename: "inventaris-huta-halasan.pdf",
    },
  ];

  const nextDoc = () =>
    setCurrentDocIndex((prev) => (prev + 1) % documents.length);
  const prevDoc = () =>
    setCurrentDocIndex(
      (prev) => (prev - 1 + documents.length) % documents.length,
    );

  const openPdf = (pdfUrl) => {
    setActivePdf(pdfUrl);
    setPdfModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePdf = () => {
    setPdfModalOpen(false);
    setActivePdf(null);
    document.body.style.overflow = "";
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlideIdx, setNextSlideIdx] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const slides = [img1, img2, img3, img4, img5, img6];
  const SLIDE_SPEED = 4000;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, 100);
          }
        });
      },
      { threshold: 0.2 },
    );
    const ref = sectionRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setNextSlideIdx((currentSlide + 1) % slides.length);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, SLIDE_SPEED / 2);
      setTimeout(() => {
        setIsTransitioning(false);
      }, SLIDE_SPEED);
    }, SLIDE_SPEED);
    return () => clearInterval(interval);
  }, [isVisible, slides.length, currentSlide]);

  const handleIndicatorClick = (index) => {
    setIsTransitioning(true);
    setNextSlideIdx(index);
    setTimeout(() => {
      setCurrentSlide(index);
    }, 400);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <div className="hm-app">
      <MaintenanceAlert />

      <Helmet>
        <title>Horas | Kelompok Bale Pasogit Huta Halasan</title>
        <meta
          name="description"
          content="Website Resmi Kelompok Bale Pasogit Huta Halasan, menampilkan informasi tentang Ugamo Malim di Bale Pasogit Huta Halasan, kalender Batak, dan Informasi terupdate tentang Bale Pasogit Huta Halasan."
        />
        <meta
          name="keywords"
          content="Parmalim, Bale Pasogit, Huta Halasan, Parmalim Huta Halasan"
        />
        <meta name="author" content="Huta Halasan" />
        <link rel="icon" type="image/svg+xml" href="/logo_huta_halasan.jpg" />
      </Helmet>

      <Header />

      {/* ── HERO ── */}
      <section className="hm-hero">
        <img src={imgHutaHalasan} alt="Huta Halasan" className="hm-hero__bg" />
        <div className="hm-hero__veil" />
        <div className="hm-hero__content">
          <h1 className="hm-hero__title">
            Parmalim
            <span className="hm-hero__batak"> ᯇᯒ᯲ᯔᯞᯪᯔ᯲</span>
          </h1>
          <div className="hm-hero__divider" />
          <h2 className="hm-hero__subtitle">
            Bale Pasogit
            <span className="hm-hero__batak"> ᯅᯞᯩ ᯇᯘᯬᯎᯪᯖ᯲</span>
          </h2>
          <p className="hm-hero__location">
            Huta Halasan <span className="hm-hero__batak-sm">ᯂᯮᯖ ᯂᯞᯘᯉ᯲</span>
          </p>
        </div>
      </section>

      {/* ── SLIDESHOW / SPIRITUALITY ── */}
      <section ref={sectionRef} className="hm-sction-spirit">
        <div
          className={`hm-sction-spirit__slides ${isVisible ? "is-visible" : ""}`}
        >
          <div
            className={`hm-sction-spirit__slide hm-sction-spirit__slide--current ${isVisible ? "is-loaded" : ""}`}
            style={{ backgroundImage: `url(${slides[currentSlide]})` }}
          />
          {isTransitioning && (
            <div
              className="hm-sction-spirit__slide hm-sction-spirit__slide--next"
              style={{ backgroundImage: `url(${slides[nextSlideIdx]})` }}
            />
          )}
          <div className="hm-sction-spirit__overlay" />
        </div>

        <div
          className={`hm-sction-spirit__body ${isVisible ? "is-visible" : ""}`}
        >
          <p className="hm-sction-spirit__label">Hakikat Parmalim</p>
          <h2 className="hm-sction-spirit__heading">
            With Spirituality
            <br />
            and Ritual
          </h2>
          <p className="hm-sction-spirit__sub">to uphold God's teaching</p>
        </div>

        {isVisible && (
          <div className="hm-sction-spirit__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hm-sction-spirit__dot ${i === currentSlide ? "is-active" : ""}`}
                onClick={() => handleIndicatorClick(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="hm-sction-about">
        <div className="hm-sction-about__inner">
          <div className="hm-sction-about__media">
            <img
              src={imgHutaHalasan}
              alt="Bale Pasogit"
              className="hm-sction-about__img"
            />
            <div className="hm-sction-about__img-deco" />
          </div>
          <div className="hm-sction-about__text">
            <span className="hm-sction-about__label">Tentang Kami</span>
            <h2 className="hm-sction-about__heading">About Us</h2>
            <div className="hm-sction-about__rule" />
            <p className="hm-sction-about__para">
              Kelompok Bale Pasogit Partonggoan Huta Halasan merupakan
              organisasi penghayat kepercayaan berbasis tradisi Ugamo Malim yang
              berlokasi di Desa Sionggang Tengah, Kecamatan Lumban Julu,
              Kabupaten Toba, Sumatera Utara. Organisasi ini telah memperoleh
              Surat Keterangan Terinventarisasi (SKT) dari Direktorat Bina
              Kepercayaan Terhadap Tuhan Yang Maha Esa dan Masyarakat Adat
              dengan Tanda Inventarisasi No: 15/TI-KMA/06/2025, sehingga
              memiliki legitimasi formal sebagai wadah penghayat kepercayaan.
            </p>
            <p className="hm-sction-about__para">
              Kelompok Bale Pasogit Huta Halasan menganut Ajaran Ugamo Malim,
              merupakan kepercayaan yang diwariskan secara turun-temurun oleh
              leluhur Batak. Seperti definisi dari Parmalim (Par Ugamo Malim),
              yaitu "pengikut ajaran Malim", yang mempersiapkan diri dan
              persembahan yang suci dan pengikutnya harus suci dan juga bersih.
            </p>
          </div>
        </div>
      </section>

      {/* ── LEGALITY DOCUMENTS ── */}
      <section className="hm-sction-docs">
        <div className="hm-sction-docs__inner">
          <span className="hm-sction-docs__label">Legalitas</span>
          <h2 className="hm-sction-docs__heading">Legality Documents</h2>

          <div className="hm-sction-docs__carousel">
            <button
              className="hm-sction-docs__btn hm-sction-docs__btn--prev"
              onClick={prevDoc}
              aria-label="Previous"
            >
              &#8592;
            </button>

            <div className="hm-sction-docs__card">
              {/* PDF Peek Preview */}
              <div
                className="hm-sction-docs__preview hm-sction-docs__preview--clickable"
                onClick={() => openPdf(documents[currentDocIndex].file)}
                title="Klik untuk pratinjau dokumen"
              >
                {/* Iframe menampilkan halaman pertama PDF, scroll & interaksi diblokir */}
                <iframe
                  key={documents[currentDocIndex].file}
                  src={`${documents[currentDocIndex].file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title="PDF peek"
                  className="hm-sction-docs__peek-iframe"
                  tabIndex="-1"
                  aria-hidden="true"
                />
                {/* Gradient fade di bagian bawah peek */}
                <div className="hm-sction-docs__peek-fade" />
                {/* Overlay klik + label */}
                <div className="hm-sction-docs__peek-overlay">
                  <span className="hm-sction-docs__peek-label">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Pratinjau Penuh
                  </span>
                </div>
                <span className="hm-sction-docs__pdf-badge">PDF</span>
              </div>

              {/* Doc Info + Actions */}
              <div className="hm-sction-docs__info">
                <span className="hm-sction-docs__doc-tag">
                  {documents[currentDocIndex].tag}
                </span>
                <h3>{documents[currentDocIndex].title}</h3>
                <p>{documents[currentDocIndex].description}</p>

                <div className="hm-sction-docs__actions">
                  {/* Buka di tab baru */}
                  <a
                    href={documents[currentDocIndex].file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hm-sction-docs__action-btn hm-sction-docs__action-btn--view"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Buka Dokumen
                  </a>

                  {/* Unduh */}
                  <a
                    href={documents[currentDocIndex].file}
                    download={documents[currentDocIndex].filename}
                    className="hm-sction-docs__action-btn hm-sction-docs__action-btn--download"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Unduh
                  </a>
                </div>

                <div className="hm-sction-docs__counter">
                  {currentDocIndex + 1} / {documents.length}
                </div>
              </div>
            </div>

            <button
              className="hm-sction-docs__btn hm-sction-docs__btn--next"
              onClick={nextDoc}
              aria-label="Next"
            >
              &#8594;
            </button>
          </div>

          {/* Dot indicators */}
          <div className="hm-sction-docs__dots">
            {documents.map((_, i) => (
              <button
                key={i}
                className={`hm-sction-docs__dot ${i === currentDocIndex ? "is-active" : ""}`}
                onClick={() => setCurrentDocIndex(i)}
                aria-label={`Dokumen ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── PDF MODAL ── */}
      {pdfModalOpen && (
        <div className="hm-pdf-modal" onClick={closePdf}>
          <div
            className="hm-pdf-modal__box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hm-pdf-modal__header">
              <span className="hm-pdf-modal__title">
                {documents[currentDocIndex].title}
              </span>
              <div className="hm-pdf-modal__header-actions">
                <a
                  href={activePdf}
                  download={documents[currentDocIndex].filename}
                  className="hm-pdf-modal__dl-btn"
                  title="Unduh PDF"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Unduh
                </a>
                <button
                  className="hm-pdf-modal__close"
                  onClick={closePdf}
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="hm-pdf-modal__body">
              <iframe
                src={activePdf}
                title="PDF Viewer"
                className="hm-pdf-modal__iframe"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── ORGANIZATION ── */}
      <section className="hm-sction-org">
        <div className="hm-sction-org__inner">
          <span className="hm-sction-org__label">Kepengurusan</span>
          <h2 className="hm-sction-org__heading">Organization Structure</h2>
          <div className="hm-sction-org__placeholder">
            <p>Struktur organisasi akan ditampilkan di sini.</p>
          </div>
        </div>
      </section>

      {/* ── CALENDAR ── */}
      <section className="hm-sction-cal">
        <BatakCalendarSEO
          year={currentYear}
          month={currentMonth}
          showTitle={false}
        />
        <div className="hm-sction-cal__inner">
          <span className="hm-sction-cal__label">Penanggalan Batak</span>
          <h2 className="hm-sction-cal__heading">Calendar</h2>
          <Calendar />
        </div>
      </section>

      {/* ── BOTTOM LINKS ── */}
      <section className="hm-sction-links">
        <Link
          to="/news"
          className="hm-sction-links__card hm-sction-links__card--news"
          style={{ backgroundImage: `url(${newsBg})` }}
        >
          <div className="hm-sction-links__glass" />
          <div className="hm-sction-links__text">
            <span className="hm-sction-links__tag">Terbaru</span>
            <h3 className="hm-sction-links__title">News</h3>
            <p className="hm-sction-links__desc">
              Berita terbaru dari Bale Pasogit Huta Halasan
            </p>
            <span className="hm-sction-links__arrow">→</span>
          </div>
        </Link>

        <Link
          to="/edu"
          className="hm-sction-links__card hm-sction-links__card--edu"
          style={{ backgroundImage: `url(${eduBg})` }}
        >
          <div className="hm-sction-links__glass" />
          <div className="hm-sction-links__text">
            <span className="hm-sction-links__tag">Pembelajaran</span>
            <h3 className="hm-sction-links__title">Educations</h3>
            <p className="hm-sction-links__desc">
              Materi dan pelajaran tentang Ugamo Malim
            </p>
            <span className="hm-sction-links__arrow">→</span>
          </div>
        </Link>

        <Link
          to="/knowledge"
          className="hm-sction-links__card hm-sction-links__card--know"
          style={{ backgroundImage: `url(${knowledgeBg})` }}
        >
          <div className="hm-sction-links__glass" />
          <div className="hm-sction-links__text">
            <span className="hm-sction-links__tag">Wawasan</span>
            <h3 className="hm-sction-links__title">Knowledges</h3>
            <p className="hm-sction-links__desc">
              Perluas wawasan tentang budaya Batak
            </p>
            <span className="hm-sction-links__arrow">→</span>
          </div>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
