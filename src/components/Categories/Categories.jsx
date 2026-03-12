import {
  Cpu,
  Headphones,
  Monitor,
  HardDrive,
  Gamepad2
} from "lucide-react";

import "./Categories.css";

const categories = [
  { name: "Hardware", icon: Cpu },
  { name: "Periféricos", icon: Headphones },
  { name: "Monitores", icon: Monitor },
  { name: "Armazenamento", icon: HardDrive },
  { name: "Gamer", icon: Gamepad2 }
];

function Categories({title}) {
  return (
    <section className="categories">
      <h2 className="category-title">{title}</h2>
      <div className="categories-container">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <div key={index} className="category-item">
              <div className="category-card">
                <Icon className="category-icon" />
              </div>
              <span className="category-name">
                {cat.name}
              </span>
            </div>
          );
        })}

      </div>
    </section>
  );
}

export default Categories;

