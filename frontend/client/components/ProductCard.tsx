import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: number | string;
  documentId?: string;
  rank?: number;
  image: string;
  name: string;
  price: string;
  oldPrice?: string;
  isOnSale?: boolean;
  rating: number;
  reviews: number;
}

export default function ProductCard({
  id,
  documentId,
  rank,
  image,
  name,
  price,
  oldPrice,
  isOnSale,
  rating,
  reviews,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Удалено из избранного" : "Добавлено в избранное");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Парсим цену (убираем пробелы и преобразуем в число)
    const numericPrice = parseInt(price.replace(/\s/g, ""), 10) || 0;
    
    addToCart({
      id: String(id),
      documentId: documentId || String(id),
      name,
      image,
      price: numericPrice,
    });
    
    toast.success("Товар добавлен в корзину", {
      action: {
        label: "Перейти",
        onClick: () => navigate("/cart"),
      },
    });
  };

  return (
    <div className="group relative flex-shrink-0">
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 mb-3">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Rank Badge */}
          {rank && (
            <div className="absolute top-0 left-0 bg-black/60 text-white w-12 h-12 flex items-center justify-center">
              <span className="font-poppins text-lg">{rank}</span>
            </div>
          )}

          {/* Action Buttons - Inside image area */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors ${isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white hover:bg-heimish-dark hover:text-white"
                }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-heimish-dark text-white shadow-md flex items-center justify-center hover:bg-black transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link to={`/product/${id}`} className="block">
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-poppins text-heimish-black line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            {oldPrice ? (
              <>
                <p className="text-xs sm:text-sm font-poppins font-medium text-[#ef4444]">
                  {price} ₽
                </p>
                <p className="text-xs sm:text-sm font-poppins text-gray-400 line-through">
                  {oldPrice} ₽
                </p>
              </>
            ) : (
              <p className="text-xs sm:text-sm font-poppins font-medium text-heimish-black">
                {price} ₽
              </p>
            )}
          </div>
          {reviews > 0 ? (
            <p className="text-[10px] sm:text-xs font-poppins text-heimish-gray-light">
              ★ {rating} • {reviews} {reviews === 1 ? "отзыв" : reviews < 5 ? "отзыва" : "отзывов"}
            </p>
          ) : (
            <p className="text-[10px] sm:text-xs font-poppins text-gray-400">
              Пока нет отзывов
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
