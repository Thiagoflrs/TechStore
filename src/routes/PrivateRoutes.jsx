import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const perfil = localStorage.getItem("perfil");

  if (!token) {
    return <Navigate to="/Auth" replace />;
  }

  if (perfil !== "ADMINISTRADOR") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;