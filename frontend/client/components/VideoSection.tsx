import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function VideoSection() {
  const { t } = useTranslation();

  return (
    <section className="w-full">
      <div className="w-full max-w-none lg:max-w-[1024px] xl:w-full max-w-none mx-auto flex items-center flex-col lg:flex-row">
        {/* Video/Image Side - Fixed 450px width on desktop/tablet */}
        <div className="flex-shrink-0 w-full lg:w-[450px] h-[500px] lg:h-[600px] bg-black overflow-hidden relative">
          <iframe
            src="https://player.vimeo.com/video/922256344?h=24b5d6b9dd&autoplay=1&loop=1&title=0&byline=0&portrait=0&background=1&muted=1"
            className="absolute top-1/2 left-1/2 w-[177.77%] h-full min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Heimish Brand Video"
          />
        </div>

        {/* Content Side - Remaining width */}
        <div className="w-full lg:flex-grow flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 md:py-16 lg:py-0 lg:px-8 bg-white h-auto lg:h-[600px]">
          <div className="text-center max-w-sm space-y-8">
            <h2 className="text-2xl sm:text-3xl font-poppins text-heimish-black tracking-wide leading-loose">
              {t("video.title")}
            </h2>

            <p className="text-base sm:text-lg font-sans font-light text-heimish-black leading-relaxed tracking-wide whitespace-pre-line">
              {t("video.description")}
            </p>

            <Link
              to="/product/new-moringa-ceramide-bb-cream-spf30-pa-53g-1-87oz"
              className="inline-block px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base lg:px-10 lg:py-4 border border-heimish-black font-poppins text-heimish-black hover:bg-heimish-black hover:text-white transition-colors"
            >
              {t("video.button")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
