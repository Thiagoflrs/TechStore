import {
  Cpu,
  Headphones,
  Monitor,
  HardDrive,
  Gamepad2,
  Keyboard,
  Mouse,
  Smartphone,
  Camera,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "./Categories.css";

const categories = [
  { name: "Hardware", icon: Cpu },
  { name: "Periféricos", icon: Headphones },
  { name: "Monitores", icon: Monitor },
  { name: "Armazenamento", icon: HardDrive },
  { name: "Gamer", icon: Gamepad2 },
  { name: "Teclados", icon: Keyboard },
  { name: "Mouse", icon: Mouse },
  { name: "Smartphones", icon: Smartphone },
  { name: "Câmeras", icon: Camera },
];

/* duplicação para garantir loop infinito */
const infiniteCategories = [...categories, ...categories];

function Categories({ title }) {
  return (
    <section className="categories">
      <h2 className="category-title">{title}</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={8}
        centeredSlides={true}
        navigation
        loop={true}
        speed={5000}
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
            <SwiperSlide key={`${cat.name}-${index}`}>
              <div className="category-item">
                <div className="category-card">
                  <Icon className="category-icon" />
                </div>

                <span className="category-name">{cat.name}</span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

export default Categories;
