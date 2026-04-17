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
import EducationDetail from "./Edu/EducationDetail";
import UseScrollToTop from "./hooks/UseScrollToTop";

// ── Admin dashboard pages ─────────────────────────────────────
import { Login } from "./admin/pages/Login";
import { Dashboard } from "./admin/pages/Dashboard";
import { Konten } from "./admin/pages/Konten";
import { Pengetahuan } from "./admin/pages/Pengetahuan";
import { Komentar } from "./admin/pages/Komentar";
import { Validasi } from "./admin/pages/Validasi";
import { Users } from "./admin/pages/Users";

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

        {/* Fallback 404 → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
