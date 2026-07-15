import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


interface Complaint {
  id: string;
  category: string;
  status: string;
  neighborhood?: string;
  location?: { latitude: number; longitude: number };
}

interface Team {
  id: string;
  name: string;
  status: string;
  members?: any[];
}


const categoryLabel: Record<string, string> = {
  buraco: "Buraco na via",
  fossa: "Fossa cheia",
  vazamento: "Vazamento",
  iluminacao: "Iluminação",
  lixo: "Lixo acumulado",
  arvore: "Árvore caída",
  perigo: "Perigo",
  outro: "Outro",
};


export default function GerarOrdemServico() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; time: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    try {
      const [complaintsRes, teamsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/complaints?status=approved`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/field-teams`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      
      if (!complaintsRes.ok) {
        console.error(`Erro ao buscar ocorrências. Status: ${complaintsRes.status}`);
      }
      if (!teamsRes.ok) {
        console.error(`Erro ao buscar equipes de campo. Status: ${teamsRes.status}`);
      }

      
      const complaintsData = complaintsRes.ok ? await complaintsRes.json() : [];
      const teamsData = teamsRes.ok ? await teamsRes.json() : [];

      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (err) {
      console.error("Erro fatal ao processar os dados da API:", err);
      setError("Não foi possível carregar os dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplaint = (id: string) => {
    setSelectedComplaints(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedComplaints.length === 0) {
      setError("Selecione ao menos uma ocorrência.");
      return;
    }
    if (!selectedTeam) {
      setError("Selecione uma equipe responsável.");
      return;
    }

    setError("");
    setSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      await Promise.all(
        selectedComplaints.map(complaintId =>
          fetch(`${import.meta.env.VITE_API_URL}/service-orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              complaintId,
              teamId: selectedTeam,
              notes: notes || null,
            }),
          })
        )
      );

      navigate("/ordens");
    } catch (err) {
      setError("Erro ao criar ordem de serviço. Tente novamente.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  
  useEffect(() => {
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        
        setCurrentPosition([-6.3307, -36.5303]);
      }
    );
  }, []);

  useEffect(() => {
    if (selectedComplaints.length === 0 || !currentPosition) {
      setRouteCoords([]);
      setRouteInfo(null);
      return;
    }
    calculateRoute();
  }, [selectedComplaints, currentPosition]);

  const calculateRoute = async () => {
    
    const selectedData = complaints.filter(c => selectedComplaints.includes(c.id));
    const points = selectedData
      .filter(c => c.location?.latitude && c.location?.longitude)
      .map(c => `${c.location!.longitude},${c.location!.latitude}`);

    if (points.length === 0) return;

    
    const origin = `${currentPosition![1]},${currentPosition![0]}`;
    const coords = [origin, ...points].join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes?.[0]) {
        const route = data.routes[0];
        const coords: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        setRouteCoords(coords);

        const distKm = (route.distance / 1000).toFixed(1);
        const timeMin = Math.round(route.duration / 60);
        setRouteInfo({ distance: `${distKm} km`, time: `${timeMin} min` });
      }
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
    }
  };

  return (
    <div style={s.root}>
      <main style={s.main}>

        {}
        <header style={s.header}>
          <a href="/ordens" style={s.backLink}>← Ordens de serviço</a>
          <h1 style={s.headerTitle}>Gerar Ordem de Serviço</h1>
        </header>

        <div style={s.divider} />

        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={{ color: "#6B7280", marginTop: 12 }}>Carregando dados...</p>
          </div>
        ) : (
          <div style={s.content}>

            {}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Selecionar Ocorrências</h2>
              <div style={s.complaintList}>
                {complaints.length === 0 ? (
                  <p style={s.emptyText}>
                    Nenhuma ocorrência aprovada disponível para criar ordem de serviço.
                  </p>
                ) : (
                  complaints.map((c) => {
                    const isSelected = selectedComplaints.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        style={{ ...s.complaintItem, ...(isSelected ? s.complaintItemSelected : {}) }}
                        onClick={() => toggleComplaint(c.id)}
                      >
                        {}
                        <div style={{ ...s.checkbox, ...(isSelected ? s.checkboxSelected : {}) }}>
                          {isSelected && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>

                        {}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>

                        <span style={s.complaintLabel}>
                          <strong>{c.id.slice(0, 8).toUpperCase()}</strong>
                          {" - "}
                          {categoryLabel[c.category] ?? c.category}
                          {c.neighborhood ? ` • ${c.neighborhood}` : ""}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Equipe Responsável</h2>
              <select
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
                style={s.select}
              >
                <option value="">Selecione uma equipe...</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Rota Otimizada</h2>
              
              {routeInfo && (
                <div style={s.routeInfo}>
                  <span>📍 Distância total: <strong>{routeInfo.distance}</strong></span>
                  <span>⏱ Tempo estimado: <strong>{routeInfo.time}</strong></span>
                </div>
              )}

              <div style={s.mapWrap}>
                {currentPosition ? (
                  <MapContainer
                    center={currentPosition}
                    zoom={13}
                    style={{ width: "100%", height: "100%", borderRadius: "14px" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {}
                    <Marker position={currentPosition}>
                      <Popup>Sua localização atual</Popup>
                    </Marker>

                    {}
                    {complaints
                      .filter(c => selectedComplaints.includes(c.id) && c.location?.latitude)
                      .map(c => (
                        <Marker key={c.id} position={[c.location!.latitude, c.location!.longitude]}>
                          <Popup>
                            {categoryLabel[c.category] ?? c.category}
                            {c.neighborhood ? ` - ${c.neighborhood}` : ""}
                          </Popup>
                        </Marker>
                      ))}

                    {}
                    {routeCoords.length > 0 && (
                      <Polyline
                        positions={routeCoords}
                        color="#7C3AED"
                        weight={4}
                        opacity={0.8}
                      />
                    )}
                  </MapContainer>
                ) : (
                  <div style={s.mapLoading}>
                    <div style={s.spinner} />
                    <p style={{ color: "#9CA3AF", marginTop: 12 }}>Obtendo localização...</p>
                  </div>
                )}
              </div>
            </div>

            {}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Observações (opcional)</h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Adicione instruções ou observações para a equipe..."
                style={s.textarea}
                rows={4}
              />
            </div>

            {}
            {error && (
              <div style={s.errorBanner}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {}
            <button
              style={{ ...s.createBtn, ...(submitting ? s.createBtnDisabled : {}) }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                "Criando..."
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Criar Ordem de Serviço
                </>
              )}
            </button>

          </div>
        )}
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; min-height: 100vh; overflow-x: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8FAFC; }
        #root { width: 100%; min-height: 100vh; }
        select:focus, textarea:focus { outline: none; }
        button:focus { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}



const s: Record<string, any> = {
  root: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
  },
  main: {
    width: "100%",
    padding: "32px 48px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    maxWidth: "1400px", 
    margin: "0 auto",   
  },

  
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
    width: "100%", 
  },
  backLink: {
    fontSize: "15px",
    color: "#7C3AED",
    fontWeight: 600,
    textDecoration: "none",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  divider: {
    height: "1px",
    background: "#E2E8F0",
    width: "100%",
  },

  
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%", 
  },

  
  card: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
    width: "100%", 
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "20px",
  },

  
  complaintList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
  complaintItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "18px 20px",
    border: "1.5px solid #E2E8F0",
    borderRadius: "14px",
    cursor: "pointer",
    background: "white",
    transition: "all 0.15s",
    width: "100%", 
  },
  complaintItemSelected: {
    borderColor: "#7C3AED",
    background: "#FAFAFF",
  },
  checkbox: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: "2px solid #CBD5E1",
    background: "#1E1B4B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxSelected: {
    background: "#7C3AED",
    borderColor: "#7C3AED",
  },
  complaintLabel: {
    fontSize: "16px",
    color: "#1E293B",
    fontWeight: 400,
  },

  
  select: {
    width: "100%",
    height: "56px",
    border: "1.5px solid #E2E8F0",
    borderRadius: "14px",
    padding: "0 18px",
    fontSize: "16px",
    color: "#7C3AED",
    background: "white",
    cursor: "pointer",
    appearance: "auto",
  },

  
  mapPlaceholder: {
    height: "320px",
    background: "linear-gradient(135deg, #EFF6FF 0%, #EDE9FE 100%)",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    width: "100%",
  },
  mapLabel: {
    fontSize: "16px",
    color: "#6366F1",
    fontWeight: 500,
  },
  mapSub: {
    fontSize: "14px",
    color: "#94A3B8",
  },

  
  textarea: {
    width: "100%",
    border: "1.5px solid #E2E8F0",
    borderRadius: "14px",
    padding: "16px 18px",
    fontSize: "16px",
    color: "#1E293B",
    background: "#FAFAFA",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
  },

  
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "12px",
    padding: "14px 18px",
    fontSize: "15px",
    color: "#DC2626",
    width: "100%",
  },

  
  createBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    height: "64px",
    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.2px",
  },
  createBtnDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 0",
    width: "100%",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #E5E7EB",
    borderTopColor: "#7C3AED",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  emptyText: {
    fontSize: "15px",
    color: "#9CA3AF",
    textAlign: "center",
    padding: "24px 0",
    width: "100%",
  },
  mapWrap: {
  width: "100%",
  height: "380px",
  borderRadius: "14px",
  overflow: "hidden",
  border: "1px solid #E2E8F0",
  },
  mapLoading: {
    width: "100%",
    height: "380px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#F8FAFC",
    borderRadius: "14px",
  },
  routeInfo: {
    display: "flex",
    gap: "24px",
    padding: "14px 18px",
    background: "#EDE9FE",
    borderRadius: "12px",
    marginBottom: "16px",
    fontSize: "15px",
    color: "#4C1D95",
  },
};