import { Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export function AuthRoutes() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  );
}
