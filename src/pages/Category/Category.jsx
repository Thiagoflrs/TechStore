import { useParams, Link } from "react-router-dom";
import { ShoppingBasket, ArrowLeft } from "lucide-react";
import Header from "../../components/header/Header";
import "./Category.css";

function Category() {
  const { nomeCategoria } = useParams();

  const produtosBackEnd = [
    { id: 1, nome: "Monitor Gamer Curvo 27'", categoria: "monitores", preco: 1299.90, imagem: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" },
    { id: 2, nome: "Teclado Mecânico RGB", categoria: "teclados", preco: 349.00, imagem: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400" },
    { id: 3, nome: "Mouse Óptico Stealth", categoria: "mouse", preco: 189.90, imagem: "https://images.unsplash.com/photo-1527814050087-379381547969?w=400" },
    { id: 4, nome: "Placa de Vídeo RTX 4060", categoria: "hardware", preco: 2599.00, imagem: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    { id: 5, nome: "Headset Studio Pro", categoria: "periféricos", preco: 459.00, imagem: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400" },
    { id: 6, nome: "SSD NVMe 1TB", categoria: "armazenamento", preco: 520.00, imagem: "https://images.unsplash.com/photo-1597849005574-2018824f11fb?w=400" }
  ];

  const produtosFiltrados = produtosBackEnd.filter(
    (p) => p.categoria.toLowerCase() === (nomeCategoria || "").toLowerCase()
  );

  return (
    <div className="cat-page">
      <Header />
      <main className="cat-container">
        <div className="cat-header">
          <Link to="/" className="cat-back">
            <ArrowLeft size={16} /> Voltar
          </Link>
          <h1 className="cat-title">{nomeCategoria}</h1>
        </div>

        <div className="cat-grid">
          {produtosFiltrados.map((item) => (
            <div key={item.id} className="cat-card">
              <div className="cat-img-box">
                <img src={item.imagem} alt={item.nome} />
              </div>
              <div className="cat-txt-box">
                <h3 title={item.nome}>{item.nome}</h3>
                <p className="cat-price">R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <button className="cat-buy-btn">
                  <ShoppingBasket size={18} />
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>

        {produtosFiltrados.length === 0 && (
          <div className="cat-empty">
            <p>Nenhum produto encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Category;