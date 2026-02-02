import { Link, useLocation, useSearchParams } from "react-router-dom";

const categories = [
  { id: "ALL", label: "ВСЕ", param: null },
  { id: "CLEANSING", label: "ОЧИЩЕНИЕ", param: "Очищение" },
  { id: "SERUMS", label: "СЫВОРОТКИ", param: "Сыворотки" },
  { id: "CREAMS", label: "КРЕМЫ", param: "Кремы" },
  { id: "MAKEUP", label: "МАКИЯЖ", param: "Макияж" },
  { id: "SUN", label: "ЗАЩИТА", param: "Солнцезащита" },
];

export default function CategoryTabs() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get category from URL
  const currentCategory = searchParams.get("category");
  const currentLine = searchParams.get("line");

  // Determine which tab is active
  const getActiveTab = () => {
    // If there's a line param or category param, match it
    if (currentCategory) {
      const found = categories.find(cat => cat.param === currentCategory);
      return found?.id || "ALL";
    }
    // No params = ALL
    return "ALL";
  };

  const activeTab = getActiveTab();

  // Generate link path for each tab
  const getTabPath = (category: typeof categories[0]) => {
    if (category.param === null) {
      // "ВСЕ" - clear all filters
      return "/all";
    }
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
