import { useState, useEffect } from "react";
import "./Payments.css";
import {
  validateCreditCard,
  validateExpiryDate,
} from "../../utils/cardValidator";
import { FaQrcode, FaCreditCard, FaShoppingBag } from "react-icons/fa";
import VisualCard from "./VisualCard";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import RecommendedBrands from "../../components/BrandCard/RecommendedBrands";
import { useCart } from "../../context/CartContext";

function Pagamento() {
  const { cart } = useCart();
  const [metodo, setMetodo] = useState("credito");
  const [analise, setAnalise] = useState(false);
  const [tempo, setTempo] = useState(300);
  const [virado, setVirado] = useState(false);

  const [dados, setDados] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    bandeira: null,
  });

  const [validacao, setValidacao] = useState({ cartao: null, data: null });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    let timer;
    if (metodo === "pix" && tempo > 0) {
      timer = setInterval(() => setTempo((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [metodo, tempo]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "numero") {
      value = value.replace(/\D/g, "").slice(0, 16);
      const res = validateCreditCard(value);
      setValidacao((prev) => ({ ...prev, cartao: res }));
      setDados((prev) => ({ ...prev, numero: value, bandeira: res?.bandeira }));
    } else if (name === "validade") {
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);

      setDados((prev) => ({ ...prev, [name]: value }));

      if (value.length === 5) {
        setValidacao((prev) => ({
          ...prev,
          data: validateExpiryDate(value),
        }));
      }
    } else if (name === "nome") {
      setDados((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setDados((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (analise) {
    return (
      <div className="container">
        <div className="card shadow-lg p-5 text-center">
          <h1 className="text-primary">Pagamento em análise</h1>
          <p>Aguarde enquanto processamos seus dados...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="container">
        <div className="card layout">
          <div className="lado-esquerdo">
            <h2>Pagamento</h2>

            <button
              className={`botao ${metodo === "pix" ? "ativo" : ""}`}
              onClick={() => setMetodo("pix")}
            >
              <FaQrcode /> PIX
            </button>

            <button
              className={`botao ${metodo === "credito" ? "ativo" : ""}`}
              onClick={() => setMetodo("credito")}
            >
              <FaCreditCard /> Cartão
            </button>

            <div className="resumo-pagamento">
              <div className="resumo-header">
                <FaShoppingBag color="#00ff88" />
                <span>Resumo do Pedido</span>
              </div>
              <div className="resumo-lista">
                {cart.map((item) => (
                  <div key={item.id} className="resumo-item">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                ))}
              </div>
              <div className="resumo-total">
                <span>Total:</span>
                <strong>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>
            </div>
          </div>

          <div className="lado-direito">
            {metodo === "pix" ? (
              <div className="info">
                <img
                  className="qrcode"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Pix_Total_${total}`}
                  alt="QR Code Pix"
                />

                <p className="total-pix-display">
                  Valor a pagar: <strong>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </p>

                <p>
                  Expira em:{" "}
                  <strong>
                    {Math.floor(tempo / 60)}:
                    {String(tempo % 60).padStart(2, "0")}
                  </strong>
                </p>

                <button className="confirmar" onClick={() => setAnalise(true)}>
                  Confirmar PIX
                </button>
              </div>
            ) : (
              <div className="info">
                <VisualCard
                  numero={dados.numero}
                  nome={dados.nome}
                  validade={dados.validade}
                  cvv={dados.cvv}
                  bandeira={dados.bandeira}
                  virado={virado}
                  validacao={validacao}
                />

                <div className="formulario-cartao">
                  <input
                    name="numero"
                    type="text"
                    placeholder="Número do Cartão"
                    value={dados.numero}
                    onChange={handleChange}
                  />

                  <input
                    name="nome"
                    type="text"
                    placeholder="Nome no Cartão"
                    value={dados.nome}
                    onChange={handleChange}
                  />

                  <div
                    className="input-group"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <input
                      name="validade"
                      type="text"
                      placeholder="MM/AA"
                      value={dados.validade}
                      onChange={handleChange}
                      maxLength={5}
                    />

                    <input
                      name="cvv"
                      type="text"
                      placeholder="CVV"
                      maxLength={4}
                      value={dados.cvv}
                      onFocus={() => setVirado(true)}
                      onBlur={() => setVirado(false)}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          cvv: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>

                  <button
                    className="confirmar"
                    onClick={() => setAnalise(true)}
                    disabled={
                      !validacao.cartao?.valid || !validacao.data?.valid
                    }
                  >
                    Pagar {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <RecommendedBrands title="Marcas Recomendadas"/>
      <Footer />
    </>
  );
}

export default Pagamento;