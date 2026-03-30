import BrandCard from "./BrandCard.jsx";
import "./RecommendedBrands.css";
import logitech from "../../assets/images/brands/logitech.webp";
import dell from "../../assets/images/brands/dell.webp";
import amd from "../../assets/images/brands/amd.webp";
import samsung from "../../assets/images/brands/samsung.webp";
import redragon from "../../assets/images/brands/redragon.webp";
import acer from "../../assets/images/brands/acer.webp";
import corsair from "../../assets/images/brands/corsair.webp";
import hyperX from "../../assets/images/brands/hyperX.webp";

const brands = [
  {
    name: "Logitech",
    logo: logitech,
  },

  {
    name: "Dell",
    logo: dell,
  },
  {
    name: "AMD",
    logo: amd,
  },
  {
    name: "Samsung",
    logo: samsung,
  },
  {
    name: "Redragon",
    logo: redragon,
  },
  {
    name: "Acer",
    logo: acer,
  },
  {
    name: "Corsair",
    logo: corsair,
  },
    {
    name: "HyperX",
    logo: hyperX,
  },
];

function RecommendedBrands({title}) {
  return (
    <section className="recommended-brands">
      <h2 className="title-brands">{title}</h2>
      <div className="brands-grid">
        {brands.map((brand, index) => (
          <BrandCard key={index} brand={brand} />
        ))}
      </div>
    </section>
  );
}

export default RecommendedBrands;