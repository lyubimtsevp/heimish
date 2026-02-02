import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="relative bg-heimish-blue w-full">
      <div className="w-full py-1.5 sm:py-2 text-center">
        <a
          href="#kakao"
          className="text-xs sm:text-sm font-poppins text-heimish-black hover:underline"
        >
          {t("top_banner.text")}
        </a>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Close banner"
      >
        <X className="w-4 h-4 text-heimish-black" />
      </button>
    </div>
  );
}
