// src/admin/components/layout/AppLayout.jsx
// Mendukung basePath="/admin" agar NavLink & redirect benar
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastContainer } from "../ui/Toast";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import "../../styles/layout.css";

export const AppLayout = ({ basePath = "/admin" }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated)
      navigate(`${basePath}/login`, { replace: true });
  }, [isAuthenticated, loading, navigate, basePath]);

  useEffect(() => {
    const handler = () => {
      toast.warning("Sesi habis. Silakan login kembali.");
      setTimeout(() => navigate(`${basePath}/login`, { replace: true }), 1200);
    };
    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, [navigate, toast, basePath]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "var(--c-text-muted)",
          fontFamily: "var(--font)",
        }}
      >
        Memuat…
      </div>
    );

  if (!isAuthenticated) return null;

  return (
    <div className="layout-root">
      <Sidebar basePath={basePath} />
      <div className="layout-main">
        <Topbar pathname={location.pathname} basePath={basePath} />
        <main className="layout-content">
          <Outlet context={{ toast }} />
        </main>
      </div>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
};
