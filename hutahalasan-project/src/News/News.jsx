import React, { useState } from "react";
import "./news.css";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import imgHutaHalasan from '../assets/gambar_huta_halasan.jpg';

const NewsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("Related");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data untuk artikel
  const articles = [
    {
      id: 1,
      title: "Upacara Adat Batak Toba di Samosir",
      subtitle: "Ritual tradisional yang masih lestari",
      category: "Budaya",
      author: "Journalist",
      date: "2 days ago",
      image: "/api/placeholder/300/200",
      views: "1.2k",
      comments: "45",
      type: "featured",
    },
    {
      id: 2,
      title: "Festival Gondang Sabangunan 2024",
      subtitle: "Musik tradisional Batak yang memukau",
      category: "Festival",
      author: "Journalist",
      date: "3 days ago",
      image: "/api/placeholder/300/200",
      views: "856",
      comments: "32",
      type: "new",
    },
    {
      id: 3,
      title: "Sopo Godang: Arsitektur Tradisional Batak",
      subtitle: "Keindahan rumah adat yang memukau",
      category: "Arsitektur",
      author: "Journalist",
      date: "1 week ago",
      image: "/api/placeholder/300/200",
      views: "674",
      comments: "21",
      type: "regular",
    },
    {
      id: 4,
      title: "Tortor Batak: Tarian Sakral Leluhur",
      subtitle: "Makna filosofis dalam setiap gerakan",
      category: "Tarian",
      author: "Journalist",
      date: "1 week ago",
      image: "/api/placeholder/300/200",
      views: "523",
      comments: "18",
      type: "regular",
    },
    {
      id: 5,
      title: "Kuliner Khas Batak: Arsik dan Saksang",
      subtitle: "Cita rasa autentik dari Tanah Batak",
      category: "Kuliner",
      author: "Journalist",
      date: "2 weeks ago",
      image: "/api/placeholder/300/200",
      views: "789",
      comments: "28",
      type: "regular",
    },
    {
      id: 6,
      title: "Danau Toba: Warisan Alam dan Budaya",
      subtitle: "Keajaiban alam yang penuh sejarah",
      category: "Pariwisata",
      author: "Journalist",
      date: "2 weeks ago",
      image: "/api/placeholder/300/200",
      views: "912",
      comments: "35",
      type: "regular",
    },
  ];

  const trendingArticles = [
    {
      id: 7,
      title: "Ulos Batak: Kain Suci Penuh Makna",
      subtitle: "Filosofi dan kegunaan dalam kehidupan",
      category: "Budaya",
      author: "Journalist",
      date: "1 day ago",
      views: "1.3k",
      comments: "67",
    },
    {
      id: 8,
      title: "Sigale-gale: Boneka Tradisional yang Hidup",
      subtitle: "Seni pertunjukan unik dari Samosir",
      category: "Seni",
      author: "Journalist",
      date: "2 days ago",
      views: "921",
      comments: "43",
    },
    {
      id: 9,
      title: "Bahasa Batak: Pelestarian Warisan Leluhur",
      subtitle: "Upaya menjaga bahasa daerah",
      category: "Bahasa",
      author: "Journalist",
      date: "3 days ago",
      views: "756",
      comments: "29",
    },
  ];

  return (
    <div className="news-page-container">
      <Header />
      
      {/* Hero Section with Background Image */}
      <div className="news-hero-section">
        <img src={imgHutaHalasan} alt="Huta Halasan" className="news-hero-background" />
        <div className="news-hero-overlay">
          <div className="news-hero-content">
            <h1 className="news-hero-title">News</h1>
            <p className="news-hero-subtitle">(batak script)</p>
          </div>
        </div>
      </div>

      {/* News Navigation and Search */}
      <div className="news-navigation-bar">
        <div className="news-nav-content">
          <div className="news-nav-left">
            <span className="news-nav-title">News</span>
          </div>
          <div className="news-nav-center">
            <div className="news-search-container">
              <input
                type="text"
                placeholder="Type here..."
                className="news-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="news-nav-right">
            <div className="news-filter-controls">
              <select
                className="news-filter-select"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="Related">📋 Related</option>
                <option value="Popular">🔥 Popular</option>
                <option value="Recent">🕒 Recent</option>
              </select>
              <select
                className="news-sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="Latest">🧡 Latest</option>
                <option value="Oldest">📅 Oldest</option>
                <option value="Most Viewed">👀 Most Viewed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* News Content Container */}
      <div className="news-content-container">
        {/* Left Content - Main Articles */}
        <div className="news-main-content">
          {/* New Badge */}
          <div className="news-section-badge">New</div>
          
          {/* Featured Article */}
          {articles.filter(article => article.type === 'featured').map(article => (
            <div key={article.id} className="news-featured-card">
              <div className="news-featured-badge">FEATURED</div>
              <div className="news-featured-image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="news-featured-content">
                <h2 className="news-featured-title">{article.title}</h2>
                <p className="news-featured-meta">{article.subtitle} | {article.author}</p>
                <div className="news-featured-stats">
                  <span className="news-stat-item">👁 {article.views}</span>
                  <span className="news-stat-item">💬 {article.comments}</span>
                </div>
                <span className="news-category-tag">{article.category}</span>
              </div>
            </div>
          ))}

          {/* Regular Articles Grid */}
          <div className="news-articles-grid">
            {articles.filter(article => article.type !== 'featured').map((article) => (
              <div key={article.id} className="news-article-card">
                <div className="news-article-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="news-article-content">
                  <h3 className="news-article-title">{article.title}</h3>
                  <p className="news-article-meta">{article.subtitle} | {article.author}</p>
                  <div className="news-article-stats">
                    <span className="news-stat-item">👁 {article.views}</span>
                    <span className="news-stat-item">💬 {article.comments}</span>
                  </div>
                  <span className="news-category-tag">{article.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Trending */}
        <div className="news-sidebar">
          <div className="news-trending-section">
            <h2 className="news-trending-title">Trending</h2>
            
            {trendingArticles.map((article, index) => (
              <div key={article.id} className="news-trending-item">
                <div className="news-trending-number">{index + 1}</div>
                <div className="news-trending-content">
                  <h4 className="news-trending-item-title">{article.title}</h4>
                  <p className="news-trending-meta">{article.subtitle}</p>
                  <p className="news-trending-author">{article.date} | {article.author}</p>
                  <div className="news-trending-stats">
                    <span className="news-stat-item">👁 {article.views}</span>
                    <span className="news-stat-item">💬 {article.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;