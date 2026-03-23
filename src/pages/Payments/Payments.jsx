import { useState, useEffect } from "react";
import "./Payments.css";
import { validateCreditCard, validateExpiryDate } from "../../utils/cardValidator";
import VisualCard from "./VisualCard";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { QrCode, CreditCard, ClipboardList } from "lucide-react";

function Pagamento() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [metodoAtivo, setMetodoAtivo] = useState('credito'); 
  const [analise, setAnalise] = useState(false);
  const [tempoPix, setTempoPix] = useState(300);
  const [virado, setVirado] = useState(false);
  const [dadosCard, setDadosCard] = useState({ numero: "", nome: "", validade: "", cvv: "", bandeira: null });
  const [validacao, setValidacao] = useState({ cartao: null, data: null });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const toggleMetodo = (metodo) => {
    setMetodoAtivo(metodoAtivo === metodo ? null : metodo);
  };

  useEffect(() => {
    let timer;
    if (metodoAtivo === "pix" && tempoPix > 0) {
      timer = setInterval(() => setTempoPix((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [metodoAtivo, tempoPix]);

  const handleChangeCard = (e) => {
    let { name, value } = e.target;
    if (name === "numero") {
      value = value.replace(/\D/g, "").slice(0, 16);
      const res = validateCreditCard(value);
      setValidacao((prev) => ({ ...prev, cartao: res }));
      setDadosCard((prev) => ({ ...prev, numero: value, bandeira: res?.bandeira }));
    } else if (name === "validade") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);
      setDadosCard((prev) => ({ ...prev, [name]: value }));
      if (value.length === 5) {
        setValidacao((prev) => ({ ...prev, data: validateExpiryDate(value) }));
      }
    } else if (name === "nome") {
      setDadosCard((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setDadosCard((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (analise) {
    return (
      <div className="container-analise">
        <div className="card-analise">
          <h1>Pagamento em análise</h1>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="kb-container-master">
        <div className="kb-grid-layout">
          <section className="kb-section-pagamento">
            <h2 className="kb-title-step">FORMA DE PAGAMENTO</h2>
            <div className="kb-accordion">
              <div className={`kb-accordion-item ${metodoAtivo === 'pix' ? 'open' : ''}`}>
                <button className="kb-accordion-header" onClick={() => toggleMetodo('pix')}>
                  <div className="kb-header-left">
                    <span className="kb-radio-simulado"></span>
                    <strong className="kb-metodo-nome">PIX</strong>
                  </div>
                  <QrCode size={24} color={metodoAtivo === 'pix' ? "#007bff" : "#718096"} />
                </button>
                <div className="kb-accordion-content">
                  <div className="kb-content-inner">
                    <div className="kb-pix-data">
                      <div className="kb-qr-wrapper">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Pix_${total}`} alt="Pix" />
                      </div>
                      <div className="kb-pix-text">
                        <p>Total PIX:</p>
                        <h3>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        <p>Expira em: <strong>{Math.floor(tempoPix / 60)}:{String(tempoPix % 60).padStart(2, "0")}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`kb-accordion-item ${metodoAtivo === 'credito' ? 'open' : ''}`}>
                <button className="kb-accordion-header" onClick={() => toggleMetodo('credito')}>
                  <div className="kb-header-left">
                    <span className="kb-radio-simulado"></span>
                    <strong className="kb-metodo-nome">CARTÃO DE CRÉDITO</strong>
                  </div>
                  <CreditCard size={24} color={metodoAtivo === 'credito' ? "#007bff" : "#718096"} />
                </button>
                <div className="kb-accordion-content">
                  <div className="kb-content-inner kb-credito-inner">
                    <div className="kb-visual-card-center">
                      <VisualCard
                        numero={dadosCard.numero}
                        nome={dadosCard.nome}
                        validade={dadosCard.validade}
                        cvv={dadosCard.cvv}
                        bandeira={dadosCard.bandeira}
                        virado={virado}
                        validacao={validacao}
                      />
                    </div>
                    <div className="kb-credito-form">
                      <input name="numero" type="text" placeholder="Número do cartão*" value={dadosCard.numero} onChange={handleChangeCard} />
                      <input name="nome" type="text" placeholder="Nome impresso no cartão*" value={dadosCard.nome} onChange={handleChangeCard} />
                      <div className="kb-form-row">
                        <input name="validade" type="text" placeholder="Validade*" value={dadosCard.validade} onChange={handleChangeCard} maxLength={5} />
                        <input 
                          name="cvv" 
                          type="text" 
                          placeholder="CVV*" 
                          maxLength={4} 
                          value={dadosCard.cvv} 
                          onFocus={() => setVirado(true)} 
                          onBlur={() => setVirado(false)} 
                          onChange={(e) => setDadosCard({ ...dadosCard, cvv: e.target.value.replace(/\D/g, "") })} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="kb-aside-resumo">
            <div className="kb-white-card">
              <h3 className="resumo-titulo"><ClipboardList size={20} color="#007bff" /> Resumo do pedido</h3>
              <div className="kb-total-block">
                <span>Total:</span>
                <strong className="kb-price-blue">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>
            </div>
            <div className="kb-action-buttons">
              <button className="kb-btn-primary" onClick={() => setAnalise(true)}>FINALIZAR COMPRA</button>
              <button className="kb-btn-secondary" onClick={() => navigate(-1)}>VOLTAR</button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pagamento;