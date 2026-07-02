import React from "react";
import { Outlet } from "react-router-dom";

export function AuthRoutes(): React.JSX.Element {
  // O Outlet renderizará as rotas filhas (/login, /register) definidas no App.tsx
  return <Outlet />;
}