import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");

    if (token && token !== "undefined" && usuarioId && usuarioId !== "null") {
      return {
        token,
        usuarioId,
      };
    }
    return null;
  });

  const login = (userData) => {
    const token = userData.Token;
    const usuarioId = userData.UsuarioId;

    if (!usuarioId) {
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("usuarioId", usuarioId.toString());

    setUser({
      token: token,
      usuarioId: usuarioId.toString(),
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
  };
};