import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number | string;
  rank?: number;
  image: string;
  name: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: number;
}

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

export default function ProductCarousel({
  products,
  title,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
    <section className="w-full py-12 md:py-20">
      <div className="w-full max-w-none mx-auto px-4 md:px-[5%] relative">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-heimish-black text-center mb-6 sm:mb-8 md:mb-10 tracking-wide">
          {title}
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-10px)] md:flex-[0_0_calc(33.333%-13.333px)] lg:flex-[0_0_calc(20%-16px)]"
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="hidden sm:flex absolute -left-16 top-1/2 -translate-y-1/2 w-[70px] h-[70px] items-center justify-center disabled:opacity-30 hover:opacity-70 transition-opacity z-10"
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
            className="hidden sm:flex absolute -right-16 top-1/2 -translate-y-1/2 w-[70px] h-[70px] items-center justify-center disabled:opacity-30 hover:opacity-70 transition-opacity z-10"
            aria-label="Next products"
          >
            <img
              src="/icons/arrow-right.svg"
              alt="Next"
              className="w-full h-full"
            />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-4 mt-8 sm:mt-16 mb-4">
          {scrollSnaps
            .slice(0, Math.ceil(products.length / 4))
            .map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${index === selectedIndex ? "bg-heimish-black" : "bg-black/20"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
