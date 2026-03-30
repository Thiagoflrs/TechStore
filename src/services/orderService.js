  import axios from "axios";

  const API_URL = `${import.meta.env.VITE_API_URL}`;
  const API_URL_PAGAMENTO = `${import.meta.env.VITE_API_URL}`;

  const aguardarProcessamento = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  export const createOrder = async (data) => {
    const response = await axios.post(`${API_URL}/api/Pedidos/CriarPedido`, data, getAuthHeader());
    return response.data;
  };

  export const concluirPedido = async (pedidoId, tipoPagamento) => {
    const config = getAuthHeader();
    
    const metodosComPagamento = ["CREDITO", "DEBITO", "PIX"];

    try {
      if (metodosComPagamento.includes(tipoPagamento)) {
        await axios.post(
          `${API_URL_PAGAMENTO}/api/PagamentoControllers/Processar/${pedidoId}`,
          { TipoPagamento: tipoPagamento },
          config
        );

        await aguardarProcessamento(2500);
      }

      const response = await axios.get(
        `${API_URL}/api/Pedidos/ConcluirProcesssamento/${pedidoId}`,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao finalizar o pedido:", error);
      throw error;
    }
  };