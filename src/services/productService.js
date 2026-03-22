const API_URL = "http://localhost:5248/api/Produtos"

const images = import.meta.glob("../assets/images/produtos/*", {
  eager: true,
});

import defaultImage from "../assets/images/produtos/default.jpg";

const getImageById = (id) => {
  const extensions = ["webp", "jpg", "png"];

  for (let ext of extensions) {
    const path = `../assets/images/produtos/${id}.${ext}`;
    if (images[path]) {
      return images[path].default;
    }
  }

  return defaultImage;
};

const mapProduto = (produto) => {
  return {
    id: produto.ProdutoId,
    name: produto.Nome,
    price: produto.Valor,
    oldPrice: null,
    image: getImageById(produto.ProdutoId),
    installment: "ou 3x sem juros",
    stock: produto.Quantidade,
  };
};

export const getProdutos = async () => {
  try {
    const response = await fetch(API_URL);

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
    const response = await fetch(`${API_URL}/${id}`);

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