import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: number | string;
  image: string;
  name: string;
  price: string;
  rating?: number;
  reviews?: number;
}

interface ProductShowcaseProps {
  title?: string;
  bannerImage: string;
  tabletBannerImage?: string;
  mobileBannerImage?: string;
  products: Product[];
  backgroundColor?: string;
  reversed?: boolean;
  categoryLink?: string;
}

export default function ProductShowcase({
  title,
  bannerImage,
  tabletBannerImage,
  mobileBannerImage,
  products,
  backgroundColor = "#F5F5F5",
  reversed = false,
  categoryLink = "/all",
}: ProductShowcaseProps) {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full mt-8 md:mt-12" style={{ backgroundColor }}>
      <div
        className={`w-full max-w-none mx-auto flex items-stretch px-4 lg:px-6 flex-col lg:flex-row ${reversed ? "lg:flex-row-reverse" : ""}`}
      >
        {/* Banner Image Side - 40% width on desktop */}
        <Link to={categoryLink} className="w-full lg:w-[40%] relative flex-shrink-0 group block">
          <picture className="w-full h-full block">
            <source
              media="(max-width: 640px)"
              srcSet={
                mobileBannerImage ||
                bannerImage.replace("width=1440", "width=600")
              }
            />
            <source media="(min-width: 1280px)" srcSet={bannerImage} />
            {tabletBannerImage && (
              <source media="(min-width: 1024px)" srcSet={tabletBannerImage} />
            )}
            <img
              src={bannerImage}
              alt={title || "Product showcase"}
              className="w-full h-full object-cover min-h-[280px] sm:min-h-[400px] lg:min-h-0 lg:h-full"
            />
          </picture>

          {/* SHOP NOW Button Overlay */}
          <span
            className="absolute left-1/2 top-[60%] lg:left-[45%] lg:top-[56%] -translate-x-1/2 -translate-y-1/2 px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 border border-heimish-black bg-transparent text-heimish-black font-poppins text-sm sm:text-base group-hover:bg-heimish-black group-hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            {t("showcase.shop_now")}
          </span>
        </Link>

        {/* Products Side - 60% width on desktop */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center py-8 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8 xl:py-14 xl:px-12 flex-shrink-0">
          {/* Carousel View */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={scrollPrev}
              className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-heimish-dark hover:text-white transition-all duration-300 border border-gray-100"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={scrollNext}
              className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-heimish-dark hover:text-white transition-all duration-300 border border-gray-100"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Carousel */}
            <div className="overflow-hidden mx-8 sm:mx-14" ref={emblaRef}>
              <div className="flex gap-3 sm:gap-4 lg:gap-5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex-[0_0_calc(50%-6px)] sm:flex-[0_0_calc(33.333%-11px)] lg:flex-[0_0_calc(33.333%-14px)] min-w-0"
                  >
                    <ProductCard
                      id={product.id}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating || 0}
                      reviews={product.reviews || 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex 
                    ? "bg-heimish-dark w-6" 
                    : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
