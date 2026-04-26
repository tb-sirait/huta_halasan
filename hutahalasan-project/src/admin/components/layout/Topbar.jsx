// src/admin/components/layout/Topbar.jsx
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import "../../styles/layout.css";

const PAGE_TITLES = {
  dashboard: { icon: "▦", label: "Dashboard" },
  konten: { icon: "◈", label: "Konten Berita & Edukasi" },
  pengetahuan: { icon: "◉", label: "File Pengetahuan" },
  komentar: { icon: "◎", label: "Moderasi Komentar" },
  validasi: { icon: "◆", label: "Antrian Validasi" },
  users: { icon: "◐", label: "Kelola User" },
};

export const Topbar = ({ pathname, basePath = "/admin" }) => {
  const { user } = useAuth();
  const segment =
    pathname.replace(basePath, "").replace(/^\//, "").split("/")[0] ||
    "dashboard";
  const page = PAGE_TITLES[segment] || { icon: "○", label: "Halaman" };

  return (
    <header className="topbar-root">
      <div className="topbar-title">
        <span className="topbar-title-icon">{page.icon}</span>
        {page.label}
      </div>

      <div className="topbar-right">
        <div className="topbar-account">
          <div className="topbar-avatar">
            {getInitials(user?.nama_user || user?.email || "??")}
          </div>
          <div className="topbar-account-info">
            <div className="topbar-account-name">
              {user?.nama_user || user?.email || "Admin"}
            </div>
            <div className="topbar-account-role">
              {user?.role} · {user?.subrole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
