import React from "react";
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCreditCard 
} from "react-icons/fa";

const VisualCard = ({ 
  numero, 
  nome, 
  validade, 
  cvv, 
  bandeira, 
  virado, 
  validacao 
}) => {
  
  // Mapeamento de logotipos atualizado para incluir Elo
  const getLogo = (b) => {
    switch (b) {
      case "Visa": return <FaCcVisa />;
      case "MasterCard": return <FaCcMastercard />;
      case "AmericanExpress": return <FaCcAmex />;
      case "Elo": return <FaCreditCard />; // Elo usa ícone de cartão genérico ou SVG customizado
      default: return <FaCreditCard />;
    }
  };

  // Lógica de formatação robusta: remove espaços e agrupa de 4 em 4
  const formatarNumero = (num) => {
    if (!num) return "**** **** **** ****";
    const cleanNum = num.replace(/\s?/g, "");
    return cleanNum.replace(/(\d{4})/g, "$1 ").trim();
  };

  const numeroClass = validacao?.cartao 
    ? (validacao.cartao.valid ? "valid" : "invalid") 
    : "";
  
  const validadeClass = validacao?.data 
    ? (validacao.data.valid ? "valid" : "invalid") 
    : "";

  return (
    /* A classe dinâmica `${bandeira}` permite estilizar as cores via CSS */
    <div className={`cartao-visual ${virado ? "virado" : ""} ${bandeira || ""}`}>
      
      {/* FRENTE DO CARTÃO */}
      <div className="cartao-frente">
        <div 
          className="topo-cartao" 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div className="chip"></div>
          <span className="logo-bandeira">{getLogo(bandeira)}</span>
        </div>

        <div className={`numero-cartao ${numeroClass}`}>
          {formatarNumero(numero)}
        </div>

        <div 
          className="baixo-cartao" 
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="nome-cartao">
            {nome?.toUpperCase() || "NOME DO TITULAR"}
          </div>
          <div className={`validade-cartao ${validadeClass}`}>
            {validade || "MM/AA"}
          </div>
        </div>
      </div>

      {/* VERSO DO CARTÃO */}
      <div className="cartao-verso">
        <div className="faixa-preta"></div>
        <div className="cvv-box" style={{ padding: "15px" }}>
          <span style={{ fontSize: "0.75rem", color: "#fff" }}>CVV</span>
          <div className="cvv-display">{cvv || "***"}</div>
        </div>
      </div>

    </div>
  );
};

export default VisualCard;