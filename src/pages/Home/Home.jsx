import Header from "../../components/Header/Header";
import Banner from "../../components/Banner/Banner";
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
import gamerProducts from "../../components/ProductSection/gamerProducts"
import peripheralProducts from "../../components/ProductSection/peripheralProducts"
import offersProducts from "../../components/ProductSection/offersProducts"
import acessoryProducts from "../../components/ProductSection/acessoryProducts"
import Footer from "../../components/footer/Footer";

function Home() {
  return (
    <>
      <Header />
      <Banner />
      <Categories title="Confira nossas Categorias" />
      <ProductSection title="Em oferta" products={offersProducts} />
      <SectionDivider images={[Banner0]} />
      <ProductSection title="Gamer" products={gamerProducts} />
      <SectionDivider images={[Banner1, Banner2]} />
      <ProductSection title="Periféricos" products={peripheralProducts} />
      <SectionDivider images={[Banner3, Banner4, Banner5]} />
      <ProductSection title="Acessórios" products={acessoryProducts} />
      <RecommendedBrands title="Marcas Recomendadas" />
      <Footer />
    </>
  );
}

export default Home;