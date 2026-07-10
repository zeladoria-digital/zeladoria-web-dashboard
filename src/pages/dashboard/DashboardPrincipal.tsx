import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Configuração de Ícones do Leaflet ───────────────────────────────────────
// Corrige o problema clássico de caminhos de imagens quebrados após build do React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Ícone customizado para a Posição Atual (Roxo e com efeito de pulso)
const currentSpaceIcon = L.divIcon({
  className: "custom-current-marker",
  html: `
    <div style="
      position: relative;
      width: 20px;
      height: 20px;
      background-color: #8B5CF6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    ">
      <div style="
        position: absolute;
        inset: -6px;
        background-color: rgba(139, 92, 246, 0.4);
        border-radius: 50%;
        animation: pulse 1.8s infinite ease-in-out;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10], // Centraliza o ponto de ancoragem no meio do círculo
});

// ─── Types ───────────────────────────────────────────────────────────────────
interface Complaint {
  id: string;
  status: string;
  category: string;
  source: string;
  createdAt: string;
  neighborhood?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface Stats {
  total: number;
  resolved: number;
  inProgress: number;
  pending: number;
}

// ─── Helpers & Mappers ───────────────────────────────────────────────────────
const categoryLabel: Record<string, string> = {
  buraco: "Buraco na via",
  fossa: "Fossa cheia",
  vazamento: "Vazamento de água",
  iluminacao: "Iluminação",
  lixo: "Lixo acumulado",
  arvore: "Árvore caída",
  perigo: "Perigo",
  outro: "Outro",
};

const statusColor: Record<string, string> = {
  pending: "#EF4444",
  approved: "#3B82F6",
  in_progress: "#F59E0B",
  resolved: "#10B981",
  rejected: "#9CA3AF",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function DashboardPrincipal() {
  const [stats, setStats] = useState<Stats>({ total: 0, resolved: 0, inProgress: 0, pending: 0 });
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [loadingMap, setLoadingMap] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    loadStats();
    getUserLocation();
  }, []);

  // Captura a localização atual do profissional logado
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
          setLoadingMap(false);
        },
        (error) => {
          console.warn("Geolocalização recusada ou indisponível, usando coordenada padrão.", error);
          // Coordenada padrão de Currais Novos / RN como fallback
          setCurrentPosition([-6.2607, -36.5303]);
          setLoadingMap(false);
        }
      );
    } else {
      setCurrentPosition([-6.2607, -36.5303]);
      setLoadingMap(false);
    }
  };

  const loadStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: Complaint[] = await res.json();
      
      setComplaints(data);

      setStats({
        total: data.length,
        resolved: data.filter((c) => c.status === "resolved").length,
        inProgress: data.filter((c) => c.status === "in_progress").length,
        pending: data.filter((c) => c.status === "pending").length,
      });

    } catch (err) {
      console.error("Erro ao carregar stats:", err);
    }
  };

  const timeAgo = (dateStr: string): string => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return "Agora";
    if (diff < 3600) return `Há ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)}h`;
    return `Há ${Math.floor(diff / 86400)}d`;
  };

  return (
    <div style={s.root}>
      <main style={s.main}>

        {/* ── Header ── */}
        <header style={s.header}>
          <div style={s.headerLeft}>
            <h1 style={s.headerTitle}>Dashboard Principal</h1>
          </div>
          <div style={s.headerRight}>
            <div style={s.notifBtn}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={s.notifBadge}>5</span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{ ...s.userChip, cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div style={s.userAvatar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  </svg>
                </div>
                <span style={s.userName}>{user?.name ?? "Carregando..."}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 10 }}
                    onClick={() => setShowDropdown(false)}
                  />
                  <div style={s.dropdown}>
                    <button
                      style={s.dropdownItem}
                      onClick={() => { setShowDropdown(false); navigate("/perfil"); }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                      </svg>
                      Meu perfil
                    </button>
                    <div style={s.dropdownDivider} />
                    <button
                      style={{ ...s.dropdownItem, color: "#EF4444" }}
                      onClick={() => {
                        setShowDropdown(false);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/");
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Stat Cards ── */}
        <div style={s.statsGrid}>
          {[
            {
              label: "Total de Ocorrências", value: stats.total, pct: "+12%", color: "#EFF6FF",
              iconColor: "#3B82F6", pctColor: "#10B981",
              icon: <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            },
            {
              label: "Resolvidas (30d)", value: stats.resolved, pct: "+8%", color: "#ECFDF5",
              iconColor: "#10B981", pctColor: "#10B981",
              icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
            },
            {
              label: "Em Andamento", value: stats.inProgress, pct: "-5%", color: "#FEF3C7",
              iconColor: "#F59E0B", pctColor: "#EF4444",
              icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>
            },
            {
              label: "Pendentes", value: stats.pending, pct: "+3%", color: "#FEE2E2",
              iconColor: "#EF4444", pctColor: "#10B981",
              icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
            },
          ].map((card) => (
            <div key={card.label} style={s.statCard}>
              <div style={s.statCardLeft}>
                <div style={{ ...s.statIcon, background: card.color }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={card.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {card.icon}
                  </svg>
                </div>
                <div style={s.statInfo}>
                  <span style={s.statValue}>{card.value.toLocaleString("pt-BR")}</span>
                  <span style={s.statLabel}>{card.label}</span>
                </div>
              </div>
              <span style={{ ...s.statPct, color: card.pctColor }}>{card.pct}</span>
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ── */}
        <div style={s.mainGrid}>

          {/* ── Left: Mapa Real Integrado ── */}
          <section style={s.card}>
            <h2 style={s.cardTitle}>Mapa Interativo de Ocorrências</h2>
            <div style={s.mapWrap}>
              {!loadingMap && currentPosition ? (
                <MapContainer
                  center={currentPosition}
                  zoom={14}
                  style={{ width: "100%", height: "100%", zIndex: 1 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Marcador de referência da sua Posição Atual com ícone roxo customizado */}
                  <Marker position={currentPosition} icon={currentSpaceIcon}>
                    <Popup>
                      <strong>Minha Posição Atual</strong> <br /> 
                      Ponto de referência do profissional logado.
                    </Popup>
                  </Marker>

                  {/* Renderização real das Ocorrências vindo do Firestore */}
                  {complaints
                    .filter((c) => c.location?.latitude && c.location?.longitude)
                    .map((c) => (
                      <Marker 
                        key={c.id} 
                        position={[c.location!.latitude, c.location!.longitude]}
                      >
                        <Popup>
                          <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                            <strong style={{ color: "#1E293B" }}>{categoryLabel[c.category] ?? c.category}</strong>
                            {c.neighborhood && <div style={{ color: "#64748B" }}>Bairro: {c.neighborhood}</div>}
                            <div style={{ marginTop: "4px" }}>
                              <span style={{ 
                                display: "inline-block", 
                                padding: "2px 8px", 
                                borderRadius: "4px", 
                                color: "white", 
                                fontSize: "11px", 
                                fontWeight: "bold",
                                background: statusColor[c.status] ?? "#6B7280" 
                              }}>
                                {c.status === "pending" ? "Pendente" : c.status === "in_progress" ? "Em Andamento" : c.status}
                              </span>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              ) : (
                <div style={s.loadingMapWrap}>
                  <div style={s.spinner} />
                  <p style={{ color: "#64748B", marginTop: 12, fontSize: "15px" }}>Buscando coordenadas de referência...</p>
                </div>
              )}
            </div>
          </section>

          {/* ── Right: Ocorrências Críticas ── */}
          <section style={s.card}>
            <h2 style={s.cardTitle}>Ocorrências Críticas</h2>

            {stats.pending > 0 && (
              <div style={s.alertBanner}>
                <span style={{ fontSize: "18px" }}>`🚛`</span>
                <div style={{ fontSize: "15px" }}>
                  <strong>Alta demanda:</strong> {stats.pending} ocorrências pendentes de revisão
                </div>
              </div>
            )}

            <div style={s.criticalList}>
              {complaints
                .filter((c) => c.status === "pending" || c.status === "in_progress")
                .slice(0, 5)
                .map((c) => (
                  <div key={c.id} style={c.status === "pending" ? s.criticalItemActive : s.criticalItem}>
                    <div style={s.criticalItemLeft}>
                      <div style={{ ...s.dot, background: statusColor[c.status] }} />
                      <div style={s.criticalDetails}>
                        <span style={s.criticalName}>
                          {c.status === "pending" && "⭐ "}
                          {categoryLabel[c.category] ?? c.category}
                          {c.neighborhood ? ` - ${c.neighborhood}` : ""}
                        </span>
                        <span style={s.criticalTime}>{timeAgo(c.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}

              {complaints.filter((c) => c.status === "pending" || c.status === "in_progress").length === 0 && (
                <p style={{ color: "#9CA3AF", fontSize: "15px", textAlign: "center", padding: "24px 0" }}>
                  Nenhuma ocorrência crítica
                </p>
              )}
            </div>

            <button style={s.verTodas} onClick={() => navigate("/ocorrencias")}>
              Ver todas →
            </button>
          </section>

        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: #F8FAFC; 
        }
        #root {
          width: 100%;
          min-height: 100vh;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s: Record<string, any> = {
  root: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    display: "flex",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  },
  main: {
    width: "100%",
    padding: "32px 48px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  notifBtn: {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
  },
  notifBadge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    background: "#EF4444",
    color: "white",
    fontSize: "11px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #F8FAFC",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#F1F5F9",
    padding: "8px 20px 8px 8px",
    borderRadius: "100px",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#E0E7FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#334155",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    width: "100%",
  },
  statCard: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
  },
  statCardLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "flex-start",
  },
  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statValue: {
    fontSize: "34px",
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: "1",
  },
  statLabel: {
    fontSize: "15px",
    color: "#64748B",
    fontWeight: "500",
  },
  statPct: {
    fontSize: "14px",
    fontWeight: "700",
    paddingTop: "2px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "28px",
    width: "100%",
    alignItems: "stretch",
  },
  card: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "20px",
    marginTop: 0,
  },
  mapWrap: {
    width: "100%",
    flex: 1,
    minHeight: "480px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
  },
  loadingMapWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    position: "absolute",
    inset: 0,
    background: "#FAFAFA"
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #E5E7EB",
    borderTopColor: "#7C3AED",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  alertBanner: {
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: "10px",
    padding: "16px 18px",
    color: "#B45309",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  criticalList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    flex: 1,
  },
  criticalItemActive: {
    background: "#FFFDF5",
    border: "1px solid #FEF3C7",
    borderRadius: "14px",
    padding: "18px 20px",
  },
  criticalItem: {
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "18px 20px",
  },
  criticalItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  criticalDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  criticalName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1E293B",
  },
  criticalTime: {
    fontSize: "13px",
    color: "#94A3B8",
  },
  verTodas: {
    background: "transparent",
    border: "none",
    color: "#8B5CF6",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
    marginTop: "20px",
    alignSelf: "center",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    minWidth: "220px",
    zIndex: 20,
    overflow: "hidden",
    padding: "8px",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "16px 18px",
    background: "transparent",
    border: "none",
    borderRadius: "12px",
    fontSize: "17px",
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    textAlign: "left",
  },
  dropdownDivider: {
    height: "1px",
    background: "#F1F5F9",
    margin: "4px 0",
  },
  
};