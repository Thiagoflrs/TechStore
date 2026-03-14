import acer from "../../assets/images/monitor/acer.webp"
import g403 from "../../assets/images/mouse/g403_logitech.webp"
import placaMae from "../../assets/images/computador/placaMae.webp"
import tecladoRD from "../../assets/images/teclado/teclado_RD.jpg"
import placaVD from "../../assets/images/computador/placaVD.webp"
import fonHyperX from "../../assets/images/phones/hyperX.jpg"
import alligator from "../../assets/images/computador/alligator.jpg"
import ryzen5 from "../../assets/images/computador/ryzen5.jpg"
import rdZeus from "../../assets/images/phones/rdZeus.webp"
import cadeiraGamer from "../../assets/images/computador/cadeira.webp"

const gamerProducts = [
  {
    name: "Cadeira Gamer 1STPLAYER FAST",
    price: 1799.90,
    oldPrice: 2299.90,
    image: cadeiraGamer,
    installment: "12x de R$149,91"
  },
  {
    name: "Mouse Gamer Logitech G403",
    price: 350.90,
    oldPrice: 399.90,
    image: g403,
    installment: "12x de R$29,24"
  },
  {
    name: "Teclado Mecânico Redragon",
    price: 155.20,
    oldPrice: 189.90,
    image: tecladoRD,
    installment: "12x de R$12,93"
  },
  {
    name: "Fone de Ouvido HyperX Cloud",
    price: 250.00,
    oldPrice: 299.90,
    image: fonHyperX,
    installment: "12x de R$20,83"
  },
  {
    name: "Headset Redragon Zeus X RGB",
    price: 502.50,
    image: rdZeus,
    installment: "12x de R$41,88"
  },
  {
    name: "Placa-Mãe MSI B550M Pro-VDH",
    price: 930.00,
    image: placaMae,
    installment: "12x de R$77,50"
  },
  {
    name: "Placa de Vídeo Radeon RX 7600",
    price: 1759.99,
    image: placaVD,
    installment: "12x de R$146,66"
  },
  {
    name: "Monitor Gamer Acer 24''",
    price: 750.90,
    oldPrice: 899.90,
    image: acer,
    installment: "12x de R$62,57"
  },
  {
    name: "PC Gamer Alligator i7 16GB",
    price: 3799.99,
    image: alligator,
    installment: "12x de R$316,67"
  },
  {
    name: "PC Gamer Ryzen 5 RX 6600",
    price: 5299.99,
    image: ryzen5,
    installment: "12x de R$441,67"
  }
];

export default gamerProducts;