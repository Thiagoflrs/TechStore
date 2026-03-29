import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import Home from "../pages/Home/Home.jsx";
import Auth from "../pages/Auth/Auth.jsx";
import Payments from "../pages/Payments/Payments.jsx";
import Product from "../pages/ProductDetails/ProductDetails.jsx";
import Category from "../pages/Category/Category.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.public.home} element={<Home />} />
        <Route path={paths.public.auth} element={<Auth />} />
        <Route path={paths.public.payments} element={<Payments />} />
        <Route path={paths.public.productDetails} element={<Product />} />
        <Route path={paths.public.categoryName} element={<Category />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;