import "./Banner.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import banner1 from "../../assets/images/banners/home1.webp";
import banner2 from "../../assets/images/banners/home2.webp";
import banner3 from "../../assets/images/banners/home3.webp";

function Banner() {
  const banners = [{ image: banner1 }, { image: banner2 }, { image: banner3 }];

  return (
    <section className="banner">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        slidesPerView={2}
        spaceBetween={20}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div
              className="banner-slide"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Banner;
