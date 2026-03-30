import { useState, useEffect } from "react";
import "./Payments.css";
import {
  validateCreditCard,
  validateExpiryDate,
} from "../../utils/cardValidator";
import VisualCard from "./VisualCard";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  CreditCard as DebitIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Swal from "sweetalert2";
import { concluirPedido } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";

function Pagamento() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [saldoUser, setSaldoUser] = useState(0);

  const [pedido, setPedido] = useState(null);
  const [metodoAtivo, setMetodoAtivo] = useState("credito");
  const [analise, setAnalise] = useState(false);
  const [virado, setVirado] = useState(false);
  const [parcelas, setParcelas] = useState(1);

  const [dadosCard, setDadosCard] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    bandeira: null,
  });

  const [validacao, setValidacao] = useState({
    cartao: null,
    data: { valid: null },
  });

  useEffect(() => {
    const buscarSaldo = async () => {

      if (user?.usuarioId && user?.usuarioId !== "null") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/Usuarios/GetInfoUsuario/${user.usuarioId}`,
            {
              headers: { 
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            const valor = data.Saldo !== undefined ? data.Saldo : data.saldo;
            setSaldoUser(Number(valor) || 0);
          }
        } catch (error) {
          console.error("Erro ao buscar saldo:", error);
        }
      }
    };
    buscarSaldo();
  }, [user]);

  useEffect(() => {
    const pedidoId = localStorage.getItem("pedidoId");
    const itens = localStorage.getItem("pedidoItens");

    if (!pedidoId || !itens) {
      navigate("/");
      return;
    }

    setPedido({ id: pedidoId, itens: JSON.parse(itens) });
  }, [navigate]);

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const handleChangeCard = (e) => {
    let { name, value } = e.target;
    if (name === "numero") {
      const clean = value.replace(/\D/g, "");
      const res = validateCreditCard(clean);
      setValidacao((prev) => ({ ...prev, cartao: res }));
      setDadosCard((prev) => ({
        ...prev,
        numero: formatCardNumber(value),
        bandeira: res?.bandeira || null,
      }));
    } else if (name === "validade") {
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
      setDadosCard((prev) => ({ ...prev, validade: value }));
      if (value.length === 5) {
        setValidacao((prev) => ({ ...prev, data: validateExpiryDate(value) }));
      }
    } else if (name === "nome") {
      setDadosCard((prev) => ({ ...prev, nome: value.toUpperCase() }));
    } else if (name === "cvv") {
      setDadosCard((prev) => ({
        ...prev,
        cvv: value.replace(/\D/g, "").slice(0, 4),
      }));
    }
  };

  const total =
    pedido?.itens?.reduce((acc, item) => acc + item.price * item.quantity, 0) ??
    0;

  const isCardValid =
    validacao.cartao?.valid &&
    validacao.data?.valid &&
    (dadosCard.cvv.length === 3 || dadosCard.cvv.length === 4) &&
    dadosCard.nome.length > 3;

  const finalizarPagamento = async () => {
    if (saldoUser < total) {
      Swal.fire({
        icon: "error",
        title: "Saldo Insuficiente",
        text: `Seu saldo é de R$ ${saldoUser.toFixed(2)}, mas o total é R$ ${total.toFixed(2)}.`,
      });
      return;
    }
    try {
      setAnalise(true);
      const tipoParaAPI = metodoAtivo.toUpperCase();

      await concluirPedido(pedido.id, tipoParaAPI);

      if (tipoParaAPI === "PIX") {
        setAnalise(false);
        await Swal.fire({
          title: "Pagamento via Pix",
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
              <p>Escaneie o QR Code abaixo para pagar:</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ChavePixSimuladaTechStore" alt="QR Code Pix" style="border: 5px solid #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
              <div style="background: #f1f5f9; padding: 10px; border-radius: 5px; width: 100%;">
                <small style="color: #64748b; font-weight: bold;">Código Copia e Cola:</small>
                <p style="font-size: 12px; word-break: break-all; margin: 5px 0;">00020126360014BR.GOV.BCB.PIX0114TECHSTORE20265204000053039865802BR5913TECHSTORE6009SAO_PAULO62070503***6304E2B1</p>
              </div>
            </div>
          `,
          confirmButtonText: "JÁ PAGUEI",
          confirmButtonColor: "#007bff",
          allowOutsideClick: false,
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Pagamento aprovado!",
          text: "Seu pedido foi concluído com sucesso.",
          timer: 3000,
          showConfirmButton: false,
        });
      }

      localStorage.removeItem("pedidoId");
      localStorage.removeItem("pedidoItens");
      clearCart();
      navigate("/");
    } catch (error) {
      setAnalise(false);
      Swal.fire({
        icon: "error",
        title: "Erro no pagamento",
        text:
          error.response?.data?.Mensagem ||
          "Não foi possível concluir o pedido.",
      });
    }
  };

  if (!pedido) return <p style={{ padding: "40px" }}>Carregando...</p>;

  if (analise)
    return (
      <div className="container-analise">
        <div className="card-analise">
          <h1>Processando pagamento...</h1>
          <div className="spinner"></div>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <div className="kb-container-master">
        <div className="kb-grid-layout">
          <section className="kb-section-pagamento">
            <h2 className="kb-title-step">Escolha como pagar</h2>

            <div className="kb-accordion">
              <div
                className={`kb-accordion-item ${metodoAtivo === "pix" ? "open" : ""}`}
              >
                <button
                  className="kb-accordion-header"
                  onClick={() => setMetodoAtivo("pix")}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <QrCode
                      size={20}
                      color={metodoAtivo === "pix" ? "#007bff" : "#64748b"}
                    />
                    <strong>Pix</strong>
                  </div>
                  {metodoAtivo === "pix" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {metodoAtivo === "pix" && (
                  <div className="kb-accordion-content fade-in">
                    <p>
                      O QR Code para pagamento será gerado após a finalização.
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`kb-accordion-item ${metodoAtivo === "credito" ? "open" : ""}`}
              >
                <button
                  className="kb-accordion-header"
                  onClick={() => setMetodoAtivo("credito")}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <CreditCard
                      size={20}
                      color={metodoAtivo === "credito" ? "#007bff" : "#64748b"}
                    />
                    <strong>Cartão de Crédito</strong>
                  </div>
                  {metodoAtivo === "credito" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {metodoAtivo === "credito" && (
                  <div className="kb-accordion-content fade-in">
                    <div className="kb-visual-card-center">
                      <VisualCard
                        {...dadosCard}
                        virado={virado}
                        validacao={validacao}
                      />
                    </div>
                    <div className="kb-credito-form">
                      <input
                        type="text"
                        name="numero"
                        placeholder="0000 0000 0000 0000"
                        value={dadosCard.numero}
                        onChange={handleChangeCard}
                        className={
                          validacao.cartao?.valid
                            ? "valid"
                            : dadosCard.numero.length > 15
                              ? "invalid"
                              : ""
                        }
                      />
                      <input
                        type="text"
                        name="nome"
                        placeholder="NOME IMPRESSO NO CARTÃO"
                        value={dadosCard.nome}
                        onChange={handleChangeCard}
                      />
                      <div className="kb-form-row">
                        <input
                          type="text"
                          name="validade"
                          placeholder="MM/AA"
                          value={dadosCard.validade}
                          onChange={handleChangeCard}
                          className={
                            validacao.data?.valid
                              ? "valid"
                              : dadosCard.validade.length === 5
                                ? "invalid"
                                : ""
                          }
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={dadosCard.cvv}
                          onChange={handleChangeCard}
                          onFocus={() => setVirado(true)}
                          onBlur={() => setVirado(false)}
                        />
                      </div>
                      <select
                        value={parcelas}
                        onChange={(e) => setParcelas(Number(e.target.value))}
                      >
                        {[1, 2, 3, 6, 7, 8, 9, 10, 11, 12].map((p) => (
                          <option key={p} value={p}>
                            {p}x de{" "}
                            {(total / p).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}{" "}
                            sem juros
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`kb-accordion-item ${metodoAtivo === "debito" ? "open" : ""}`}
              >
                <button
                  className="kb-accordion-header"
                  onClick={() => setMetodoAtivo("debito")}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <DebitIcon
                      size={20}
                      color={metodoAtivo === "debito" ? "#007bff" : "#64748b"}
                    />
                    <strong>Cartão de Débito</strong>
                  </div>
                  {metodoAtivo === "debito" ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {metodoAtivo === "debito" && (
                  <div className="kb-accordion-content fade-in">
                    <div className="kb-visual-card-center">
                      <VisualCard
                        {...dadosCard}
                        virado={virado}
                        validacao={validacao}
                      />
                    </div>
                    <div className="kb-credito-form">
                      <input
                        type="text"
                        name="numero"
                        placeholder="0000 0000 0000 0000"
                        value={dadosCard.numero}
                        onChange={handleChangeCard}
                        className={
                          validacao.cartao?.valid
                            ? "valid"
                            : dadosCard.numero.length > 15
                              ? "invalid"
                              : ""
                        }
                      />
                      <input
                        type="text"
                        name="nome"
                        placeholder="NOME IMPRESSO NO CARTÃO"
                        value={dadosCard.nome}
                        onChange={handleChangeCard}
                      />
                      <div className="kb-form-row">
                        <input
                          type="text"
                          name="validade"
                          placeholder="MM/AA"
                          value={dadosCard.validade}
                          onChange={handleChangeCard}
                          className={
                            validacao.data?.valid
                              ? "valid"
                              : dadosCard.validade.length === 5
                                ? "invalid"
                                : ""
                          }
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={dadosCard.cvv}
                          onChange={handleChangeCard}
                          onFocus={() => setVirado(true)}
                          onBlur={() => setVirado(false)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="kb-aside-resumo">
            <div className="kb-white-card">
              <h3 style={{ marginBottom: "15px", fontWeight: "700" }}>
                Resumo do Pedido
              </h3>
              {pedido.itens.map((item, idx) => (
                <div className="kb-line" key={idx}>
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>
                    {(item.price * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              ))}
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--kb-border)",
                  margin: "10px 0",
                }}
              />
              <div className="kb-total-block">
                <span>Total:</span>
                <strong className="text-price">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>

              <div className="kb-action-buttons">
                <button
                  className="kb-btn-primary"
                  onClick={finalizarPagamento}
                  disabled={
                    (metodoAtivo !== "pix" && !isCardValid) || !metodoAtivo
                  }
                >
                  {analise ? "PROCESSANDO..." : "FINALIZAR COMPRA"}
                </button>
                <button
                  className="kb-btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  VOLTAR
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pagamento;