import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container"> 
        <div className="logo">
          TechStore
        </div>
        <div className="search">
          <Search size={18} className="search-icon"/>
          <input
            type="text"
            placeholder="Buscar produtos..."
          />
        </div>
        <div className="actions">
          <Link to="/Auth" className="login">
            <User size={25} className="login-icon"/>  
            <div className="login-text">
              <span>Bem-vindo(a)</span>
              <strong>Entre ou cadastre-se</strong>
            </div>
          </Link>
          <button className="cart">
            <ShoppingCart size={20}/>
            <span className="cart-count">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;