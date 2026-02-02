import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  Star,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Mock product data
const mockProduct = {
  id: 1,
  name: "Бальзам All Clean 120мл",
  nameEn: "All Clean Balm 120ml",
  price: "18,000",
  priceRub: "1,500",
  originalPrice: "20,000",
  originalPriceRub: "1,800",
  discount: 10,
  rating: 4.8,
  reviews: 13006,
  description: `Очищающий бальзам #1 в России и Корее. Мягко удаляет макияж, включая водостойкую косметику, не раздражая кожу.

• Веганская формула
• Без минеральных масел
• pH-сбалансированный
• Подходит для чувствительной кожи`,
  descriptionEn: `#1 Cleansing Balm in Russia and Korea. Gently removes makeup including waterproof cosmetics without irritating the skin.

• Vegan formula
• No mineral oils
• pH-balanced
• Suitable for sensitive skin`,
  howToUse: `1. Нанесите небольшое количество бальзама на сухую кожу лица
2. Мягко массируйте круговыми движениями 1-2 минуты
3. Добавьте немного воды для эмульгирования
4. Тщательно смойте теплой водой
5. При необходимости используйте дополнительное средство для умывания`,
  howToUseEn: `1. Apply a small amount of balm to dry face
2. Gently massage in circular motions for 1-2 minutes
3. Add a little water to emulsify
4. Rinse thoroughly with warm water
5. Follow up with a cleanser if needed`,
  ingredients: `Cetyl Ethylhexanoate, Triethylhexanoin, Polyglyceryl-10 Dioleate, C12-15 Alkyl Benzoate, Hydrogenated Poly(C6-14 Olefin), Caprylic/Capric Triglyceride, Polyglyceryl-2 Sesquiisostearate, Shea Butter, Coconut Oil, Grape Seed Oil...`,
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
};

// Mock Q&A data
const mockQA = [
  {
    id: 1,
    question: "Подходит ли для жирной кожи?",
    questionEn: "Is it suitable for oily skin?",
    author: "Мария К.",
    date: "15.12.2025",
    answer: "Да, бальзам отлично подходит для жирной кожи! Он эффективно очищает поры и удаляет излишки себума.",
    answerEn: "Yes, the balm is perfect for oily skin! It effectively cleanses pores and removes excess sebum.",
    answerAuthor: "Heimish Official",
    answerDate: "16.12.2025",
    helpful: 24,
  },
  {
    id: 2,
    question: "Какой срок годности у продукта?",
    questionEn: "What is the shelf life?",
    author: "Анна В.",
    date: "10.12.2025",
    answer: "Срок годности — 24 месяца с даты производства. После вскрытия рекомендуем использовать в течение 12 месяцев.",
    answerEn: "Shelf life is 24 months from production date. After opening, we recommend using within 12 months.",
    answerAuthor: "Heimish Official",
    answerDate: "11.12.2025",
    helpful: 18,
  },
];

// Mock related products
const relatedProducts = [
  {
    id: 2,
    image: "/placeholder.svg",
    name: "Бальзам All Clean Мандарин 120мл",
    nameEn: "All Clean Balm Mandarin 120ml",
    price: "18,000",
    priceRub: "1,500",
    rating: 4.9,
    reviews: 792,
  },
  {
    id: 3,
    image: "/placeholder.svg",
    name: "Пенка All Clean White Clay 150г",
    nameEn: "All Clean White Clay Foam 150g",
    price: "12,000",
    priceRub: "1,000",
    rating: 4.9,
    reviews: 444,
  },
  {
    id: 4,
    image: "/placeholder.svg",
    name: "Тонер Matcha Biome 150мл",
    nameEn: "Matcha Biome Toner 150ml",
    price: "20,000",
    priceRub: "1,700",
    rating: 5,
    reviews: 54,
  },
  {
    id: 5,
    image: "/placeholder.svg",
    name: "Крем Moringa Ceramide 50мл",
    nameEn: "Moringa Ceramide Cream 50ml",
    price: "32,000",
    priceRub: "2,600",
    rating: 4.8,
    reviews: 156,
  },
];

export default function Product() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRu = i18n.language === "ru";

  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const product = mockProduct; // In real app, fetch by id

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-heimish-gray-light mb-6">
          <a href="/" className="hover:text-heimish-black">
            {isRu ? "Главная" : "Home"}
          </a>
          <span className="mx-2">/</span>
          <a href="/catalog" className="hover:text-heimish-black">
            {isRu ? "Каталог" : "Catalog"}
          </a>
          <span className="mx-2">/</span>
          <span className="text-heimish-black">
            {isRu ? product.name : product.nameEn}
          </span>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.images[currentImage]}
                alt={isRu ? product.name : product.nameEn}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImage === index
                      ? "border-heimish-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${isRu ? product.name : product.nameEn} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-poppins font-medium text-heimish-black mb-2">
                {isRu ? product.name : product.nameEn}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-heimish-gray-light">
                  ({product.reviews.toLocaleString()} {isRu ? "отзывов" : "reviews"})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-poppins font-semibold text-heimish-black">
                {isRu ? `${product.priceRub} ₽` : `${product.price}원`}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-heimish-gray-light line-through">
                  {isRu ? `${product.originalPriceRub} ₽` : `${product.originalPrice}원`}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-heimish-gray-dark whitespace-pre-line">
              {isRu ? product.description : product.descriptionEn}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-heimish-black">
                {isRu ? "Количество" : "Quantity"}
              </span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-heimish-black hover:bg-heimish-gray-dark text-white"
              >
                {isRu ? "В корзину" : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                {isRu ? "Бесплатная доставка от 3000 ₽" : "Free shipping over ₩30,000"}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                {isRu ? "Доставка 2-5 рабочих дней" : "Delivery 2-5 business days"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full justify-start border-b border-gray-200 rounded-none bg-transparent p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-heimish-black data-[state=active]:bg-transparent"
            >
              {isRu ? "Описание" : "Description"}
            </TabsTrigger>
            <TabsTrigger
              value="howto"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-heimish-black data-[state=active]:bg-transparent"
            >
              {isRu ? "Применение" : "How to Use"}
            </TabsTrigger>
            <TabsTrigger
              value="ingredients"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-heimish-black data-[state=active]:bg-transparent"
            >
              {isRu ? "Состав" : "Ingredients"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-heimish-gray-dark">
                {isRu ? product.description : product.descriptionEn}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="howto" className="pt-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-heimish-gray-dark">
                {isRu ? product.howToUse : product.howToUseEn}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="pt-6">
            <div className="prose max-w-none">
              <p className="text-heimish-gray-dark text-sm">{product.ingredients}</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Q&A Section - Like Ozon */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-poppins font-medium text-heimish-black flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {isRu ? "Вопросы о товаре" : "Product Q&A"}
              <span className="text-sm font-normal text-heimish-gray-light">
                ({mockQA.length})
              </span>
            </h2>
          </div>

          {/* Ask Question */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <Textarea
              placeholder={isRu ? "Задайте вопрос о товаре..." : "Ask a question about this product..."}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="mb-3 bg-white"
            />
            <Button disabled={!newQuestion.trim()}>
              {isRu ? "Отправить вопрос" : "Submit Question"}
            </Button>
          </div>

          {/* Q&A List */}
          <div className="space-y-6">
            {mockQA.map((qa) => (
              <div key={qa.id} className="border-b border-gray-100 pb-6">
                {/* Question */}
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {qa.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{qa.author}</span>
                        <span className="text-xs text-heimish-gray-light">{qa.date}</span>
                      </div>
                      <p className="text-heimish-black">
                        {isRu ? qa.question : qa.questionEn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Answer */}
                {qa.answer && (
                  <div className="ml-11 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-blue-700">
                        {qa.answerAuthor}
                      </span>
                      <span className="text-xs text-blue-500">{qa.answerDate}</span>
                    </div>
                    <p className="text-sm text-heimish-gray-dark">
                      {isRu ? qa.answer : qa.answerEn}
                    </p>
                    <button className="flex items-center gap-1 mt-3 text-xs text-heimish-gray-light hover:text-heimish-black transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      {isRu ? "Полезно" : "Helpful"} ({qa.helpful})
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section>
          <h2 className="text-xl font-poppins font-medium text-heimish-black mb-6">
            {isRu ? "С этим товаром покупают" : "Customers also bought"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((product) => (
              <a key={product.id} href={`/product/${product.id}`}>
                <ProductCard
                  image={product.image}
                  name={isRu ? product.name : product.nameEn}
                  price={isRu ? product.priceRub : product.price}
                  rating={product.rating}
                  reviews={product.reviews}
                />
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

