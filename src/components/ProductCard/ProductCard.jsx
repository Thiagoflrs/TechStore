import "./ProductCard.css";
import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const calculateDiscount = (oldPrice, price) => {
    if (!oldPrice) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const discount = calculateDiscount(product.oldPrice, product.price);

  const formatPrice = (value) => {
    return value.toFixed(2).replace(".", ",");
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {discount && <span className="discount-badge">-{discount}%</span>}

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <h4 className="product-name">{product.name}</h4>

      <div className="price-box">
        {product.oldPrice && (
          <span className="old-price">R$ {formatPrice(product.oldPrice)}</span>
        )}

        <span className="price">R$ {formatPrice(product.price)}</span>
      </div>

      <span className="installment">{product.installment}</span>

      <button
        className="buy-button"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <ShoppingBasket size={20} />
        Comprar
      </button>
    </div>
  );
}

export default ProductCard;
