import { Search, ShoppingBasket, User, Heart, Headset, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../cart/CartDrawer";
import "./Header.css";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

function Header() {
  const { user, logout } = useAuth();
  const { cartCount, setUserId } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const carregarDadosUsuario = useCallback(async () => {
    if (!user?.usuarioId || user.usuarioId === "null" || user.usuarioId === "undefined") {
      setPerfil({ nome: "Usuário", saldo: 0 });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5248/api/Usuarios/GetInfoUsuario/${user.usuarioId}`, {
        method: 'GET',
        headers: { 
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPerfil({
          nome: data.Nome ?? "Usuário", 
          saldo: data.Saldo ?? 0
        });
      } else {
        setPerfil({ nome: "Usuário", saldo: 0 });
      }
    } catch (error) {
      setPerfil({ nome: "Usuário", saldo: 0 });
    }
  }, [user]);

  useEffect(() => {
    carregarDadosUsuario();
  }, [carregarDadosUsuario]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserId(null);
      setPerfil(null);
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: "Logout realizado com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Ops...', text: 'Erro ao sair.' });
    }
  };

  const formatarMoeda = (valor) => {
    const numero = Number(valor || 0);
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h2 className="logo">Tech<span>Store</span></h2>
        </Link>

        <div className="search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Buscar produtos..." />
        </div>

        <div className="actions">
          {user ? (
            <div className="login-logged">
              <User size={25} className="login-icon" />
              <div className="login-text">
                <span>Olá, {perfil?.nome || "Carregando..."}!</span>
                <strong>Saldo: {formatarMoeda(perfil?.saldo)}</strong>
              </div>
              <button onClick={handleLogout} className="logout-button" title="Sair">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/Auth" className="login">
              <User size={25} className="login-icon" />
              <div className="login-text">
                <span>Bem-vindo(a)</span>
                <strong>Entre ou cadastre-se</strong>
              </div>
            </Link>
          )}

          <Link to="/atendimento" className="action-item"><Headset size={24} /></Link>
          <Link to="/favoritos" className="action-item"><Heart size={24} /></Link>

          <button className="cart" onClick={() => setIsCartOpen(true)}>
            <motion.div
              animate={cartCount > 0 ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBasket size={26} strokeWidth={2.5} />
            </motion.div>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

export default Header;