import ProductCard from "../ProductCard/ProductCard";
import { getProdutos } from "../../services/productService";
import { useEffect, useState } from "react";

function ProductSection({ title, categoriasIds }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await getProdutos();

        const filtrados = categoriasIds
          ? data.filter((p) =>
              categoriasIds.includes(p.categoriaId)
            )
          : data;

        setProducts(filtrados);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [categoriasIds]);

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
          {products.slice(0, 10).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductSection;