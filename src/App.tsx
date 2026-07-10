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
// 1. AQUI: Importação da sua tela de gestão
import DeviceManagement from "./pages/dashboard/gestao-dispositivos/DeviceManagement"
import OrdemServico from './pages/dashboard/OrdemServico'
import ListaOrdens from './pages/dashboard/ListaOrdens'
import GestaoEquipes from './pages/dashboard/GestaoEquipes'


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

        {/* Rotas do Dashboard com o Layout Aplicado (Sidebar) */}
        <Route element={<DashboardLayout />}>
          <Route element={<DashboardRoutes />}>
            <Route path="/dashboard" element={<DashboardPrincipal />} />
            <Route path="/ocorrencias" element={<ListaOcorrencias />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ocorrencia/:id" element={<DetalleOcorrencia />} />
            {/* 2. AQUI: A rota para a sua tela sendo renderizada DENTRO do Layout com Sidebar */}
            <Route path="/dispositivos" element={<DeviceManagement />} />
            {/* <Route path="/ordens" element={<OrdemServico />} /> */}
            <Route path="/ordens" element={<ListaOrdens />} />
            <Route path="/equipes" element={<GestaoEquipes />} />
            <Route path='/ordens/nova' element={<OrdemServico />} />
          </Route>
        </Route>

        {/* Rota de fallback (404) */}
        <Route path="*" element={<div style={{ padding: 20 }}>Página não encontrada.</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App