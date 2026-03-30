import { Search, ShoppingBasket, User, Heart, Headset, LogOut, Wrench } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../../services/userService";
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
  const [tipoPerfil, setTipoPerfil] = useState(null);
  
  const hasFetched = useRef(false);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Usuarios/GetInfoUsuario/${user.usuarioId}`, {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        console.error("Erro ao buscar dados do usuário:", response.status);
        return;
      }

      const data = await response.json();

      setPerfil({
        nome: data.Nome ?? "Usuário",
        saldo: data.Saldo ?? 0
      });

    } catch (error) {
      console.error("Erro na requisição do perfil:", error);
    }
  }, [user]);

  const carregarPerfilUsuario = useCallback(async () => {
    if (!user?.usuarioId) return;

    try {
      const data = await getUser(user.usuarioId, user.token);

      const perfil = data?.Perfil ?? null;
      setTipoPerfil(perfil);

      if (perfil?.toUpperCase() !== "ADMINISTRADOR") {
        await carregarDadosUsuario();
      }

    } catch (error) {
      console.error("Erro ao buscar tipo de perfil:", error);
      setTipoPerfil(null);
    }
  }, [user, carregarDadosUsuario]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    carregarPerfilUsuario();
  }, [carregarPerfilUsuario]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserId(null);
      setPerfil(null);
      setTipoPerfil(null);

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
            tipoPerfil?.toUpperCase() === "ADMINISTRADOR" ? (
              <div className="login-logged">
                <button onClick={handleLogout} className="logout-button" title="Sair">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="login-logged">
                <User size={25} className="login-icon" />
                <div className="login-text">
                  <span>Olá, {perfil?.nome || "Usuário"}!</span>
                  <strong>Saldo: {formatarMoeda(perfil?.saldo)}</strong>
                </div>
                <button onClick={handleLogout} className="logout-button" title="Sair">
                  <LogOut size={20} />
                </button>
              </div>
            )
          ) : (
            <Link to="/Auth" className="login">
              <User size={25} className="login-icon" />
              <div className="login-text">
                <span>Bem-vindo(a)</span>
                <strong>Entre ou cadastre-se</strong>
              </div>
            </Link>
          )}

          {tipoPerfil?.toUpperCase() === "ADMINISTRADOR" && (
            <Link to="/dashboard" className="action-item" title="Admin">
              <Wrench size={24} />
            </Link>
          )}

          <Link to="/atendimento" className="action-item" title="Atendimento">
            <Headset size={24} />
          </Link>

          <Link to="/favoritos" className="action-item" title="Favoritos">
            <Heart size={24} />
          </Link>

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