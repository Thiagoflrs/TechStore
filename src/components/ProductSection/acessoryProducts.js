import carregadorSamsung from "../../assets/images/carregador/carregador15W.webp"
import carregadorMotorola from "../../assets/images/carregador/motorola30W.webp"
import caboIphone from "../../assets/images/acessor/caboIphone.webp"
import caboDuplo from "../../assets/images/acessor/caboDuplo.webp"
import capinhaS20 from "../../assets/images/acessor/capinhaS20.jpg"
import capinhaG30 from "../../assets/images/acessor/capinhaG30.jpg"
import suporteCell from "../../assets/images/acessor/suportCell.webp"
import foneChines from "../../assets/images/phones/foneChin.jpg"
import webCam from "../../assets/images/acessor/webcam.webp"
import suportMonitor from "../../assets/images/acessor/suportMonitor.webp"

const accessoryProducts = [
  {
    name: "Carregador Samsung 15W",
    price: 10.00,
    image: carregadorSamsung
  },
  {
    name: "Carregador Motorola 30W",
    price: 80.00,
    image: carregadorMotorola,
    installment: "4x de R$20,00"
  },
  {
    name: "Cabo iPhone USB-C para A",
    price: 110.00,
    image: caboIphone,
    installment: "6x de R$18,33"
  },
  {
    name: "Cabo iPhone USB-C Duplo",
    price: 22.05,
    image: caboDuplo
  },
  {
    name: "Capinha Samsung S20 FE",
    price: 18.00,
    image: capinhaS20
  },
  {
    name: "Capinha Motorola Moto G30",
    price: 22.50,
    image: capinhaG30
  },
  {
    name: "Suporte Celular para Carro",
    price: 30.00,
    image: suporteCell,
  },
  {
    name: "Fone de Ouvido Intrauricular",
    price: 15.00,
    image: foneChines,
  },
  {
    name: "Webcam Logitech C270 HD",
    price: 270.58,
    image: webCam,
    installment: "12x de R$22,55"
  },
  {
    name: "Suporte Articulado Monitor",
    price: 177.50,
    image: suportMonitor,
    installment: "12x de R$14,79"
  }
];

export default accessoryProducts;