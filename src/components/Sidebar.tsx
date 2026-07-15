import { useLocation, useNavigate } from "react-router-dom";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const items: SidebarItem[] = [
  {
    label: "Início",
    path: "/dashboard",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Ocorrências",
    path: "/ocorrencias",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Ordens de Serviço",
    path: "/ordens",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Equipes",
    path: "/equipes",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Dispositivos",
    path: "/dispositivos",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  






















];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  return (
    <aside style={s.sidebar}>
      {}
      <div style={s.logoWrap}>
        <div style={s.logoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="white" />
          </svg>
        </div>
        <span style={s.logoText}>ReportAI</span>
      </div>

      {}
      <nav style={s.nav}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              style={{ ...s.navItem, ...(isActive ? s.navItemActive : {}) }}
              onClick={() => navigate(item.path)}
            >
              <span style={{ ...s.navIcon, color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.5)" }}>
                {item.icon}
              </span>
              <span style={{ ...s.navLabel, color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.6)" }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {}
      <div style={s.bottomWrap}>
        <div style={s.divider} />
        <div style={s.userWrap}>
          <div style={s.userAvatar}>
            {user?.name?.charAt(0).toUpperCase() ?? "G"}
          </div>
          <div style={s.userInfo}>
            <span style={s.userName}>{user?.name ?? "Gestor"}</span>
            <span style={s.userRole}>Gestor</span>
          </div>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

const s: Record<string, any> = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    height: "100%",
    background: "linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)",
    display: "flex",
    flexDirection: "column",
    padding: "28px 16px",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
  },

  
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 12px 32px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "20px",
  },
  logoIcon: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#FFFFFF",
    letterSpacing: "-0.3px",
  },

  
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "background 0.15s",
  },
  navItemActive: {
    background: "rgba(124,58,237,0.35)",
    boxShadow: "inset 0 0 0 1px rgba(124,58,237,0.4)",
  },
  navIcon: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  navLabel: {
    fontSize: "16px",
    fontWeight: 500,
  },

  
  bottomWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
  },
  userWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    overflow: "hidden",
  },
  userName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
    fontSize: "15px",
    fontWeight: 500,
    width: "100%",
  },
};