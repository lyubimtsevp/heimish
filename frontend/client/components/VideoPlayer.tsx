import { useState } from "react";
import { Play, X } from "lucide-react";

interface Video {
  id?: string;
  title?: string;
  type: "local" | "rutube" | "youtube";
  url: string;
  thumbnail?: string;
}

interface VideoPlayerProps {
  videos: Video[];
}

// Extract Rutube video ID from URL
function getRutubeId(url: string): string | null {
  const match = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function VideoPlayer({ videos }: VideoPlayerProps) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  if (!videos || videos.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Видео для этого товара пока недоступны.
      </p>
    );
  }

  const closeVideo = () => setActiveVideo(null);

  return (
    <div className="space-y-4">
      {/* Video Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {videos.map((video, index) => (
          <button
            key={video.id || index}
            onClick={() => setActiveVideo(video)}
            className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-heimish-dark transition-all"
          >
            {/* Thumbnail */}
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title || `Видео ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-500" />
              </div>
            )}
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-6 h-6 text-heimish-dark ml-1" />
              </div>
            </div>

            {/* Video Title */}
            {video.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs truncate">{video.title}</p>
              </div>
            )}

            {/* Type Badge */}
            <div className="absolute top-2 right-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                video.type === "rutube" 
                  ? "bg-red-500 text-white" 
                  : video.type === "youtube"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-white"
              }`}>
                {video.type === "rutube" ? "RuTube" : video.type === "youtube" ? "YouTube" : "Видео"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeVideo}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video Player */}
            {activeVideo.type === "local" && (
              <video
                src={activeVideo.url}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              >
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
            )}

            {activeVideo.type === "rutube" && (
              <iframe
                src={`https://rutube.ru/play/embed/${getRutubeId(activeVideo.url)}`}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="clipboard-write; autoplay"
                allowFullScreen
              />
            )}

            {activeVideo.type === "youtube" && (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=1`}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* Video Title */}
            {activeVideo.title && (
              <p className="text-white text-center mt-4 text-lg">
                {activeVideo.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


