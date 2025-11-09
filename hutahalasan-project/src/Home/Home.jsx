import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import Footer from "../Footer/Footer";
import Header from "../Navbar/Header";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import newsBg from "../assets/1.jpg";
import eduBg from "../assets/2.jpg";
import knowledgeBg from "../assets/gambar_huta_halasan.jpg";
import { Link } from "react-router-dom";

import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";
import img6 from "../assets/6.jpg";

import "./slideshow.css";

import Helmet from "react-helmet";

const Home = () => {
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  const documents = [
    { title: "Akta_title", description: "Akta_description" },
    { title: "SK_title", description: "SK_description" },
    { title: "Other_title", description: "Other_description" },
  ];

  const nextDoc = () => {
    setCurrentDocIndex((prev) => (prev + 1) % documents.length);
  };

  const prevDoc = () => {
    setCurrentDocIndex(
      (prev) => (prev - 1 + documents.length) % documents.length,
    );
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [slideSpeed, setSlideSpeed] = useState(600);
  const sectionRef = useRef(null);
  const slideCountRef = useRef(0);

  // Array gambar - ganti dengan URL gambar Anda
  const slides = [img1, img2, img3, img4, img5, img6];

  // Intersection Observer untuk deteksi scroll
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
      {
        threshold: 0.2,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  // Auto slide dengan cross-fade transition
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      // Set next slide
      setNextSlide((currentSlide + 1) % slides.length);

      // Tunggu separuh durasi untuk memulai fade
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        slideCountRef.current += 1;

        // Melambatkan kecepatan setelah beberapa slide
        if (slideCountRef.current === 2) {
          setSlideSpeed(1200);
        } else if (slideCountRef.current === 4) {
          setSlideSpeed(2000);
        } else if (slideCountRef.current === 6) {
          setSlideSpeed(3500);
        }
      }, slideSpeed / 2);

      // Reset transition state
      setTimeout(() => {
        setIsTransitioning(false);
      }, slideSpeed);
    }, slideSpeed);

    return () => clearInterval(interval);
  }, [isVisible, slideSpeed, slides.length, currentSlide]);

  const handleIndicatorClick = (index) => {
    setIsTransitioning(true);
    setNextSlide(index);

    setTimeout(() => {
      setCurrentSlide(index);
      setSlideSpeed(3500);
      slideCountRef.current = 6;
    }, 400);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <div className="app">
      <Helmet>
        <title>Home - Huta Halasan</title>
        <meta name="description" content="Huta Halasan" />
        <meta name="keywords" content="Huta Halasan" />
        <meta name="author" content="Huta Halasan" />
        <link rel="icon" type="image/svg+xml" href="/logo_huta_halasan.jpg" />
      </Helmet>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <img
          src={imgHutaHalasan}
          alt="Huta Halasan"
          className="hero-background"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Parmalim
              <br />
              <p className="hero-description-title"> ᯇᯒ᯲ᯔᯞᯪᯔ᯲</p>
              Bale Pasogit
              <br />
              <p className="hero-description-title">ᯅᯞᯩ ᯇᯘᯬᯎᯪᯖ᯲</p>
            </h1>
            <span className="home-hero-subtitle">Huta Halasan</span>
            <p className="hero-description-subtitle">ᯂᯮᯖ ᯂᯞᯘᯉ᯲</p>
          </div>
        </div>
      </section>

      {/* Spirituality Section */}
      <section ref={sectionRef} className="spirituality">
        {/* Slideshow Background dengan cross-fade */}
        <div className={`spirituality-slideshow ${isVisible ? "show" : ""}`}>
          {/* Dark Overlay - tetap stabil, tidak ikut pergantian slide */}
          <div className="spirituality-slide-overlay"></div>

          {/* Current Slide */}
          <div
            className={`spirituality-slide current ${isVisible ? "slide-visible" : ""}`}
            style={{
              backgroundImage: `url(${slides[currentSlide]})`,
            }}
          />

          {/* Next Slide (for cross-fade effect) */}
          {isTransitioning && (
            <div
              className="spirituality-slide next fading-in"
              style={{
                backgroundImage: `url(${slides[nextSlide]})`,
              }}
            />
          )}
        </div>

        {/* Dark Overlay - diluar slideshow agar tidak ikut transisi */}

        {/* Content dengan animasi fade-in */}
        <div className={`spirituality-overlay ${isVisible ? "show" : ""}`}>
          <div className="spirituality-content">
            <h2 className="spirituality-title">With Spirituality and Ritual</h2>
            <p className="spirituality-subtitle">to uphold God's teaching</p>
          </div>
        </div>

        {/* Slide Indicators */}
        {isVisible && (
          <div className="spirituality-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? "active" : ""}`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2 className="home-section-title">About Us</h2>
          <div className="about-content">
            <div className="about-image">
              <img
                src={imgHutaHalasan}
                alt="Bale Pasogit Building"
                className="building"
              />
            </div>
            <div className="about-text">
              <p>
                Maragam-ragam do Ugamo adong di liat Portibion. Sada sian na
                maragam-ragam i namargoar Ugamo Malim, marojahan di tonga-tonga
                bangso Batak, hinatindanghon tu Amanta Raja Nasiakbagi.
              </p>
              <br />
              <p>
                Ugamo Malim, ima sada dalan pardomuan dompak debata, marhite
                pelean ingkon ias jala malim, dohot pangihutna pe ingkon ias
                jala malim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legality Documents */}
      <section className="documents">
        <div className="container">
          <h2 className="home-section-title">Legality Documents</h2>
          <div className="documents-carousel">
            <button className="carousel-btn prev" onClick={prevDoc}>
              ‹
            </button>
            <div className="document-card">
              <div className="document-preview">
                <p>Click for preview</p>
              </div>
              <div className="document-info">
                <h3>{documents[currentDocIndex].title}</h3>
                <p>{documents[currentDocIndex].description}</p>
              </div>
            </div>
            <button className="carousel-btn next" onClick={nextDoc}>
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="organization">
        <h2 className="title">Organization Structure</h2>
      </section>

      {/* Bottom Sections */}
      <section className="bottom-sections">
        {/* News */}
        <Link
          to="/news"
          className="bottom-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${newsBg})`,
          }}
        >
          <div className="section-overlay">
            <div className="text-container">
              <h2 className="bottom-title">News</h2>
              <p className="hover-subtext">
                Menjelajahi halaman News untuk berita terbaru
              </p>
            </div>
          </div>
        </Link>

        {/* Education */}
        <Link
          to="/edu"
          className="bottom-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${eduBg})`,
          }}
        >
          <div className="section-overlay red">
            <div className="text-container">
              <h2 className="bottom-title">Educations</h2>
              <p className="hover-subtext">
                Menjelajahi halaman Education untuk materi pembelajaran
              </p>
            </div>
          </div>
        </Link>

        {/* Knowledge */}
        <Link
          to="/knowledge"
          className="bottom-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${knowledgeBg})`,
          }}
        >
          <div className="section-overlay blue">
            <div className="text-container">
              <h2 className="bottom-title">Knowledges</h2>
              <p className="hover-subtext">
                Menjelajahi halaman Knowledge untuk wawasan tambahan
              </p>
            </div>
          </div>
        </Link>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
