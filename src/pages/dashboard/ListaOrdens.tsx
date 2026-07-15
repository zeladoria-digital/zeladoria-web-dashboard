import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface ServiceOrder {
  id: string;
  complaintId: string;
  teamId: string;
  assignedBy: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  complaint?: {
    category: string;
    neighborhood?: string;
    source: string;
  };
  team?: {
    name: string;
  };
}


const statusLabel: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const statusStyle: Record<string, { background: string; color: string; border: string }> = {
  pending: { background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" },
  in_progress: { background: "#EDE9FE", color: "#6D28D9", border: "1px solid #DDD6FE" },
  completed: { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" },
  cancelled: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" },
};

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

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("pt-BR");

const timeAgo = (dateStr: string): string => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Agora";
  if (diff < 3600) return `Há ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)}h`;
  return `Há ${Math.floor(diff / 86400)}d`;
};


export default function ListaOrdens() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [filtered, setFiltered] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, search, activeFilter]);

  const loadOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/service-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: ServiceOrder[] = await res.json();

      
      const enriched = await Promise.all(
        data.map(async (order) => {
          try {
            const [complaintRes, teamRes] = await Promise.all([
              fetch(`${import.meta.env.VITE_API_URL}/complaints/${order.complaintId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`${import.meta.env.VITE_API_URL}/field-teams/${order.teamId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            const complaint = complaintRes.ok ? await complaintRes.json() : null;
            const team = teamRes.ok ? await teamRes.json() : null;

            return {
              ...order,
              complaint: complaint ? {
                category: complaint.category,
                neighborhood: complaint.neighborhood,
                source: complaint.source,
              } : undefined,
              team: team ? { name: team.name } : undefined,
            };
          } catch {
            return order;
          }
        })
      );

      setOrders(enriched);
    } catch (err) {
      console.error("Erro ao carregar ordens:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orders];

    if (activeFilter !== "all") {
      result = result.filter(o => o.status === activeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.team?.name?.toLowerCase().includes(q) ||
        (categoryLabel[o.complaint?.category ?? ""] ?? "").toLowerCase().includes(q) ||
        o.complaint?.neighborhood?.toLowerCase().includes(q) ||
        (statusLabel[o.status] ?? "").toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  };

  const openStatusModal = (order: ServiceOrder) => {
    setSelectedOrder(order);
    
    
    
    if (order.status === "in_progress") {
      setNewStatus("completed");
    } else {
      setNewStatus(order.status);
    }

    setStatusNotes(order.notes ?? "");
    setModalError("");
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setUpdating(true);
    setModalError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/service-orders/${selectedOrder.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus, notes: statusNotes || null }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar status");
      }

      setShowModal(false);
      loadOrders();
    } catch (err: any) {
      setModalError(err.message || "Erro ao atualizar status.");
    } finally {
      setUpdating(false);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    inProgress: orders.filter(o => o.status === "in_progress").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  return (
    <div style={s.root}>
      <main style={s.main}>

        {}
        <header style={s.header}>
          <div>
            <a href="/dashboard" style={s.backLink}>← Dashboard</a>
            <div style={s.headerRow}>
              <h1 style={s.headerTitle}>Ordens de Serviço</h1>
              <button style={s.newBtn} onClick={() => navigate("/ordens/nova")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Nova Ordem
              </button>
            </div>
          </div>
        </header>

        <div style={s.divider} />

        {}
        <div style={s.statsGrid}>
          {[
            { label: "Total", value: stats.total, color: "#EEF2FF", iconColor: "#6366F1", icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /> },
            { label: "Pendentes", value: stats.pending, color: "#FFFBEB", iconColor: "#F59E0B", icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
            { label: "Em andamento", value: stats.inProgress, color: "#EDE9FE", iconColor: "#7C3AED", icon: <><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></> },
            { label: "Concluídas", value: stats.completed, color: "#ECFDF5", iconColor: "#10B981", icon: <><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></> },
          ].map(card => (
            <div key={card.label} style={s.statCard}>
              <div style={{ ...s.statIcon, background: card.color }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {card.icon}
                </svg>
              </div>
              <div style={s.statInfo}>
                <span style={s.statValue}>{card.value}</span>
                <span style={s.statLabel}>{card.label}</span>
              </div>
            </div>
          ))}
        </div>

        {}
        <div style={s.filterCard}>
          <div style={s.searchWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por ID, equipe, categoria, bairro..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>

          <div style={s.chips}>
            {[
              { key: "all", label: "Todas" },
              { key: "pending", label: "Pendentes" },
              { key: "in_progress", label: "Em andamento" },
              { key: "completed", label: "Concluídas" },
              { key: "cancelled", label: "Canceladas" },
            ].map(f => (
              <button
                key={f.key}
                style={{ ...s.chip, ...(activeFilter === f.key ? s.chipActive : {}) }}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {}
        <div style={s.tableCard}>
          {loading ? (
            <div style={s.loadingWrap}>
              <div style={s.spinner} />
              <p style={{ color: "#6B7280", marginTop: 12 }}>Carregando ordens...</p>
            </div>
          ) : (
            <>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["ID", "Ocorrência", "Equipe", "Bairro", "Status", "Criada", "Ações"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "48px 0" }}>
                        Nenhuma ordem encontrada
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o, i) => (
                      <tr key={o.id} style={{ ...s.tr, background: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}>
                        {}
                        <td style={{ ...s.td, ...s.tdId }}>
                          {o.id.slice(0, 8).toUpperCase()}
                        </td>

                        {}
                        <td style={s.td}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ fontWeight: 600, color: "#1E293B" }}>
                              {categoryLabel[o.complaint?.category ?? ""] ?? o.complaint?.category ?? "—"}
                            </span>
                            <span style={{ fontSize: 13, color: "#9CA3AF" }}>
                              #{o.complaintId.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {}
                        <td style={s.td}>
                          <div style={s.teamCell}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span>{o.team?.name ?? "—"}</span>
                          </div>
                        </td>

                        {}
                        <td style={{ ...s.td, color: "#6B7280" }}>
                          {o.complaint?.neighborhood ?? "—"}
                        </td>

                        {}
                        <td style={s.td}>
                          <span style={{ ...s.statusBadge, ...(statusStyle[o.status] ?? statusStyle.pending) }}>
                            {statusLabel[o.status] ?? o.status}
                          </span>
                        </td>

                        {}
                        <td style={{ ...s.td, color: "#6B7280" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span>{formatDate(o.createdAt)}</span>
                            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{timeAgo(o.createdAt)}</span>
                          </div>
                        </td>

                        {}
                        <td style={s.td}>
                          <button
                            style={s.actionBtn}
                            onClick={() => openStatusModal(o)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                            </svg>
                            Atualizar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {filtered.length > 0 && (
                <div style={s.tableFooter}>
                  <span style={s.tableCount}>
                    Exibindo <strong>{filtered.length}</strong> de <strong>{orders.length}</strong> ordens
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {}
      {showModal && selectedOrder && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <div>
                <h3 style={s.modalTitle}>Atualizar Status</h3>
                <p style={s.modalSubtitle}>
                  Ordem #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button style={s.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={s.modalBody}>
              {}
              <div style={s.currentStatus}>
                <span style={s.currentStatusLabel}>Status atual:</span>
                <span style={{ ...s.statusBadge, ...(statusStyle[selectedOrder.status] ?? statusStyle.pending) }}>
                  {statusLabel[selectedOrder.status] ?? selectedOrder.status}
                </span>
              </div>

              {}
              <div style={s.modalField}>
                <label style={s.modalLabel}>Novo Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  style={s.modalSelect}
                >
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              {}
              <div style={s.modalField}>
                <label style={s.modalLabel}>Observações (opcional)</label>
                <textarea
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                  placeholder="Adicione uma observação sobre a mudança de status..."
                  style={s.modalTextarea}
                  rows={3}
                />
              </div>

              {}
              {modalError && (
                <div style={s.modalError}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {modalError}
                </div>
              )}
            </div>

            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button
                style={{ ...s.modalConfirmBtn, ...(updating ? { opacity: 0.7 } : {}) }}
                onClick={handleUpdateStatus}
                disabled={updating}
              >
                {updating ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; min-height: 100vh; overflow-x: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8FAFC; }
        #root { width: 100%; min-height: 100vh; }
        input:focus, select:focus, textarea:focus { outline: none; }
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
  },

  
  header: {
    width: "100%",
  },
  backLink: {
    fontSize: "15px",
    color: "#7C3AED",
    fontWeight: 600,
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  newBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
  divider: {
    height: "1px",
    background: "#E2E8F0",
  },

  
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  statCard: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
  },
  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statValue: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748B",
    fontWeight: 500,
  },

  
  filterCard: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "1.5px solid #E2E8F0",
    borderRadius: "12px",
    padding: "0 18px",
    height: "52px",
    background: "#FAFAFA",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: "16px",
    color: "#1E293B",
  },
  chips: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  chip: {
    padding: "10px 20px",
    borderRadius: "100px",
    border: "1.5px solid #E2E8F0",
    background: "white",
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
  },
  chipActive: {
    background: "#7C3AED",
    borderColor: "#7C3AED",
    color: "white",
    fontWeight: 700,
  },

  
  tableCard: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 700,
    color: "#64748B",
    padding: "18px 24px",
    borderBottom: "1px solid #F1F5F9",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: "#FAFAFA",
  },
  tr: {
    borderBottom: "1px solid #F1F5F9",
  },
  td: {
    fontSize: "15px",
    color: "#374151",
    padding: "18px 24px",
    verticalAlign: "middle",
  },
  tdId: {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#7C3AED",
    fontWeight: 700,
  },
  teamCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#475569",
  },
  statusBadge: {
    display: "inline-block",
    fontSize: "13px",
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: "100px",
  },
  actionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: "#EDE9FE",
    border: "1px solid #DDD6FE",
    borderRadius: "10px",
    color: "#6D28D9",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  tableFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #F1F5F9",
    background: "#FAFAFA",
  },
  tableCount: {
    fontSize: "14px",
    color: "#64748B",
  },

  
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 0",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #E5E7EB",
    borderTopColor: "#7C3AED",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "white",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px 28px",
    borderBottom: "1px solid #F1F5F9",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: "13px",
    color: "#94A3B8",
    marginTop: "4px",
  },
  modalClose: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    color: "#9CA3AF",
    cursor: "pointer",
  },
  modalBody: {
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  currentStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    background: "#F8FAFC",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
  },
  currentStatusLabel: {
    fontSize: "14px",
    color: "#64748B",
    fontWeight: 500,
  },
  modalField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  modalLabel: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#374151",
  },
  modalSelect: {
    height: "52px",
    border: "1.5px solid #E2E8F0",
    borderRadius: "12px",
    padding: "0 16px",
    fontSize: "16px",
    color: "#1E293B",
    background: "#FAFAFA",
    cursor: "pointer",
  },
  modalTextarea: {
    border: "1.5px solid #E2E8F0",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    color: "#1E293B",
    background: "#FAFAFA",
    resize: "vertical",
    fontFamily: "inherit",
  },
  modalError: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#DC2626",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "20px 28px",
    borderTop: "1px solid #F1F5F9",
  },
  modalCancelBtn: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "1.5px solid #E2E8F0",
    background: "white",
    fontSize: "15px",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  modalConfirmBtn: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
};