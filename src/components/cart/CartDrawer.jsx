import { useCart } from "../../context/CartContext";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { paths } from "../../routes/paths";
import { useProtectedAction } from "../../hooks/useProtectedAction";
import { createOrder } from "../../services/orderService";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./CartDrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const { handleAction } = useProtectedAction();

  const formatPrice = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    handleAction(async () => {
      try {
        if (cart.length === 0) return;
        setLoading(true);

        const payload = {
          Itens: cart.map((item) => ({
            CodigoProduto: item.codigo,
            Quantidade: item.quantity,
          })),
        };

        const response = await createOrder(payload);
        
        const pedidoId = response?.pedidoId || response?.id || response?.PedidoId;

        if (!pedidoId) throw new Error("ID do pedido não retornado.");

        localStorage.setItem("pedidoId", pedidoId);
        localStorage.setItem("pedidoItens", JSON.stringify(cart));

        await Swal.fire({
          icon: "success",
          title: "Pedido gerado!",
          text: "Redirecionando para o pagamento...",
          timer: 1500,
          showConfirmButton: false,
        });

        onClose(); 
        navigate(paths.public.payments);

      } catch (error) {
        console.error("Erro ao criar pedido:", error);
        Swal.fire({
          icon: "error",
          title: "Ops...",
          text: error.response?.data?.Mensagem || "Não foi possível gerar seu pedido.",
        });
      } finally {
        setLoading(false);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="header-title">
            <ShoppingBag size={22} color="#3B82F6" />
            <h2>Seu Carrinho</h2>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
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
                    <strong className="text-price">{formatPrice(item.price)}</strong>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                  <div className="quantity-control">
                    <button 
                      onClick={() => decreaseQuantity(item.id)} 
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
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
            <button 
              className="checkout-btn" 
              onClick={handleCheckout} 
              disabled={loading}
            >
              {loading ? "Processando..." : "Ir para o Pagamento"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}