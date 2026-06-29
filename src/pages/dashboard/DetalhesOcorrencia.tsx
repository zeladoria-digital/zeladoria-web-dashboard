import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Complaint {
  id: string;
  status: string;
  category: string;
  source: string;
  createdAt: string;
  updatedAt?: string;
  neighborhood?: string;
  description?: string;
  photoUrl?: string;
  userId?: string;
  reviewNotes?: string;
  reviewedBy?: string;
  location?: { latitude: number; longitude: number };
}

interface TimelineItem {
  label: string;
  date: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovada",
  in_progress: "Em andamento",
  resolved: "Resolvido",
  rejected: "Rejeitada",
};

const statusStyle: Record<string, { background: string; color: string; border: string }> = {
  pending: { background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" },
  approved: { background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" },
  in_progress: { background: "#EDE9FE", color: "#6D28D9", border: "1px solid #DDD6FE" },
  resolved: { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" },
  rejected: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" },
};

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const buildTimeline = (complaint: Complaint): TimelineItem[] => {
  const items: TimelineItem[] = [
    { label: "Reporte recebido", date: complaint.createdAt },
  ];

  if (complaint.status === "approved" || complaint.status === "in_progress" || complaint.status === "resolved") {
    items.push({ label: "Em análise", date: complaint.updatedAt ?? complaint.createdAt });
    items.push({ label: "Aprovado", date: complaint.updatedAt ?? complaint.createdAt });
  }

  if (complaint.status === "in_progress") {
    items.push({ label: "Em andamento", date: complaint.updatedAt ?? complaint.createdAt });
  }

  if (complaint.status === "resolved") {
    items.push({ label: "Em andamento", date: complaint.updatedAt ?? complaint.createdAt });
    items.push({ label: "Resolvido", date: complaint.updatedAt ?? complaint.createdAt });
  }

  if (complaint.status === "rejected") {
    items.push({ label: "Rejeitado", date: complaint.updatedAt ?? complaint.createdAt });
  }

  return items;
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function DetalheOcorrencia() {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Pega o ID da URL
  const id = window.location.pathname.split("/").pop();

  useEffect(() => {
    loadComplaint();
  }, []);

  const loadComplaint = async () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaint(data);
      setNewStatus(data.status);
    } catch (err) {
      console.error("Erro ao carregar ocorrência:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token || !complaint) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/complaints/${complaint.id}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, notes: statusNotes }),
      });

      if (res.ok) {
        setShowStatusModal(false);
        loadComplaint(); // recarrega os dados
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner} />
        <p style={{ color: "#6B7280", marginTop: 12 }}>Carregando ocorrência...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={s.loadingWrap}>
        <p style={{ color: "#EF4444", fontSize: 18 }}>Ocorrência não encontrada.</p>
        <a href="/ocorrencias" style={s.backLink}>← Voltar para lista</a>
      </div>
    );
  }

  const timeline = buildTimeline(complaint);

  return (
    <div style={s.root}>
      <main style={s.main}>

        {/* ── Header ── */}
        <header style={s.header}>
          <div>
            <a href="/ocorrencias" style={s.backLink}>← Voltar para lista</a>
            <h1 style={s.headerTitle}>
              Ocorrência #{complaint.id.slice(0, 8).toUpperCase()}
            </h1>
          </div>
          <button style={s.alterarBtn} onClick={() => setShowStatusModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Alterar Status
          </button>
        </header>

        <div style={s.contentGrid}>

          {/* ── Left Column ── */}
          <div style={s.leftCol}>

            {/* Foto */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Foto da Ocorrência</h2>
              {complaint.photoUrl ? (
                <img
                  src={complaint.photoUrl}
                  alt="Foto da ocorrência"
                  style={s.photo}
                />
              ) : (
                <div style={s.photoPlaceholder}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  <p style={{ color: "#9CA3AF", marginTop: 12, fontSize: 15 }}>Sem foto disponível</p>
                </div>
              )}
            </div>

            {/* Linha do Tempo */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Linha do Tempo</h2>
              <div style={s.timeline}>
                {timeline.map((item, i) => (
                  <div key={i} style={s.timelineItem}>
                    <div style={s.timelineDotWrap}>
                      <div style={s.timelineDot} />
                      {i < timeline.length - 1 && <div style={s.timelineLine} />}
                    </div>
                    <div style={s.timelineContent}>
                      <span style={s.timelineLabel}>{item.label}</span>
                      <span style={s.timelineDate}>{formatDateTime(item.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right Column ── */}
          <div style={s.rightCol}>

            {/* Informações */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Informações</h2>

              <div style={s.infoList}>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Tipo</span>
                  <span style={s.infoValue}>
                    {categoryLabel[complaint.category] ?? complaint.category}
                  </span>
                </div>

                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Status</span>
                  <span style={{ ...s.statusBadge, ...(statusStyle[complaint.status] ?? statusStyle.pending) }}>
                    {statusLabel[complaint.status] ?? complaint.status}
                  </span>
                </div>

                <div style={s.infoItem}>
                  <div style={s.infoWithIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={s.infoLabel}>Localização</span>
                  </div>
                  <span style={s.infoValue}>
                    {complaint.neighborhood ?? "—"}
                    {complaint.location && (
                      <span style={{ fontSize: 13, color: "#9CA3AF", display: "block", marginTop: 2 }}>
                        {complaint.location.latitude.toFixed(4)}, {complaint.location.longitude.toFixed(4)}
                      </span>
                    )}
                  </span>
                </div>

                <div style={s.infoItem}>
                  <div style={s.infoWithIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={s.infoLabel}>Data</span>
                  </div>
                  <span style={s.infoValue}>{formatDateTime(complaint.createdAt)}</span>
                </div>

                <div style={s.infoItem}>
                  <div style={s.infoWithIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <span style={s.infoLabel}>Cidadão</span>
                  </div>
                  <span style={s.infoValue}>{complaint.userId?.slice(0, 8) ?? "—"}</span>
                </div>

                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Origem</span>
                  <span style={{
                    ...s.sourceBadge,
                    background: complaint.source === "iot" ? "#EEF2FF" : "#F0FDF4",
                    color: complaint.source === "iot" ? "#4F46E5" : "#16A34A"
                  }}>
                    {complaint.source === "iot" ? "Dispositivo IoT" : "Cidadão"}
                  </span>
                </div>

                {complaint.description && (
                  <div style={s.infoItem}>
                    <span style={s.infoLabel}>Descrição</span>
                    <span style={{ ...s.infoValue, color: "#64748B", lineHeight: 1.6 }}>
                      {complaint.description}
                    </span>
                  </div>
                )}

                {complaint.reviewNotes && (
                  <div style={s.infoItem}>
                    <span style={s.infoLabel}>Observações do Gestor</span>
                    <span style={{ ...s.infoValue, color: "#64748B", lineHeight: 1.6 }}>
                      {complaint.reviewNotes}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Modal Alterar Status ── */}
      {showStatusModal && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Alterar Status</h3>
              <button style={s.modalClose} onClick={() => setShowStatusModal(false)}>✕</button>
            </div>

            <div style={s.modalBody}>
              <div style={s.modalField}>
                <label style={s.modalLabel}>Novo Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  style={s.modalSelect}
                >
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovada</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="resolved">Resolvido</option>
                  <option value="rejected">Rejeitada</option>
                </select>
              </div>

              <div style={s.modalField}>
                <label style={s.modalLabel}>Observações (opcional)</label>
                <textarea
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                  placeholder="Adicione uma observação sobre a mudança de status..."
                  style={s.modalTextarea}
                  rows={4}
                />
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowStatusModal(false)}>
                Cancelar
              </button>
              <button
                style={{ ...s.modalConfirmBtn, ...(updatingStatus ? { opacity: 0.7 } : {}) }}
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
              >
                {updatingStatus ? "Salvando..." : "Salvar"}
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

// ─── Styles ──────────────────────────────────────────────────────────────────
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

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  backLink: {
    fontSize: "15px",
    color: "#7C3AED",
    fontWeight: 600,
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  alterarBtn: {
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

  // Content Grid
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "28px",
    alignItems: "start",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  // Card
  card: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "20px",
  },

  // Photo
  photo: {
    width: "100%",
    borderRadius: "14px",
    objectFit: "cover",
    maxHeight: "460px",
  },
  photoPlaceholder: {
    width: "100%",
    height: "300px",
    background: "#F8FAFC",
    border: "1.5px dashed #E2E8F0",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  // Timeline
  timeline: {
    display: "flex",
    flexDirection: "column",
  },
  timelineItem: {
    display: "flex",
    gap: "16px",
  },
  timelineDotWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  timelineDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#7C3AED",
    flexShrink: 0,
    marginTop: "4px",
  },
  timelineLine: {
    width: "2px",
    flex: 1,
    background: "#E2E8F0",
    margin: "6px 0",
    minHeight: "28px",
  },
  timelineContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    paddingBottom: "24px",
  },
  timelineLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1E293B",
  },
  timelineDate: {
    fontSize: "13px",
    color: "#94A3B8",
  },

  // Info List
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px", // Aumentei levemente o espaço entre os blocos para acompanhar as letras maiores
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Força o bloco a alinhar todo o conteúdo à esquerda
    gap: "6px",
  },
  infoWithIcon: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  infoLabel: {
    fontSize: "15px", // Aumentado (era 13px)
    color: "#9CA3AF",
    fontWeight: 500,
    textAlign: "left",
  },
  infoValue: {
    fontSize: "19px", // Aumentado (era 16px)
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "left", // Garante que o texto não centralize
  },
  statusBadge: {
    display: "inline-block",
    fontSize: "14px", // Aumentado (era 13px)
    fontWeight: 600,
    padding: "6px 18px",
    borderRadius: "100px",
    alignSelf: "flex-start",
  },
  sourceBadge: {
    display: "inline-block",
    fontSize: "14px", // Aumentado (era 13px)
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "100px",
    alignSelf: "flex-start",
  },

  // Modal
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
    maxWidth: "520px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 28px",
    borderBottom: "1px solid #F1F5F9",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0F172A",
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

  // Loading
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #E5E7EB",
    borderTopColor: "#7C3AED",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};