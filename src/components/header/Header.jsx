import { Search, ShoppingCart, User, Heart, Headset } from "lucide-react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
          <h2 className="logo">Tech<span>Store</span></h2>
        <div className="search">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Buscar produtos..." />
        </div>
        <div className="actions">
         <Link to="/Auth" className="login">
            <User size={25} className="login-icon" />
            <div className="login-text">
              <span>Bem-vindo(a)</span>
              <strong>Entre ou cadastre-se</strong>
            </div>
          </Link>

          <Link to="/atendimento" className="action-item" title="Atendimento ao Cliente">
            <Headset size={24} />
          </Link>

          <Link to="/favoritos" className="action-item" title="Meus favoritos">
            <Heart size={24} />
          </Link>

          <button className="cart" title="Carrinho">
            <ShoppingCart size={20} />
            <span className="cart-count">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
