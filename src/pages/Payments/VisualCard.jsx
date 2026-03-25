import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCreditCard 
} from "react-icons/fa";
import "./VisualCard.css";

const VisualCard = ({ 
  numero, 
  nome, 
  validade, 
  cvv, 
  bandeira, 
  virado, 
  validacao 
}) => {
  
  const getLogo = (b) => {
    switch (b) {
      case "Visa": return <FaCcVisa />;
      case "MasterCard": return <FaCcMastercard />;
      case "AmericanExpress": return <FaCcAmex />;
      default: return <FaCreditCard />;
    }
  };

  const numeroClass = validacao?.cartao 
    ? (validacao.cartao.valid ? "valid" : "invalid") 
    : "";

  const validadeClass = validacao?.data 
    ? (validacao.data.valid ? "valid" : "invalid") 
    : "";

  const corBandeira = bandeira ? bandeira.replace(/\s+/g, '') : "Default";

  return (
    <div className={`cartao-visual ${virado ? "virado" : ""} ${corBandeira}`}>
      <div className="cartao-inner">
        {/* FRENTE */}
        <div className="cartao-frente">
          <div className="topo-cartao">
            <div className="chip"></div>
            <span className="logo-bandeira">{getLogo(bandeira)}</span>
          </div>

          <div className={`numero-cartao ${numeroClass}`}>
            {numero || "**** **** **** ****"}
          </div>

          <div className="baixo-cartao">
            <div className="nome-cartao">
              {nome || "NOME DO TITULAR"}
            </div>
            <div className={`validade-cartao ${validadeClass}`}>
              {validade || "MM/AA"}
            </div>
          </div>
        </div>

        <div className="cartao-verso">
          <div className="faixa-preta"></div>
          <div className="cvv-box">
            <span className="cvv-label">CVV</span>
            <div className="cvv-display">{cvv || "***"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualCard;