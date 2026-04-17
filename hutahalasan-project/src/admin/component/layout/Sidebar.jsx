// src/admin/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/layout.css";

const NAV = [
  {
    section: "Utama",
    items: [{ path: "dashboard", icon: "▦", label: "Dashboard" }],
  },
  {
    section: "Konten",
    items: [
      {
        path: "konten",
        icon: "◈",
        label: "Konten Berita & Edukasi",
        roles: ["Jurnalis", "Pengembang", "Manajer", "Validator"],
      },
      {
        path: "pengetahuan",
        icon: "◉",
        label: "File Pengetahuan",
        roles: ["Jurnalis", "Pengembang", "Manajer", "Validator"],
      },
    ],
  },
  {
    section: "Moderasi",
    items: [
      {
        path: "komentar",
        icon: "◎",
        label: "Moderasi Komentar",
        roles: ["Manajer", "Pengembang"],
      },
      {
        path: "validasi",
        icon: "◆",
        label: "Antrian Validasi",
        roles: ["Validator"],
      },
    ],
  },
  {
    section: "Administrasi",
    items: [
      { path: "users", icon: "◐", label: "Kelola User", roles: ["Pengembang"] },
    ],
  },
];

export const Sidebar = ({ basePath = "/admin" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const subrole = user?.subrole;

  const isVisible = (roles) => !roles || roles.includes(subrole);

  const handleLogout = () => {
    logout();
    navigate(`${basePath}/login`);
  };

  return (
    <aside className="sidebar-root">
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">Parmalim</div>
        <div className="sidebar-logo-sub">Admin Dashboard</div>
      </div>

      <nav className="sidebar-nav">
        {/* Tombol balik ke main website */}
        <div className="sidebar-section-label">Navigasi</div>
        <a href="/" className="sidebar-item">
          <span className="sidebar-item-icon">←</span>
          <span className="sidebar-item-label">Kembali ke Website</span>
        </a>

        {NAV.map((group) => {
          const visible = group.items.filter((i) => isVisible(i.roles));
          if (!visible.length) return null;
          return (
            <div key={group.section}>
              <div className="sidebar-section-label">{group.section}</div>
              {visible.map((item) => (
                <NavLink
                  key={item.path}
                  to={`${basePath}/${item.path}`}
                  className={({ isActive }) =>
                    `sidebar-item${isActive ? " active" : ""}`
                  }
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <span className="sidebar-item-icon">⏻</span>
          Keluar
        </button>
      </div>
    </aside>
  );
};
