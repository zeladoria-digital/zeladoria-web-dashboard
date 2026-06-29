import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Complaint {
  id: string;
  status: string;
  category: string;
  source: string;
  createdAt: string;
  neighborhood?: string;
  description?: string;
  userId?: string;
  location?: { latitude: number; longitude: number };
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

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("pt-BR");
};

const isFossa = (c: Complaint) =>
  c.category === "fossa" || c.category?.toLowerCase().includes("fossa");

// ─── Component ───────────────────────────────────────────────────────────────
export default function ListaOcorrencias() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filtered, setFiltered] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [fossaCount, setFossaCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, search, activeFilter]);

  const loadComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Complaint[] = await res.json();
      setComplaints(data);
      setFossaCount(data.filter(isFossa).length);
    } catch (err) {
      console.error("Erro ao carregar ocorrências:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...complaints];

    // Filtro por categoria/origem
    if (activeFilter === "fossa") result = result.filter(isFossa);
    else if (activeFilter === "iot") result = result.filter(c => c.source === "iot");
    else if (activeFilter === "outros") result = result.filter(c => !isFossa(c) && c.source !== "iot");

    // Filtro por busca
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        (categoryLabel[c.category] ?? c.category)?.toLowerCase().includes(q) ||
        c.neighborhood?.toLowerCase().includes(q) ||
        (statusLabel[c.status] ?? c.status)?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  };

  const exportCSV = () => {
    const headers = ["ID", "Tipo", "Bairro", "Status", "Origem", "Data"];
    const rows = filtered.map(c => [
      c.id,
      categoryLabel[c.category] ?? c.category,
      c.neighborhood ?? "—",
      statusLabel[c.status] ?? c.status,
      c.source === "iot" ? "IoT" : "Cidadão",
      formatDate(c.createdAt),
    ]);

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ocorrencias.csv";
    a.click();
  };

  return (
    <div style={s.root}>
      <main style={s.main}>

        {/* ── Header ── */}
        <header style={s.header}>
          <div>
            <a href="/dashboard" style={s.backLink}>← Dashboard</a>
            <h1 style={s.headerTitle}>Lista de Ocorrências</h1>
          </div>
          <button style={s.exportBtn} onClick={exportCSV}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Exportar CSV
          </button>
        </header>

        {/* ── Search + Filters ── */}
        <div style={s.filterCard}>
          {/* Search */}
          <div style={s.searchWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por ID, tipo, localização..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>

          {/* Filter chips */}
          <div style={s.chips}>
            <button
              style={{ ...s.chip, ...(activeFilter === "all" ? s.chipActive : {}) }}
              onClick={() => setActiveFilter("all")}
            >
              Todas
            </button>
            <button
              style={{ ...s.chip, ...(activeFilter === "fossa" ? s.chipFossa : {}) }}
              onClick={() => setActiveFilter("fossa")}
            >
              🚛 Fossa cheia {fossaCount > 0 && `(Alta demanda)`}
            </button>
            <button
              style={{ ...s.chip, ...(activeFilter === "iot" ? s.chipActiveOutline : {}) }}
              onClick={() => setActiveFilter("iot")}
            >
              Buracos (IoT)
            </button>
            <button
              style={{ ...s.chip, ...(activeFilter === "outros" ? s.chipActiveOutline : {}) }}
              onClick={() => setActiveFilter("outros")}
            >
              Outras categorias
            </button>

            <div style={s.filtrosBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filtros
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={s.tableCard}>
          {loading ? (
            <div style={s.loadingWrap}>
              <div style={s.spinner} />
              <p style={{ color: "#6B7280", marginTop: 12 }}>Carregando ocorrências...</p>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  {["ID", "Tipo", "Localização", "Status", "Data", "Origem", "Ações"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "48px 0" }}>
                      Nenhuma ocorrência encontrada
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <tr key={c.id} style={{ ...s.tr, background: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}>
                      {/* ID */}
                      <td style={{ ...s.td, ...s.tdId }}>
                        {c.id.slice(0, 8).toUpperCase()}
                      </td>

                      {/* Tipo */}
                      <td style={s.td}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {isFossa(c) && <span>⭐</span>}
                          <span style={{ ...s.typeText, color: isFossa(c) ? "#B45309" : "#1E293B", fontWeight: isFossa(c) ? 700 : 500 }}>
                            {categoryLabel[c.category] ?? c.category}
                          </span>
                        </span>
                      </td>

                      {/* Localização */}
                      <td style={{ ...s.td, color: "#6B7280" }}>
                        {c.neighborhood ?? "—"}
                      </td>

                      {/* Status */}
                      <td style={s.td}>
                        <span style={{ ...s.statusBadge, ...(statusStyle[c.status] ?? statusStyle.pending) }}>
                          {statusLabel[c.status] ?? c.status}
                        </span>
                      </td>

                      {/* Data */}
                      <td style={{ ...s.td, color: "#374151" }}>
                        {formatDate(c.createdAt)}
                      </td>

                      {/* Origem */}
                      <td style={s.td}>
                        <span style={{ ...s.sourceBadge, background: c.source === "iot" ? "#EEF2FF" : "#F0FDF4", color: c.source === "iot" ? "#4F46E5" : "#16A34A" }}>
                          {c.source === "iot" ? "IoT" : "Cidadão"}
                        </span>
                      </td>

                      {/* Ações */}
                      <td style={s.td}>
                        <button style={s.verBtn} onClick={() => navigate("/ocorrencia/" + c.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Footer da tabela */}
          {!loading && filtered.length > 0 && (
            <div style={s.tableFooter}>
              <span style={s.tableCount}>
                Exibindo <strong>{filtered.length}</strong> de <strong>{complaints.length}</strong> ocorrências
              </span>
            </div>
          )}
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; min-height: 100vh; overflow-x: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8FAFC; }
        #root { width: 100%; min-height: 100vh; }
        input:focus { outline: none; }
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
    alignItems: "flex-start", // ← era flex-end
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
  exportBtn: {
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

  // Filter Card
  filterCard: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
  chipFossa: {
    background: "#FFFBEB",
    borderColor: "#FDE68A",
    color: "#B45309",
    fontWeight: 700,
  },
  chipActiveOutline: {
    borderColor: "#7C3AED",
    color: "#7C3AED",
    fontWeight: 700,
  },
  filtrosBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "100px",
    border: "1.5px solid #E2E8F0",
    background: "white",
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    marginLeft: "auto",
  },

  // Table Card
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
    transition: "background 0.15s",
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
  typeText: {
    fontSize: "15px",
  },
  statusBadge: {
    display: "inline-block",
    fontSize: "13px",
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: "100px",
  },
  sourceBadge: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: "100px",
  },
  verBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    border: "none",
    color: "#7C3AED",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 0",
  },

  // Footer
  tableFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #F1F5F9",
    background: "#FAFAFA",
  },
  tableCount: {
    fontSize: "14px",
    color: "#64748B",
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
};