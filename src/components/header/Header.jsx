import { Search, ShoppingBasket, User, Heart, Headset, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../cart/CartDrawer";
import "./Header.css";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const mensagem = await logout();
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: mensagem,        
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ops...',
        text: 'Erro ao sair. Tente novamente.',
      });
    }
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
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
                <span>Olá, {user.nome}!</span>
                <strong>Saldo: R$ {user.saldo.toFixed(2)}</strong>
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

          <Link to="/atendimento" className="action-item">
            <Headset size={24} />
          </Link>

          <Link to="/favoritos" className="action-item">
            <Heart size={24} />
          </Link>

          <button 
            type="button"
            className="cart" 
            onClick={() => setIsCartOpen(true)}
          >
            <motion.div
              key={cartCount}
              initial={{ scale: 1 }}
              animate={cartCount > 0 ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBasket size={26} strokeWidth={2.5} color="#0F172A" />
            </motion.div>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

export default Header;