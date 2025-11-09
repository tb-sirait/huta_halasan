import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Navbar/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import "./KnowledgeDetail.css";

const KnowledgeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);

  // Sample data - in real app, this would come from API
  const allArticles = {
    1: {
      id: 1,
      title: "Acara Ulaon Sipaha Lima di Huta Halasan",
      subtitle: "Ritual tradisional yang masih lestari",
      image: "/api/placeholder/800/400",
      category: "Budaya",
      views: 1200,
      comments: 45,
      author: "Journalist",
      publishedDate: "2024-08-29",
      timeAgo: "3 days ago",
      content: `
        <p>Acara Ulaon Sipaha Lima merupakan salah satu ritual tradisional yang masih dilestarikan oleh masyarakat Batak di Huta Halasan. Ritual ini memiliki makna yang sangat mendalam dalam kehidupan sosial dan spiritual masyarakat setempat.</p>
        
        <h3>Sejarah dan Makna</h3>
        <p>Ulaon Sipaha Lima telah dilaksanakan secara turun-temurun selama berabad-abad. Nama "Sipaha Lima" sendiri berasal dari bahasa Batak yang berarti "lima tahap" atau "lima bagian", merujuk pada lima tahapan penting dalam ritual ini.</p>
        
        <p>Setiap tahapan memiliki simbolisme tersendiri yang berkaitan dengan kehidupan manusia, mulai dari kelahiran hingga kematian. Ritual ini tidak hanya sebagai bentuk penghormatan kepada leluhur, tetapi juga sebagai sarana untuk memperkuat ikatan sosial dalam komunitas.</p>
        
        <h3>Prosesi Ritual</h3>
        <p>Ritual dimulai dengan persiapan yang melibatkan seluruh anggota masyarakat. Para tetua adat memimpin jalannya acara dengan menggunakan berbagai perlengkapan tradisional seperti gondang, ulos, dan berbagai sesaji.</p>
        
        <p>Proses ritual berlangsung selama beberapa hari dengan melibatkan berbagai kegiatan seperti tarian tradisional, nyanyian, dan pembacaan mantra-mantra kuno yang diwariskan dari generasi ke generasi.</p>
        
        <h3>Pelestarian Budaya</h3>
        <p>Di era modern ini, Ulaon Sipaha Lima menjadi sangat penting sebagai bentuk pelestarian budaya Batak. Generasi muda diharapkan dapat memahami dan melanjutkan tradisi ini agar tidak hilang ditelan zaman.</p>
        
        <p>Pemerintah daerah juga turut mendukung pelestarian ritual ini dengan memberikan bantuan dan pengakuan resmi sebagai warisan budaya takbenda yang perlu dijaga kelestariannya.</p>
      `,
      tags: ["budaya", "ritual", "tradisional", "batak", "huta halasan"],
    },
    2: {
      id: 2,
      title: "Festival Gondang Sabangunan 2024",
      subtitle: "Perayaan musik tradisional Batak",
      image: "/api/placeholder/800/400",
      category: "Budaya",
      views: 856,
      comments: 23,
      author: "Journalist",
      publishedDate: "2024-08-30",
      timeAgo: "2 days ago",
      content: `
        <p>Festival Gondang Sabangunan 2024 telah sukses diselenggarakan dengan meriah di Samosir, Sumatera Utara. Acara tahunan ini menjadi ajang pelestarian dan promosi musik tradisional Batak kepada dunia.</p>
        
        <h3>Tentang Gondang Sabangunan</h3>
        <p>Gondang Sabangunan adalah ensemble musik tradisional Batak yang terdiri dari berbagai alat musik seperti gondang, ogung, dan sarune. Musik ini memiliki peran penting dalam berbagai upacara adat Batak.</p>
        
        <p>Festival ini menghadirkan puluhan grup gondang dari berbagai daerah di Sumatera Utara, menciptakan harmoni musik yang memukau ribuan pengunjung yang hadir.</p>
      `,
      tags: ["musik", "gondang", "festival", "batak", "samosir"],
    },
    3: {
      id: 3,
      title: "Sopo Godang: Arsitektur Tradisional Batak",
      subtitle: "Rumah adat yang penuh makna",
      image: "/api/placeholder/800/400",
      category: "Budaya",
      views: 642,
      comments: 18,
      author: "Journalist",
      publishedDate: "2024-08-28",
      timeAgo: "4 days ago",
      content: `
        <p>Sopo Godang merupakan rumah adat tradisional Batak yang memiliki arsitektur unik dan sarat akan makna filosofis. Bangunan ini tidak hanya berfungsi sebagai tempat tinggal, tetapi juga sebagai pusat kehidupan sosial masyarakat Batak.</p>
        
        <h3>Struktur dan Filosofi</h3>
        <p>Arsitektur Sopo Godang mencerminkan kosmologi Batak yang membagi dunia menjadi tiga bagian: banua ginjang (dunia atas), banua tonga (dunia tengah), dan banua toru (dunia bawah).</p>
        
        <p>Setiap elemen bangunan memiliki makna simbolis yang mendalam, mulai dari bentuk atap yang menyerupai perahu terbalik hingga ukiran-ukiran yang menghiasi dinding dan tiang-tiang rumah.</p>
      `,
      tags: ["arsitektur", "rumah adat", "batak", "sopo godang", "filosofi"],
    },
  };

  const trendingData = [
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

  useEffect(() => {
    // Get current article
    const currentArticle = allArticles[parseInt(id)];
    setArticle(currentArticle);

    // Get related articles (exclude current article)
    const related = Object.values(allArticles)
      .filter((art) => art.id !== parseInt(id))
      .slice(0, 2);
    setRelatedArticles(related);

    // Set trending articles
    setTrendingArticles(trendingData);
  }, [id]);

  const handleBackToKnowledge = () => {
    navigate("/knowledge");
  };

  const handleArticleClick = (articleId) => {
    navigate(`/knowledge/${articleId}`);
  };

  const handleTrendingClick = (trendingId) => {
    // For trending items, you might want to create them or redirect
    console.log(`Trending item ${trendingId} clicked`);
  };

  if (!article) {
    return (
      <div className="knowledge-detail-page">
        <Header />
        <div className="knowledge-detail-container">
          <div className="knowledge-detail-loading">
            <p>Artikel tidak ditemukan</p>
            <button
              onClick={handleBackToKnowledge}
              className="knowledge-back-button"
            >
              ← Kembali ke Knowledge
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="knowledge-detail-page">
      <Header />

      <div className="knowledge-detail-container">
        {/* Back Button */}
        <button
          onClick={handleBackToKnowledge}
          className="knowledge-back-button"
        >
          ← Kembali ke Knowledge
        </button>

        <div className="knowledge-detail-content">
          {/* Main Article Content */}
          <div className="knowledge-detail-main">
            <article className="knowledge-detail-article">
              {/* Article Header */}
              <header className="knowledge-detail-header">
                <div className="knowledge-detail-category">
                  {article.category}
                </div>
                <h1 className="knowledge-detail-title">{article.title}</h1>
                <p className="knowledge-detail-subtitle">{article.subtitle}</p>

                {/* Article Meta */}
                <div className="knowledge-detail-meta">
                  <div className="knowledge-detail-author-info">
                    <span className="knowledge-detail-author">
                      By {article.author}
                    </span>
                    <span className="knowledge-detail-date">
                      {article.timeAgo}
                    </span>
                  </div>
                  <div className="knowledge-detail-stats">
                    <span className="knowledge-detail-stat">
                      👁️ {article.views.toLocaleString()}
                    </span>
                    <span className="knowledge-detail-stat">
                      💬 {article.comments}
                    </span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className="knowledge-detail-image">
                <img src={article.image} alt={article.title} />
              </div>

              {/* Article Content */}
              <div
                className="knowledge-detail-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              <div className="knowledge-detail-tags">
                <h4>Tags:</h4>
                <div className="knowledge-detail-tag-list">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="knowledge-detail-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="knowledge-detail-comments">
                <h3>Komentar ({article.comments})</h3>

                {/* Comment Form */}
                <div className="knowledge-detail-comment-form">
                  <h4>Tinggalkan Komentar</h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const comment = {
                        name: formData.get("name"),
                        email: formData.get("email"),
                        message: formData.get("message"),
                      };
                      console.log("New comment:", comment);
                      // Handle comment submission here
                      e.target.reset();
                    }}
                  >
                    <div className="knowledge-detail-form-row">
                      <div className="knowledge-detail-form-group">
                        <label htmlFor="name">Nama *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          placeholder="Masukkan nama Anda"
                        />
                      </div>
                      <div className="knowledge-detail-form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          placeholder="Masukkan email Anda"
                        />
                      </div>
                    </div>
                    <div className="knowledge-detail-form-group">
                      <label htmlFor="message">Komentar *</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="4"
                        placeholder="Tulis komentar Anda di sini..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="knowledge-detail-submit-btn"
                    >
                      Kirim Komentar
                    </button>
                  </form>
                </div>

                {/* Comments List */}
                <div className="knowledge-detail-comments-list">
                  <div className="knowledge-detail-comment">
                    <div className="knowledge-detail-comment-avatar">
                      <div className="knowledge-detail-avatar-circle">JD</div>
                    </div>
                    <div className="knowledge-detail-comment-content">
                      <div className="knowledge-detail-comment-header">
                        <h5 className="knowledge-detail-comment-author">
                          John Doe
                        </h5>
                        <span className="knowledge-detail-comment-time">
                          2 hari yang lalu
                        </span>
                      </div>
                      <p className="knowledge-detail-comment-text">
                        Artikel yang sangat menarik! Saya baru mengetahui
                        tentang ritual Ulaon Sipaha Lima ini. Terima kasih telah
                        membagikan informasi budaya yang begitu berharga. Semoga
                        tradisi seperti ini tetap lestari di masa depan.
                      </p>
                      <div className="knowledge-detail-comment-actions">
                        <button className="knowledge-detail-comment-action">
                          👍 Suka (12)
                        </button>
                        <button className="knowledge-detail-comment-action">
                          💬 Balas
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="knowledge-detail-comment">
                    <div className="knowledge-detail-comment-avatar">
                      <div className="knowledge-detail-avatar-circle">MS</div>
                    </div>
                    <div className="knowledge-detail-comment-content">
                      <div className="knowledge-detail-comment-header">
                        <h5 className="knowledge-detail-comment-author">
                          Maria Sitompul
                        </h5>
                        <span className="knowledge-detail-comment-time">
                          1 hari yang lalu
                        </span>
                      </div>
                      <p className="knowledge-detail-comment-text">
                        Sebagai orang Batak, saya sangat bangga dengan
                        pelestarian budaya seperti ini. Ritual Ulaon Sipaha Lima
                        memang masih dilaksanakan di kampung halaman saya.
                        Artikel ini menjelaskan dengan sangat baik makna dan
                        prosesinya.
                      </p>
                      <div className="knowledge-detail-comment-actions">
                        <button className="knowledge-detail-comment-action">
                          👍 Suka (8)
                        </button>
                        <button className="knowledge-detail-comment-action">
                          💬 Balas
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="knowledge-detail-comment">
                    <div className="knowledge-detail-comment-avatar">
                      <div className="knowledge-detail-avatar-circle">RP</div>
                    </div>
                    <div className="knowledge-detail-comment-content">
                      <div className="knowledge-detail-comment-header">
                        <h5 className="knowledge-detail-comment-author">
                          Rudi Pangaribuan
                        </h5>
                        <span className="knowledge-detail-comment-time">
                          18 jam yang lalu
                        </span>
                      </div>
                      <p className="knowledge-detail-comment-text">
                        Apakah ada jadwal khusus untuk ritual ini? Saya ingin
                        mengajak keluarga untuk menyaksikan langsung tradisi
                        yang luar biasa ini.
                      </p>
                      <div className="knowledge-detail-comment-actions">
                        <button className="knowledge-detail-comment-action">
                          👍 Suka (3)
                        </button>
                        <button className="knowledge-detail-comment-action">
                          💬 Balas
                        </button>
                      </div>

                      {/* Reply to comment */}
                      <div className="knowledge-detail-comment-reply">
                        <div className="knowledge-detail-comment-avatar">
                          <div className="knowledge-detail-avatar-circle small">
                            AD
                          </div>
                        </div>
                        <div className="knowledge-detail-comment-content">
                          <div className="knowledge-detail-comment-header">
                            <h5 className="knowledge-detail-comment-author">
                              Admin
                            </h5>
                            <span className="knowledge-detail-comment-time">
                              10 jam yang lalu
                            </span>
                          </div>
                          <p className="knowledge-detail-comment-text">
                            Biasanya ritual ini dilaksanakan setiap bulan ke-7
                            dan ke-12 menurut kalender Batak. Untuk informasi
                            lebih detail, bisa menghubungi tokoh adat setempat.
                          </p>
                          <div className="knowledge-detail-comment-actions">
                            <button className="knowledge-detail-comment-action">
                              👍 Suka (5)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Load More Comments */}
                  <div className="knowledge-detail-load-more">
                    <button className="knowledge-detail-load-more-btn">
                      Muat Komentar Lainnya (42)
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Articles Section */}
              <div className="knowledge-detail-related">
                <h3>Artikel Terkait</h3>
                <div className="knowledge-detail-related-grid">
                  {relatedArticles.map((relatedArticle) => (
                    <div
                      key={relatedArticle.id}
                      className="knowledge-detail-related-card"
                      onClick={() => handleArticleClick(relatedArticle.id)}
                    >
                      <div className="knowledge-detail-related-image">
                        <img
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                        />
                      </div>
                      <div className="knowledge-detail-related-content">
                        <h4>{relatedArticle.title}</h4>
                        <p>{relatedArticle.subtitle}</p>
                        <div className="knowledge-detail-related-meta">
                          <span>👁️ {relatedArticle.views}</span>
                          <span>💬 {relatedArticle.comments}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="knowledge-detail-sidebar">
            {/* Latest/Trending News */}
            <div className="knowledge-detail-trending">
              <h3 className="knowledge-detail-trending-title">
                Konten Trending
              </h3>

              <div className="knowledge-detail-trending-list">
                {trendingArticles.map((item) => (
                  <div
                    key={item.id}
                    className="knowledge-detail-trending-item"
                    onClick={() => handleTrendingClick(item.id)}
                  >
                    <div className="knowledge-detail-trending-rank">
                      {item.rank}
                    </div>
                    <div className="knowledge-detail-trending-content">
                      <h4 className="knowledge-detail-trending-item-title">
                        {item.title}
                      </h4>
                      <p className="knowledge-detail-trending-item-subtitle">
                        {item.subtitle}
                      </p>
                      <div className="knowledge-detail-trending-info">
                        <span className="knowledge-detail-trending-time">
                          {item.timeAgo} | {item.author}
                        </span>
                        <div className="knowledge-detail-trending-stats">
                          <span>👁️ {item.views.toLocaleString()}</span>
                          <span>💬 {item.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Updates */}
            <div className="knowledge-detail-latest">
              <h3 className="knowledge-detail-latest-title">Konten Terbaru</h3>

              <div className="knowledge-detail-latest-list">
                <div className="knowledge-detail-latest-item">
                  <div className="knowledge-detail-latest-content">
                    <h4>Tradisi Mangongkal Holi di Batak Toba</h4>
                    <p>Ritual pemindahan tulang leluhur</p>
                    <span className="knowledge-detail-latest-time">
                      5 jam yang lalu
                    </span>
                  </div>
                </div>

                <div className="knowledge-detail-latest-item">
                  <div className="knowledge-detail-latest-content">
                    <h4>Horja Bius: Upacara Pernikahan Adat</h4>
                    <p>Prosesi pernikahan tradisional Batak</p>
                    <span className="knowledge-detail-latest-time">
                      1 hari yang lalu
                    </span>
                  </div>
                </div>

                <div className="knowledge-detail-latest-item">
                  <div className="knowledge-detail-latest-content">
                    <h4>Makanan Tradisional: Arsik dan Naniura</h4>
                    <p>Kuliner khas yang mendunia</p>
                    <span className="knowledge-detail-latest-time">
                      2 hari yang lalu
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="knowledge-detail-share">
              <h4>Bagikan Artikel</h4>
              <div className="knowledge-detail-share-buttons">
                <button className="knowledge-detail-share-btn facebook">
                  Facebook
                </button>
                <button className="knowledge-detail-share-btn twitter">
                  Twitter
                </button>
                <button className="knowledge-detail-share-btn whatsapp">
                  WhatsApp
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default KnowledgeDetail;
