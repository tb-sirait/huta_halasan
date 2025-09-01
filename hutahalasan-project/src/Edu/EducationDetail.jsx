import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import "./EducationDetail.css";

const educationContent = [
  {
    id: 1,
    title: "Traditional Batak Dance Performance",
    subtitle: "2024-01-15 | Journalist",
    image: "/api/placeholder/400/250",
    category: "Culture",
    views: "1.2k",
    likes: "89",
    content: `Traditional Batak dance is a mesmerizing cultural expression that has been passed down through generations in North Sumatra. These performances are not merely entertainment but serve as a bridge connecting the present with ancestral wisdom and spiritual beliefs.

    The intricate movements tell stories of daily life, mythology, and important social events. Each gesture carries meaning, from the graceful hand movements that mimic the flow of Lake Toba's waters to the powerful foot stomps that honor the earth spirits.

    In this comprehensive workshop, participants will learn about the different types of Batak dances, including the ceremonial Tor-tor dance performed during important rituals and celebrations. Local master dancers will guide you through the basic movements and explain the cultural significance behind each performance.

    The workshop also covers traditional costumes, music accompaniment using gondang instruments, and the role of dance in Batak society. This is an excellent opportunity to immerse yourself in authentic Batak culture and gain a deeper appreciation for this beautiful art form.`,
    isTrending: true,
  },
  {
    id: 2,
    title: "Batak Script Learning Workshop",
    subtitle: "2024-01-12 | Journalist",
    image: "/api/placeholder/400/250",
    category: "Language",
    views: "856",
    likes: "67",
    content: `The Batak script, known as Surat Batak or Aksara Batak, is an ancient writing system that has been used by the Batak people for centuries. This unique script is not just a means of communication but a repository of cultural knowledge and spiritual wisdom.

    In this intensive workshop, participants will discover the fascinating history of Batak script, learn the basic characters and their pronunciation, and understand how this writing system has evolved over time. Expert linguists and cultural scholars will guide you through hands-on exercises.

    The workshop covers practical applications of Batak script in modern contexts, including its use in traditional ceremonies, ancient manuscripts called pustaha, and contemporary cultural preservation efforts. You'll also learn about the different regional variations of the script across Batak territories.

    By the end of this workshop, participants will be able to read simple Batak texts and write basic words in this beautiful script. This knowledge opens doors to understanding traditional Batak literature, folklore, and cultural documents that are otherwise inaccessible to those unfamiliar with the script.`,
    isTrending: true,
  },
  {
    id: 3,
    title: "Batak Architecture Heritage Tour",
    subtitle: "2024-01-10 | Journalist",
    image: "/api/placeholder/400/250",
    category: "Architecture",
    views: "742",
    likes: "54",
    content: `Batak traditional architecture represents one of Indonesia's most distinctive and sophisticated building traditions. The iconic boat-shaped roofs and intricate wood carvings tell stories of cosmology, social hierarchy, and environmental adaptation.

    This heritage tour takes you through authentic Batak villages where traditional houses (Rumah Bolon) still stand as living monuments to ancestral wisdom. You'll explore the symbolic meanings behind architectural elements and understand how these structures reflect Batak worldview.`,
    isTrending: false,
  },
  {
    id: 4,
    title: "Batak Culinary Masterclass",
    subtitle: "2024-01-08 | Journalist",
    image: "/api/placeholder/400/250",
    category: "Culinary",
    views: "923",
    likes: "78",
    content: `Experience the rich flavors of Batak cuisine in this hands-on culinary masterclass. Learn to prepare traditional dishes like Arsik (spiced fish), Saksang (pork curry), and Panggang (grilled specialties) using authentic recipes and techniques.

    Our expert chefs will guide you through the use of traditional spices and cooking methods that have been perfected over generations. Understand the cultural significance of food in Batak society and how meals bring communities together.`,
    isTrending: false,
  },
];

const EducationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const content = educationContent.find((item) => item.id === parseInt(id));
  const trendingContent = educationContent.filter((item) => item.isTrending);

  if (!content) {
    return (
      <div>
        <Header />
        <div className="error-container">
          <h2>Content Not Found</h2>
          <p>The requested educational content could not be found.</p>
          <button 
            onClick={() => navigate("/edu")} 
            className="back-button"
          >
            ← Back to Education
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleTrendingClick = (itemId) => {
    navigate(`/education/${itemId}`);
  };

  const handleBackClick = () => {
    navigate("/edu");
  };

  return (
    <div className="education-detail-page">
      <Header />

      {/* Hero Section */}
      <section className="detail-hero">
        <div className="hero-background">
          <img
            src={imgHutaHalasan}
            alt="Huta Halasan"
            className="hero-background-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">{content.title}</h1>
          <p className="hero-subtitle">{content.subtitle}</p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="detail-section">
        <div className="container">
          <div className="detail-layout">
            {/* Main Content */}
            <main className="detail-main">
              <article className="content-article">
                <div className="article-image-container">
                  <img 
                    src={content.image} 
                    alt={content.title}
                    className="article-image"
                  />
                </div>
                
                <header className="article-header">
                  <h2 className="article-title">{content.title}</h2>
                  <p className="article-subtitle">{content.subtitle}</p>
                  
                  <div className="article-meta">
                    <span className="meta-item">
                      <span className="meta-icon">👁️</span>
                      <span className="meta-text">{content.views}</span>
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">❤️</span>
                      <span className="meta-text">{content.likes}</span>
                    </span>
                    <span className="meta-item">
                      <span className="meta-category">{content.category}</span>
                    </span>
                  </div>
                </header>

                <div className="article-content">
                  {content.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="content-paragraph">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>

                <div className="article-actions">
                  <button
                    onClick={handleBackClick}
                    className="back-button"
                    type="button"
                  >
                    <span className="button-icon">←</span>
                    <span className="button-text">Back to Education</span>
                  </button>
                </div>
              </article>
            </main>

            {/* Trending Sidebar */}
            <aside className="detail-sidebar">
              <div className="sidebar-container">
                <h3 className="sidebar-title">Trending</h3>
                
                <div className="trending-list">
                  {trendingContent.map((item) => (
                    <article
                      key={item.id}
                      className="trending-item"
                      onClick={() => handleTrendingClick(item.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleTrendingClick(item.id);
                        }
                      }}
                    >
                      <div className="trending-image-container">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="trending-image"
                        />
                      </div>
                      
                      <div className="trending-content">
                        <h4 className="trending-title">{item.title}</h4>
                        <p className="trending-subtitle">{item.subtitle}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EducationDetail;