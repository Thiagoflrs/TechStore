import "./ProductCard.css"
import { Star, ShoppingCart } from "lucide-react"

function ProductCard({ product }) {

  return (

    <div className="product-card">

      {product.discount && (
        <span className="discount-badge">
          -{product.discount}%
        </span>
      )}

      <div className="product-image">
        <img src={product.image} alt={product.name}/>
      </div>

      <h4 className="product-name">
        {product.name}
      </h4>

      <div className="rating">

        <Star size={16} fill="gold" stroke="gold"/>
        <span>{product.rating}</span>

        <span className="reviews">
          ({product.reviews})
        </span>

      </div>

      <div className="price-box">

        {product.oldPrice && (
          <span className="old-price">
            R$ {product.oldPrice}
          </span>
        )}

        <span className="price">
          R$ {product.price}
        </span>

      </div>

      <span className="installment">
        {product.installment}
      </span>

      <button className="buy-button">
        <ShoppingCart size={20}/>
        Comprar
      </button>

    </div>

  )

}

export default ProductCard