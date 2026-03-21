import { useState } from "react";
import { login as loginService, logoutService } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(() => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    nome: localStorage.getItem("nome"),
    saldo: parseFloat(localStorage.getItem("saldo")) || 0,
    token,
  };
});

  const login = async (email, senha) => {
    const { token, nome, saldo } = await loginService(email, senha);
    localStorage.setItem("token", token);
    localStorage.setItem("nome", nome);
    localStorage.setItem("saldo", saldo ?? 0);
    setUser({ token, nome, saldo: saldo ?? 0 });
  };

  const logout = async () => {
    const mensagem = await logoutService();
    setUser(null);
    return mensagem;
  };

  return { user, login, logout };
}