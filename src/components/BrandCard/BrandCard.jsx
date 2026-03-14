import "./BrandCard.css";

function BrandCard({ brand }) {
  return (
    <div className="brand-card">
      <img src={brand.logo} alt={brand.name} />
      <span>{brand.name}</span>
    </div>
  );
}

export default BrandCard;