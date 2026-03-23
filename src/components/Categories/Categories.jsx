import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categorieService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./Categories.css";

function Categories({ title }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const infiniteCategories = [...categories, ...categories];

  return (
    <section className="categories">
      <h2 className="category-title">{title}</h2>
      {loading ? (
        <p>Carregando categorias...</p>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={8}
          centeredSlides={true}
          navigation
          loop={true}
          speed={3000}
          allowTouchMove={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            900: { slidesPerView: 5 },
            1200: { slidesPerView: 6.2 },
          }}
          className="categories-container"
        >
          {infiniteCategories.map((cat, index) => {
            const Icon = cat.icon;

            return (
              <SwiperSlide key={`${cat.id || cat.name}-${index}`}>
                <Link
                  to={`/categoria/${cat.name}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="category-item">
                    <div className="category-card">
                      <Icon className="category-icon" size={32} />
                    </div>
                    <span className="category-name">{cat.name}</span>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
}

export default Categories;