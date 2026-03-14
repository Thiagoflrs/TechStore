import acer from "../../assets/images/monitor/acer.webp"
import aoc from "../../assets/images/monitor/aoc.jpg"
import samsung from "../../assets/images/monitor/samsung.jpg"
import g403 from "../../assets/images/mouse/g403_logitech.webp"
import g203 from "../../assets/images/mouse/g203_logitech.jpg"
import tecladoLogitech from "../../assets/images/teclado/logitech.jpg"
import tecladoDell from "../../assets/images/teclado/dell.avif"
import foneSamsung from "../../assets/images/phones/samsung.jpg"
import foneHavit from "../../assets/images/phones/havit.jpg" 
import mousepadFort from "../../assets/images/acessor/mousepadFort.webp"

const peripheralProducts = [
  {
    name: "Monitor Gamer Acer 24''",
    price: 750.90,
    oldPrice: 899.90,
    image: acer,
    installment: "12x de R$62,57"
  },
  {
    name: "Monitor AOC LED 21''",
    price: 325.90,
    oldPrice: 389.90,
    image: aoc,
    installment: "12x de R$27,15"
  },
  {
    name: "Monitor Samsung Slim 23''",
    price: 550.90,
    oldPrice: 629.90,
    image: samsung,
    installment: "12x de R$45,90"
  },
  {
    name: "Mouse Logitech G203 RGB",
    price: 175.85,
    oldPrice: 199.90,
    image: g203,
    installment: "12x de R$14,65"
  },
  {
    name: "Mouse Logitech G403 Hero",
    price: 350.90,
    oldPrice: 399.90,
    image: g403,
    installment: "12x de R$29,24"
  },
  {
    name: "Mousepad Fortrek Speed",
    price: 35.00,
    image: mousepadFort
  },
  {
    name: "Fone de Ouvido Havit Pro",
    price: 152.50,
    image: foneHavit,
    installment: "12x de R$12,70"
  },
  {
    name: "Teclado Mecânico Logitech",
    price: 420.90,
    oldPrice: 499.90,
    image: tecladoLogitech,
    installment: "12x de R$35,07"
  },
  {
    name: "Teclado Multimídia Dell",
    price: 290.90,
    image: tecladoDell,
    installment: "12x de R$24,24"
  },
  {
    name: "Fone de Ouvido Samsung",
    price: 110.20,
    image: foneSamsung,
    installment: "12x de R$9,18"
  }
];

export default peripheralProducts;