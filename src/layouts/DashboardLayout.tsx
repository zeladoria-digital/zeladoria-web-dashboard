import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "260px", flex: 1, minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
}