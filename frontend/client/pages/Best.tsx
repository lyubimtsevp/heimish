import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import BestProductCard from "@/components/BestProductCard";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import TopBanner from "@/components/TopBanner";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types/product";

export default function Best() {
  const [sortOption, setSortOption] = useState("Популярные");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ pageSize: 100 })
      .then(({ products: all }) => {
        const best = all.filter(p => p.isBest);
        setProducts(best.length > 0 ? best : all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...products].sort((a, b) => {
    switch (sortOption) {
      case "Новинки": return 0;
      case "Цена (низкая)": return a.price - b.price;
      case "Цена (высокая)": return b.price - a.price;
      case "Рейтинг": return (b.rating || 0) - (a.rating || 0);
      case "Отзывы": return (b.reviews || 0) - (a.reviews || 0);
      default: return (b.reviews || 0) - (a.reviews || 0);
    }
  });

  const sortOptions = [
    "Популярные",
    "Новинки",
    "Цена (низкая)",
    "Цена (высокая)",
    "Рейтинг",
    "Отзывы",
  ];

  return (
    <div className="min-h-screen bg-white font-circe">
      <TopBanner />
      <Header />

      <main className="pt-12 md:pt-20">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-[68px]">
          {/* Category Tabs */}
          <div className="mb-12 md:mb-[90px]">
            <CategoryTabs activeCategory="BEST" />
          </div>

          {/* Page Title and Sort */}
          <div className="mb-12 md:mb-[90px]">
            <div className="flex items-start justify-between mb-6 md:mb-8">
              <h1 className="text-black text-2xl sm:text-3xl md:text-[40px] font-bold font-circe leading-tight md:leading-[57.14px] tracking-wide">
                ЛУЧШЕЕ
              </h1>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2.5 py-1.5 border border-black bg-white text-black text-xs font-circe leading-[30px] hover:bg-gray-50 transition-colors">
                    <span>{sortOption}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white border-gray-200"
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      className="text-xs font-circe cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                      onClick={() => setSortOption(option)}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-20 text-gray-400">Загрузка...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 md:gap-x-[60px] gap-y-16 md:gap-y-28">
                {sorted.map((product) => (
                  <BestProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images[0] || "/placeholder.svg"}
                    title={product.title}
                    price={`${product.price.toLocaleString("ru-RU")} ₽`}
                    reviewCount={product.reviews}
                    points={`${Math.round(product.price * 0.05)} ₽`}
                    soldOut={!product.inStock}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
