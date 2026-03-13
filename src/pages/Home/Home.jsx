import Header from "../../components/Header/Header";
import Banner from "../../components/Banner/Banner";
import Categories from "../../components/Categories/Categories";
import ProductSection from "../../components/ProductSection/ProductSection";
import SectionDivider from "../../components/SectionDivider/SectionDivider";
import Banner1 from "../../assets/images/banners/banner.webp";
import Banner2 from "../../assets/images/banners/banner1.webp";
import Banner3 from "../../assets/images/banners/banner2.webp";

function Home() {
  return (
    <>
      <Header />
      <Banner />
      <Categories title="Confira nossas Categorias" />
      <ProductSection title="Em oferta" />
      <SectionDivider images={[Banner1]} />
      <ProductSection title="Mais Procurados" />
      <SectionDivider images={[Banner2, Banner3]} />
    </>
  );
}

export default Home;