import { useParams, useNavigate, Link } from "react-router-dom";
import "./ProductDetails.css";
import { useProtectedAction } from "../../hooks/useProtectedAction";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import RecommendedBrands from "../../components/BrandCard/RecommendedBrands";
import { getProdutoById } from "../../services/productService";
import { paths } from "../../routes/paths";
import { useCart } from "../../context/CartContext";
import FlyToCart from "../../components/cart/FlyToCart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { handleAction } = useProtectedAction();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const data = await getProdutoById(Number(id));
        const productWithExtras = {
          ...data,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu",
          brand: "TechStore",
          stock: data.stock ?? 0,
        };
        setProduct(productWithExtras);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
  }, [id]);

  const formatPrice = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleMouseMove = (e) => {
    if (!showZoom) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product);
      setIsFlying(true);
      setTimeout(() => setIsFlying(false), 800);
    }
  };

  const handleBuyNow = () => {
    handleAction(() => {
      if (product && product.stock > 0) {
        addToCart(product);
        navigate(paths.public.payments);
      }
    });
  };

  if (loading) return <p style={{ padding: "40px" }}>Carregando...</p>;
  if (!product)
    return <p style={{ padding: "40px" }}>Produto não encontrado</p>;

  const pixPrice = product.price * 0.9;
  const isOutOfStock = product.stock === 0;

  return (
    <>
      <Header />
      <FlyToCart isAnimating={isFlying} productImage={product.image} />
      <div className="details-container">
        <Link to="/" className="cat-back">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="details-wrapper">
          <div
            className="image-section"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => {
              setShowZoom(false);
              setIsDragging(false);
            }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            <img src={product.image} alt={product.name} />
            {showZoom && (
              <div
                className="zoom-lens"
                style={{
                  backgroundImage: `url(${product.image})`,
                  ...zoomStyle,
                  cursor: isDragging ? "grabbing" : "zoom-in",
                }}
              />
            )}
          </div>
          <div className="info">
            <h1>{product.name}</h1>
            <span className="brand">
              Marca: <strong>{product.brand}</strong>
            </span>
            <p className="description">{product.description}</p>
            <div className="price-boxDetails">
              <h2 className="price-details">{formatPrice(product.price)}</h2>
              <span className="pix">
                ou {formatPrice(pixPrice)} no PIX (10% OFF)
              </span>
            </div>
            <p className={`stock ${product.stock > 0 ? "ok" : "out"}`}>
              {product.stock > 0
                ? `✔ Em estoque (${product.stock} unidades)`
                : "✖ Indisponível"}
            </p>
            <div className="buy-box">
              <button
                className={`buy-btn ${isOutOfStock ? "disabled" : ""}`}
                disabled={isOutOfStock}
                onClick={handleBuyNow}
              >
                {isOutOfStock ? "Indisponível" : "Comprar agora"}
              </button>
              <button
                className="cart-btn"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                Adicionar ao carrinho
              </button>
            </div>
            <div className="benefits">
              <div>🚚 Frete rápido</div>
              <div>🔒 Compra segura</div>
            </div>
          </div>
        </div>
      </div>
      <RecommendedBrands title="Marcas Recomendadas" />
      <Footer />
    </>
  );
}
