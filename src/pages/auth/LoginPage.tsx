import { type CSSProperties, type FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [lembrar, setLembrar] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState<string>("");

  const limparErro = (campo: string) => {
    setErros((prev) => ({ ...prev, [campo]: "" }));
    setErroGeral("");
  };

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!email.trim()) novosErros.email = "Email é obrigatório";
    else if (!validarEmail(email)) novosErros.email = "Informe um email válido";

    if (!senha.trim()) novosErros.senha = "Senha é obrigatória";
    else if (senha.length < 6)
      novosErros.senha = "Senha deve ter no mínimo 6 caracteres";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log('1. Iniciando login...')
  
  if (!validarFormulario()) {
    console.log('2. Formulário inválido:', erros)
    return
  }

  console.log('3. Formulário válido')
  setLoading(true);
  setErroGeral("");

  try {
    console.log('4. Chamando Firebase Auth...')
    const firebaseRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: senha,
          returnSecureToken: true,
        }),
      }
    );

    const firebaseData = await firebaseRes.json();
    console.log('5. Resposta Firebase:', firebaseData)
    
    if (firebaseData.error) throw new Error("E-mail ou senha inválidos");

    const idToken: string = firebaseData.idToken;
    console.log('6. idToken gerado, chamando backend...')

    const backendRes = await fetch(`${import.meta.env.VITE_API_URL}/users/login-dashboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const backendData = await backendRes.json();
    console.log('7. Resposta backend:', backendData)
    
    if (!backendRes.ok) throw new Error(backendData.error || "Acesso negado");

    localStorage.setItem("token", backendData.token);
    localStorage.setItem("user", JSON.stringify(backendData.user));

    console.log('8. Login bem sucedido! Redirecionando...')
    window.location.href = "/dashboard";

  } catch (error: any) {
    console.log('ERRO:', error.message)
    setErroGeral(error.message || "Erro ao fazer login");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.page}>
      {/* Background gradient */}
      <div style={styles.background} />

      {/* Botão voltar */}
      <button style={styles.botaoVoltar} onClick={() => window.history.back()}>
        ← Voltar
      </button>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>
          <h1 style={styles.titulo}>ReportAI Admin</h1>
          <p style={styles.subtitulo}>Portal de Gestão da Prefeitura</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Login do Gestor</h2>

          {/* Erro geral */}
          {erroGeral && (
            <div style={styles.erroGeral}>
              <span style={styles.erroGeralIcon}>⚠</span>
              {erroGeral}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email ou Matrícula</label>
              <div style={{ ...styles.inputContainer, ...(erros.email ? styles.inputError : {}) }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.inputIcon}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="7" r="4" stroke="#9CA3AF" strokeWidth="2" />
                </svg>
                <input
                  type="email"
                  placeholder="seu.email@prefeitura.gov.br"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); limparErro("email"); }}
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
              {erros.email && <span style={styles.erroText}>{erros.email}</span>}
            </div>

            {/* SENHA */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Senha</label>
              <div style={{ ...styles.inputContainer, ...(erros.senha ? styles.inputError : {}) }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.inputIcon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); limparErro("senha"); }}
                  style={styles.input}
                  autoComplete="current-password"
                />
              </div>
              {erros.senha && <span style={styles.erroText}>{erros.senha}</span>}
            </div>

            {/* Lembrar + Esqueci */}
            <div style={styles.lembrarContainer}>
              <label style={styles.lembrarLabel}>
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  style={styles.checkbox}
                />
                Lembrar de mim
              </label>
              <a href="/esqueci-senha" style={styles.esqueciLink}>
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.botao, ...(loading ? styles.botaoLoading : {}) }}
            >
              {loading ? "Entrando..." : "Entrar no Sistema"}
            </button>
          </form>

          {/* Divisor */}
          <div style={styles.divisor} />

          <p style={styles.acessoRestrito}>
            Acesso restrito a servidores autorizados
          </p>
        </div>

        {/* Rodapé */}
        <p style={styles.rodape}>
          Sistema protegido por autenticação multi-fator
        </p>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html {
          width: 100%;
          height: 100%;
        }
        body {
          width: 100%;
          min-height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #5b21b6 100%);
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          overflow-x: hidden;
        }
        #root {
          width: 100%;
          min-height: 100vh;
        }
        input::placeholder { color: #9CA3AF; }
        input:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // ← sem background aqui
  },
  background: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #5b21b6 100%)",
    zIndex: 0,
  },
  botaoVoltar: {
    position: "fixed",
    top: 40,
    left: 40,
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.8)",
    fontSize: 22,
    cursor: "pointer",
    padding: "10px 16px",
    borderRadius: 8,
    zIndex: 10,
  },
  container: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: 800,
    padding: "80px 40px",
    margin: "0 auto",     // ← garante centralização
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 56,
  },
  iconContainer: {
    width: 120,
    height: 120,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    border: "1px solid rgba(255,255,255,0.2)",
  },
  titulo: {
    fontSize: 52,
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: "-0.5px",
  },
  subtitulo: {
    fontSize: 24,
    color: "rgba(255,255,255,0.6)",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 28,
    padding: "64px 60px",
    width: "100%",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
  },
  cardTitulo: {
    fontSize: 36,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 40,
  },
  erroGeral: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 12,
    padding: "18px 22px",
    marginBottom: 28,
    fontSize: 18,
    color: "#DC2626",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  erroGeralIcon: {
    fontSize: 22,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    display: "block",
    fontSize: 18,
    fontWeight: 500,
    color: "#6B7280",
    marginBottom: 12,
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #E5E7EB",
    borderRadius: 14,
    padding: "0 20px",
    height: 68,
    gap: 14,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    flexShrink: 0,
    width: 26,
    height: 26,
  },
  input: {
    flex: 1,
    border: "none",
    fontSize: 20,
    color: "#111827",
    background: "transparent",
    height: "100%",
  },
  erroText: {
    display: "block",
    fontSize: 16,
    color: "#EF4444",
    marginTop: 8,
    marginLeft: 2,
  },
  lembrarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  lembrarLabel: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 20,
    color: "#374151",
    cursor: "pointer",
  },
  checkbox: {
    width: 24,
    height: 24,
    accentColor: "#7C3AED",
    cursor: "pointer",
  },
  esqueciLink: {
    fontSize: 20,
    color: "#7C3AED",
    textDecoration: "none",
    fontWeight: 500,
  },
  botao: {
    width: "100%",
    height: 72,
    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 14,
    fontSize: 22,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.3px",
  },
  botaoLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  divisor: {
    height: 1,
    background: "#F3F4F6",
    margin: "40px 0 24px",
  },
  acessoRestrito: {
    textAlign: "center",
    fontSize: 18,
    color: "#9CA3AF",
  },
  rodape: {
    marginTop: 32,
    fontSize: 18,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
  },
};