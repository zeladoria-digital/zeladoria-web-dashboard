import { useState, useEffect, useRef } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="white" strokeWidth="1.8" fill="none" />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IdIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 10h2M16 14h2M6 10h4v4H6z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="4" y1="9" x2="20" y2="9" strokeLinecap="round" />
    <line x1="4" y1="15" x2="20" y2="15" strokeLinecap="round" />
    <line x1="10" y1="3" x2="8" y2="21" strokeLinecap="round" />
    <line x1="16" y1="3" x2="14" y2="21" strokeLinecap="round" />
  </svg>
);

const CityIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 21h18M9 21V7l6-4v18M3 21V11l6-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RoadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9" y="11" width="10" height="10" rx="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
    <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Google Logo SVG
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// GOV.BR Logo simplified
const GovBrLogo = () => (
  <svg width="48" height="18" viewBox="0 0 80 30" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="30" rx="3" fill="#1351B4" />
    <text x="6" y="21" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="white">gov</text>
    <text x="42" y="21" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="#FFCD07">.br</text>
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────────

interface FieldState {
  value: string;
  error: boolean;
  errorMsg: string;
  focused: boolean;
}

const makeField = (): FieldState => ({ value: "", error: false, errorMsg: "", focused: false });

// ── Field Component ────────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  state: FieldState;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  type?: string;
  maxLength?: number;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
}

const Field = ({ id, label, placeholder, icon, state, onChange, onFocus, onBlur, type = "text", maxLength, suffix, style }: FieldProps) => (
  <div className="field-group">
    <label className="field-label" htmlFor={id}>{label}</label>
    <div className="input-wrap">
      <span className={`input-icon${state.focused ? " focused" : ""}`}>{icon}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={state.value}
        maxLength={maxLength}
        className={`field-input${state.error ? " error" : ""}`}
        style={{ paddingRight: suffix ? "42px" : undefined, ...style }}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="off"
      />
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
    {state.error && (
      <div className="field-error">
        <ErrorIcon />
        {state.errorMsg || "Preencha este campo"}
      </div>
    )}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Fields
  const [nome, setNome] = useState(makeField());
  const [email, setEmail] = useState(makeField());
  const [senha, setSenha] = useState(makeField());
  const [cpf, setCpf] = useState(makeField());
  const [telefone, setTelefone] = useState(makeField());
  const [cep, setCep] = useState(makeField());
  const [cidade, setCidade] = useState(makeField());
  const [bairro, setBairro] = useState(makeField());
  const [rua, setRua] = useState(makeField());
  const [numero, setNumero] = useState(makeField());

  useEffect(() => { setMounted(true); }, []);

  // Masks
  const maskCpf = (v: string) => v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length === 0) return "";
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };
  const maskCep = (v: string) => v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

  const upd = (setter: React.Dispatch<React.SetStateAction<FieldState>>, mask?: (v: string) => string) =>
    (v: string) => setter(p => ({ ...p, value: mask ? mask(v) : v, error: false, errorMsg: "" }));
  const focus = (setter: React.Dispatch<React.SetStateAction<FieldState>>) => () => setter(p => ({ ...p, focused: true }));
  const blur = (setter: React.Dispatch<React.SetStateAction<FieldState>>) => () => setter(p => ({ ...p, focused: false }));
  const setError = (setter: React.Dispatch<React.SetStateAction<FieldState>>, msg: string) =>
    setter(p => ({ ...p, error: true, errorMsg: msg }));

  // ── Validators ────────────────────────────────────────────────────────────────
  const VALID_EMAIL_DOMAINS = ["@gmail.com", "@outlook.com", "@yahoo.com", "@yahoo.com.br", "@icloud.com"];

  const validators: Record<string, (v: string) => string | null> = {
    nome: (v) => {
      if (!v.trim()) return "Preencha este campo";
      if (v.trim().length < 20) return `Nome muito curto (mín. 20 caracteres, atual: ${v.trim().length})`;
      return null;
    },
    cpf: (v) => {
      if (!v.trim()) return "Preencha este campo";
      if (v.length !== 14) return "CPF inválido (formato: 000.000.000-00)";
      return null;
    },
    telefone: (v) => {
      if (!v.trim()) return "Preencha este campo";
      const digits = v.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) return "Telefone inválido (10 ou 11 dígitos)";
      return null;
    },
    email: (v) => {
      if (!v.trim()) return "Preencha este campo";
      if (!v.includes("@") || !v.includes(".")) return "E-mail inválido (ex: nome@gmail.com)";
      const matched = VALID_EMAIL_DOMAINS.some(d => v.toLowerCase().endsWith(d));
      if (!matched) return "Use um domínio válido: Gmail, Outlook, Yahoo ou iCloud";
      return null;
    },
    senha: (v) => {
      if (!v.trim()) return "Preencha este campo";
      if (v.length < 8) return `Senha muito curta (mín. 8 caracteres, atual: ${v.length})`;
      return null;
    },
    cep: (v) => {
      if (!v.trim()) return "Preencha este campo";
      if (v.length !== 9) return "CEP inválido (formato: 00000-000)";
      return null;
    },
    cidade: (v) => (!v.trim() ? "Preencha este campo" : null),
    bairro: (v) => (!v.trim() ? "Preencha este campo" : null),
    rua:    (v) => (!v.trim() ? "Preencha este campo" : null),
    numero: (v) => {
      if (!v.trim()) return "Preencha este campo";
      if (!/^\d+$/.test(v.trim())) return "Informe apenas números";
      return null;
    },
  };

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleSubmit = () => {
    const checks: [string, FieldState, React.Dispatch<React.SetStateAction<FieldState>>][] = [
      ["nome", nome, setNome], ["email", email, setEmail], ["senha", senha, setSenha],
      ["cpf", cpf, setCpf], ["telefone", telefone, setTelefone], ["cep", cep, setCep],
      ["cidade", cidade, setCidade], ["bairro", bairro, setBairro],
      ["rua", rua, setRua], ["numero", numero, setNumero],
    ];

    let hasError = false;
    checks.forEach(([key, field, setter]) => {
      const msg = validators[key](field.value);
      if (msg) { setError(setter, msg); hasError = true; }
    });
    if (hasError) return;

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        html, body, #root {
          margin: 0; padding: 0; width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1050 0%, #4a2c9e 50%, #4a2490 100%);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --violet: #8b3cf7;
          --violet-hover: #7928e8;
          --purple-mid: #4a2c9e;
          --purple-bright: #9c5ef0;
          --bg-from: #1e1050;
          --bg-to: #4a2490;
          --card-bg: rgba(255,255,255,0.97);
          --text-primary: #1a1a2e;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --border: #e5e7eb;
          --border-focus: #8b3cf7;
          --input-bg: #f9fafb;
          --shadow-card: 0 25px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.15);
          --shadow-btn: 0 4px 20px rgba(139,60,247,0.5);
          --shadow-btn-hover: 0 8px 30px rgba(139,60,247,0.65);
        }

        body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

        .page {
          min-height: 100vh; width: 100%;
          background: linear-gradient(135deg, var(--bg-from) 0%, var(--purple-mid) 50%, var(--bg-to) 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 80px 16px 40px; position: relative; overflow-x: hidden; overflow-y: auto;
        }
        .page::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 60% at 15% 20%, rgba(120,60,220,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 85% 80%, rgba(80,20,180,0.4) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 10%, rgba(160,80,255,0.2) 0%, transparent 50%);
        }
        .page::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .back-btn {
          position: fixed; top: 20px; left: 20px; display: flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(8px);
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          transition: all 0.2s ease; z-index: 10;
        }
        .back-btn:hover { background: rgba(255,255,255,0.18); color: white; transform: translateX(-2px); }

        .help-btn {
          position: fixed; bottom: 20px; right: 20px; width: 40px; height: 40px;
          border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px); color: white; display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: all 0.2s ease; z-index: 10;
        }
        .help-btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.05); }

        .main-content {
          display: flex; flex-direction: column; align-items: center;
          width: 100%; max-width: 500px; position: relative; z-index: 1;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : "20px"});
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .brand-section { text-align: center; margin-bottom: 28px; }

        .logo-wrap {
          width: 64px; height: 64px; border-radius: 18px;
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%);
          border: 1px solid rgba(255,255,255,0.25); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3);
          transition: transform 0.3s ease;
        }
        .logo-wrap:hover { transform: translateY(-2px) scale(1.02); }

        .brand-title {
          font-family: 'Outfit', sans-serif; font-size: clamp(24px, 5vw, 28px);
          font-weight: 700; color: white; letter-spacing: -0.5px; margin-bottom: 4px;
        }
        .brand-subtitle { font-size: 14px; color: rgba(255,255,255,0.65); font-weight: 400; }

        /* ── Card ── */
        .card {
          width: 100%; background: var(--card-bg); border-radius: 20px;
          padding: clamp(24px, 5vw, 36px);
          box-shadow: var(--shadow-card); border: 1px solid rgba(255,255,255,0.8);
        }

        .card-title {
          font-family: 'Outfit', sans-serif; font-size: clamp(18px, 4vw, 21px);
          font-weight: 700; color: var(--text-primary); letter-spacing: -0.3px; margin-bottom: 6px;
        }
        .card-subtitle { font-size: 13.5px; color: var(--text-secondary); margin-bottom: 24px; }

        /* ── Social buttons ── */
        .social-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
          margin-bottom: 10px;
        }
        .social-btn-google {
          background: #fff; border: 1.5px solid var(--border); color: var(--text-primary);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .social-btn-google:hover {
          border-color: #c7c7c7; background: #fafafa;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1); transform: translateY(-1px);
        }
        .social-btn-gov {
          background: #1351B4; border: 1.5px solid #1351B4; color: white;
          box-shadow: 0 2px 8px rgba(19,81,180,0.3);
        }
        .social-btn-gov:hover {
          background: #0f3f94; border-color: #0f3f94;
          box-shadow: 0 4px 16px rgba(19,81,180,0.45); transform: translateY(-1px);
        }

        /* ── Divider ── */
        .divider-row {
          display: flex; align-items: center; gap: 12px; margin: 6px 0 4px;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider-text { font-size: 12px; color: var(--text-muted); font-weight: 500; white-space: nowrap; }

        /* ── Expand button ── */
        .expand-btn {
          width: 100%; padding: 13px; margin-top: 10px;
          background: linear-gradient(135deg, var(--violet) 0%, var(--purple-bright) 100%);
          color: white; border: none; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
          letter-spacing: 0.2px; cursor: pointer; transition: all 0.25s ease;
          box-shadow: var(--shadow-btn); display: flex; align-items: center;
          justify-content: center; gap: 8px;
        }
        .expand-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn-hover); }
        .expand-btn .chevron {
          transition: transform 0.35s ease;
          transform: rotate(${expanded ? "180deg" : "0deg"});
          display: flex; align-items: center;
        }

        /* ── Form expansion ── */
        .form-expand {
          overflow: hidden;
          max-height: ${expanded ? "2000px" : "0"};
          opacity: ${expanded ? 1 : 0};
          transition: max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
        }

        .form-inner { padding-top: 24px; }

        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 14px; margin-top: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .section-label:first-of-type { margin-top: 0; }

        /* ── Fields ── */
        .field-group { margin-bottom: 14px; }
        .field-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--text-primary); margin-bottom: 6px; letter-spacing: 0.1px;
        }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute; left: 13px; color: var(--text-muted);
          display: flex; align-items: center; pointer-events: none;
          transition: color 0.2s ease; z-index: 1;
        }
        .input-icon.focused { color: var(--violet); }
        .field-input {
          width: 100%; padding: 11px 13px 11px 38px; border: 1.5px solid var(--border);
          border-radius: 10px; background: var(--input-bg); font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-primary); transition: all 0.2s ease;
          outline: none; appearance: none; -webkit-appearance: none;
        }
        .field-input::placeholder { color: var(--text-muted); }
        .field-input:focus {
          border-color: var(--border-focus); background: #fff;
          box-shadow: 0 0 0 3px rgba(139,60,247,0.12);
        }
        .field-input.error { border-color: #e53e3e; background: #fff5f5; box-shadow: 0 0 0 3px rgba(229,62,62,0.1); }

        .input-suffix {
          position: absolute; right: 12px; background: none; border: none; cursor: pointer;
          color: var(--text-muted); display: flex; align-items: center;
          padding: 4px; border-radius: 4px; transition: color 0.2s ease;
        }
        .input-suffix:hover { color: var(--text-secondary); }

        .field-error {
          display: flex; align-items: center; gap: 5px; margin-top: 5px;
          padding: 5px 10px; background: #fff0f0; border: 1px solid rgba(229,62,62,0.25);
          border-radius: 6px; font-size: 12px; color: #c53030; font-weight: 500;
          animation: errorIn 0.2s ease;
        }
        @keyframes errorIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }

        /* ── 2-column grid ── */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-row-3 { display: grid; grid-template-columns: 1.4fr 1fr 0.7fr; gap: 12px; }

        /* ── Submit ── */
        .submit-btn {
          width: 100%; padding: 14px; margin-top: 8px;
          background: linear-gradient(135deg, var(--violet) 0%, var(--purple-bright) 100%);
          color: white; border: none; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease; box-shadow: var(--shadow-btn);
          position: relative; overflow: hidden;
        }
        .submit-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
          opacity: 0; transition: opacity 0.2s ease;
        }
        .submit-btn:hover:not(:disabled)::before { opacity: 1; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-btn-hover); }
        .submit-btn:disabled { opacity: 0.75; cursor: not-allowed; }

        .spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2.5px solid rgba(255,255,255,0.4); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-link {
          text-align: center; margin-top: 18px; font-size: 13.5px; color: var(--text-secondary);
        }
        .login-link a { color: var(--violet); font-weight: 500; text-decoration: none; }
        .login-link a:hover { text-decoration: underline; }

        .page-footer {
          margin-top: 20px; font-size: 12.5px; color: rgba(255,255,255,0.45);
          text-align: center; position: relative; z-index: 1;
        }

        @media (max-width: 520px) {
          .back-btn span { display: none; }
          .back-btn { padding: 8px 10px; }
          .field-row { grid-template-columns: 1fr; }
          .field-row-3 { grid-template-columns: 1fr 1fr; }
          .field-row-3 > :last-child { grid-column: span 2; }
          .card { border-radius: 16px; }
        }
      `}</style>

      <div className="page" style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(135deg,#1e1050 0%,#4a2c9e 50%,#4a2490 100%)" }}>
        <button className="back-btn" onClick={() => {}}>
          <ArrowLeft />
          <span>Voltar</span>
        </button>

        <div className="main-content">
          {/* Brand */}
          <div className="brand-section">
            <div className="logo-wrap"><ShieldIcon /></div>
            <h1 className="brand-title">ReportaAi</h1>
            <p className="brand-subtitle">Portal do Cidadão</p>
          </div>

          {/* Card */}
          <div className="card">
            <h2 className="card-title">Criar sua conta</h2>
            <p className="card-subtitle">Escolha como deseja se cadastrar</p>

            {/* GOV.BR */}
            <button className="social-btn social-btn-gov" onClick={() => {}}>
              <GovBrLogo />
              Continuar com o GOV.BR
            </button>

            {/* Google */}
            <button className="social-btn social-btn-google" onClick={() => {}}>
              <GoogleLogo />
              Continuar com o Google
            </button>

            {/* Divider */}
            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">ou cadastre-se com email</span>
              <div className="divider-line" />
            </div>

            {/* Expand trigger */}
            <button className="expand-btn" onClick={expanded ? undefined : handleExpand}>
              {expanded ? "Preencha os dados abaixo" : "Cadastrar"}
              <span className="chevron"><ChevronDown /></span>
            </button>

            {/* Expandable form */}
            <div className="form-expand" ref={formRef}>
              <div className="form-inner">

                {/* Dados pessoais */}
                <div className="section-label">Dados Pessoais</div>

                <Field
                  id="nome" label="Nome Completo" placeholder="João da Silva"
                  icon={<UserIcon />} state={nome}
                  onChange={upd(setNome)} onFocus={focus(setNome)} onBlur={blur(setNome)}
                />

                <div className="field-row">
                  <Field
                    id="cpf" label="CPF" placeholder="000.000.000-00"
                    icon={<IdIcon />} state={cpf}
                    onChange={upd(setCpf, maskCpf)} onFocus={focus(setCpf)} onBlur={blur(setCpf)}
                  />
                  <Field
                    id="telefone" label="Telefone" placeholder="(00) 00000-0000"
                    icon={<PhoneIcon />} state={telefone}
                    onChange={upd(setTelefone, maskPhone)} onFocus={focus(setTelefone)} onBlur={blur(setTelefone)}
                  />
                </div>

                {/* Acesso */}
                <div className="section-label">Dados de Acesso</div>

                <Field
                  id="email" label="E-mail" placeholder="joao@email.com"
                  icon={<MailIcon />} state={email} type="email"
                  onChange={upd(setEmail)} onFocus={focus(setEmail)} onBlur={blur(setEmail)}
                />

                <div className="field-group">
                  <label className="field-label" htmlFor="senha">Senha</label>
                  <div className="input-wrap">
                    <span className={`input-icon${senha.focused ? " focused" : ""}`}><LockIcon /></span>
                    <input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={senha.value}
                      className={`field-input${senha.error ? " error" : ""}`}
                      style={{ paddingRight: "42px" }}
                      onChange={(e) => setSenha(p => ({ ...p, value: e.target.value, error: false, errorMsg: "" }))}
                      onFocus={() => setSenha(p => ({ ...p, focused: true }))}
                      onBlur={() => setSenha(p => ({ ...p, focused: false }))}
                    />
                    <button
                      type="button"
                      className="input-suffix"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {senha.error && <div className="field-error"><ErrorIcon />{senha.errorMsg || "Preencha este campo"}</div>}
                </div>

                {/* Endereço */}
                <div className="section-label">Endereço</div>

                <div className="field-row">
                  <Field
                    id="cep" label="CEP" placeholder="00000-000"
                    icon={<MapPinIcon />} state={cep}
                    onChange={upd(setCep, maskCep)} onFocus={focus(setCep)} onBlur={blur(setCep)}
                  />
                  <Field
                    id="cidade" label="Cidade" placeholder="Ex: Natal"
                    icon={<CityIcon />} state={cidade}
                    onChange={upd(setCidade)} onFocus={focus(setCidade)} onBlur={blur(setCidade)}
                  />
                </div>

                <div className="field-row-3">
                  <Field
                    id="rua" label="Rua / Logradouro" placeholder="Ex: Rua das Flores"
                    icon={<RoadIcon />} state={rua}
                    onChange={upd(setRua)} onFocus={focus(setRua)} onBlur={blur(setRua)}
                  />
                  <Field
                    id="bairro" label="Bairro" placeholder="Ex: Centro"
                    icon={<MapPinIcon />} state={bairro}
                    onChange={upd(setBairro)} onFocus={focus(setBairro)} onBlur={blur(setBairro)}
                  />
                  <Field
                    id="numero" label="Número" placeholder="Ex: 142"
                    icon={<HashIcon />} state={numero}
                    onChange={upd(setNumero)} onFocus={focus(setNumero)} onBlur={blur(setNumero)}
                  />
                </div>

                {/* Submit */}
                <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <><span className="spinner" />Cadastrando...</> : "Criar conta"}
                </button>

                <p className="login-link">
                  Já tem uma conta? <a href="#">Entrar</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-footer">Sistema protegido por autenticação multi-fator</div>

        <button className="help-btn" aria-label="Ajuda"><HelpIcon /></button>
      </div>
    </>
  );
}
