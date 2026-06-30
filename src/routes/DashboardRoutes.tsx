import { Route } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/Dashboard";import { Perfil } from "../pages/dashboard/Perfil";
import DeviceManagement from "../pages/dashboard/gestao-dispositivos/DeviceManagement";
export function DashboardRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/gestao-dispositivos" element={<DeviceManagement />} />
    </>
  );
}
