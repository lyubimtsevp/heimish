import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Grid, List, SlidersHorizontal, X } from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Filter categories
const filterCategories = {
  category: {
    title: "КАТЕГОРИЯ",
    titleEn: "CATEGORY",
    options: [
      { id: "cleanser", label: "Очищающее средство", labelEn: "Cleanser" },
      { id: "toner", label: "Тонер", labelEn: "Toner" },
      { id: "serum", label: "Сыворотка", labelEn: "Serum" },
      { id: "cream", label: "Крем", labelEn: "Cream" },
      { id: "mask", label: "Маска и пластырь", labelEn: "Mask & Patch" },
      { id: "hair", label: "Волосы", labelEn: "Hair" },
      { id: "makeup", label: "Макияж", labelEn: "Makeup" },
    ],
  },
  line: {
    title: "ЛИНИЯ",
    titleEn: "LINE",
    options: [
      { id: "rx", label: "RX", labelEn: "RX" },
      { id: "allclean", label: "Всё чистое", labelEn: "All Clean" },
      { id: "marine", label: "Морской уход", labelEn: "Marine Care" },
      { id: "rose", label: "Роза", labelEn: "Rose" },
      { id: "matcha", label: "Матча Биом", labelEn: "Matcha Biome" },
      { id: "moringa", label: "Моринга Керамид", labelEn: "Moringa Ceramide" },
    ],
  },
  concern: {
    title: "ПРОБЛЕМА",
    titleEn: "CONCERN",
    options: [
      { id: "hydration", label: "Увлажнение", labelEn: "Hydration" },
      { id: "pores", label: "Поры/кожное сало", labelEn: "Pores/Sebum" },
      { id: "sensitive", label: "Чувствительная кожа", labelEn: "Sensitive" },
      { id: "barrier", label: "Увлажнение/барьер", labelEn: "Moisture/Barrier" },
      { id: "wrinkles", label: "Морщины/эластичность", labelEn: "Wrinkles/Elasticity" },
      { id: "brightening", label: "Осветление", labelEn: "Brightening" },
    ],
  },
};

// Mock products data
const mockProducts = [
  {
    id: 1,
    image: "/placeholder.svg",
    name: "Бальзам All Clean 120мл",
    nameEn: "All Clean Balm 120ml",
    price: "18,000",
    priceRub: "1,500",
    rating: 4.8,
    reviews: 13006,
    discount: 10,
    category: "cleanser",
    line: "allclean",
  },
  {
    id: 2,
    image: "/placeholder.svg",
    name: "База Artless Glow SPF50+ PA++++",
    nameEn: "Artless Glow Base SPF50+ PA++++",
    price: "22,000",
    priceRub: "1,800",
    rating: 4.8,
    reviews: 737,
    discount: 15,
    category: "makeup",
    line: "moringa",
  },
  {
    id: 3,
    image: "/placeholder.svg",
    name: "Тушь Dailism Smudge Stop",
    nameEn: "Dailism Smudge Stop Mascara",
    price: "14,000",
    priceRub: "1,200",
    rating: 4.9,
    reviews: 378,
    category: "makeup",
    line: "moringa",
  },
  {
    id: 4,
    image: "/placeholder.svg",
    name: "Бальзам All Clean Мандарин 120мл",
    nameEn: "All Clean Balm Mandarin 120ml",
    price: "18,000",
    priceRub: "1,500",
    rating: 4.9,
    reviews: 792,
    discount: 10,
    category: "cleanser",
    line: "allclean",
  },
  {
    id: 5,
    image: "/placeholder.svg",
    name: "Сыворотка RX Мультивитамин Glow 35мл",
    nameEn: "RX Multi Vitamin Glow Serum 35ml",
    price: "28,000",
    priceRub: "2,300",
    rating: 5,
    reviews: 7,
    category: "serum",
    line: "rx",
  },
  {
    id: 6,
    image: "/placeholder.svg",
    name: "Крем Moringa Ceramide Hyaluronic 50мл",
    nameEn: "Moringa Ceramide Hyaluronic Cream 50ml",
    price: "32,000",
    priceRub: "2,600",
    rating: 4.8,
    reviews: 156,
    discount: 17,
    category: "cream",
    line: "moringa",
  },
  {
    id: 7,
    image: "/placeholder.svg",
    name: "Тонер Matcha Biome Redness Relief 150мл",
    nameEn: "Matcha Biome Redness Relief Toner 150ml",
    price: "20,000",
    priceRub: "1,700",
    rating: 5,
    reviews: 54,
    category: "toner",
    line: "matcha",
  },
  {
    id: 8,
    image: "/placeholder.svg",
    name: "Патчи Bulgarian Rose Hydrogel 60шт",
    nameEn: "Bulgarian Rose Hydrogel Eye Patch 60pcs",
    price: "20,000",
    priceRub: "1,700",
    rating: 4.7,
    reviews: 194,
    discount: 9,
    category: "mask",
    line: "rose",
  },
];

interface FilterSectionProps {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}

function FilterSection({ title, options, selected, onToggle }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium text-heimish-black hover:text-heimish-gray-dark transition-colors">
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selected.includes(option.id)}
                onCheckedChange={() => onToggle(option.id)}
                className="border-heimish-gray-light data-[state=checked]:bg-heimish-black data-[state=checked]:border-heimish-black"
              />
              <span className="text-sm text-heimish-gray-dark group-hover:text-heimish-black transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function Catalog() {
  const { t, i18n } = useTranslation();
  const isRu = i18n.language === "ru";

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    category: [],
    line: [],
    concern: [],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  const toggleFilter = (category: string, id: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((item) => item !== id)
        : [...prev[category], id],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({ category: [], line: [], concern: [] });
  };

  const activeFiltersCount = Object.values(selectedFilters).flat().length;

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes(product.category)) {
      return false;
    }
    if (selectedFilters.line.length > 0 && !selectedFilters.line.includes(product.line)) {
      return false;
    }
    return true;
  });

  const FiltersContent = () => (
    <div className="space-y-2">
      {Object.entries(filterCategories).map(([key, category]) => (
        <FilterSection
          key={key}
          title={isRu ? category.title : category.titleEn}
          options={category.options.map((opt) => ({
            id: opt.id,
            label: isRu ? opt.label : opt.labelEn,
          }))}
          selected={selectedFilters[key]}
          onToggle={(id) => toggleFilter(key, id)}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-heimish-gray-light mb-6">
          <span className="hover:text-heimish-black cursor-pointer">
            {isRu ? "Главная" : "Home"}
          </span>
          <span className="mx-2">/</span>
          <span className="text-heimish-black">
            {isRu ? "Все товары" : "All Products"}
          </span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-poppins font-medium text-heimish-black mb-8">
          {isRu ? "ВСЕ ТОВАРЫ" : "ALL PRODUCTS"}
        </h1>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-heimish-black">
                  {isRu ? "ФИЛЬТРЫ" : "FILTERS"}
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-heimish-gray-light hover:text-heimish-black transition-colors"
                  >
                    {isRu ? "Сбросить" : "Clear"} ({activeFiltersCount})
                  </button>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden flex items-center gap-2"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      {isRu ? "Фильтры" : "Filters"}
                      {activeFiltersCount > 0 && (
                        <span className="bg-heimish-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="flex items-center justify-between">
                        {isRu ? "Фильтры" : "Filters"}
                        {activeFiltersCount > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-xs text-heimish-gray-light hover:text-heimish-black"
                          >
                            {isRu ? "Сбросить" : "Clear"}
                          </button>
                        )}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-heimish-gray-light">
                  {filteredProducts.length} {isRu ? "товаров" : "products"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-0 bg-transparent text-heimish-gray-dark focus:ring-0 cursor-pointer"
                >
                  <option value="popular">{isRu ? "Популярные" : "Popular"}</option>
                  <option value="newest">{isRu ? "Новинки" : "Newest"}</option>
                  <option value="price-asc">{isRu ? "Цена ↑" : "Price ↑"}</option>
                  <option value="price-desc">{isRu ? "Цена ↓" : "Price ↓"}</option>
                </select>

                {/* View Mode */}
                <div className="hidden sm:flex items-center gap-1 border-l border-gray-200 pl-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(selectedFilters).map(([category, ids]) =>
                  ids.map((id) => {
                    const option = filterCategories[category as keyof typeof filterCategories]?.options.find(
                      (opt) => opt.id === id
                    );
                    return option ? (
                      <button
                        key={`${category}-${id}`}
                        onClick={() => toggleFilter(category, id)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-heimish-gray-dark hover:bg-gray-200 transition-colors"
                      >
                        {isRu ? option.label : option.labelEn}
                        <X className="w-3 h-3" />
                      </button>
                    ) : null;
                  })
                )}
              </div>
            )}

            {/* Products Grid */}
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group relative"
                >
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                  <ProductCard
                    image={product.image}
                    name={isRu ? product.name : product.nameEn}
                    price={isRu ? product.priceRub : product.price}
                    rating={product.rating}
                    reviews={product.reviews}
                  />
                </a>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-heimish-gray-light mb-4">
                  {isRu ? "Товары не найдены" : "No products found"}
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  {isRu ? "Сбросить фильтры" : "Clear filters"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

