import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

const HERO_SLIDES = [
  {
    id: 1,
    image: "/banners/heimish_hero.jpg",
    alt: "Heimish Skincare - Korean Beauty",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              <div className="relative w-full">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {HERO_SLIDES.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5">
          {HERO_SLIDES.map((_, index) => (
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
