import { Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import { Perfil } from "../pages/dashboard/Perfil";

export function DashboardRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
    </>
  );
}
