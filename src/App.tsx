import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthRoutes } from './routes/AuthRoutes' 
import { DashboardRoutes } from './routes/DashboardRoutes' 
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPrincipal from './pages/dashboard/DashboardPrincipal'
import ListaOcorrencias from './pages/dashboard/ListaOcorrencias'
import { Perfil } from './pages/dashboard/Perfil'
import DetalleOcorrencia from "./pages/dashboard/DetalhesOcorrencia"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz: Redireciona para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas de Autenticação Aninhadas */}
        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rotas do Dashboard com o Layout Aplicado */}
        <Route element={<DashboardLayout />}>
          <Route element={<DashboardRoutes />}>
            <Route path="/dashboard" element={<DashboardPrincipal />} />
            <Route path="/ocorrencias" element={<ListaOcorrencias />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ocorrencia/:id" element={<DetalleOcorrencia />} />
          </Route>
        </Route>

        {/* Rota de fallback (404) */}
        <Route path="*" element={<div style={{ padding: 20 }}>Página não encontrada.</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App