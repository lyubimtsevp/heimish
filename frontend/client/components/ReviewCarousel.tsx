import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReviewCard from "./ReviewCard";

interface Review {
  id: number;
  image: string;
  productName: string;
  reviewText: string;
  rating: number;
}

interface ReviewCarouselProps {
  reviews: Review[];
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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

  return (
    <section className="w-full py-8 md:py-10 bg-heimish-bg">
      <div className="w-full max-w-none mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-heimish-black text-center mb-6 sm:mb-8 md:mb-10 tracking-wide">
          {t("products.best_review")}
        </h2>

        {/* Carousel Container */}
        <div className="relative px-4 sm:px-6 md:px-[9%]">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-[0_0_calc(100%-20px)] min-w-0 px-2.5 md:flex-[0_0_calc(50%-20px)] lg:flex-[0_0_calc(33.333%-20px)]"
                >
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center disabled:opacity-30 hover:opacity-70 transition-opacity z-10"
            aria-label="Previous reviews"
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
            aria-label="Next reviews"
          >
            <img
              src="/icons/arrow-right.svg"
              alt="Next"
              className="w-full h-full"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
