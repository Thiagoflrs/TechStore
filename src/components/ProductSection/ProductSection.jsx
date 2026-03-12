import ProductCard from "../ProductCard/ProductCard";

const products = [

  {
    name: "Mouse Gamer RGB",
    price: 129,
    oldPrice: 159,
    image: "/products/mouse.png",
    rating: 4.5,
    reviews: 120,
    discount: 20,
    installment: "12x de R$10,75"
  },

  {
    name: "Teclado Mecânico RGB",
    price: 399,
    oldPrice: 499,
    image: "/products/keyboard.png",
    rating: 4.8,
    reviews: 80,
    discount: 15,
    installment: "12x de R$33,25"
  },

  {
  name: "Mousepad Gamer XL",
  price: 89,
  oldPrice: 109,
  image: "/products/mousepad.png",
  rating: 4.7,
  reviews: 65,
  discount: 18,
  installment: "12x de R$7,41"
},

{
  name: "Webcam Full HD",
  price: 249,
  oldPrice: 299,
  image: "/products/webcam.png",
  rating: 4.4,
  reviews: 52,
  discount: 16,
  installment: "12x de R$20,75"
},

{
  name: "SSD NVMe 1TB",
  price: 499,
  oldPrice: 599,
  image: "/products/ssd.png",
  rating: 4.9,
  reviews: 210,
  discount: 17,
  installment: "12x de R$41,58"
},

{
  name: "Placa de Vídeo RTX 4060",
  price: 2399,
  oldPrice: 2699,
  image: "/products/gpu.png",
  rating: 4.8,
  reviews: 98,
  discount: 11,
  installment: "12x de R$199,91"
},

{
  name: "Cadeira Gamer",
  price: 899,
  oldPrice: 1099,
  image: "/products/chair.png",
  rating: 4.6,
  reviews: 140,
  discount: 18,
  installment: "12x de R$74,91"
},

{
  name: "Notebook Gamer i7 RTX",
  price: 6499,
  oldPrice: 6999,
  image: "/products/notebook.png",
  rating: 4.9,
  reviews: 75,
  discount: 7,
  installment: "12x de R$541,58"
},

{
  name: "Controle Gamer Wireless",
  price: 279,
  oldPrice: 329,
  image: "/products/controller.png",
  rating: 4.6,
  reviews: 93,
  discount: 15,
  installment: "12x de R$23,25"
},

{
  name: "Hub USB 7 Portas",
  price: 119,
  oldPrice: 149,
  image: "/products/hubusb.png",
  rating: 4.5,
  reviews: 47,
  discount: 20,
  installment: "12x de R$9,91"
}

]

function ProductSection({title}){

  return(

    <section style={{padding:"40px"}}>
        <h2 className="section-title">{title}</h2>      <div style={{
        display:"flex",
        gap:"40px",
        justifyContent:"center",
        flexWrap:"wrap"
      }}>
        {products.map((p,i)=>(
          <ProductCard key={i} product={p}/>
        ))}

      </div>

    </section>

  )

}

export default ProductSection