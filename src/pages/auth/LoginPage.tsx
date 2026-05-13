import { useState, useEffect } from "react";

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path
      d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"
      stroke="white"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    // Verifica se os dados foram informados
    const hasEmailError = !email.trim();
    const hasPasswordError = !password.trim();
    
    // Guarda os erros, caso sejam encontrados
    setEmailError(hasEmailError);
    setPasswordError(hasPasswordError);

    if (hasEmailError || hasPasswordError) 
      return;

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1050 0%, #4a2c9e 50%, #4a2490 100%);
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --purple-deep: #2d1b6b;
          --purple-mid: #4a2c9e;
          --purple-light: #7c4dce;
          --purple-bright: #9c5ef0;
          --violet: #8b3cf7;
          --violet-hover: #7928e8;
          --accent: #a855f7;
          --bg-from: #1e1050;
          --bg-to: #4a2490;
          --card-bg: rgba(255,255,255,0.97);
          --text-primary: #1a1a2e;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --border: #e5e7eb;
          --border-focus: #8b3cf7;
          --input-bg: #f9fafb;
          --input-bg-focus: #ffffff;
          --shadow-card: 0 25px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.15);
          --shadow-btn: 0 4px 20px rgba(139,60,247,0.5);
          --shadow-btn-hover: 0 8px 30px rgba(139,60,247,0.65);
        }

        body {
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, var(--bg-from) 0%, var(--purple-mid) 50%, var(--bg-to) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 15% 20%, rgba(120,60,220,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 85% 80%, rgba(80,20,180,0.4) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 10%, rgba(160,80,255,0.2) 0%, transparent 50%);
          pointer-events: none;
        }

        .page::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          z-index: 10;
          text-decoration: none;
        }

        .back-btn:hover {
          background: rgba(255,255,255,0.18);
          color: white;
          transform: translateX(-2px);
        }

        .help-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .help-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.05);
        }

        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : "20px"});
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .brand-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-wrap {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .logo-wrap:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35);
        }

        .brand-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(26px, 5vw, 30px);
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .brand-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          font-weight: 400;
          letter-spacing: 0.2px;
        }

        .card {
          width: 100%;
          background: var(--card-bg);
          border-radius: 20px;
          padding: clamp(28px, 5vw, 40px);
          box-shadow: var(--shadow-card);
          border: 1px solid rgba(255,255,255,0.8);
        }

        .card-header {
          margin-bottom: 28px;
        }

        .card-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(20px, 4vw, 22px);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          margin-bottom: 4px;
        }

        .field-group {
          margin-bottom: 18px;
        }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: 0.1px;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.2s ease;
          z-index: 1;
        }

        .input-icon.focused {
          color: var(--violet);
        }

        .field-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          background: var(--input-bg);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--text-primary);
          transition: all 0.2s ease;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
        }

        .field-input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }

        .field-input:focus {
          border-color: var(--border-focus);
          background: var(--input-bg-focus);
          box-shadow: 0 0 0 3px rgba(139,60,247,0.12);
        }

        .field-input.error {
          border-color: #e53e3e;
          background: #fff5f5;
          box-shadow: 0 0 0 3px rgba(229,62,62,0.1);
        }

        .field-error {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          padding: 5px 10px;
          background: #fff0f0;
          border: 1px solid rgba(229,62,62,0.25);
          border-radius: 6px;
          font-size: 12px;
          color: #c53030;
          font-weight: 500;
          animation: errorIn 0.2s ease;
        }

        @keyframes errorIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field-error svg {
          flex-shrink: 0;
        }



        .input-action {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .input-action:hover {
          color: var(--text-secondary);
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 8px;
        }

        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-wrap input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--violet);
          cursor: pointer;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .checkbox-label {
          font-size: 13.5px;
          color: var(--text-secondary);
          font-weight: 400;
        }

        .forgot-link {
          font-size: 13.5px;
          color: var(--violet);
          text-decoration: none;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: var(--violet-hover);
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--violet) 0%, var(--purple-bright) 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.2px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: var(--shadow-btn);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .submit-btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: var(--shadow-btn-hover);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, var(--border), transparent);
          margin: 22px 0 16px;
        }

        .card-footer-text {
          text-align: center;
          font-size: 12.5px;
          color: var(--text-muted);
          font-weight: 400;
        }

        .page-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 12.5px;
          color: rgba(255,255,255,0.5);
          position: relative;
          z-index: 1;
        }

        .page-footer span {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .page-footer .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          display: inline-block;
        }

        @media (max-width: 480px) {
          .back-btn span {
            display: none;
          }
          .back-btn {
            padding: 8px 10px;
          }
          .card {
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="page" style={{minHeight:"100vh",width:"100%",background:"linear-gradient(135deg,#1e1050 0%,#4a2c9e 50%,#4a2490 100%)"}}>
        <button className="back-btn" onClick={() => {}}>
          <ArrowLeft />
          <span>Voltar</span>
        </button>

        <div className="main-content">
          <div className="brand-section">
            <div className="logo-wrap">
              <ShieldIcon />
            </div>
            <h1 className="brand-title">ReportaAi Admin</h1>
            <p className="brand-subtitle">Portal de Gestão da Prefeitura</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Login do Gestor</h2>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="email">
                Email ou Matrícula
              </label>
              <div className="input-wrap">
                <span className={`input-icon ${emailFocused ? "focused" : ""}`}>
                  <UserIcon />
                </span>
                <input
                  id="email"
                  type="text"
                  className={`field-input${emailError ? " error" : ""}`}
                  placeholder="seu.email@prefeitura.gov.br"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  autoComplete="username"
                />
              </div>
              {emailError && (
                <div className="field-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Preencha este campo
                </div>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">
                Senha
              </label>
              <div className="input-wrap">
                <span className={`input-icon ${passwordFocused ? "focused" : ""}`}>
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  autoComplete="current-password"
                  className={`field-input${passwordError ? " error" : ""}`}
                  style={{ paddingRight: "42px" }}
                  onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(false); }}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {passwordError && (
                <div className="field-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Preencha este campo
                </div>
              )}
            </div>

            <div className="row">
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-label">Lembrar de mim</span>
              </label>
              <a href="#" className="forgot-link">
                Esqueceu a senha?
              </a>
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Entrando...
                </>
              ) : (
                "Entrar no Sistema"
              )}
            </button>

            <div className="divider" />

            <p className="card-footer-text">
              Acesso restrito a servidores autorizados
            </p>
          </div>
        </div>

        <div className="page-footer">
          <span>
            Sistema protegido por autenticação multi-fator
          </span>
        </div>

        <button className="help-btn" aria-label="Ajuda">
          <HelpIcon />
        </button>
      </div>
    </>
  );
}
