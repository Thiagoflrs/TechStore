import "./SectionDivider.css";

function SectionDivider({ images }) {
  return (
    <div className={`section-divider columns-${images.length}`}>
      {images.map((img, index) => (
        <img key={index} src={img} alt={`banner-${index}`} />
      ))}
    </div>
  );
}

export default SectionDivider;