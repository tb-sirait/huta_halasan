import React, { useState } from "react";
import "./home.css";
import Footer from "../Footer/Footer";
import Header from "../Navbar/Header";

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
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Bale Pasogit
              <br />
              <span className="hero-subtitle">Huta Halasan</span>
            </h1>
            <p className="hero-description">(Batak Script)</p>
            <p className="hero-location">Sionggang</p>
            <p className="hero-location-sub">(South Sihon)</p>
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
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            <div className="about-image">
              <img src="/api/placeholder/300/200" alt="Bale Pasogit Building" />
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
          <h2 className="section-title">Legality Documents</h2>
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
        <div className="container">
          <h2 className="section-title white">Organization Structure</h2>
          <div className="org-chart">
            <div className="org-level-1">
              <div className="org-card">
                <div className="org-photo"></div>
                <div className="org-info">
                  <h4>Name</h4>
                  <p>Raja Hatorongan</p>
                </div>
              </div>
            </div>
            <div className="org-level-2">
              <div className="org-card">
                <div className="org-photo"></div>
                <div className="org-info">
                  <h4>Name</h4>
                  <p>Raja Namora</p>
                </div>
              </div>
              <div className="org-card">
                <div className="org-photo"></div>
                <div className="org-info">
                  <h4>Name</h4>
                  <p>Raja Parhuta</p>
                </div>
              </div>
              <div className="org-card">
                <div className="org-photo"></div>
                <div className="org-info">
                  <h4>Name</h4>
                  <p>Raja Hatorongan</p>
                </div>
              </div>
            </div>
            <div className="org-level-3">
              <div className="org-card wide">
                <p>Pamgula & Ulu Pamguna Bale Pasogit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Sections */}
      <section className="bottom-sections">
        <div className="bottom-section news-section">
          <div className="section-overlay">
            <h2 className="bottom-title">News</h2>
          </div>
        </div>
        <div className="bottom-section education-section">
          <div className="section-overlay red">
            <h2 className="bottom-title">Educations</h2>
          </div>
        </div>
        <div className="bottom-section knowledge-section">
          <div className="section-overlay blue">
            <h2 className="bottom-title">Knowledges</h2>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
