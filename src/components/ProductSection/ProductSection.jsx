import ProductCard from "../ProductCard/ProductCard";
import { getProdutos } from "../../services/productService";
import { useEffect, useState } from "react";

function ProductSection({ title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await getProdutos();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  return (
    <section style={{ padding: "40px" }}>
      <h2 className="section-title">{title}</h2>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {products.map((p, i) => (
            <ProductCard key={i} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductSection;
