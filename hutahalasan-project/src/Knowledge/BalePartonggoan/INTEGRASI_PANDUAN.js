// ============================================================
// PANDUAN INTEGRASI – Bale Partonggoan
// ============================================================
//
// 1. STRUKTUR FILE YANG PERLU DITAMBAHKAN
// ─────────────────────────────────────────
//  src/
//  ├── data/
//  │   └── balePartonggoan.js          ← (file JSON data)
//  ├── BalePartonggoan/
//  │   └── BalePartonggoanDetail.jsx   ← (halaman detail)
//  └── styles/
//      ├── bale-partonggoan.css        ← (CSS section di Knowledge)
//      └── bale-partonggoan-detail.css ← (CSS halaman detail)
//
// ─────────────────────────────────────────
// 2. MODIFIKASI Knowledge.jsx
// ─────────────────────────────────────────
// Tambahkan import berikut di bagian atas Knowledge.jsx:
//
//   import BalePartonggoanSection from "./BalePartonggoanSection";
//
// Lalu tambahkan komponen di dalam konten utama (setelah section
// "Semua Dokumen" / k-card-grid), sebelum penutup </div> dari k-layout:
//
//   {/* ── Bale Partonggoan ── */}
//   <BalePartonggoanSection />
//
// ─────────────────────────────────────────
// 3. ROUTING (App.jsx / Router)
// ─────────────────────────────────────────
// Tambahkan route berikut ke dalam file router utama (App.jsx):
//
//   import BalePartonggoanDetail from "./BalePartonggoan/BalePartonggoanDetail";
//
//   // Di dalam <Routes>:
//
//   <Route
//     path="/bale-partonggoan/bale-pasogit-huta-halasan"
//     element={<BalePartonggoanDetail isPasogit={true} />}
//   />
//   <Route
//     path="/bale-partonggoan/bale-parsantian/:nama"
//     element={<BalePartonggoanDetail isPasogit={false} />}
//   />
//
// ─────────────────────────────────────────
// 4. CONTOH App.jsx (ringkasan)
// ─────────────────────────────────────────

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Knowledge from "./Knowledge/Knowledge";
import BalePartonggoanDetail from "./BalePartonggoan/BalePartonggoanDetail";
// ... import lainnya

function App() {
  return (
    <Router>
      <Routes>
        {/* ... route lain yang sudah ada ... */}
        <Route path="/knowledge" element={<Knowledge />} />
        <Route
          path="/bale-partonggoan/bale-pasogit-huta-halasan"
          element={<BalePartonggoanDetail isPasogit={true} />}
        />
        <Route
          path="/bale-partonggoan/bale-parsantian/:nama"
          element={<BalePartonggoanDetail isPasogit={false} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

// ─────────────────────────────────────────
// 5. CATATAN PENTING
// ─────────────────────────────────────────
// - Gambar sementara menggunakan "/src/assets/4.jpg" sesuai permintaan.
//   Ganti path di balePartonggoan.js saat gambar asli tersedia.
//
// - Google Maps embed menggunakan koordinat dari database (balePartonggoan.js).
//   Tidak memerlukan API key untuk embed dasar.
//
// - Slug untuk route cabang mengikuti format:
//   "bale-parsantian-{nama}" → contoh: "bale-parsantian-medan-sunggal"
//   Pastikan field `slug` di data konsisten dengan parameter URL.
//
// - CSS variable (--k-border, --k-bg, dll.) diasumsikan sudah
//   didefinisikan di konten-shared.css yang sudah ada.
