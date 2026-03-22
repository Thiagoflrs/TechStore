import {
  Cpu,
  Headphones,
  Monitor,
  HardDrive,
  Gamepad2,
  Keyboard,
  Mouse,
  Smartphone,
  Cable,
  Laptop,
  ToyBrick,
} from "lucide-react";

const iconMap = {
  Smartphone: Smartphone,
  Acessorios: Headphones,
  Carregadores: HardDrive,
  "Fones de Ouvido": Headphones,
  Mouses: Mouse,
  Teclados: Keyboard,
  Monitores: Monitor,
  Consoles: Gamepad2,
  Cabos: Cable,
  Computadores: Laptop,
  Brinquedos: ToyBrick,
};

const mapCategories = (categories) => {
  return {
    id: categories.CategoriaId,
    name: categories.Nome,
    icon: iconMap[categories.Nome] || Cpu,
  };
};

const API_URL = "http://localhost:5248/api/Categorias";

export const getCategories = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar categorias");
    }

    const data = await response.json();
    return data.map(mapCategories);
  } catch (error) {
    console.error("Erro no serviço:", error);
    throw error;
  }
};
