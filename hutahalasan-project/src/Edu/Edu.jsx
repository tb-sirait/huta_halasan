import React, { useState } from "react";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import "./edu.css";

const Education = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Related");
  const [filterBy, setFilterBy] = useState("Latest");
  const [activeTab, setActiveTab] = useState("new");

  // Sample data for education content
  const educationContent = [
    {
      id: 1,
      title: "Traditional Batak Dance Performance",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Culture",
      date: "2024-01-15",
      views: "1.2k",
      likes: "89",
      isNew: true,
      isTrending: true,
    },
    {
      id: 2,
      title: "Batak Script Learning Workshop",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Language",
      date: "2024-01-12",
      views: "856",
      likes: "67",
      isNew: true,
      isTrending: true,
    },
    {
      id: 3,
      title: "Traditional Music Instruments",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Music",
      date: "2024-01-10",
      views: "743",
      likes: "52",
      isNew: false,
      isTrending: false,
    },
    {
      id: 4,
      title: "Ceremonial Rituals Explained",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Tradition",
      date: "2024-01-08",
      views: "921",
      likes: "78",
      isNew: false,
      isTrending: true,
    },
    {
      id: 5,
      title: "Weaving Traditions of Batak",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Craft",
      date: "2024-01-05",
      views: "634",
      likes: "41",
      isNew: false,
      isTrending: false,
    },
    {
      id: 6,
      title: "Architecture of Traditional Houses",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Architecture",
      date: "2024-01-03",
      views: "1.1k",
      likes: "92",
      isNew: false,
      isTrending: true,
    },
  ];

  const filteredContent = educationContent.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "new" ? item.isNew : item.isTrending;
    return matchesSearch && matchesTab;
  });

  const featuredContent = educationContent.find((item) => item.id === 1);
  const trendingContent = educationContent
    .filter((item) => item.isTrending)
    .slice(0, 3);

  return (
    <div className="education-page">
      <Header />

      {/* Hero Section */}
      <section className="education-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Education</h1>
            <p className="hero-subtitle">(batak script)</p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-filter-section">
        <div className="container">
          <div className="search-filter-container">
            <div className="section-title-container">
              <h2 className="section-title">Education</h2>
            </div>

            <div className="controls-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Find more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="filter-controls">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="Related">📊 Related</option>
                  <option value="Popular">⭐ Popular</option>
                  <option value="Recent">🕐 Recent</option>
                </select>

                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="Latest">🔥 Latest</option>
                  <option value="Oldest">📅 Oldest</option>
                  <option value="Most Viewed">👁️ Most Viewed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs and Grid */}
      <section className="content-section">
        <div className="container">
          <div className="content-layout">
            {/* Left Column - New & Content Grid */}
            <div className="left-column">
              {/* Tab Navigation */}
              <div className="tab-navigation">
                <button
                  className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
                  onClick={() => setActiveTab("new")}
                >
                  New
                </button>
              </div>

              {/* Featured Content */}
              {activeTab === "new" && featuredContent && (
                <div className="featured-content">
                  <div className="featured-card">
                    <div className="featured-image">
                      <img
                        src={featuredContent.image}
                        alt={featuredContent.title}
                      />
                      <div className="featured-overlay">
                        <span className="featured-badge">Featured</span>
                      </div>
                    </div>
                    <div className="featured-info">
                      <h3 className="featured-title">
                        {featuredContent.title}
                      </h3>
                      <p className="featured-subtitle">
                        {featuredContent.subtitle}
                      </p>
                      <div className="featured-meta">
                        <span className="views">
                          👁️ {featuredContent.views}
                        </span>
                        <span className="likes">
                          ❤️ {featuredContent.likes}
                        </span>
                        <span className="category">
                          {featuredContent.category}
                        </span>
                      </div>
                      <p className="featured-description">
                        Discover the rich cultural heritage of traditional Batak
                        dance performances, showcasing centuries-old traditions
                        and spiritual significance.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Grid */}
              <div className="content-grid">
                {filteredContent.slice(1).map((item) => (
                  <div key={item.id} className="content-card">
                    <div className="card-image">
                      <img src={item.image} alt={item.title} />
                      <div className="card-overlay">
                        <div className="play-button">▶️</div>
                      </div>
                    </div>
                    <div className="card-content">
                      <h4 className="card-title">{item.title}</h4>
                      <p className="card-subtitle">{item.subtitle}</p>
                      <div className="card-meta">
                        <span className="views">👁️ {item.views}</span>
                        <span className="likes">❤️ {item.likes}</span>
                        <span className="category">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Trending */}
            <div className="right-column">
              <div className="trending-section">
                <h3 className="trending-title">Trending</h3>
                <div className="trending-content">
                  {trendingContent.map((item, index) => (
                    <div key={item.id} className="trending-card">
                      <div className="trending-image">
                        <img src={item.image} alt={item.title} />
                        <div className="trending-rank">{index + 1}</div>
                      </div>
                      <div className="trending-info">
                        <h4 className="trending-card-title">{item.title}</h4>
                        <p className="trending-card-subtitle">
                          {item.subtitle}
                        </p>
                        <div className="trending-meta">
                          <span className="views">👁️ {item.views}</span>
                          <span className="likes">❤️ {item.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Education;
