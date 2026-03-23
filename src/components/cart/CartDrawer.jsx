import { useCart } from "../../context/CartContext";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import "./CartDrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, cartCount } = useCart();
  const navigate = useNavigate();

  const formatPrice = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate(paths.public.payments);
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="header-title">
            <ShoppingBag size={22} color="#00ff88" />
            <h2>Seu Carrinho</h2>
          </div>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={50} color="#333" />
              <p>O carrinho está vazio</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <div className="item-price-info">
                    <span>{item.quantity}x</span>
                    <strong className="green-text">{formatPrice(item.price)}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span>Total do pedido:</span>
              <strong className="total-price">{formatPrice(total)}</strong>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}