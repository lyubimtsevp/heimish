import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const COOKIE_CONSENT_KEY = "heimish_cookie_consent";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useTranslation();

  // Check localStorage on mount
  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "dismissed");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="w-full max-w-none mx-auto px-5 relative">
        <div className="bg-white border border-gray-200 shadow-[0_-8px_16px_0_rgba(0,0,0,0.08)] absolute bottom-0 right-5 w-[600px] max-w-[calc(100vw-40px)] pointer-events-auto">
          {/* Header Bar */}
          <div className="flex justify-end border-b border-gray-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-1 text-xs font-poppins text-heimish-gray-dark"
            >
              {t("cookie.close")}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
              />
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 hover:bg-gray-50 transition-colors border-l border-gray-100"
              aria-label="Close banner"
            >
              <X className="w-3 h-3 text-heimish-gray-dark" />
            </button>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-base sm:text-lg font-bold font-poppins text-heimish-black mb-2 sm:mb-3">
                {t("cookie.title")}
              </h2>
              <p className="text-sm text-heimish-gray-dark leading-relaxed mb-4 sm:mb-6 font-poppins">
                <Trans i18nKey="cookie.text">
                  This service uses cookies to display information according to
                  the language you use. Please read our{" "}
                  <a
                    href="#privacy"
                    className="underline font-bold text-heimish-black hover:text-opacity-80"
                  >
                    Cookie Policy
                  </a>
                  , outlined in the Privacy Policy, regarding the use of
                  cookies.
                </Trans>
              </p>

              <div className="flex gap-2 sm:gap-3">
                <button className="px-5 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-sm border border-gray-300 bg-white text-heimish-black rounded-[5px] font-poppins font-bold hover:bg-gray-50 transition-colors">
                  {t("cookie.settings")}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-sm bg-[#1a1a1a] text-white rounded-[5px] font-poppins font-bold hover:bg-black transition-colors"
                >
                  {t("cookie.allow")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
