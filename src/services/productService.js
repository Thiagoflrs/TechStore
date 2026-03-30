import { getImageById } from "../services/imageService";

export const mapProduto = (produto) => {
  return {
    id: produto.ProdutoId,
    codigo: produto.Codigo,
    name: produto.Nome,
    price: produto.Valor ?? 0,
    oldPrice: null,
    image: getImageById(produto.ProdutoId),
    stock: produto.Quantidade,
    categoriaId: produto.CategoriaId,
  };
};

export const getProdutos = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/Produtos`);

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const data = await response.json();
    return data.map(mapProduto);

  } catch (error) {
    console.error("Erro no serviço:", error);
    throw error;
  }
};

export const getProdutoById = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/Produtos/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar o produto");
    }

    const data = await response.json();
    return mapProduto(data);

  } catch (error) {
    console.error("Erro no serviço:", error);
    throw error;
  }
};