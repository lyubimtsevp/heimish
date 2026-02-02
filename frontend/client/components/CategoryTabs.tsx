import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCategories } from "@/lib/api";

const STATIC_CATEGORIES = [
  { id: "ALL", label: "ВСЕ", param: null as string | null },
  { id: "CLEANSING", label: "ОЧИЩЕНИЕ", param: "Очищение" },
  { id: "SERUMS", label: "СЫВОРОТКИ", param: "Сыворотки" },
  { id: "CREAMS", label: "КРЕМЫ", param: "Кремы" },
  { id: "MAKEUP", label: "МАКИЯЖ", param: "Макияж" },
  { id: "SUN", label: "ЗАЩИТА", param: "Солнцезащита" },
];

interface Props {
  activeCategory?: string;
}

export default function CategoryTabs({ activeCategory }: Props) {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState(STATIC_CATEGORIES);

  useEffect(() => {
    fetchCategories().then(cats => {
      if (cats.length > 0) {
        setCategories([
          { id: "ALL", label: "ВСЕ", param: null as string | null },
          ...cats.map(c => ({ id: c.toUpperCase(), label: c.toUpperCase(), param: c })),
        ]);
      }
    });
  }, []);

  const currentCategory = searchParams.get("category");

  const getActiveTab = () => {
    if (activeCategory) return activeCategory;
    if (currentCategory) {
      const found = categories.find(cat => cat.param === currentCategory);
      return found?.id || "ALL";
    }
    return "ALL";
  };

  const activeTab = getActiveTab();

  const getTabPath = (category: typeof categories[0]) => {
    if (category.param === null) return "/all";
    return `/all?category=${encodeURIComponent(category.param)}`;
  };

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="flex justify-center min-w-min">
        {categories.map((category, index) => {
          const isActive = activeTab === category.id;
          return (
            <Link
              key={category.id}
              to={getTabPath(category)}
              className={`
                flex-shrink-0 w-[90px] sm:w-[120px] h-11 text-[11px] sm:text-[13px] font-circe font-normal
                transition-all duration-200 flex items-center justify-center
                ${isActive
                  ? "border border-gray-300 bg-white text-black font-medium"
                  : "border-t border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }
                ${index === 0 ? "border-l" : ""}
                ${index === categories.length - 1 ? "border-r" : ""}
              `}
            >
              {category.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
