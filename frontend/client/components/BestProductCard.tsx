import { Link } from "react-router-dom";

interface BestProductCardProps {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  price: string;
  reviewCount: number;
  points: string;
  soldOut?: boolean;
}

export default function BestProductCard({
  id,
  image,
  title,
  subtitle,
  price,
  reviewCount,
  points,
  soldOut = false,
}: BestProductCardProps) {
  return (
    <div className="flex flex-col gap-[19px] pb-0.5">
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {soldOut && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
               <span className="bg-black text-white px-3 py-1 text-sm font-medium">
                 Нет в наличии
               </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <Link to={`/product/${id}`} className="block">
        <div className="space-y-3">
          {/* Title */}
          <div className="min-h-[44px]">
            <h3 className="text-gray-600 text-base font-medium font-circe leading-[22.86px] line-clamp-2">
              {title}
              {subtitle && (
                <>
                  <span className="inline-flex items-center mx-1">
                    <svg width="16" height="21" viewBox="0 0 17 21" fill="none">
                      <path
                        d="M3.78098 8.93051H1.89062V10.917H3.78098V8.93051ZM8.95544 8.93051H7.06508V10.917H8.95544V8.93051ZM14.1299 8.93051H12.2395V10.917H14.1299V8.93051Z"
                        fill="#5E5F61"
                      />
                    </svg>
                  </span>
                  <br />
                  {subtitle}
                </>
              )}
            </h3>
          </div>

          {/* Price */}
          <div className="border-b border-gray-200 pb-2.5">
            <div className="flex items-center gap-1.5">
              <p className="text-gray-600 text-[15px] font-rubik font-normal leading-[21.43px]">
                {price}
              </p>
              {soldOut && (
                <span className="text-red-500 text-[13px] font-rubik leading-[18.57px]">
                  (Нет в наличии)
                </span>
              )}
            </div>
          </div>

          {/* Reviews & Points */}
          <div className="flex items-center gap-1.5">
            <img
              src="/icons/star.svg"
              alt="reviews"
              className="w-[19px] h-[17px]"
            />
            <p className="text-gray-500 text-sm italic font-rubik leading-5">
              Отзывов {reviewCount.toLocaleString()} / Баллов {points}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
