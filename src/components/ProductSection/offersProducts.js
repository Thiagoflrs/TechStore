import acer from "../../assets/images/monitor/acer.webp"
import aoc from "../../assets/images/monitor/aoc.jpg"
import samsung from "../../assets/images/monitor/samsung.jpg"
import g403 from "../../assets/images/mouse/g403_logitech.webp"
import g203 from "../../assets/images/mouse/g203_logitech.jpg"
import tecladoLogitech from "../../assets/images/teclado/logitech.jpg"
import tecladoRD from "../../assets/images/teclado/teclado_RD.jpg"
import fonHyperX from "../../assets/images/phones/hyperX.jpg"
import rdHP from "../../assets/images/teclado/rdHP.webp"
import acerPredator from "../../assets/images/computador/notPredator.webp"

const offersProducts = [
  {
    name: "Monitor Gamer Acer 24''",
    price: 750.90,
    oldPrice: 899.90,
    image: acer,
    installment: "12x de R$62,57"
  },
  {
    name: "Monitor Samsung 23''",
    price: 550.90,
    oldPrice: 629.90,
    image: samsung,
    installment: "12x de R$45,90"
  },
  {
    name: "Mouse Logitech G403 Hero",
    price: 350.90,
    oldPrice: 399.90,
    image: g403,
    installment: "12x de R$29,24"
  },
  {
    name: "Teclado Gamer Logitech",
    price: 420.90,
    oldPrice: 499.90,
    image: tecladoLogitech,
    installment: "12x de R$35,07"
  },
  {
    name: "Fone Gamer HyperX Cloud",
    price: 250.00,
    oldPrice: 299.90,
    image: fonHyperX,
    installment: "12x de R$20,83"
  },
  {
    name: "Monitor Slim AOC 21''",
    price: 325.90,
    oldPrice: 389.90,
    image: aoc,
    installment: "12x de R$27,15"
  },
  {
    name: "Teclado Mecânico Redragon",
    price: 155.20,
    oldPrice: 189.90,
    image: tecladoRD,
    installment: "12x de R$12,93"
  },
  {
    name: "Mouse Logitech G203 RGB",
    price: 175.85,
    oldPrice: 199.90,
    image: g203,
    installment: "12x de R$14,65"
  },
  {
    name: "Teclado Redragon Harry Potter",
    price: 399.99,
    oldPrice: 749.99,
    image: rdHP,
    installment: "12x de R$33,33"
  },
  {
    name: "Notebook Acer Predator i9",
    price: 11249.90,
    oldPrice: 14999.90,
    image: acerPredator,
    installment: "12x de R$937,49"
  }
];

export default offersProducts;