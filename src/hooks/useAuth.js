import { useState } from "react";
import { login as loginService, logout as logoutService } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState({
    nome: localStorage.getItem("nome") || "",
    saldo: parseFloat(localStorage.getItem("saldo")) || 0,
    token: localStorage.getItem("token") || "",
  });

  const login = async (email, senha) => {
    const { token, nome, saldo } = await loginService(email, senha);
    localStorage.setItem("token", token);
    localStorage.setItem("nome", nome);
    localStorage.setItem("saldo", saldo ?? 0);
    setUser({ token, nome, saldo: saldo ?? 0 });
  };

  const logout = async () => {
    await logoutService();
    setUser({ token: "", nome: "", saldo: 0 });
  };

  return { user, login, logout };
}