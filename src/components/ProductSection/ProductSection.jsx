import ProductCard from "../ProductCard/ProductCard";

function ProductSection({ title, products }) {

  return (

    <section style={{ padding: "40px" }}>
      <h2 className="section-title">{title}</h2>

      <div style={{
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>

        {products.map((p, i) => (
          <ProductCard key={i} product={p}/>
        ))}

      </div>

    </section>

  )

}

export default ProductSection