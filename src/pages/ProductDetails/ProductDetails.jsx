import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import RecommendedBrands from "../../components/BrandCard/RecommendedBrands";
import { getProdutoById } from "../../services/productService";
import { paths } from "../../routes/paths";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const data = await getProdutoById(Number(id));

        const productWithExtras = {
          ...data,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

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

  if (loading) return <p style={{ padding: "40px" }}>Carregando...</p>;
  if (!product) return <p style={{ padding: "40px" }}>Produto não encontrado</p>;

  const pixPrice = product.price * 0.9;
  const isOutOfStock = product.stock === 0;

  return (
    <>
      <Header />

      <div className="details-container">
        <div className="details-wrapper">

          {/* IMAGEM */}
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

          {/* INFO */}
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
              
              <Link
                to={isOutOfStock ? "#" : paths.public.payments}
                className={`buy-btn ${isOutOfStock ? "disabled" : ""}`}
                onClick={(e) => {
                  if (isOutOfStock) e.preventDefault();
                }}
              >
                {isOutOfStock ? "Indisponível" : "Comprar agora"}
              </Link>

              {/* 🔥 Carrinho */}
              <button
                className="cart-btn"
                disabled={isOutOfStock}
              >
                Adicionar ao carrinho
              </button>
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

      <RecommendedBrands title="Marcas Recomendadas" />
      <Footer />
    </>
  );
}