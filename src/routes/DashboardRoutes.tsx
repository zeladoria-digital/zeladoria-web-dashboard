import { Route } from "react-router-dom";
import DashboardPrincipal from "../pages/dashboard/DashboardPrincipal";
import { Perfil } from "../pages/dashboard/Perfil";
import ListaOcorrencias from "../pages/dashboard/ListaOcorrencias";
import DetalleOcorrencia from "../pages/dashboard/DetalhesOcorrencia";

export function DashboardRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<DashboardPrincipal />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/ocorrencias" element={<ListaOcorrencias />} />
      <Route path="/ocorrencia/:id" element={<DetalleOcorrencia />} />
    </>
  );
}