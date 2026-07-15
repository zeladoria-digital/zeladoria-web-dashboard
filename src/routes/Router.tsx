
import { BrowserRouter, Routes } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import DashboardRoutes from "./Dashboard";
import PublicRoutes from "./PublicRoutes";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <AuthRoutes />
        <DashboardRoutes />
        <PublicRoutes />
      </Routes>
    </BrowserRouter>
  );
}
