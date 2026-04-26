// src/admin/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/layout.css";

const NAV = [
  {
    section: "Utama",
    items: [{ to: "dashboard", icon: "▦", label: "Dashboard" }],
  },
  {
    section: "Konten",
    items: [
      {
        to: "konten",
        icon: "◈",
        label: "Konten Berita & Edukasi",
        roles: ["Jurnalis", "Pengembang", "Manajer", "Validator"],
      },
      {
        to: "pengetahuan",
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
        to: "komentar",
        icon: "◎",
        label: "Moderasi Komentar",
        roles: ["Manajer", "Pengembang"],
      },
      {
        to: "validasi",
        icon: "◆",
        label: "Antrian Validasi",
        roles: ["Validator"],
      },
    ],
  },
  {
    section: "Administrasi",
    items: [
      { to: "users", icon: "◐", label: "Kelola User", roles: ["Pengembang"] },
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
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">Parmalim</div>
        <div className="sidebar-logo-sub">Admin Dashboard</div>
      </div>

      <nav className="sidebar-nav">
        {/* Kembali ke website */}
        <a href="/" className="sidebar-back-link">
          ← Kembali ke Website
        </a>

        {NAV.map((group) => {
          const visible = group.items.filter((i) => isVisible(i.roles));
          if (!visible.length) return null;
          return (
            <div key={group.section}>
              <div className="sidebar-section-label">{group.section}</div>
              {visible.map((item) => (
                <NavLink
                  key={item.to}
                  to={`${basePath}/${item.to}`}
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
