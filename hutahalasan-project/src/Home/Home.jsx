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

import Helmet from "react-helmet";

const Home = () => {
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const documents = [
    { title: "Akta_title", description: "Akta_description" },
    { title: "SK_title", description: "SK_description" },
    { title: "Other_title", description: "Other_description" },
  ];

  const nextDoc = () => setCurrentDocIndex((prev) => (prev + 1) % documents.length);
  const prevDoc = () => setCurrentDocIndex((prev) => (prev - 1 + documents.length) % documents.length);

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
            setTimeout(() => { setIsVisible(true); setHasAnimated(true); }, 100);
          }
        });
      },
      { threshold: 0.2 }
    );
    const ref = sectionRef.current;
    if (ref) observer.observe(ref);
    return () => { if (ref) observer.unobserve(ref); };
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setNextSlideIdx((currentSlide + 1) % slides.length);
      setTimeout(() => { setCurrentSlide((prev) => (prev + 1) % slides.length); }, SLIDE_SPEED / 2);
      setTimeout(() => { setIsTransitioning(false); }, SLIDE_SPEED);
    }, SLIDE_SPEED);
    return () => clearInterval(interval);
  }, [isVisible, slides.length, currentSlide]);

  const handleIndicatorClick = (index) => {
    setIsTransitioning(true);
    setNextSlideIdx(index);
    setTimeout(() => { setCurrentSlide(index); }, 400);
    setTimeout(() => { setIsTransitioning(false); }, 800);
  };

  return (
    <div className="hm-app">
      <MaintenanceAlert />

      <Helmet>
        <title>Horas | Kelompok Bale Pasogit Huta Halasan</title>
        <meta name="description" content="Website Resmi Kelompok Bale Pasogit Huta Halasan, menampilkan informasi tentang Ugamo Malim di Bale Pasogit Huta Halasan, kalender Batak, dan Informasi terupdate tentang Bale Pasogit Huta Halasan." />
        <meta name="keywords" content="Parmalim, Bale Pasogit, Huta Halasan, Parmalim Huta Halasan" />
        <meta name="author" content="Huta Halasan" />
        <link rel="icon" type="image/svg+xml" href="/logo_huta_halasan.jpg" />
      </Helmet>

      <Header />

      {/* ── HERO ── */}
      <section className="hm-hero">
        <img src={imgHutaHalasan} alt="Huta Halasan" className="hm-hero__bg" />
        <div className="hm-hero__veil" />
        <div className="hm-hero__content">
          <span className="hm-hero__eyebrow">Ugamo Malim</span>
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
          <a href="#about" className="hm-hero__cta">Kenali Kami</a>
        </div>
        <div className="hm-hero__scroll-hint">
          <span />
        </div>
      </section>

      {/* ── SLIDESHOW / SPIRITUALITY ── */}
      <section ref={sectionRef} className="hm-sction-spirit">
        <div className={`hm-sction-spirit__slides ${isVisible ? "is-visible" : ""}`}>
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

        <div className={`hm-sction-spirit__body ${isVisible ? "is-visible" : ""}`}>
          <p className="hm-sction-spirit__label">Hakikat Parmalim</p>
          <h2 className="hm-sction-spirit__heading">With Spirituality<br />and Ritual</h2>
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
            <img src={imgHutaHalasan} alt="Bale Pasogit" className="hm-sction-about__img" />
            <div className="hm-sction-about__img-deco" />
          </div>
          <div className="hm-sction-about__text">
            <span className="hm-sction-about__label">Tentang Kami</span>
            <h2 className="hm-sction-about__heading">About Us</h2>
            <div className="hm-sction-about__rule" />
            <p className="hm-sction-about__para">
              Maragam-ragam do Ugamo adong di liat Portibion. Sada sian na
              maragam-ragam i namargoar Ugamo Malim, marojahan di tonga-tonga
              bangso Batak, hinatindanghon tu Amanta Raja Nasiakbagi.
            </p>
            <p className="hm-sction-about__para">
              Ugamo Malim, ima sada dalan pardomuan dompak debata, marhite
              pelean ingkon ias jala malim, dohot pangihutna pe ingkon ias
              jala malim.
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
            <button className="hm-sction-docs__btn hm-sction-docs__btn--prev" onClick={prevDoc} aria-label="Previous">&#8592;</button>
            <div className="hm-sction-docs__card">
              <div className="hm-sction-docs__preview">
                <svg width="48" height="64" viewBox="0 0 48 64" fill="none">
                  <rect width="48" height="64" rx="4" fill="#e8ddd0"/>
                  <rect x="8" y="12" width="32" height="4" rx="2" fill="#c4a882"/>
                  <rect x="8" y="22" width="24" height="3" rx="1.5" fill="#d4c5b0"/>
                  <rect x="8" y="30" width="28" height="3" rx="1.5" fill="#d4c5b0"/>
                  <rect x="8" y="38" width="20" height="3" rx="1.5" fill="#d4c5b0"/>
                  <rect x="8" y="46" width="25" height="3" rx="1.5" fill="#d4c5b0"/>
                </svg>
                <p>Klik untuk pratinjau</p>
              </div>
              <div className="hm-sction-docs__info">
                <h3>{documents[currentDocIndex].title}</h3>
                <p>{documents[currentDocIndex].description}</p>
                <div className="hm-sction-docs__counter">
                  {currentDocIndex + 1} / {documents.length}
                </div>
              </div>
            </div>
            <button className="hm-sction-docs__btn hm-sction-docs__btn--next" onClick={nextDoc} aria-label="Next">&#8594;</button>
          </div>
        </div>
      </section>

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
        <BatakCalendarSEO year={currentYear} month={currentMonth} showTitle={false} />
        <div className="hm-sction-cal__inner">
          <span className="hm-sction-cal__label">Penanggalan Batak</span>
          <h2 className="hm-sction-cal__heading">Calendar</h2>
          <Calendar />
        </div>
      </section>

      {/* ── BOTTOM LINKS ── */}
      <section className="hm-sction-links">
        <Link to="/news" className="hm-sction-links__card hm-sction-links__card--news" style={{ backgroundImage: `url(${newsBg})` }}>
          <div className="hm-sction-links__glass" />
          <div className="hm-sction-links__text">
            <span className="hm-sction-links__tag">Terbaru</span>
            <h3 className="hm-sction-links__title">News</h3>
            <p className="hm-sction-links__desc">Berita terbaru dari Bale Pasogit Huta Halasan</p>
            <span className="hm-sction-links__arrow">→</span>
          </div>
        </Link>

        <Link to="/edu" className="hm-sction-links__card hm-sction-links__card--edu" style={{ backgroundImage: `url(${eduBg})` }}>
          <div className="hm-sction-links__glass" />
          <div className="hm-sction-links__text">
            <span className="hm-sction-links__tag">Pembelajaran</span>
            <h3 className="hm-sction-links__title">Educations</h3>
            <p className="hm-sction-links__desc">Materi dan pelajaran tentang Ugamo Malim</p>
            <span className="hm-sction-links__arrow">→</span>
          </div>
        </Link>

        <Link to="/knowledge" className="hm-sction-links__card hm-sction-links__card--know" style={{ backgroundImage: `url(${knowledgeBg})` }}>
          <div className="hm-sction-links__glass" />
          <div className="hm-sction-links__text">
            <span className="hm-sction-links__tag">Wawasan</span>
            <h3 className="hm-sction-links__title">Knowledges</h3>
            <p className="hm-sction-links__desc">Perluas wawasan tentang budaya Batak</p>
            <span className="hm-sction-links__arrow">→</span>
          </div>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;