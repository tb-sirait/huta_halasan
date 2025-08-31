import React, { useState } from "react";
import "./home.css";
import Footer from "../Footer/Footer";
import Header from "../Navbar/Header";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import newsBg from "../assets/1.jpg";
import eduBg from "../assets/2.jpg";
import knowledgeBg from "../assets/gambar_huta_halasan.jpg";
import { Link } from "react-router-dom";

const App = () => {
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

  return (
    <div className="app">
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
              Bale Pasogit
              <br />
              <p className="hero-description-title">ᯅᯞᯩ ᯇᯘᯬᯎᯪᯖ᯲</p>
            </h1>
            <span className="home-hero-subtitle">Huta Halasan</span>
            <p className="hero-description-subtitle">ᯂᯮᯖ ᯂᯞᯘᯉ᯲</p>
            <p className="hero-location">Sionggang</p>
            <p className="hero-description-subtitle">ᯘᯪᯀᯬᯰᯎᯰ</p>
          </div>
        </div>
      </section>

      {/* Spirituality Section */}
      <section className="spirituality">
        <div className="spirituality-overlay">
          <div className="spirituality-content">
            <h2 className="spirituality-title">With Spirituality and Ritual</h2>
            <p className="spirituality-subtitle">to uphold God's teaching</p>
          </div>
        </div>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                tempor leo elit, nec fringilla ipsum bibendum sed. Nulla
                iaculisque ligula vel arcu bibendum molestie. Aenec vehica est
                posuere facilisi mauris. Mauris varius sagittis arcu. Nec
                convallis. Malesuadta pellentesqu habitant morbi tristique
                senectus et netus et malesuadta fames ac turpis egestas mauris,
                ut lorem. Sed et tempor ex. Aliquam leo lectus, blandit vel
                placerat tempor non, vitae et temos ut et ligula auctor, in
                aliquet tortor suscipit. Donec ut lorem vel eros consequat
                laoreet. Donec non orci magna.
              </p>
              <br />
              <p>
                Duis volutpdat sapien ut lorem comvallis, eu phareta risus
                rhoncus. Aliquam pretium arcu arcu, et consectetur diam aliquam
                eu. Fuisus ribus massa, pellentesque bibendum dignissim A
                bibendum imperdiet ut mauris a a bibenddm aliquam urna. Maecenas
                pellentesque bibendum adipiscing ut lorem. Aliquam arget
                vulputate. Mauris dictum ipsum ligula, non dignissim massa
                suscipit eget eu. Maecenas semper ut mauris mauris consequat.
                Praesent mattis. Etiam porta Cras vitae orci non augue consequat
                blandit.
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

        <div className="org-chart">
          {/* Level 1 */}
          <div className="org-level level-1">
            <div className="org-card">
              <div className="org-photo">
                <img src="/images/raja-habonoron.png" alt="Raja Habonoron" />
              </div>
              <p className="name">Raja Habonoron</p>
            </div>
          </div>

          {/* Connector */}
          <div className="connector vertical"></div>
          <div className="connector horizontal"></div>

          {/* Level 2 */}
          <div className="org-level level-2">
            <div className="org-card">
              <div className="org-photo">
                <img src="/images/raja-namora.png" alt="Raja Namora" />
              </div>
              <p className="name">Raja Namora</p>
            </div>
            <div className="org-card">
              <div className="org-photo">
                <img src="/images/raja-huta.png" alt="Raja Huta" />
              </div>
              <p className="name">Raja Huta</p>
            </div>
            <div className="org-card">
              <div className="org-photo">
                <img src="/images/raja-hatorongan.png" alt="Raja Hatorongan" />
              </div>
              <p className="name">Raja Hatorongan</p>
            </div>
          </div>

          {/* Connector */}
          <div className="connector vertical down"></div>

          {/* Level 3 */}
          <div className="org-level level-3">
            <div className="org-card wide">
              <p>Pangula & Ulu Punguan Bale Pasogit</p>
            </div>
          </div>
        </div>
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

export default App;
