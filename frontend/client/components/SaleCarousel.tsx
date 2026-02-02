import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchAllProducts } from "@/lib/api";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";

export default function SaleCarousel() {
  const { t } = useTranslation();
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Загрузка акционных товаров
  useEffect(() => {
    const loadSaleProducts = async () => {
      try {
        const products = await fetchAllProducts();
        // Фильтруем только акционные товары
        const onSale = products.filter((p: any) => p.isOnSale === true);
        setSaleProducts(onSale);
      } catch (error) {
        console.error("Error loading sale products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSaleProducts();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Если нет акционных товаров, не показываем секцию
  if (!loading && saleProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 md:py-10 bg-heimish-bg">
      <div className="w-full max-w-none mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-heimish-black text-center mb-6 sm:mb-8 md:mb-10 tracking-wide">
          {t("products.best_review")}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-heimish-pink" />
          </div>
        ) : (
          /* Carousel Container */
          <div className="relative px-4 sm:px-6 md:px-[9%]">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {saleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-[0_0_calc(50%-20px)] min-w-0 px-2.5 md:flex-[0_0_calc(33.333%-20px)] lg:flex-[0_0_calc(25%-20px)]"
                  >
                    <ProductCard
                      id={product.id}
                      documentId={product.id}
                      image={product.images?.[0] || "/placeholder.jpg"}
                      name={product.title}
                      price={product.price.toLocaleString("ru-RU")}
                      oldPrice={product.oldPrice?.toLocaleString("ru-RU")}
                      isOnSale={product.isOnSale}
                      rating={product.rating || 0}
                      reviews={product.reviews || 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center disabled:opacity-30 hover:opacity-70 transition-opacity z-10"
              aria-label="Previous products"
            >
              <img
                src="/icons/arrow-left.svg"
                alt="Previous"
                className="w-full h-full"
              />
            </button>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center disabled:opacity-30 hover:opacity-70 transition-opacity z-10"
              aria-label="Next products"
            >
              <img
                src="/icons/arrow-right.svg"
                alt="Next"
                className="w-full h-full"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
