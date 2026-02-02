import { Search, ShoppingCart, Menu, X, ChevronDown, ChevronRight, Package, HelpCircle, RefreshCw, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useTranslation();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsMegaMenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      timeoutRef.current = setTimeout(() => {
        setIsMegaMenuOpen(false);
      }, 300);
    }
  };

  const toggleMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
    setExpandedMobileSection(null);
  };

  const closeMenu = () => {
    setIsMegaMenuOpen(false);
    setExpandedMobileSection(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setExpandedMobileSection(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const megaMenuCategories = {
    all: [
      { title: t("mega.all"), link: "/all", isBold: true },
      { title: t("nav.best"), link: "/best", isBold: true },
    ],
    makeup: [
      { title: t("mega.makeup"), link: "/all?category=Макияж", isBold: true },
      { title: t("mega.base_sun"), link: "/all?category=Солнцезащита" },
      { title: t("mega.face"), link: "/all?category=Кремы" },
      { title: t("mega.mascara"), link: "/all?category=Макияж" },
    ],
    category: [
      { title: t("mega.category"), link: "/all", isBold: true },
      { title: t("mega.cleanser"), link: "/all?category=Очищение" },
      { title: t("mega.toner"), link: "/all?category=Тонеры" },
      { title: t("mega.serum"), link: "/all?category=Сыворотки" },
      { title: t("mega.cream"), link: "/all?category=Кремы" },
      { title: t("mega.mask_patch"), link: "/all?category=Маски" },
      { title: t("mega.hair"), link: "/all?category=Волосы" },
      { title: t("mega.acc"), link: "/all" },
    ],
    line: [
      { title: t("mega.line"), link: "/all", isBold: true },
      { title: "RX", link: "/all?line=RX" },
      { title: "ALL CLEAN", link: "/all?line=All Clean" },
      { title: "MARINE CARE", link: "/all?line=Marine Care" },
      { title: "ROSE", link: "/all?line=Bulgarian Rose" },
      { title: "MATCHA BIOME", link: "/all?line=Matcha Biome" },
      { title: "MORINGA CERAMIDE", link: "/all?line=Moringa" },
    ],
    concern: [
      { title: t("mega.concern"), link: "/all", isBold: true },
      { title: t("mega.moisture"), link: "/all?category=Кремы" },
      { title: t("mega.pores"), link: "/all?category=Очищение" },
      { title: t("mega.calming"), link: "/all?category=Маски" },
      { title: t("mega.barrier"), link: "/all?category=Кремы" },
      { title: t("mega.elasticity"), link: "/all?category=Сыворотки" },
      { title: t("mega.brightening"), link: "/all?category=Солнцезащита" },
    ],
  };

  const mobileMenuSections = [
    { key: "all", title: "ВСЕ ТОВАРЫ", items: megaMenuCategories.all },
    { key: "category", title: "КАТЕГОРИИ", items: megaMenuCategories.category.slice(1) },
    { key: "line", title: "ЛИНИИ", items: megaMenuCategories.line.slice(1) },
    { key: "makeup", title: "МАКИЯЖ", items: megaMenuCategories.makeup.slice(1) },
    { key: "concern", title: "ПО ПРОБЛЕМЕ", items: megaMenuCategories.concern.slice(1) },
  ];

  const featuredProducts = [
    {
      image: "/images/HEIM-MATCHABI_0.jpg",
      title: "MATCHA BIOME",
      link: "/all?line=Matcha Biome",
    },
    {
      image: "/images/artless-perfect-cushion-spf50-pa_0.jpg",
      title: "ARTLESS GLOW",
      link: "/all?line=Artless",
    },
  ];

  return (
    <header className="relative z-50 bg-white">
      <div className="w-full">
        {/* Main Navigation */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-12 xl:px-16 py-3 md:py-4 border-b border-gray-200 relative">
          {/* Left Navigation with Menu Button */}
          <div className="flex items-center gap-6 xl:gap-10">
            {/* Hamburger Menu Button */}
            <button
              className="p-2 hover:opacity-70 transition-opacity"
              onClick={toggleMenu}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Toggle menu"
            >
              {isMegaMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-12 font-poppins font-medium text-base text-heimish-gray-dark">
              <Link to="/all?category=best" className="hover:text-heimish-black transition-colors">
                {t("nav.best")}
              </Link>
              <Link to="/delivery" className="hover:text-heimish-black transition-colors">
                ДОСТАВКА
              </Link>
            </nav>
          </div>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 absolute left-1/2 -translate-x-1/2">
            <img
              src="/heimish_logo.svg"
              alt="heimish"
              className="h-7 sm:h-8"
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-6 h-6 text-heimish-gray-dark" />
            </button>

            <Link to="/cart" className="relative flex items-center gap-1 hover:opacity-70 transition-opacity">
              <div className="p-2">
                <ShoppingCart className="w-6 h-6 text-heimish-gray-dark" />
              </div>
              <span className="hidden sm:block font-poppins font-medium text-sm text-heimish-gray-dark">
                {t("nav.cart")}
              </span>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-heimish-gray-dark text-white text-sm font-poppins ml-1">
                {totalItems}
              </div>
            </Link>

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-heimish-pink/20 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm text-heimish-dark">{user?.username?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="font-poppins font-medium text-sm text-heimish-gray-dark">{user?.username}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="hidden lg:flex items-center gap-2 font-poppins font-medium text-sm text-heimish-gray-dark hover:text-heimish-black transition-colors"
              >
                <User className="w-5 h-5" />
                {t("nav.login")}
              </button>
            )}
          </div>
        </div>

        {/* Mega Menu - Desktop (lg and up) */}
        {isMegaMenuOpen && (
          <div
            className="absolute left-0 top-full w-full bg-white border-b border-gray-200 shadow-lg z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Desktop Mega Menu */}
            <div className="hidden lg:block px-12 xl:px-16 py-5">
              <div className="flex gap-10 justify-between">
                {/* Categories Grid */}
                <div className="flex gap-10">
                  {/* ALL & BEST Column */}
                  <div className="flex flex-col gap-5 min-w-[130px]">
                    {megaMenuCategories.all.map((item, idx) => (
                      <div key={idx} className="pb-5">
                        <Link
                          to={item.link}
                          onClick={closeMenu}
                          className="block pb-0.5 border-b border-heimish-gray-dark font-poppins font-semibold text-base text-heimish-gray-dark"
                        >
                          {item.title}
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* MAKE-UP Column */}
                  <div className="flex flex-col min-w-[130px]">
                    {megaMenuCategories.makeup.map((item, idx) => (
                      <div key={idx} className="pb-5">
                        {item.isBold ? (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="block pb-0.5 border-b border-heimish-gray-dark font-poppins font-semibold text-base text-heimish-gray-dark"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="font-poppins font-medium text-[15px] text-heimish-gray hover:text-heimish-black transition-colors"
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CATEGORY Column */}
                  <div className="flex flex-col min-w-[130px]">
                    {megaMenuCategories.category.map((item, idx) => (
                      <div key={idx} className="pb-5">
                        {item.isBold ? (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="block pb-0.5 border-b border-heimish-gray-dark font-poppins font-semibold text-base text-heimish-gray-dark"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="font-poppins font-medium text-[15px] text-heimish-gray hover:text-heimish-black transition-colors"
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* LINE Column */}
                  <div className="flex flex-col min-w-[130px]">
                    {megaMenuCategories.line.map((item, idx) => (
                      <div key={idx} className="pb-5">
                        {item.isBold ? (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="block pb-0.5 border-b border-heimish-gray-dark font-poppins font-semibold text-base text-heimish-gray-dark"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="font-poppins font-medium text-[15px] text-heimish-gray hover:text-heimish-black transition-colors"
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CONCERN Column */}
                  <div className="flex flex-col min-w-[130px]">
                    {megaMenuCategories.concern.map((item, idx) => (
                      <div key={idx} className="pb-5">
                        {item.isBold ? (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="block pb-0.5 border-b border-heimish-gray-dark font-poppins font-semibold text-base text-heimish-gray-dark"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <Link
                            to={item.link}
                            onClick={closeMenu}
                            className="font-poppins font-medium text-[15px] text-heimish-gray hover:text-heimish-black transition-colors"
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Products - only on xl screens */}
                <div className="hidden xl:flex gap-6">
                  {featuredProducts.map((product, idx) => (
                    <Link
                      key={idx}
                      to={product.link}
                      onClick={closeMenu}
                      className="flex flex-col items-center group"
                    >
                      <div className="mb-5">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-[200px] h-[200px] object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <div className="text-center font-poppins font-medium text-base text-heimish-gray-dark group-hover:text-heimish-black transition-colors pb-5">
                        {product.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Menu (below lg) */}
            <div className="lg:hidden max-h-[70vh] overflow-y-auto">
              {/* Quick Links */}
              <div className="border-b border-gray-100">
                <Link
                  to="/all"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-6 py-4 font-semibold text-heimish-gray-dark hover:bg-gray-50"
                >
                  ВСЕ ТОВАРЫ
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <Link
                  to="/best"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-6 py-4 font-semibold text-heimish-gray-dark hover:bg-gray-50 border-t border-gray-100"
                >
                  ЛУЧШЕЕ
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>

              {/* Expandable Sections */}
              {mobileMenuSections.slice(1).map((section) => (
                <div key={section.key} className="border-b border-gray-100">
                  <button
                    onClick={() => setExpandedMobileSection(
                      expandedMobileSection === section.key ? null : section.key
                    )}
                    className="flex items-center justify-between w-full px-6 py-4 font-semibold text-heimish-gray-dark hover:bg-gray-50"
                  >
                    {section.title}
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedMobileSection === section.key ? "rotate-180" : ""
                      }`} 
                    />
                  </button>
                  
                  {expandedMobileSection === section.key && (
                    <div className="bg-gray-50 px-6 pb-4">
                      {section.items.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.link}
                          onClick={closeMenu}
                          className="block py-2.5 text-[15px] text-heimish-gray hover:text-heimish-black transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Additional Links */}
              <div className="px-6 py-4 space-y-3 bg-gray-50">
                <Link
                  to="/delivery"
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-2 text-heimish-gray-dark hover:text-heimish-black"
                >
                  <Package className="w-5 h-5 text-heimish-gray" />
                  Доставка
                </Link>
                <Link
                  to="/faq"
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-2 text-heimish-gray-dark hover:text-heimish-black"
                >
                  <HelpCircle className="w-5 h-5 text-heimish-gray" />
                  Частые вопросы
                </Link>
                <Link
                  to="/returns"
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-2 text-heimish-gray-dark hover:text-heimish-black"
                >
                  <RefreshCw className="w-5 h-5 text-heimish-gray" />
                  Возврат и обмен
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search Modal */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </header>
  );
}
