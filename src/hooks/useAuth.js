import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const nome = localStorage.getItem("nome");
    const saldo = localStorage.getItem("saldo");
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");

    if (token && token !== "undefined") {
      return { 
        nome: nome || "Usuário", 
        saldo: parseFloat(saldo || 0), 
        token,
        usuarioId
      };
    }
    return null;
  });

  const login = (userData) => {
    const token = userData.Token;
    const nome = userData.Nome;
    const saldo = userData.Saldo ?? 0;
    const usuarioId = userData.UsuarioId;

    localStorage.setItem("token", token);
    localStorage.setItem("nome", nome);
    localStorage.setItem("saldo", saldo.toString());

    if (usuarioId) {
      localStorage.setItem("usuarioId", usuarioId);
    }
    
    setUser({
      token: token,
      nome: nome,
      saldo: parseFloat(saldo),
      usuarioId: usuarioId,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  const atualizarSaldo = (novoSaldo) => {
    const saldoFormatado = parseFloat(novoSaldo || 0);
    localStorage.setItem("saldo", saldoFormatado.toString());
    
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        saldo: saldoFormatado,
      };
    });
  };

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    atualizarSaldo,
  };
};