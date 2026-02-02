import { useTranslation } from "react-i18next";

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: "/images/HEIM-ALLCLEAN_0.jpg",
    alt: "Heimish All Clean Balm",
  },
  {
    id: 2,
    image: "/images/HEIM-MATCHABI_0.jpg",
    alt: "Heimish Matcha Biome",
  },
  {
    id: 3,
    image: "/images/bulgarian-rose-water-hydrogel-eye-patch-60ea_0.jpg",
    alt: "Bulgarian Rose Eye Patch",
  },
  {
    id: 4,
    image: "/images/HEIM-MORINGAC_0.jpg",
    alt: "Moringa Ceramide BB Cream",
  },
  {
    id: 5,
    image: "/images/artless-perfect-cushion-spf50-pa_0.jpg",
    alt: "Artless Perfect Cushion",
  },
  {
    id: 6,
    image: "/images/rx-aha-bha-enzyme-scrub-130ml-copy_0.jpg",
    alt: "RX AHA BHA Enzyme Scrub",
  },
];

export default function InstagramGrid() {
  const { t } = useTranslation();

  return (
    <section className="w-full py-12 md:py-20">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins text-heimish-black mb-2 tracking-wide">
            {t("instagram.title")}
          </h2>
          <a
            href="https://instagram.com/heimish_cosmetic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base md:text-lg font-poppins text-heimish-gray-light uppercase tracking-[4px] sm:tracking-[8px] md:tracking-[10.8px] hover:text-heimish-black transition-colors"
          >
            @heimish_cosmetic
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-0.5 md:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/heimish_cosmetic"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden bg-gray-100"
            >
              <img
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
