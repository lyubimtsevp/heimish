import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import SaleCarousel from "@/components/SaleCarousel";
import VideoSection from "@/components/VideoSection";
import ProductShowcase from "@/components/ProductShowcase";
import InstagramGrid from "@/components/InstagramGrid";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { fetchAllProducts } from "@/lib/api";
import { Product } from "@/types/product";

export default function Index() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const snapping = useRef(false);

  // Scroll to hero on mount so header is hidden initially
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    }
  }, []);

  // Snap past hero when scrolling down, free scroll up
  useEffect(() => {
    const onScroll = () => {
      if (snapping.current) return;
      const scrollY = window.scrollY;
      const heroBottom = (heroRef.current?.offsetTop || 0) + (heroRef.current?.offsetHeight || 0);
      const heroTop = heroRef.current?.offsetTop || 0;
      const isScrollingDown = scrollY > lastScrollY.current;

      // If scrolling down and in the hero zone, snap to content
      if (isScrollingDown && scrollY > heroTop + 50 && scrollY < heroBottom - 100) {
        snapping.current = true;
        window.scrollTo({ top: heroBottom, behavior: "smooth" });
        setTimeout(() => { snapping.current = false; }, 500);
      }

      // If scrolling up and entering the hero zone from below, snap to hero top
      if (!isScrollingDown && scrollY < heroBottom - 50 && scrollY > heroTop + 100) {
        snapping.current = true;
        window.scrollTo({ top: heroTop, behavior: "smooth" });
        setTimeout(() => { snapping.current = false; }, 500);
      }

      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  // Best products from real data (top 10 by reviews)
  const bestProducts = [...products]
    .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    .slice(0, 10)
    .map((product, index) => ({
      id: product.id,
      rank: index + 1,
      image: product.images[0] || "",
      name: product.title,
      price: product.price.toLocaleString("ru-RU"),
      oldPrice: product.oldPrice ? product.oldPrice.toLocaleString("ru-RU") : undefined,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
    }));

  // Real RX line products from database (увеличено до 8 для слайдера)
  const rxProducts = products
    .filter(p => p.line === "RX")
    .slice(0, 8)
    .map(p => ({
      id: p.id,
      image: p.images[0] || "",
      name: p.title,
      price: p.price.toLocaleString("ru-RU"),
      oldPrice: p.oldPrice ? p.oldPrice.toLocaleString("ru-RU") : undefined,
      rating: p.rating || 0,
      reviews: p.reviews || 0,
    }));

  // Real Makeup products from database (увеличено до 8 для слайдера)
  const makeupProducts = products
    .filter(p => p.category === "Макияж")
    .slice(0, 8)
    .map(p => ({
      id: p.id,
      image: p.images[0] || "",
      name: p.title,
      oldPrice: p.oldPrice ? p.oldPrice.toLocaleString("ru-RU") : undefined,
      price: p.price.toLocaleString("ru-RU"),
      rating: p.rating || 0,
      reviews: p.reviews || 0,
    }));

  return (
    <div className="min-h-screen bg-white overflow-x-hidden scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <TopBanner />
      <Header />
      <div ref={heroRef} className="h-screen">
        <HeroCarousel />
      </div>

      <div>
        {/* BEST Products Section - Added top spacing */}
        <div className="pt-4 sm:pt-6">
          <ProductCarousel products={bestProducts} title={t("products.best")} />
        </div>

        {/* АКЦИИ - Товары со скидкой */}
        <SaleCarousel />

        {/* Video Section - Direct connection to Review section in Figma? No, spacing looks standard. */}
        {/* Plan said: BEST REVIEW -> Video: Direct (no extra gap) */}
        <VideoSection />

        {/* Product Showcase 1 - RX Line */}
        <ProductShowcase
          bannerImage="/banners/banner_2.jpg"
          tabletBannerImage="/placeholder.svg"
          mobileBannerImage="/placeholder.svg"
          products={rxProducts}
          backgroundColor="#F5F5F5"
          categoryLink="/all?line=RX"
        />

        {/* Product Showcase 2 - Makeup - REVERSED */}
        <ProductShowcase
          bannerImage="/banners/banner_3.jpg"
          tabletBannerImage="/placeholder.svg"
          mobileBannerImage="/placeholder.svg"
          products={makeupProducts}
          backgroundColor="#F5F5F5"
          reversed={true}
          categoryLink="/all?category=Макияж"
        />

        {/* Instagram Section - Gap adjustment */}
        <div className="pt-12 pb-6 sm:pt-16 sm:pb-8 md:pt-24">
          <InstagramGrid />
        </div>

        <Footer />
        <CookieBanner />
      </div>
    </div>
  );
}
