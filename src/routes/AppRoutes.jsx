import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import Dashboard from "../pages/Dashboard/Dashboard";
import Home from "../pages/Home/Home"; 

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        
        {/* Adicionei esta linha para evitar o erro "No routes matched" */}
        <Route path="/Auth" element={<Auth />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;