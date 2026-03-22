import Banner from "../../components/Banner/Banner";
import Header from "../../components/header/Header";
import Categories from "../../components/Categories/Categories";
import ProductSection from "../../components/ProductSection/ProductSection";
import SectionDivider from "../../components/SectionDivider/SectionDivider";
import RecommendedBrands from "../../components/BrandCard/RecommendedBrands";
import Banner0 from "../../assets/images/banners/banner.webp";
import Banner1 from "../../assets/images/banners/banner1.webp";
import Banner2 from "../../assets/images/banners/banner2.webp";
import Banner3 from "../../assets/images/banners/banner3.webp";
import Banner4 from "../../assets/images/banners/banner4.webp";
import Banner5 from "../../assets/images/banners/banner5.webp";
import Footer from "../../components/footer/Footer";

function Home() {
  return (
    <>
      <Header />
      <Banner />
      <Categories title="Confira nossas Categorias" />
      <ProductSection title="Em oferta"/>
      <SectionDivider images={[Banner0]} />
      <ProductSection title="Gamer"/>
      <SectionDivider images={[Banner1, Banner2]} />
      <ProductSection title="Periféricos"/>
      <SectionDivider images={[Banner3, Banner4, Banner5]} />
      <ProductSection title="Acessórios"/>
      <RecommendedBrands title="Marcas Recomendadas" />
      <Footer />
    </>
  );
}

export default Home;