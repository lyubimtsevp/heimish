import { useState } from "react";
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

// Product data translated to Russian with Ruble prices
const products = [
  {
    id: "1",
    image:
      "/placeholder.svg",
    title: "Очищающий бальзам All Clean 120мл",
    price: "1 300 ₽",
    reviewCount: 13006,
    points: "65 ₽",
  },
  {
    id: "2",
    image:
      "/placeholder.svg",
    title: "Пудра Moringa Ceramide Pressed Setting",
    subtitle: "5г",
    price: "1 000 ₽",
    reviewCount: 824,
    points: "50 ₽",
  },
  {
    id: "3",
    image:
      "/placeholder.svg",
    title: "Очищающий бальзам All Clean Мандарин 120мл",
    price: "1 300 ₽",
    reviewCount: 792,
    points: "65 ₽",
  },
  {
    id: "4",
    image:
      "/placeholder.svg",
    title: "База под макияж Artless Glow SPF50+ PA++++",
    price: "1 600 ₽",
    reviewCount: 737,
    points: "80 ₽",
  },
  {
    id: "5",
    image:
      "/placeholder.svg",
    title: "Пенка All Clean White Clay 150г",
    price: "900 ₽",
    reviewCount: 444,
    points: "45 ₽",
  },
  {
    id: "6",
    image:
      "/placeholder.svg",
    title: "Пенка All Clean Green 150г",
    price: "900 ₽",
    reviewCount: 399,
    points: "45 ₽",
  },
  {
    id: "7",
    image:
      "/placeholder.svg",
    title: "Тушь Dailism Smudge Stop 2 вида",
    subtitle: "(Подкручивание/Объем)",
    price: "1 000 ₽",
    reviewCount: 378,
    points: "50 ₽",
  },
  {
    id: "8",
    image:
      "/placeholder.svg",
    title: "Маска Black Tea 110мл",
    price: "1 600 ₽",
    reviewCount: 223,
    points: "80 ₽",
  },
  {
    id: "9",
    image:
      "/placeholder.svg",
    title: "Патчи Bulgarian Rose Hydrogel 60шт",
    price: "1 400 ₽",
    reviewCount: 194,
    points: "70 ₽",
  },
  {
    id: "10",
    image:
      "/placeholder.svg",
    title: "Пенка Matcha Biome Amino Acne 150г",
    price: "1 000 ₽",
    reviewCount: 153,
    points: "50 ₽",
  },
  {
    id: "11",
    image:
      "/placeholder.svg",
    title: "Спонж Artless Rubycell Puff 5шт",
    price: "600 ₽",
    reviewCount: 109,
    points: "30 ₽",
  },
  {
    id: "12",
    image:
      "/placeholder.svg",
    title: "BB Крем Moringa Ceramide SPF30 PA",
    subtitle: "8 оттенков",
    price: "1 600 ₽",
    reviewCount: 103,
    points: "80 ₽",
  },
  {
    id: "13",
    image:
      "/placeholder.svg",
    title: "Патчи Matcha Biome Hydrogel 60шт",
    price: "1 400 ₽",
    reviewCount: 97,
    points: "70 ₽",
  },
  {
    id: "14",
    image:
      "/placeholder.svg",
    title: "Крем Matcha Biome Intensive Repair 50мл",
    price: "2 000 ₽",
    reviewCount: 63,
    points: "100 ₽",
  },
  {
    id: "15",
    image:
      "/placeholder.svg",
    title: "Тонер Matcha Biome Redness Relief",
    subtitle: "150мл",
    price: "1 400 ₽",
    reviewCount: 54,
    points: "70 ₽",
  },
  {
    id: "16",
    image:
      "/placeholder.svg",
    title: "Увлажняющий гель Matcha Biome Oil-Free",
    subtitle: "100мл",
    price: "1 600 ₽",
    reviewCount: 53,
    points: "80 ₽",
  },
  {
    id: "17",
    image:
      "/placeholder.svg",
    title: "Крем Moringa Ceramide Hyaluronic",
    subtitle: "50мл",
    price: "2 500 ₽",
    reviewCount: 49,
    points: "125 ₽",
  },
  {
    id: "18",
    image:
      "/placeholder.svg",
    title: "Санскрин Moringa Ceramide Watery SPF50+",
    subtitle: "PA++++",
    price: "1 600 ₽",
    reviewCount: 38,
    points: "80 ₽",
  },
  {
    id: "19",
    image:
      "/placeholder.svg",
    title: "Очищающее масло Matcha Biome Perfect 150мл",
    price: "1 400 ₽",
    reviewCount: 27,
    points: "70 ₽",
  },
  {
    id: "20",
    image:
      "/placeholder.svg",
    title: "Шампунь RX Amino Biotin Revitalizing",
    subtitle: "400мл",
    price: "1 900 ₽",
    reviewCount: 22,
    points: "95 ₽",
  },
  {
    id: "21",
    image:
      "/placeholder.svg",
    title: "Крем Marine Care Deep Moisture Nourishing",
    subtitle: "55мл",
    price: "2 400 ₽",
    reviewCount: 19,
    points: "120 ₽",
  },
  {
    id: "22",
    image:
      "/placeholder.svg",
    title: "Тинт Artless Glow Tinted Sunscreen SPF50+",
    subtitle: "PA++++",
    price: "1 600 ₽",
    reviewCount: 18,
    points: "80 ₽",
  },
  {
    id: "23",
    image:
      "/placeholder.svg",
    title: "Термозащита RX Amino Keratin 150мл",
    subtitle: "Leave-in Treatment",
    price: "1 600 ₽",
    reviewCount: 12,
    points: "80 ₽",
  },
  {
    id: "24",
    image:
      "/placeholder.svg",
    title: "Сыворотка Marine Care Retinol Eye 30мл",
    price: "2 000 ₽",
    reviewCount: 8,
    points: "100 ₽",
  },
  {
    id: "25",
    image:
      "/placeholder.svg",
    title: "Пилинг-сыворотка RX AHA BHA 35мл",
    price: "2 000 ₽",
    reviewCount: 7,
    points: "100 ₽",
  },
  {
    id: "26",
    image:
      "/placeholder.svg",
    title: "Сыворотка RX Multi Vitamin Glow 35мл",
    price: "2 000 ₽",
    reviewCount: 6,
    points: "100 ₽",
  },
  {
    id: "27",
    image:
      "/placeholder.svg",
    title: "Крем Black Rose Hydra Plumping 50мл",
    subtitle: "Sherbet Cream",
    price: "2 400 ₽",
    reviewCount: 6,
    points: "120 ₽",
  },
  {
    id: "28",
    image:
      "/placeholder.svg",
    title: "Крем RX Multi Vitamin Dark Spot 50мл",
    price: "2 500 ₽",
    reviewCount: 6,
    points: "125 ₽",
  },
  {
    id: "29",
    image:
      "/placeholder.svg",
    title: "Крем для глаз RX Retinol Bakuchiol 30мл",
    price: "2 700 ₽",
    reviewCount: 6,
    points: "135 ₽",
  },
  {
    id: "30",
    image:
      "/placeholder.svg",
    title: "Масло RX Retinol Bakuchiol Booster 35мл",
    price: "2 000 ₽",
    reviewCount: 5,
    points: "100 ₽",
  },
  {
    id: "31",
    image:
      "/placeholder.svg",
    title: "Сыворотка RX Hyaluronic Hydrating 35мл",
    price: "2 000 ₽",
    reviewCount: 5,
    points: "100 ₽",
  },
  {
    id: "32",
    image:
      "/placeholder.svg",
    title: "Крем RX Hyaluronic Rich Whipped 50мл",
    price: "2 500 ₽",
    reviewCount: 5,
    points: "125 ₽",
  },
  {
    id: "33",
    image:
      "/placeholder.svg",
    title: "Скраб RX AHA BHA Enzyme 130мл",
    price: "1 300 ₽",
    reviewCount: 5,
    points: "65 ₽",
  },
  {
    id: "34",
    image:
      "/placeholder.svg",
    title: "Патчи RX Retinol Bakuchiol Hydrogel",
    subtitle: "60шт",
    price: "1 600 ₽",
    reviewCount: 5,
    points: "80 ₽",
  },
  {
    id: "35",
    image:
      "/placeholder.svg",
    title: "Сыворотка Marine Care Retinol Face 50мл",
    price: "2 400 ₽",
    reviewCount: 3,
    points: "120 ₽",
  },
  {
    id: "36",
    image:
      "/placeholder.svg",
    title: "Крем для глаз Marine Care 30мл",
    price: "2 500 ₽",
    reviewCount: 172,
    points: "125 ₽",
    soldOut: true,
  },
  {
    id: "37",
    image:
      "/placeholder.svg",
    title: "Гель-крем Watermelon Moisture Soothing 110мл",
    price: "2 000 ₽",
    reviewCount: 57,
    points: "100 ₽",
    soldOut: true,
  },
];

export default function Best() {
  const [sortOption, setSortOption] = useState("Популярные");

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 md:gap-x-[60px] gap-y-16 md:gap-y-28">
              {products.map((product) => (
                <BestProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
