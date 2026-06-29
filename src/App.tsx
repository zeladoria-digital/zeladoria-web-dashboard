import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthRoutes } from './routes/AuthRoutes' // Ajuste o caminho se necessário
import { DashboardRoutes } from './routes/DashboardRoutes' // Ajuste o caminho se necessário

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Injeta as rotas de autenticação (/login, /register) */}
        {AuthRoutes()}

        {/* Injeta as rotas do dashboard (/dashboard, /perfil) */}
        {DashboardRoutes()}

        {/* Rota raiz: Redireciona automaticamente para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota de fallback (404) - Opcional */}
        <Route path="*" element={<div style={{ padding: 20 }}>Página não encontrada.</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App