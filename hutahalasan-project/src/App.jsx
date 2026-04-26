// src/App.jsx
// ─────────────────────────────────────────────────────────────
// Integrasi Main Website + Admin Dashboard dalam satu project
// Main website : /  /home  /edu  /news  /knowledge
// Admin panel  : /admin/*  (route-guarded, hanya Admin)
// ─────────────────────────────────────────────────────────────

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ── Main website pages (existing) ────────────────────────────
import Home from "./Home/Home";
import Education from "./Edu/Edu";
import News from "./News/News";
import Knowledge from "./Knowledge/Knowledge";
import KnowledgeDetail from "./Knowledge/KnowledgeDetail";
import BalePartonggoanDetail from "./Knowledge/BalePartonggoan/BalePartonggoanDetail";
import BalePartonggoanSection from "./Knowledge/BalePartonggoan/BalePartonggoanSection.jsx";
import EducationDetail from "./Edu/EducationDetail";
import UseScrollToTop from "./hooks/UseScrollToTop";

// ── Admin dashboard pages ─────────────────────────────────────
import { Login } from "./admin/Pages/Login";
import { Dashboard } from "./admin/Pages/Dashboard";
import { Konten } from "./admin/Pages/Konten";
import { Pengetahuan } from "./admin/Pages/Pengetahuan";
import { Komentar } from "./admin/Pages/Komentar";
import { Validasi } from "./admin/Pages/Validasi";
import { Users } from "./admin/Pages/Users";

// ── Admin layout & guard ──────────────────────────────────────
import { AppLayout } from "./admin/components/layout/AppLayout";
import { TokenService } from "./admin/services/api.config";

// ── Global admin styles ───────────────────────────────────────
import "./admin/styles/global.css";

// ─────────────────────────────────────────────────────────────
// Route guard: redirect ke /admin/login jika belum login
// ─────────────────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  return TokenService.isValid() ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

// ─────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <UseScrollToTop />

      <Routes>
        {/* ══════════════════════════════════════════════
            MAIN WEBSITE — public routes
            (tidak ada perubahan dari kode Anda semula)
        ══════════════════════════════════════════════ */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/edu" element={<Education />} />
        <Route path="/education/:id" element={<EducationDetail />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route
          path="/bale-partonggoan/bale-pasogit-huta-halasan"
          element={<BalePartonggoanDetail isPasogit={true} />}
        />
        <Route
          path="/bale-partonggoan/bale-parsantian/:nama"
          element={<BalePartonggoanDetail isPasogit={false} />}
        />
        <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
        <Route path="/news" element={<News />} />

        {/* ══════════════════════════════════════════════
            ADMIN — /admin/login (public, tanpa layout)
        ══════════════════════════════════════════════ */}
        <Route path="/admin/login" element={<Login adminBasePath="/admin" />} />

        {/* ══════════════════════════════════════════════
            ADMIN — /admin/* (protected, pakai AppLayout)
        ══════════════════════════════════════════════ */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AppLayout basePath="/admin" />
            </AdminRoute>
          }
        >
          {/* /admin → redirect ke /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="konten" element={<Konten />} />
          <Route path="pengetahuan" element={<Pengetahuan />} />
          <Route path="komentar" element={<Komentar />} />
          <Route path="validasi" element={<Validasi />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
