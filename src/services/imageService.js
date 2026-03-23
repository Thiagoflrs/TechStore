const images = import.meta.glob("/src/assets/images/produtos/*", {
  eager: true,
});

import defaultImage from "../assets/images/produtos/default.jpg";

export const getImageById = (id) => {
  const extensions = ["webp", "jpg", "png"];

  for (let ext of extensions) {
    const path = `/src/assets/images/produtos/${id}.${ext}`;
    const image = images[path]

    if (image) {
      return image.default || image;
    }
  }

  return defaultImage;
};