import React from "react";
import "./newsDetail.css";
import Header from "../Navbar/Header";
import Footer from "../Footer/Footer";
import imgHutaHalasan from "../assets/gambar_huta_halasan.jpg";

const NewsDetail = ({ article, onBack }) => {
  if (!article) {
    return (
      <div className="news-detail-container">
        <Header />
        <div className="news-detail-error">
          <h2>Artikel tidak ditemukan</h2>
          <button onClick={onBack} className="back-button">
            Kembali ke News
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="news-detail-container">
      <Header />

      {/* Hero Section with Background Image */}
      <div className="news-detail-hero">
        <img
          src={imgHutaHalasan}
          alt="Huta Halasan"
          className="news-detail-hero-background"
        />
        <div className="news-detail-hero-overlay">
          <div className="news-detail-hero-content">
            <span className="news-detail-category">{article.category}</span>
            <h1 className="news-detail-title">{article.title}</h1>
            <p className="news-detail-subtitle">{article.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Back Button and Navigation */}
      <div className="news-detail-nav">
        <button onClick={onBack} className="news-detail-back-btn">
          ← Kembali ke News
        </button>
        <div className="news-detail-breadcrumb">
          <span>News</span> / <span>{article.category}</span> / <span>{article.title}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="news-detail-content">
        <div className="news-detail-main">
          {/* Article Header */}
          <div className="news-detail-header">
            <h1 className="news-detail-main-title">{article.title}</h1>
            <div className="news-detail-meta">
              <div className="news-detail-meta-left">
                <span className="news-detail-author">By {article.author}</span>
                <span className="news-detail-date">{article.date}</span>
                <span className="news-detail-category-tag">{article.category}</span>
              </div>
              <div className="news-detail-meta-right">
                <span className="news-detail-views">👁 {article.views}</span>
                <span className="news-detail-comments">💬 {article.comments}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="news-detail-featured-image">
            <img src={article.image} alt={article.title} />
            <p className="news-detail-image-caption">
              {article.subtitle}
            </p>
          </div>

          {/* Article Body */}
          <div className="news-detail-body">
            <p className="news-detail-lead">
              {article.subtitle} - Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
              cillum dolore eu fugiat nulla pariatur.
            </p>

            <h3>Sejarah dan Tradisi</h3>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
              deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste 
              natus error sit voluptatem accusantium doloremque laudantium, totam rem 
              aperiam, eaque ipsa quae ab illo inventore veritatis.
            </p>

            <p>
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, 
              cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
              maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor 
              repellendus.
            </p>

            <h3>Makna dan Filosofi</h3>
            <p>
              Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus 
              saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. 
              Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis 
              voluptatibus maiores alias consequatur aut perferendis doloribus asperiores.
            </p>

            <blockquote className="news-detail-quote">
              "Budaya Batak adalah warisan leluhur yang harus dijaga dan dilestarikan 
              untuk generasi mendatang."
            </blockquote>

            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis 
              praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias 
              excepturi sint occaecati cupiditate non provident, similique sunt in culpa 
              qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>

            <h3>Pelestarian untuk Masa Depan</h3>
            <p>
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, 
              cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
              maxime placeat facere possimus, omnis voluptas assumenda est.
            </p>
          </div>

          {/* Share and Actions */}
          <div className="news-detail-actions">
            <button className="news-action-btn share-btn">
              📤 Share
            </button>
            <button className="news-action-btn save-btn">
              🔖 Save
            </button>
            <button className="news-action-btn like-btn">
              👍 Like
            </button>
          </div>

          {/* Comments Section */}
          <div className="news-detail-comments">
            <h3>Komentar ({article.comments})</h3>
            <div className="news-comment-form">
              <textarea 
                placeholder="Tulis komentar Anda..."
                className="news-comment-textarea"
              ></textarea>
              <button className="news-comment-submit">Kirim Komentar</button>
            </div>
            
            {/* Sample Comments */}
            <div className="news-comments-list">
              <div className="news-comment-item">
                <div className="news-comment-avatar">U</div>
                <div className="news-comment-content">
                  <div className="news-comment-header">
                    <strong>User123</strong>
                    <span className="news-comment-time">2 jam yang lalu</span>
                  </div>
                  <p>Artikel yang sangat menarik tentang budaya Batak! Terima kasih telah berbagi.</p>
                </div>
              </div>
              
              <div className="news-comment-item">
                <div className="news-comment-avatar">B</div>
                <div className="news-comment-content">
                  <div className="news-comment-header">
                    <strong>BatakPride</strong>
                    <span className="news-comment-time">5 jam yang lalu</span>
                  </div>
                  <p>Sebagai orang Batak, saya sangat bangga membaca artikel ini. Horas!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related Articles */}
        <div className="news-detail-sidebar">
          <div className="news-related-section">
            <h3>Artikel Terkait</h3>
            <div className="news-related-articles">
              <div className="news-related-item">
                <img src="/api/placeholder/100/80" alt="Related article" />
                <div className="news-related-content">
                  <h4>Ulos Batak: Kain Suci Penuh Makna</h4>
                  <span className="news-related-date">1 hari yang lalu</span>
                </div>
              </div>
              
              <div className="news-related-item">
                <img src="/api/placeholder/100/80" alt="Related article" />
                <div className="news-related-content">
                  <h4>Sigale-gale: Boneka Tradisional</h4>
                  <span className="news-related-date">2 hari yang lalu</span>
                </div>
              </div>
              
              <div className="news-related-item">
                <img src="/api/placeholder/100/80" alt="Related article" />
                <div className="news-related-content">
                  <h4>Festival Gondang Sabangunan</h4>
                  <span className="news-related-date">3 hari yang lalu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="news-tags-section">
            <h3>Tags</h3>
            <div className="news-tags">
              <span className="news-tag">Budaya Batak</span>
              <span className="news-tag">Tradisi</span>
              <span className="news-tag">Adat</span>
              <span className="news-tag">Samosir</span>
              <span className="news-tag">Danau Toba</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetail;