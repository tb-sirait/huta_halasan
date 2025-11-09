import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import "./edu.css";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";

const Education = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Related");
  const [filterBy, setFilterBy] = useState("Latest");
  const [activeTab, setActiveTab] = useState("new");

  const navigate = useNavigate();


  // Enhanced education content data
  const educationContent = useMemo(() => [
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
      description: "Discover the rich cultural heritage of traditional Batak dance performances, showcasing centuries-old traditions and spiritual significance."
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
      description: "Learn the unique Batak script in this hands-on workshop with local experts and master the ancient writing system."
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
      description: "Explore the fascinating world of traditional Batak musical instruments and their role in cultural ceremonies."
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
      description: "Understanding the deep spiritual meaning behind Batak ceremonial rituals and their importance in community life."
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
      description: "Master the intricate art of traditional Batak weaving and learn about the cultural stories woven into every fabric."
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
      description: "Explore the architectural marvels of traditional Batak houses and their symbolic representation of cosmology."
    },
    {
      id: 7,
      title: "Culinary Heritage Workshop",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Culinary",
      date: "2024-01-01",
      views: "987",
      likes: "65",
      isNew: false,
      isTrending: false,
      description: "Learn to prepare authentic Batak dishes and understand the cultural significance of traditional cuisine."
    },
    {
      id: 8,
      title: "Storytelling and Folklore",
      subtitle: "Sajolo_time_release | Journalist",
      image: "/api/placeholder/400/250",
      category: "Literature",
      date: "2023-12-28",
      views: "756",
      likes: "43",
      isNew: false,
      isTrending: false,
      description: "Immerse yourself in the rich oral traditions and folklore that have shaped Batak cultural identity for generations."
    }
  ], []);

  // Navigation handler for content cards
  const handleContentClick = (id) => {
    navigate(`/education/${id}`);
  };

  // Filter and sort content based on user selections
  const filteredAndSortedContent = useMemo(() => {
    let filtered = educationContent.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === "new" ? item.isNew : item.isTrending;
      
      return matchesSearch && matchesTab;
    });

    // Sort based on sortBy selection
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Popular":
          return parseInt(b.likes) - parseInt(a.likes);
        case "Recent":
          return new Date(b.date) - new Date(a.date);
        case "Related":
        default:
          return 0;
      }
    });

    // Additional filter based on filterBy selection
    if (filterBy === "Oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filterBy === "Most Viewed") {
      filtered.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
    }

    return filtered;
  }, [educationContent, filterBy, searchTerm, activeTab, sortBy]);

  const featuredContent = educationContent.find((item) => item.id === 1);
  const trendingContent = educationContent
    .filter((item) => item.isTrending)
    .slice(0, 4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Optional: Add analytics or search tracking here
  };

  const handleKeyboardNavigation = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleContentClick(id);
    }
  };

  return (
    <div className="education-page">
      <Header />

      {/* Hero Section */}
      <section className="education-hero">
        <div className="hero-background">
          <img
            src={imgHutaHalasan}
            alt="Huta Halasan Traditional Village"
            className="hero-background-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Education</h1>
          <p className="hero-subtitle">Learn Traditional Batak Culture & Heritage</p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-filter-section">
        <div className="container">
          <div className="search-filter-container">
            <div className="section-header">
              <h2 className="section-title">Educational Resources</h2>
              <p className="section-description">
                Explore our comprehensive collection of Batak cultural education materials
              </p>
            </div>

            <div className="controls-container">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search courses, workshops, and content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Search educational content"
                  />
                  <button type="submit" className="search-button" aria-label="Submit search">
                    <span className="search-icon">🔍</span>
                  </button>
                </div>
              </form>

              <div className="filter-controls">
                <div className="filter-group">
                  <label htmlFor="sort-select" className="filter-label">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="Related">📊 Related</option>
                    <option value="Popular">⭐ Popular</option>
                    <option value="Recent">🕐 Recent</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-select" className="filter-label">Filter:</label>
                  <select
                    id="filter-select"
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
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <div className="content-layout">
            {/* Main Content Area */}
            <main className="main-content">
              {/* Tab Navigation */}
              <nav className="tab-navigation" role="tablist">
                <button
                  className={`tab-button ${activeTab === "new" ? "active" : ""}`}
                  onClick={() => setActiveTab("new")}
                  role="tab"
                  aria-selected={activeTab === "new"}
                  aria-controls="new-content"
                >
                  <span className="tab-icon">🆕</span>
                  <span className="tab-text">New Content</span>
                </button>
                <button
                  className={`tab-button ${activeTab === "trending" ? "active" : ""}`}
                  onClick={() => setActiveTab("trending")}
                  role="tab"
                  aria-selected={activeTab === "trending"}
                  aria-controls="trending-content"
                >
                  <span className="tab-icon">🔥</span>
                  <span className="tab-text">Trending</span>
                </button>
              </nav>

              {/* Featured Content */}
              {activeTab === "new" && featuredContent && (
                <section className="featured-section">
                  <div 
                    className="featured-card"
                    onClick={() => handleContentClick(featuredContent.id)}
                    onKeyDown={(e) => handleKeyboardNavigation(e, featuredContent.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Featured: ${featuredContent.title}`}
                  >
                    <div className="featured-image-container">
                      <img
                        src={featuredContent.image}
                        alt={featuredContent.title}
                        className="featured-image"
                      />
                      <div className="featured-overlay">
                        <span className="featured-badge">Featured</span>
                        <div className="play-indicator">
                          <span className="play-icon">▶️</span>
                        </div>
                      </div>
                    </div>
                    <div className="featured-content">
                      <header className="featured-header">
                        <h3 className="featured-title">{featuredContent.title}</h3>
                        <p className="featured-subtitle">{featuredContent.subtitle}</p>
                      </header>
                      
                      <div className="featured-meta">
                        <span className="meta-item">
                          <span className="meta-icon">👁️</span>
                          <span className="meta-value">{featuredContent.views}</span>
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">❤️</span>
                          <span className="meta-value">{featuredContent.likes}</span>
                        </span>
                        <span className="category-badge">{featuredContent.category}</span>
                      </div>
                      
                      <p className="featured-description">{featuredContent.description}</p>
                      
                      <div className="featured-action">
                        <span className="action-text">Click to learn more</span>
                        <span className="action-arrow">→</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Content Grid */}
              <section className="content-grid-section">
                <div className="content-grid" role="grid">
                  {filteredAndSortedContent
                    .filter(item => activeTab === "new" ? item.id !== 1 : true)
                    .map((item) => (
                    <article
                      key={item.id}
                      className="content-card"
                      onClick={() => handleContentClick(item.id)}
                      onKeyDown={(e) => handleKeyboardNavigation(e, item.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.title} - ${item.category}`}
                    >
                      <div className="card-image-container">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="card-image"
                        />
                        <div className="card-overlay">
                          <div className="play-button">
                            <span className="play-icon">▶️</span>
                          </div>
                        </div>
                        {item.isNew && (
                          <div className="new-badge">New</div>
                        )}
                        {item.isTrending && (
                          <div className="trending-badge">🔥</div>
                        )}
                      </div>
                      
                      <div className="card-content">
                        <header className="card-header">
                          <h4 className="card-title">{item.title}</h4>
                          <p className="card-subtitle">{item.subtitle}</p>
                        </header>
                        
                        <div className="card-meta">
                          <span className="meta-item">
                            <span className="meta-icon">👁️</span>
                            <span className="meta-value">{item.views}</span>
                          </span>
                          <span className="meta-item">
                            <span className="meta-icon">❤️</span>
                            <span className="meta-value">{item.likes}</span>
                          </span>
                          <span className="category-tag">{item.category}</span>
                        </div>

                        <p className="card-description">{item.description}</p>
                        
                        <div className="card-action">
                          <span className="learn-more">Learn More</span>
                          <span className="action-arrow">→</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredAndSortedContent.length === 0 && (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3 className="no-results-title">No Content Found</h3>
                    <p className="no-results-description">
                      Try adjusting your search terms or filters to find educational content.
                    </p>
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setActiveTab("new");
                      }}
                      className="reset-filters-button"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </section>
            </main>

            {/* Trending Sidebar */}
            <aside className="trending-sidebar">
              <div className="sidebar-container">
                <header className="sidebar-header">
                  <h3 className="sidebar-title">
                    <span className="sidebar-icon">🔥</span>
                    <span className="sidebar-text">Trending Now</span>
                  </h3>
                </header>
                
                <div className="trending-list">
                  {trendingContent.map((item, index) => (
                    <article
                      key={item.id}
                      className="trending-item"
                      onClick={() => handleContentClick(item.id)}
                      onKeyDown={(e) => handleKeyboardNavigation(e, item.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Trending #${index + 1}: ${item.title}`}
                    >
                      <div className="trending-rank">
                        <span className="rank-number">{index + 1}</span>
                      </div>
                      
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
                        <div className="trending-stats">
                          <span className="stat-item">
                            <span className="stat-icon">👁️</span>
                            <span className="stat-value">{item.views}</span>
                          </span>
                          <span className="stat-item">
                            <span className="stat-icon">❤️</span>
                            <span className="stat-value">{item.likes}</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="sidebar-footer">
                  <button 
                    onClick={() => setActiveTab("trending")}
                    className="view-all-trending"
                  >
                    View All Trending
                  </button>
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

export default Education;