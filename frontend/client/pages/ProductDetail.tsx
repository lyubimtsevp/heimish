import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import TopBanner from "@/components/TopBanner";
import VideoPlayer from "@/components/VideoPlayer";
import AuthModal from "@/components/AuthModal";
import { ChevronLeft, ChevronRight, Minus, Plus, Heart, Share2, ChevronDown, Play, Loader2, Star, MessageCircleQuestion, Check, PenLine, LogIn } from "lucide-react";
import { Product } from "@/types/product";
import { fetchProductById, fetchAllProducts, fetchProductReviews, fetchProductQuestions, createReview, createQuestion } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Types for reviews and questions
interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    isVerified: boolean;
    createdAt: string;
}

interface Question {
    id: string;
    author: string;
    question: string;
    answer: string | null;
    createdAt: string;
}

// Format price with thousands separator
function formatPrice(price: number): string {
    return price.toLocaleString("ru-RU") + " ₽";
}

// Format date
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

// Accordion Item Component
function AccordionItem({
    title,
    children,
    isOpen,
    onToggle
}: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 text-left hover:text-heimish-dark transition-colors"
            >
                <span className="text-sm font-medium tracking-wide">{title}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
                {children}
            </div>
        </div>
    );
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-heimish-dark">{review.author}</span>
                        {review.isVerified && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" />
                                Покупка подтверждена
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                            />
                        ))}
                    </div>
                </div>
                <span className="text-sm text-gray-400">{formatDate(review.createdAt)}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{review.text}</p>
        </div>
    );
}

// Question Card Component
function QuestionCard({ question }: { question: Question }) {
    return (
        <div className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircleQuestion className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-heimish-dark">{question.author}</span>
                        <span className="text-sm text-gray-400">{formatDate(question.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{question.question}</p>
                </div>
            </div>
            {question.answer && (
                <div className="ml-11 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-heimish-dark">Ответ магазина</span>
                    </div>
                    <p className="text-gray-600 text-sm">{question.answer}</p>
                </div>
            )}
        </div>
    );
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user, isAuthenticated, token } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState<string | null>("description");
    const [product, setProduct] = useState<Product | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
    const [questionForm, setQuestionForm] = useState({ question: "" });
    const [submitting, setSubmitting] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [simpleRating, setSimpleRating] = useState(5);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

    // Open auth modal
    const openAuthModal = (mode: "login" | "register" = "login") => {
        setAuthModalMode(mode);
        setShowAuthModal(true);
    };

    // Handle simple rating submission (requires auth)
    const handleSimpleRate = async () => {
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }
        if (!product) return;
        
        setSubmitting(true);
        const success = await createReview({
            productId: product.id,
            author: user?.username || "Аноним",
            rating: simpleRating,
            text: "",
        });
        setSubmitting(false);
        if (success) {
            toast.success("Спасибо за вашу оценку!");
            setShowRatingModal(false);
            fetchProductReviews(product.id).then(setReviews);
        } else {
            toast.error("Ошибка при отправке оценки");
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }
        if (!product?.id) return;
        
        setSubmitting(true);
        try {
            const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://heimish.ru/strapi-api";
            const response = await fetch(`${STRAPI_URL}/api/reviews`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({
                    data: {
                        author: user?.username || "Пользователь",
                        rating: reviewForm.rating,
                        text: reviewForm.text,
                        product: product.id,
                        isVerified: true, // Verified because user is logged in
                    },
                }),
            });
            if (response.ok) {
                setReviewForm({ rating: 5, text: "" });
                setShowReviewForm(false);
                fetchProductReviews(product.id).then(setReviews);
                toast.success("Отзыв отправлен!");
            } else {
                toast.error("Ошибка при отправке отзыва");
            }
        } catch (error) {
            console.error("Failed to submit review:", error);
            toast.error("Ошибка при отправке отзыва");
        }
        setSubmitting(false);
    };

    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }
        if (!product?.id) return;
        
        setSubmitting(true);
        try {
            const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://heimish.ru/strapi-api";
            const response = await fetch(`${STRAPI_URL}/api/questions`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({
                    data: {
                        author: user?.username || "Пользователь",
                        question: questionForm.question,
                        product: product.id,
                    },
                }),
            });
            if (response.ok) {
                setQuestionForm({ question: "" });
                setShowQuestionForm(false);
                fetchProductQuestions(product.id).then(setQuestions);
                toast.success("Вопрос отправлен!");
            } else {
                toast.error("Ошибка при отправке вопроса");
            }
        } catch (error) {
            console.error("Failed to submit question:", error);
            toast.error("Ошибка при отправке вопроса");
        }
        setSubmitting(false);
    };

    
    // Refs for scrolling
    const reviewsRef = useRef<HTMLDivElement>(null);
    const questionsRef = useRef<HTMLDivElement>(null);

    // Fetch product from API
    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            try {
                const [fetchedProduct, products] = await Promise.all([
                    fetchProductById(id || ""),
                    fetchAllProducts()
                ]);
                setProduct(fetchedProduct);
                setAllProducts(products);
                
                // Fetch reviews and questions
                if (fetchedProduct) {
                    const [productReviews, productQuestions] = await Promise.all([
                        fetchProductReviews(id || ""),
                        fetchProductQuestions(id || "")
                    ]);
                    setReviews(productReviews);
                    setQuestions(productQuestions);
                }
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    // Related products
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return allProducts
            .filter(p => p.id !== id && (p.category === product.category || p.line === product.line))
            .slice(0, 4);
    }, [product, allProducts, id]);

    // Scroll to reviews section
    const scrollToReviews = () => {
        setActiveTab("reviews");
        reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Scroll to questions section
    const scrollToQuestions = () => {
        setActiveTab("questions");
        reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white font-circe">
                <TopBanner />
                <Header />
                <main className="pt-20 pb-20">
                    <div className="max-w-[1440px] mx-auto px-4 text-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-heimish-dark" />
                        <p className="mt-4 text-gray-500">Загрузка товара...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white font-circe">
                <TopBanner />
                <Header />
                <main className="pt-20 pb-20">
                    <div className="max-w-[1440px] mx-auto px-4 text-center">
                        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
                        <Link to="/all" className="text-heimish-dark underline">
                            Вернуться к каталогу
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const images = product.images.length > 0 ? product.images : ["https://placehold.co/600x600/f5f5f5/666?text=No+Image"];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    const decreaseQuantity = () => { if (quantity > 1) setQuantity(quantity - 1); };
    const increaseQuantity = () => setQuantity(quantity + 1);
    
    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product.id,
                documentId: product.id,
                name: product.title,
                image: product.images[0] || "",
                price: product.price,
            }, quantity);
            toast.success("Товар добавлен в корзину", {
                action: {
                    label: "Перейти",
                    onClick: () => navigate("/cart"),
                },
            });
        }
    };

    // Clean HTML from description
    const cleanDescription = product.description
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();

    const toggleAccordion = (key: string) => {
        setOpenAccordion(openAccordion === key ? null : key);
    };

    // Calculate review stats
    const reviewsCount = reviews.length || product.reviews || 0;
    const questionsCount = questions.length;

    return (
        <div className="min-h-screen bg-white font-circe">
            <TopBanner />
            <Header />

            <main className="pt-12 md:pt-20 pb-20">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[68px]">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm">
                        <ol className="flex items-center gap-2 text-gray-500">
                            <li><Link to="/" className="hover:text-heimish-dark">Главная</Link></li>
                            <li className="text-gray-300">/</li>
                            <li><Link to="/all" className="hover:text-heimish-dark">Каталог</Link></li>
                            <li className="text-gray-300">/</li>
                            <li><Link to={`/all?category=${product.category}`} className="hover:text-heimish-dark">{product.category}</Link></li>
                        </ol>
                    </nav>

                    {/* Product Section - Two Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
                        {/* Left Column - Image Gallery */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-gray-50 overflow-hidden group mb-4">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Discount Badge */}
                                {product.oldPrice && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 font-medium">
                                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all ${currentImageIndex === idx
                                                ? "border-heimish-dark"
                                                : "border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            <img loading="lazy" decoding="async" src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Right Column - Product Info */}
                        <div>
                            {/* Line Badge */}
                            <Link
                                to={`/all?line=${product.line}`}
                                className="inline-block text-xs text-gray-500 uppercase tracking-wider mb-3 hover:text-heimish-dark transition-colors"
                            >
                                {product.line}
                            </Link>

                            {/* Title */}
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-heimish-dark leading-tight mb-4">
                                {product.title}
                            </h1>

                            {/* Rating & Reviews/Questions Buttons (like Ozon) */}
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <button
                                    onClick={scrollToReviews}
                                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                                >
                                    {reviewsCount > 0 ? (
                                        <>
                                            <div className="flex items-center">
                                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                <span className="ml-1 font-medium">{product.rating}</span>
                                            </div>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600 hover:text-blue-600">
                                                {reviewsCount} {reviewsCount === 1 ? "отзыв" : reviewsCount < 5 ? "отзыва" : "отзывов"}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-gray-400">Пока нет отзывов</span>
                                    )}
                                </button>
                                <button
                                    onClick={scrollToQuestions}
                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <MessageCircleQuestion className="w-5 h-5" />
                                    <span>{questionsCount} {questionsCount === 1 ? "вопрос" : questionsCount < 5 ? "вопроса" : "вопросов"}</span>
                                </button>
                            </div>

                            {/* Verified Badge */}
                            <div className="flex items-center gap-2 text-green-600 mb-6">
                                <Check className="w-5 h-5" />
                                <span className="text-sm font-medium">Оригинальный товар</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className={`text-2xl md:text-3xl font-bold ${product.oldPrice ? "text-red-500" : "text-heimish-dark"}`}>
                                        {formatPrice(product.price * quantity)}
                                    </span>
                                    {product.oldPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            {formatPrice(product.oldPrice * quantity)}
                                        </span>
                                    )}
                                    {quantity > 1 && (
                                        <span className="text-sm text-gray-500">
                                            ({formatPrice(product.price)} × {quantity})
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    + {Math.round(product.price * quantity * 0.05)} ₽ бонусов на ваш счёт
                                </p>
                            </div>

                            {/* Stock Status */}
                            <div className={`flex items-center gap-2 text-sm font-medium mb-6 ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                                <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></span>
                                {product.inStock ? "В наличии" : "Нет в наличии"}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-gray-300 rounded-sm">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 h-11 font-medium text-sm tracking-wide text-white rounded-sm transition-colors shadow-md hover:shadow-lg ${product.inStock
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={!product.inStock}
                                >
                                    {product.inStock ? "ДОБАВИТЬ В КОРЗИНУ" : "НЕТ В НАЛИЧИИ"}
                                </button>

                                {/* Wishlist & Share */}
                                <div className="flex gap-2">
                                    <button className="w-11 h-11 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <button className="w-11 h-11 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info Accordions */}
                            <div className="border-t border-gray-200">
                                <AccordionItem
                                    title="ОПИСАНИЕ"
                                    isOpen={openAccordion === "description"}
                                    onToggle={() => toggleAccordion("description")}
                                >
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {cleanDescription || "Описание товара будет добавлено позже."}
                                    </p>
                                </AccordionItem>

                                <AccordionItem
                                    title="СОСТАВ"
                                    isOpen={openAccordion === "ingredients"}
                                    onToggle={() => toggleAccordion("ingredients")}
                                >
                                    <p className="text-sm text-gray-500 italic">
                                        Состав продукта будет добавлен позже.
                                    </p>
                                </AccordionItem>

                                <AccordionItem
                                    title="СПОСОБ ПРИМЕНЕНИЯ"
                                    isOpen={openAccordion === "usage"}
                                    onToggle={() => toggleAccordion("usage")}
                                >
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>1. Нанесите необходимое количество на кожу</li>
                                        <li>2. Мягко помассируйте до полного впитывания</li>
                                        <li>3. Используйте утром и/или вечером</li>
                                    </ul>
                                </AccordionItem>

                                <AccordionItem
                                    title="ДОСТАВКА"
                                    isOpen={openAccordion === "delivery"}
                                    onToggle={() => toggleAccordion("delivery")}
                                >
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p><strong>Доставка:</strong> 1-3 рабочих дня по России</p>
                                        <p><strong>Бесплатная доставка:</strong> от 3 000 ₽ в ПВЗ</p>
                                    </div>
                                </AccordionItem>

                                <AccordionItem
                                    title="ВИДЕО"
                                    isOpen={openAccordion === "video"}
                                    onToggle={() => toggleAccordion("video")}
                                >
                                    <VideoPlayer
                                        videos={product.videos || []}
                                    />
                                </AccordionItem>
                            </div>

                            {/* Category & Line Tags */}
                            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-2">
                                <Link
                                    to={`/all?category=${product.category}`}
                                    className="px-3 py-1 bg-gray-100 text-xs text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    {product.category}
                                </Link>
                                <Link
                                    to={`/all?line=${product.line}`}
                                    className="px-3 py-1 bg-gray-100 text-xs text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    {product.line}
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Description Section - Outside grid */}

                    {/* Reviews & Questions Section */}
                    <div ref={reviewsRef} className="mb-20 scroll-mt-24">
                        {/* Tabs */}
                        <div className="flex gap-8 border-b border-gray-200 mb-8">
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`pb-4 text-lg font-medium transition-colors relative ${
                                    activeTab === "reviews"
                                        ? "text-heimish-dark"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                Отзывы ({reviewsCount})
                                {activeTab === "reviews" && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-heimish-dark"></span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("questions")}
                                className={`pb-4 text-lg font-medium transition-colors relative ${
                                    activeTab === "questions"
                                        ? "text-heimish-dark"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                Вопросы ({questionsCount})
                                {activeTab === "questions" && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-heimish-dark"></span>
                                )}
                            </button>
                        </div>

                        {/* Reviews Tab Content */}
                        {activeTab === "reviews" && (
                            <div>
                                {/* Кнопки: Оценить и Оставить отзыв */}
                                <div className="mb-6 flex flex-wrap gap-4">
                                    <button
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                openAuthModal();
                                            } else {
                                                setShowRatingModal(true);
                                            }
                                        }}
                                        className="bg-white border border-gray-300 text-heimish-dark hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Star className="w-5 h-5" />
                                        Оценить
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                openAuthModal();
                                            } else {
                                                setShowReviewForm(!showReviewForm);
                                            }
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <PenLine className="w-5 h-5" /> {showReviewForm ? "Отмена" : "Оставить отзыв"}
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5" /> Войти чтобы оставить отзыв
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Форма отзыва (только для авторизованных) */}
                                {showReviewForm && isAuthenticated && (
                                    <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg max-w-xl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-10 h-10 bg-heimish-pink/20 rounded-full flex items-center justify-center">
                                                <span className="font-bold text-heimish-dark">{user?.username?.[0]?.toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-heimish-dark">{user?.username}</p>
                                                <p className="text-xs text-gray-500">Отзыв будет опубликован от вашего имени</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Оценка</label>
                                                <div className="flex gap-2">
                                                    {[1,2,3,4,5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                                                            className="p-1 transition-transform hover:scale-110"
                                                        >
                                                            <Star className={`w-8 h-8 ${star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Ваш отзыв</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    value={reviewForm.text}
                                                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    placeholder="Расскажите о вашем опыте использования..."
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                                            >
                                                {submitting ? "Отправка..." : "Отправить отзыв"}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {reviews.length > 0 ? (
                                    <div className="max-w-3xl">
                                        {reviews.map((review) => (
                                            <ReviewCard key={review.id} review={review} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <Star className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 mb-2">Отзывов пока нет</p>
                                        <p className="text-sm text-gray-400">Будьте первым, кто оставит отзыв!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Questions Tab Content */}
                        {activeTab === "questions" && (
                            <div ref={questionsRef}>
                                {/* Кнопка задать вопрос */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                openAuthModal();
                                            } else {
                                                setShowQuestionForm(!showQuestionForm);
                                            }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <MessageCircleQuestion className="w-5 h-5" /> {showQuestionForm ? "Отмена" : "Задать вопрос"}
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5" /> Войти чтобы задать вопрос
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Форма вопроса (только для авторизованных) */}
                                {showQuestionForm && isAuthenticated && (
                                    <form onSubmit={handleSubmitQuestion} className="mb-8 p-6 bg-gray-50 rounded-lg max-w-xl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="font-bold text-blue-600">{user?.username?.[0]?.toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-heimish-dark">{user?.username}</p>
                                                <p className="text-xs text-gray-500">Вопрос будет опубликован от вашего имени</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Ваш вопрос</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={questionForm.question}
                                                    onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Что вы хотите узнать о товаре?"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                                            >
                                                {submitting ? "Отправка..." : "Отправить вопрос"}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {questions.length > 0 ? (
                                    <div className="max-w-3xl">
                                        {questions.map((question) => (
                                            <QuestionCard key={question.id} question={question} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <MessageCircleQuestion className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 mb-2">Вопросов пока нет</p>
                                        <p className="text-sm text-gray-400">Задайте первый вопрос о товаре!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 tracking-wide">ВАМ ТАКЖЕ ПОНРАВИТСЯ</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {relatedProducts.map((related) => (
                                    <Link key={related.id} to={`/product/${related.id}`} className="group">
                                        <div className="aspect-square bg-gray-50 mb-3 overflow-hidden">
                                            <img
                                                src={related.images[0]}
                                                alt={related.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <h3 className="text-sm mb-1 line-clamp-2 group-hover:text-heimish-dark transition-colors">
                                            {related.title}
                                        </h3>
                                        <p className="font-bold text-sm">{formatPrice(related.price)}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-heimish-pink/20 rounded-full flex items-center justify-center">
                                <span className="font-bold text-heimish-dark">{user?.username?.[0]?.toUpperCase()}</span>
                            </div>
                            <div>
                                <p className="font-medium text-heimish-dark">{user?.username}</p>
                                <p className="text-xs text-gray-500">Оцените товар</p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setSimpleRating(star)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${
                                            star <= simpleRating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRatingModal(false)}
                                className="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSimpleRate}
                                disabled={submitting}
                                className="flex-1 py-3 bg-heimish-dark text-white rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Отправить"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
                initialMode={authModalMode}
            />

            <Footer />
            <CookieBanner />
        </div>
    );
}
