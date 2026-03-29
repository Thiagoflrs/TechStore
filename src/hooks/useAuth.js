import { useState } from "react";
import { getUser } from "../services/userService";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");
    const perfil = localStorage.getItem("perfil");

    if (token && token !== "undefined" && usuarioId && usuarioId !== "null") {
      return {
        token,
        usuarioId,
        perfil,
      };
    }
    return null;
  });

  const login = async (userData) => {
    const token = userData.Token;
    const usuarioId = userData.UsuarioId;

    if (!usuarioId) return;

    try {
      localStorage.setItem("token", token);
      localStorage.setItem("usuarioId", usuarioId.toString());

      const userFull = await getUser(usuarioId, token);

      localStorage.setItem("perfil", userFull.Perfil);

      setUser({
        token: token,
        usuarioId: usuarioId.toString(),
        perfil: userFull.Perfil,
      });

    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("perfil"); 
    setUser(null);
  };

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
  };
};