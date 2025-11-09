import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Navbar/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import "./knowledge.css";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";
import { Helmet } from "react-helmet";

const Knowledge = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Related");
  const [sortBy, setSortBy] = useState("Latest");

  // Sample data for main featured article
  const featuredArticle = {
    id: 1,
    title: "Acara Ulaon Sipaha Lima di Huta Halasan",
    subtitle: "Ritual tradisional yang masih lestari | Journalist",
    image: "/api/placeholder/600/400",
    category: "Budaya",
    views: 1200,
    comments: 45,
    isFeatured: true,
  };

  // Sample data for regular articles
  const articles = [
    {
      id: 2,
      title: "Festival Gondang Sabangunan 2024",
      subtitle: "Perayaan musik tradisional Batak | Journalist",
      image: "/api/placeholder/400/300",
      category: "Budaya",
      views: 856,
      comments: 23,
      timeAgo: "2 days ago",
    },
    {
      id: 3,
      title: "Sopo Godang: Arsitektur Tradisional Batak",
      subtitle: "Rumah adat yang penuh makna | Journalist",
      image: "/api/placeholder/400/300",
      category: "Budaya",
      views: 642,
      comments: 18,
      timeAgo: "3 days ago",
    },
  ];

  // Sample trending data
  const trendingNews = [
    {
      id: 4,
      title: "Ulos Batak: Kain Suci Penuh Makna",
      subtitle: "Filosofi dan kegunaan dalam kehidupan",
      timeAgo: "1 day ago",
      author: "Journalist",
      views: 1300,
      comments: 67,
      rank: 1,
    },
    {
      id: 5,
      title: "Sigale-gale: Boneka Tradisional yang Hidup",
      subtitle: "Seni pertunjukan unik dari Samosir",
      timeAgo: "2 days ago",
      author: "Journalist",
      views: 921,
      comments: 43,
      rank: 2,
    },
    {
      id: 6,
      title: "Bahasa Batak: Pelestarian Warisan Leluhur",
      subtitle: "Upaya menjaga bahasa daerah",
      timeAgo: "3 days ago",
      author: "Journalist",
      views: 756,
      comments: 29,
      rank: 3,
    },
  ];

  // Navigation handlers
  const handleArticleClick = (articleId) => {
    navigate(`/knowledge/${articleId}`);
  };

  const handleTrendingClick = (trendingId) => {
    // For trending items, you might want to create detail pages or redirect
    console.log(`Trending item ${trendingId} clicked`);
    // navigate(`/knowledge/${trendingId}`); // Uncomment if you want to navigate to detail
  };

  // Filter and sort functions
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic here
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    // Implement filter logic here
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Implement sort logic here
  };

  return (
    <div className="knowledge-page">
      <Helmet></Helmet>
      <title>Parbinotoan | Parmalim Bale Pasogit Huta Halasan</title>
      <meta
        name="description"
        content="Explore articles and knowledge about the culture, traditions, and heritage of Parmalim Bale Pasogit Huta Halasan."
      />
      <meta
        name="keywords"
        content="Parmalim, Huta Halasan, Parbinotoan, Parmalim bale pasogit Huta Halasan, Parmalim knowledge"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Huta Halasan" />
      <Header />

      {/* Main Content */}
      {/* Hero Section with Background Image */}
      <div className="news-hero-section">
        <div className="news-hero-overlay">
          <img
            src={imgHutaHalasan}
            alt="Huta Halasan"
            className="knowledge-hero-background"
          />
          <div className="news-hero-content">
            <h1 className="news-hero-title">Knowledge</h1>
            <p className="news-hero-subtitle">(batak script)</p>
          </div>
        </div>
      </div>

      <div className="knowledge-container">
        {/* Header Section */}
        <div className="knowledge-header">
          <h2 className="knowledge-section-title">Knowledge</h2>
          <div className="knowledge-controls">
            <div className="knowledge-search-wrapper">
              <input
                type="text"
                placeholder="Type here..."
                value={searchQuery}
                onChange={handleSearch}
                className="knowledge-search-input"
              />
            </div>
            <div className="knowledge-filter-group">
              <select
                value={selectedFilter}
                onChange={handleFilterChange}
                className="knowledge-filter-select"
              >
                <option value="Related">📋 Related</option>
                <option value="Popular">🔥 Popular</option>
                <option value="Recent">📖 Recent</option>
              </select>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="knowledge-sort-select knowledge-sort-latest"
              >
                <option value="Latest">❤️ Latest</option>
                <option value="Oldest">⏰ Oldest</option>
                <option value="Popular">🔥 Popular</option>
              </select>
            </div>
          </div>
        </div>

        <div className="knowledge-content">
          {/* News Section */}
          <div className="knowledge-news-section">
            {/* NEW Badge and Featured Article */}
            <div className="knowledge-new-badge">NEW</div>

            <div
              className="knowledge-news-featured"
              onClick={() => handleArticleClick(featuredArticle.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="knowledge-news-featured-image">
                <img src={featuredArticle.image} alt={featuredArticle.title} />
                <div className="knowledge-featured-badge">FEATURED</div>
              </div>
              <div className="knowledge-news-content">
                <h3 className="knowledge-news-title">
                  {featuredArticle.title}
                </h3>
                <p className="knowledge-news-subtitle">
                  {featuredArticle.subtitle}
                </p>
                <div className="knowledge-news-meta">
                  <div className="knowledge-meta-icons">
                    <span className="knowledge-icon">
                      👁️ {featuredArticle.views.toLocaleString()}
                    </span>
                    <span className="knowledge-icon">
                      💬 {featuredArticle.comments}
                    </span>
                  </div>
                  <div className="knowledge-category-tag">
                    {featuredArticle.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Articles */}
            <div className="knowledge-news-grid">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="knowledge-news-card"
                  onClick={() => handleArticleClick(article.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="knowledge-news-card-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="knowledge-news-card-content">
                    <h4 className="knowledge-news-card-title">
                      {article.title}
                    </h4>
                    <p className="knowledge-news-card-subtitle">
                      {article.subtitle}
                    </p>
                    <div className="knowledge-news-card-meta">
                      <div className="knowledge-meta-icons">
                        <span className="knowledge-icon">
                          👁️ {article.views}
                        </span>
                        <span className="knowledge-icon">
                          💬 {article.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div className="knowledge-trending-sidebar">
            <h3 className="knowledge-trending-header">Trending</h3>

            <div className="knowledge-trending-list">
              {trendingNews.map((item) => (
                <div
                  key={item.id}
                  className="knowledge-trending-item"
                  onClick={() => handleTrendingClick(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="knowledge-trending-rank">{item.rank}</div>
                  <div className="knowledge-trending-content">
                    <h4 className="knowledge-trending-title">{item.title}</h4>
                    <p className="knowledge-trending-subtitle">
                      {item.subtitle}
                    </p>
                    <div className="knowledge-trending-info">
                      <span className="knowledge-trending-time">
                        {item.timeAgo} | {item.author}
                      </span>
                      <div className="knowledge-trending-stats">
                        <span className="knowledge-icon">
                          👁️ {item.views.toLocaleString()}
                        </span>
                        <span className="knowledge-icon">
                          💬 {item.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Knowledge;
