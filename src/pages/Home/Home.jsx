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
      <ProductSection title="Consoles" categoriasIds={[8]} /> {/**consoles */}
      <SectionDivider images={[Banner0]} />
      <ProductSection title="Periféricos" categoriasIds={[5, 6, 7, 4]} />
      {/** mouse, teclados, monitores, fone */}
      <SectionDivider images={[Banner1, Banner2]} />
      <ProductSection title="Smartphones" categoriasIds={[1]} />
      {/** celular */}
      <SectionDivider images={[Banner3, Banner4, Banner5]} />
      <ProductSection title="Acessórios" categoriasIds={[2, 9]} />
      {/** acessorios, cabos */}
      <RecommendedBrands title="Marcas Recomendadas" />
      <Footer />
    </>
  );
}

export default Home;
