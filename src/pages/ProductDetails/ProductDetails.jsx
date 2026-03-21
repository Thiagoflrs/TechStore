import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import RecommendedBrands from "../../components/BrandCard/RecommendedBrands";
import rdZeus from "../../assets/images/phones/rdZeus.webp";

export default function ProductDetails() {
  const { id } = useParams();

  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const product = {
    id,
    name: "Headset Redragon Zeus X RGB",
    price: 502.5,
    description:
      "Headset gamer com som surround 7.1, RGB personalizável e microfone com cancelamento de ruído.",
    image: rdZeus,
    stock: 12,
    brand: "Redragon",
  };

  const formatPrice = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const pixPrice = product.price * 0.9;

  // 🎯 ZOOM COM CONTROLE
  const handleMouseMove = (e) => {
    if (!showZoom) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  return (
    <>
      <Header />

      <div className="details-container">
        <div className="details-wrapper">

          {/* IMAGEM COM ZOOM + DRAG */}
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

          {/* INFORMAÇÕES */}
          <div className="info">
            <h1>{product.name}</h1>

            <span className="brand">
              Marca: <strong>{product.brand}</strong>
            </span>

            <p className="description">{product.description}</p>

            {/* PREÇO */}
            <div className="price-boxDetails">
              <h2 className="price-details">
                {formatPrice(product.price)}
              </h2>

              <span className="pix">
                ou {formatPrice(pixPrice)} no PIX (10% OFF)
              </span>
            </div>

            {/* ESTOQUE */}
            <p className={`stock ${product.stock > 0 ? "ok" : "out"}`}>
              {product.stock > 0
                ? `✔ Em estoque (${product.stock} unidades)`
                : "✖ Indisponível"}
            </p>

            {/* BOTÕES */}
            <div className="buy-box">
              <Link to="/Payments"
                className="buy-btn">Comprar agora
              </Link>
              <button className="cart-btn">Adicionar ao carrinho</button>
            </div>

            {/* BENEFÍCIOS */}
            <div className="benefits">
              <div>🚚 Frete rápido</div>
              <div>🔒 Compra segura</div>
              <div>💳 Até 12x sem juros</div>
            </div>
          </div>

        </div>
      </div>
      <RecommendedBrands title="Marcas Recomendadas"/>
      <Footer />
    </>
  );
}