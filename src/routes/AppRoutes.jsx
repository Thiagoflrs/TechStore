import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import Home from "../pages/Home/Home.jsx";
import Auth from "../pages/Auth/Auth.jsx";
import Payments from "../pages/Payments/Payments.jsx"


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.public.home} element={<Home />} />
        <Route path={paths.public.auth} element={<Auth />} />
        <Route path={paths.public.payments} element={<Payments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;