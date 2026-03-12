import { useState, useEffect } from "react";
import "./Payments.css";

import { FaQrcode } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";

function Pagamento() {
  const [metodo, setMetodo] = useState("");
  const [analise, setAnalise] = useState(false);
  const [tempo, setTempo] = useState(300);

  const [numeroCartao, setNumeroCartao] = useState("");
  const [numeroLimpo, setNumeroLimpo] = useState("");
  const [validade, setValidade] = useState("");

  function confirmarPagamento() {
    setAnalise(true);
  }

  useEffect(() => {
    if (metodo === "pix" && tempo > 0) {
      const timer = setInterval(() => {
        setTempo((t) => t - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [metodo, tempo]);

  function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;

    return `${min}:${seg < 10 ? "0" + seg : seg}`;
  }

  function formatarCartao(valor) {
    let numeros = valor.replace(/\D/g, "");

    if (numeros.length > 16) {
      numeros = numeros.slice(0, 16);
    }

    setNumeroLimpo(numeros);

    let formatado = numeros.replace(/(\d{4})(?=\d)/g, "$1 ");

    setNumeroCartao(formatado);
  }

  function formatarValidade(valor) {
    let numeros = valor.replace(/\D/g, "");

    if (numeros.length > 4) {
      numeros = numeros.slice(0, 4);
    }

    if (numeros.length > 2) {
      numeros = numeros.replace(/(\d{2})(\d+)/, "$1/$2");
    }

    setValidade(numeros);
  }

  if (analise) {
    return (
      <div className="container">
        <div className="card">
          <h1>Pagamento em análise</h1>

          <p>Seu pagamento foi enviado e está sendo analisado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card layout">
        <div className="lado-esquerdo">
          <h2>Forma de pagamento</h2>

          <button className="botao" onClick={() => setMetodo("pix")}>
            <FaQrcode className="icone" />
            PIX
          </button>

          <button className="botao" onClick={() => setMetodo("debito")}>
            <FaMoneyCheckAlt className="icone" />
            Débito
          </button>

          <button className="botao" onClick={() => setMetodo("credito")}>
            <FaCreditCard className="icone" />
            Crédito
          </button>
        </div>

        <div className="lado-direito">
          {metodo === "" && <p>Escolha uma forma de pagamento</p>}

          {metodo === "pix" && (
            <div className="info">
              <h3>Pagamento via Pix</h3>

              <img
                className="qrcode"
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PagamentoPix"
                alt="pix"
              />

              <p>Tempo restante: {formatarTempo(tempo)}</p>

              {tempo === 0 ? (
                <p style={{ color: "red" }}>QR Code expirado</p>
              ) : (
                <button className="confirmar" onClick={confirmarPagamento}>
                  Confirmar pagamento
                </button>
              )}
            </div>
          )}

          {metodo === "debito" && (
            <div className="info">
              <h3>Cartão de Débito</h3>

              <input
                placeholder="Número do cartão"
                value={numeroCartao}
                onChange={(e) => formatarCartao(e.target.value)}
              />

              <input placeholder="Nome no cartão" />

              <input
                placeholder="Validade (MM/AA)"
                value={validade}
                onChange={(e) => formatarValidade(e.target.value)}
              />

              <input
                placeholder="CVV"
                maxLength="3"
                onChange={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
              />

              <button className="confirmar" onClick={confirmarPagamento}>
                Confirmar pagamento
              </button>
            </div>
          )}

          {metodo === "credito" && (
            <div className="info">
              <h3>Cartão de Crédito</h3>

              <input
                placeholder="Número do cartão"
                value={numeroCartao}
                onChange={(e) => formatarCartao(e.target.value)}
              />

              <input placeholder="Nome no cartão" />

              <input
                placeholder="Validade (MM/AA)"
                value={validade}
                onChange={(e) => formatarValidade(e.target.value)}
              />

              <input
                placeholder="CVV"
                maxLength="3"
                onChange={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
              />

              {numeroLimpo.length === 16 && (
                <select>
                  <option>1x sem juros</option>
                  <option>2x sem juros</option>
                  <option>3x sem juros</option>
                  <option>4x sem juros</option>
                  <option>5x sem juros</option>
                  <option>6x sem juros</option>
                </select>
              )}

              <button className="confirmar" onClick={confirmarPagamento}>
                Confirmar pagamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pagamento;
