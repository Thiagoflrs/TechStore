import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { getCategoryWithProducts } from "../../services/categorieService";
import { mapProduto } from "../../services/productService";
import "./Category.css";

function Category() {
  const { nomeCategoria } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const formatPrice = (value) =>
    (value ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  useEffect(() => {
    if (!nomeCategoria) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getCategoryWithProducts(nomeCategoria);

        const category = data.find(
          (c) => c.Nome.toLowerCase() === nomeCategoria.toLowerCase()
        );

        if (!category) {
          setCategoryName(nomeCategoria);
          setProducts([]);
          return;
        }

        setCategoryName(category.Nome);

        const formattedProducts = (category.Produtos || []).map(mapProduto);
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [nomeCategoria]);

  return (
    <div className="cat-page">
      <Header />

      <main className="cat-container">
        <div className="cat-header">
          <Link to="/" className="cat-back">
            <ArrowLeft size={16} /> Voltar
          </Link>

          <h1 className="cat-title">{categoryName}</h1>
        </div>

        {loading ? (
          <div className="cat-empty">
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <>
            <div className="cat-grid">
              {products.map((item) => (
                <div key={item.id} className="cat-card" onClick={() => navigate(`/product/${item.id}`)}>
                  <div className="cat-img-box">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cat-txt-box">
                    <h3 title={item.name}>{item.name}</h3>
                    <p className="cat-price">{formatPrice(item.price)}</p>
                    
                    <button
                      className="cat-buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.id}`);
                      }}
                    >
                      <ShoppingBasket size={18} />
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="cat-empty">
                <p>Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Category;