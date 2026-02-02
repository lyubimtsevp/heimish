import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { fetchBanners } from "@/lib/api";

const FALLBACK_SLIDES = [
  {
    id: 1,
    imageUrl: "/banners/heimish_hero.jpg",
    title: "Heimish Skincare - Korean Beauty",
    link: "",
  },
];

interface Slide {
  id: number;
  imageUrl: string;
  title: string;
  link: string;
}

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);

  useEffect(() => {
    fetchBanners().then((banners) => {
      if (banners.length > 0) {
        setSlides(banners);
      }
    });
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              {slide.link ? (
                <Link to={slide.link} className="relative w-full block">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-auto object-cover"
                  />
                </Link>
              ) : (
                <div className="relative w-full">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className="relative w-12 h-2 sm:w-16 bg-black/30 overflow-hidden cursor-pointer hover:bg-black/40 transition-colors"
              aria-label={`Перейти к слайду ${index + 1}`}
            >
              <div
                className={`absolute inset-0 h-full bg-heimish-black transition-transform duration-300 origin-left ${
                  index === selectedIndex ? "scale-x-100" : "scale-x-0"
                }`}
                style={{
                  transform: index === selectedIndex ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
