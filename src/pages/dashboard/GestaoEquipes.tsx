import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────
interface FieldTeam {
  id: string;
  name: string;
  members?: any[]; // O back-end envia como 'members' contendo os objetos dos usuários
  zone?: string;
  status: "active" | "inactive" | string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function GestaoEquipes() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<FieldTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<FieldTeam | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formName, setFormName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [availableAgents, setAvailableAgents] = useState<{ id: string; name: string }[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [addingMembers, setAddingMembers] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/field-teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar equipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormName("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (team: FieldTeam) => {
    setModalMode("edit");
    setSelectedTeam(team);
    setFormName(team.name);
    setError("");
    setShowModal(true);
  };

  const openConfirmModal = (team: FieldTeam) => {
    setSelectedTeam(team);
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      setError("Nome da equipe é obrigatório.");
      return;
    }

    setSubmitting(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      if (modalMode === "create") {
        await fetch(`${import.meta.env.VITE_API_URL}/field-teams`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: formName, memberIds: [] }),
        });
      } else if (modalMode === "edit" && selectedTeam) {
        await fetch(`${import.meta.env.VITE_API_URL}/field-teams/${selectedTeam.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: formName }),
        });
      }

      setShowModal(false);
      loadTeams();
    } catch (err) {
      setError("Erro ao salvar equipe. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInactivate = async () => {
    if (!selectedTeam) return;

    const token = localStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/field-teams/${selectedTeam.id}/inactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowConfirmModal(false);
      loadTeams();
    } catch (err) {
      console.error("Erro ao inativar equipe:", err);
    }
  };

  const openMembersModal = async (team: FieldTeam) => {
    setSelectedTeam(team);
    setSelectedAgents([]);
    setShowMembersModal(true);
    setLoadingMembers(true);

    const token = localStorage.getItem("token");

    try {
      // Busca todos os usuários com papel de field-agent
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await res.json();

      // Filtra apenas field-agents que não são membros da equipe
      const agents = users.filter((u: any) =>
        u.roles?.some((r: any) => r.slug === "field-agent") &&
        !team.memberIds?.includes(u.id)
      );

      setAvailableAgents(agents.map((u: any) => ({ id: u.id, name: u.name })));
      setMembers(
        (team.memberIds ?? []).map((id: string) => {
          const user = users.find((u: any) => u.id === id);
          return { id, name: user?.name ?? id };
        })
      );
    } catch (err) {
      console.error("Erro ao buscar agentes:", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAddMembers = async () => {
    if (!selectedTeam || selectedAgents.length === 0) return;

    setAddingMembers(true);
    const token = localStorage.getItem("token");

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/field-teams/${selectedTeam.id}/members/add`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberIds: selectedAgents }),
      });

      setShowMembersModal(false);
      loadTeams();
    } catch (err) {
      console.error("Erro ao adicionar membros:", err);
    } finally {
      setAddingMembers(false);
    }
  };

  return (
    <div style={s.root}>
      <main style={s.main}>

        {/* ── Header ── */}
        <header style={s.header}>
          <a href="/dashboard" style={s.backLink}>← Dashboard</a>
          <div style={s.headerRow}>
            <h1 style={s.headerTitle}>Gestão de Equipes</h1>
            <button style={s.createBtn} onClick={openCreateModal}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nova Equipe
            </button>
          </div>
        </header>

        <div style={s.divider} />

        {/* ── Tabela ── */}
        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={{ color: "#6B7280", marginTop: 12 }}>Carregando equipes...</p>
          </div>
        ) : (
          <div style={s.tableCard}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Nome da Equipe", "Membros", "Status", "Ações"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={s.emptyCell}>
                      Nenhuma equipe cadastrada.
                    </td>
                  </tr>
                ) : (
                  teams.map((team, i) => { 
                    const totalMembros = team.members ? team.members.length : 0;
                    return (
                    <tr key={team.id} style={{ ...s.tr, background: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}>
                      <td style={{ ...s.td, fontWeight: 600, color: "#0F172A" }}>
                        {team.name}
                      </td>
                      <td style={s.td}>
                        <div style={s.memberCell}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span>{totalMembros} membros</span>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={team.status === "active" ? s.badgeActive : s.badgeInactive}>
                          {team.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div style={s.actionsWrap}>
                          {/* Editar */}
                          <button
                            style={s.actionBtnEdit}
                            onClick={() => openEditModal(team)}
                            title="Editar equipe"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                            </svg>
                            Editar
                          </button>

                          <button
                            style={s.actionBtnMembers}
                            onClick={() => openMembersModal(team)}
                            title="Gerenciar membros"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <line x1="19" y1="8" x2="19" y2="14" />
                              <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                            Membros
                          </button>

                          {/* Inativar */}
                          {team.status === "active" && (
                            <button
                              style={s.actionBtnInactivate}
                              onClick={() => openConfirmModal(team)}
                              title="Inativar equipe"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                              </svg>
                              Inativar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>

            {teams.length > 0 && (
              <div style={s.tableFooter}>
                <span style={s.tableCount}>
                  <strong>{teams.length}</strong> equipe{teams.length !== 1 ? "s" : ""} cadastrada{teams.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Modal Criar/Editar ── */}
      {showModal && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>
                {modalMode === "create" ? "Nova Equipe" : "Editar Equipe"}
              </h3>
              <button style={s.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={s.modalBody}>
              <div style={s.modalField}>
                <label style={s.modalLabel}>Nome da Equipe</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => { setFormName(e.target.value); setError(""); }}
                  placeholder="Ex: Equipe Infraestrutura Norte"
                  style={{ ...s.modalInput, ...(error ? s.modalInputError : {}) }}
                />
                {error && <span style={s.errorText}>{error}</span>}
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button
                style={{ ...s.modalConfirmBtn, ...(submitting ? { opacity: 0.7 } : {}) }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Salvando..." : modalMode === "create" ? "Criar Equipe" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Confirmar Inativação ── */}
      {showConfirmModal && selectedTeam && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>Inativar Equipe</h3>
              <button style={s.modalClose} onClick={() => setShowConfirmModal(false)}>✕</button>
            </div>

            <div style={s.modalBody}>
              <div style={s.confirmWrap}>
                <div style={s.confirmIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <p style={s.confirmText}>
                  Tem certeza que deseja inativar a equipe <strong>"{selectedTeam.name}"</strong>?
                </p>
                <p style={s.confirmSubText}>
                  A equipe não será deletada — apenas ficará inativa e não aparecerá nas seleções de novas ordens de serviço.
                </p>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </button>
              <button style={s.modalInactivateBtn} onClick={handleInactivate}>
                Inativar
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
        input:focus { outline: none; }
        button:focus { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {showMembersModal && selectedTeam && (
      <div style={s.modalOverlay}>
        <div style={{ ...s.modal, maxWidth: "560px" }}>
          <div style={s.modalHeader}>
            <div>
              <h3 style={s.modalTitle}>Gerenciar Membros</h3>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
                {selectedTeam.name}
              </p>
            </div>
            <button style={s.modalClose} onClick={() => setShowMembersModal(false)}>✕</button>
          </div>

          <div style={s.modalBody}>
            {loadingMembers ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                <div style={s.spinner} />
              </div>
            ) : (
              <>
                {/* Membros atuais */}
                {members.length > 0 && (
                  <div style={s.modalField}>
                    <label style={s.modalLabel}>Membros atuais ({members.length})</label>
                    <div style={s.membersList}>
                      {members.map(m => (
                        <div key={m.id} style={s.memberItem}>
                          <div style={s.memberAvatar}>
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={s.memberName}>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Adicionar novos membros */}
                <div style={s.modalField}>
                  <label style={s.modalLabel}>
                    Adicionar agentes de campo
                  </label>
                  {availableAgents.length === 0 ? (
                    <p style={{ fontSize: 14, color: "#9CA3AF", padding: "12px 0" }}>
                      Nenhum agente de campo disponível para adicionar.
                    </p>
                  ) : (
                    <div style={s.agentsList}>
                      {availableAgents.map(agent => {
                        const isSelected = selectedAgents.includes(agent.id);
                        return (
                          <div
                            key={agent.id}
                            style={{ ...s.agentItem, ...(isSelected ? s.agentItemSelected : {}) }}
                            onClick={() => {
                              setSelectedAgents(prev =>
                                prev.includes(agent.id)
                                  ? prev.filter(id => id !== agent.id)
                                  : [...prev, agent.id]
                              );
                            }}
                          >
                            <div style={{ ...s.agentCheckbox, ...(isSelected ? s.agentCheckboxSelected : {}) }}>
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <div style={s.memberAvatar}>
                              {agent.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={s.memberName}>{agent.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div style={s.modalFooter}>
            <button style={s.modalCancelBtn} onClick={() => setShowMembersModal(false)}>
              Fechar
            </button>
            {selectedAgents.length > 0 && (
              <button
                style={{ ...s.modalConfirmBtn, ...(addingMembers ? { opacity: 0.7 } : {}) }}
                onClick={handleAddMembers}
                disabled={addingMembers}
              >
                {addingMembers ? "Adicionando..." : `Adicionar ${selectedAgents.length} membro${selectedAgents.length > 1 ? "s" : ""}`}
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties | any> = {
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
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
  },
  backLink: {
    fontSize: "15px",
    color: "#7C3AED",
    fontWeight: 600,
    textDecoration: "none",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  createBtn: {
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
    width: "100%",
  },

  // Table
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
    padding: "20px 24px",
    verticalAlign: "middle",
  },
  memberCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748B",
  },
  badgeActive: {
    display: "inline-block",
    fontSize: "13px",
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: "100px",
    background: "#ECFDF5",
    color: "#065F46",
    border: "1px solid #A7F3D0",
  },
  badgeInactive: {
    display: "inline-block",
    fontSize: "13px",
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: "100px",
    background: "#F1F5F9",
    color: "#64748B",
    border: "1px solid #E2E8F0",
  },
  actionsWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  actionBtnEdit: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "10px",
    color: "#2563EB",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  actionBtnInactivate: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: "10px",
    color: "#B45309",
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
  emptyCell: {
    padding: "48px",
    textAlign: "center",
    color: "#94A3B8",
    fontSize: "15px",
  },

  // Loading
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
    maxWidth: "480px",
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
  modalInput: {
    height: "52px",
    border: "1.5px solid #E2E8F0",
    borderRadius: "12px",
    padding: "0 16px",
    fontSize: "16px",
    color: "#1E293B",
    background: "#FAFAFA",
  },
  modalInputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: "13px",
    color: "#EF4444",
    marginTop: "2px",
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
  modalInactivateBtn: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #F59E0B, #D97706)",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },

  // Confirm Modal
  confirmWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    textAlign: "center",
  },
  confirmIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#FFFBEB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #FDE68A",
  },
  confirmText: {
    fontSize: "16px",
    color: "#1E293B",
    lineHeight: 1.6,
  },
  confirmSubText: {
    fontSize: "14px",
    color: "#94A3B8",
    lineHeight: 1.6,
  },
  actionBtnMembers: {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 16px",
  background: "#F0FDF4",
  border: "1px solid #A7F3D0",
  borderRadius: "10px",
  color: "#065F46",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
},
membersList: {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "12px",
  background: "#F8FAFC",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
},
memberItem: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
},
memberAvatar: {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
  color: "white",
  fontSize: "14px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  },
  memberName: {
    fontSize: "15px",
    color: "#1E293B",
    fontWeight: 500,
  },
  agentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  agentItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    border: "1.5px solid #E2E8F0",
    borderRadius: "12px",
    cursor: "pointer",
    background: "white",
  },
  agentItemSelected: {
    borderColor: "#7C3AED",
    background: "#FAFAFF",
  },
  agentCheckbox: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    border: "2px solid #CBD5E1",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  agentCheckboxSelected: {
    background: "#7C3AED",
    borderColor: "#7C3AED",
  },
};