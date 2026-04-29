import { Route } from "react-router-dom";
import Home from "../pages/public/Home";

export function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<Home />} />
    </>
  );
}
