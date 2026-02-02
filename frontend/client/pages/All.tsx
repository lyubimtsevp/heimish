import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import TopBanner from "@/components/TopBanner";
import { ChevronDown, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product, SortOption, SORT_OPTIONS } from "@/types/product";
import { fetchAllProducts, fetchCategories, fetchLines } from "@/lib/api";

// Format price with thousands separator
function formatPrice(price: number): string {
    return price.toLocaleString("ru-RU") + " ₽";
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
    return (
        <Link to={`/product/${product.id}`} className="group block">
            <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50">
                <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Нет в наличии</span>
                    </div>
                )}
                {product.oldPrice && product.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <h3 className="text-heimish-dark text-sm font-medium font-circe leading-5 line-clamp-2 group-hover:text-heimish-black transition-colors">
                    {product.title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className={product.oldPrice ? "text-[#ef4444] font-bold font-circe" : "text-heimish-dark font-bold font-circe"}>
                        {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                        <span className="text-gray-400 text-sm line-through">
                            {formatPrice(product.oldPrice)}
                        </span>
                    )}
                </div>
                <p className="text-gray-500 text-xs font-circe">
                    Отзывов {product.reviews.toLocaleString()} / Баллов {Math.round(product.price * 0.05)} ₽
                </p>
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
            </div>
        </Link>
    );
}

// Static fallback categories/lines
const STATIC_CATEGORIES = ["Очищение", "Сыворотки", "Кремы", "Тонеры", "Маски", "Солнцезащита", "Макияж", "Уход"];
const STATIC_LINES = ["All Clean", "RX", "Matcha Biome", "Moringa", "Marine Care", "Dailism", "Artless", "Bulgarian Rose"];

export default function All() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [sortOption, setSortOption] = useState<SortOption>("popularity");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [dynamicCategories, setDynamicCategories] = useState<string[]>(STATIC_CATEGORIES);
    const [dynamicLines, setDynamicLines] = useState<string[]>(STATIC_LINES);

    // Fetch products and dynamic categories/lines
    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            try {
                const [fetchedProducts, cats, lns] = await Promise.all([
                    fetchAllProducts(),
                    fetchCategories(),
                    fetchLines(),
                ]);
                setProducts(fetchedProducts);
                if (cats.length > 0) setDynamicCategories(cats);
                if (lns.length > 0) setDynamicLines(lns);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    // Get category and line from URL - reactive to URL changes
    const selectedCategory = searchParams.get("category") || "all";
    const selectedLine = searchParams.get("line") || "all";

    // Build dynamic CATEGORIES and FILTER_LINES from fetched data
    const CATEGORIES = useMemo(() => [
        { id: "all", label: "ВСЕ" },
        { id: "best", label: "ЛУЧШЕЕ" },
        ...dynamicCategories.map(c => ({ id: c, label: c.toUpperCase() })),
    ], [dynamicCategories]);

    const FILTER_LINES = useMemo(() => [
        { id: "all", label: "Все линейки" },
        ...dynamicLines.map(l => ({ id: l, label: l })),
    ], [dynamicLines]);

    // Calculate category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { 
            all: products.length,
            best: Math.min(20, products.length) // Top 20 best products
        };
        products.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return counts;
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by category
        if (selectedCategory === "best") {
            const top20 = [...result].sort((a, b) => b.reviews - a.reviews).slice(0, 20);
            const ids = new Set(top20.map(p => p.id));
            const extra = result.filter(p => p.isBest && !ids.has(p.id));
            result = [...extra, ...top20].sort((a, b) => {
                if (a.isBest && !b.isBest) return -1;
                if (!a.isBest && b.isBest) return 1;
                return b.reviews - a.reviews;
            });
        } else if (selectedCategory !== "all") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Filter by line
        if (selectedLine !== "all") {
            result = result.filter(p => p.line === selectedLine);
        }

        // Sort (only if not "best" which is pre-sorted)
        if (selectedCategory !== "best") {
            switch (sortOption) {
                case "price-low":
                    result.sort((a, b) => a.price - b.price);
                    break;
                case "price-high":
                    result.sort((a, b) => b.price - a.price);
                    break;
                case "rating":
                    result.sort((a, b) => b.rating - a.rating);
                    break;
                case "reviews":
                    result.sort((a, b) => b.reviews - a.reviews);
                    break;
                case "newest":
                    result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
                    break;
                default: // popularity - by reviews
                    result.sort((a, b) => b.reviews - a.reviews);
            }
        }

        return result;
    }, [products, selectedCategory, selectedLine, sortOption]);

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category === "all") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        setSearchParams(params, { replace: true });
    };

    const handleLineChange = (line: string) => {
        const params = new URLSearchParams(searchParams);
        if (line === "all") {
            params.delete("line");
        } else {
            params.set("line", line);
        }
        setSearchParams(params, { replace: true });
    };

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortOption)?.label || "Популярности";

    return (
        <div className="min-h-screen bg-white font-circe">
            <TopBanner />
            <Header />

            <main className="pt-12 md:pt-20">
                <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-[68px]">
                    {/* Category Tabs with Counts */}
                    <div className="mb-8 md:mb-12">
                        <div className="border-b border-gray-200 overflow-x-auto">
                            <div className="flex justify-center min-w-min">
                                {CATEGORIES.filter(cat => categoryCounts[cat.id] > 0 || cat.id === "all").map((category, index, arr) => {
                                    const isActive = selectedCategory === category.id;
                                    const count = categoryCounts[category.id] || 0;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryChange(category.id)}
                                            className={`
                                                flex-shrink-0 px-3 sm:px-5 h-11 text-[10px] sm:text-[12px] font-circe
                                                transition-all duration-200 flex items-center justify-center gap-1
                                                ${isActive
                                                    ? "border border-gray-300 bg-white text-black font-medium"
                                                    : "border-t border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                                }
                                                ${index === 0 ? "border-l" : ""}
                                                ${index === arr.length - 1 ? "border-r" : ""}
                                            `}
                                        >
                                            {category.label}
                                            <span className={`text-[9px] ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                                                ({count})
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar - Lines Only */}
                        <aside className="hidden lg:block w-56 flex-shrink-0">
                            {/* Lines */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold font-circe mb-4 text-heimish-dark">
                                    ЛИНЕЙКИ
                                </h3>
                                <ul className="space-y-2">
                                    {FILTER_LINES.map((line) => (
                                        <li key={line.id}>
                                            <button
                                                onClick={() => handleLineChange(line.id)}
                                                className={`text-sm font-circe transition-colors ${selectedLine === line.id
                                                    ? "text-heimish-black font-medium"
                                                    : "text-gray-500 hover:text-heimish-dark"
                                                    }`}
                                            >
                                                {line.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Page Title and Sort */}
                            <div className="mb-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h1 className="text-black text-2xl sm:text-3xl md:text-[40px] font-bold font-circe leading-tight tracking-wide">
                                            {selectedCategory === "all" ? "ВСЕ ТОВАРЫ" : selectedCategory === "best" ? "ЛУЧШЕЕ" : selectedCategory.toUpperCase()}
                                        </h1>
                                        <p className="text-gray-500 text-sm mt-2">
                                            {filteredProducts.length} товаров
                                        </p>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-heimish-dark text-sm font-circe hover:bg-gray-50 transition-colors rounded">
                                                <span>Сортировка: {currentSortLabel}</span>
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="bg-white border-gray-200"
                                        >
                                            {SORT_OPTIONS.map((option) => (
                                                <DropdownMenuItem
                                                    key={option.value}
                                                    className="text-sm font-circe cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                                                    onClick={() => setSortOption(option.value)}
                                                >
                                                    {option.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Mobile Filters */}
                                <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white text-sm font-circe rounded whitespace-nowrap">
                                                <span>Линейка</span>
                                                <ChevronDown className="w-3 h-3" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-white">
                                            {FILTER_LINES.map((line) => (
                                                <DropdownMenuItem
                                                    key={line.id}
                                                    onClick={() => handleLineChange(line.id)}
                                                    className="text-sm cursor-pointer"
                                                >
                                                    {line.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Product Grid */}
                                {loading ? (
                                    <div className="text-center py-20">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-heimish-dark" />
                                        <p className="mt-4 text-gray-500">Загрузка товаров...</p>
                                    </div>
                                ) : filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                        {filteredProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <p className="text-gray-500 text-lg">Товары не найдены</p>
                                        <button
                                            onClick={() => {
                                                handleCategoryChange("all");
                                                handleLineChange("all");
                                            }}
                                            className="mt-4 text-heimish-dark underline"
                                        >
                                            Сбросить фильтры
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <CookieBanner />
        </div>
    );
}
