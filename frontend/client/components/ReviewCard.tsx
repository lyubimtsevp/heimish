import { Star } from "lucide-react";

interface ReviewCardProps {
  image: string;
  productName: string;
  reviewText: string;
  rating: number;
}

export default function ReviewCard({
  image,
  productName,
  reviewText,
  rating,
}: ReviewCardProps) {
  return (
    <div className="flex-shrink-0 w-full">
      {/* Review Image */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100 mb-4 sm:mb-6">
        <img
          src={image}
          alt={productName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Review Content */}
      <div className="space-y-5">
        {/* Product Name */}
        <div className="border-b border-heimish-gray-lightest pb-3 sm:pb-5">
          <h3 className="text-lg sm:text-xl font-poppins text-heimish-black text-center line-clamp-1">
            {productName}...
          </h3>
        </div>

        {/* Review Text */}
        <p className="text-xs sm:text-sm font-sans font-light text-heimish-black text-center line-clamp-2 px-2 sm:px-4">
          {reviewText}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-heimish-black" />
          <span className="text-sm sm:text-base font-korean font-bold text-heimish-black">
            {rating}
          </span>
        </div>
      </div>
    </div>
  );
}
