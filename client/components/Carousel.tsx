import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "./ui/button";

interface CarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  order: number;
}

interface CarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({
  images,
  autoPlay = true,
  interval = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Filter active images and sort by order
  const activeImages = images
    .filter((image) => image.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!isPlaying || activeImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, activeImages.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? activeImages.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === activeImages.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (activeImages.length === 0) {
    return (
      <div
        className="relative w-full h-96 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: "var(--muted)",
          borderColor: "var(--border)",
          border: "1px solid var(--border)",
        }}
      >
        <p style={{ color: "var(--muted-foreground)" }}>
          No carousel images available
        </p>
      </div>
    );
  }

  const currentImage = activeImages[currentIndex];

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-900 group">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay with gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Text Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {currentImage.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8">{currentImage.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeImages.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "var(--foreground)",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "rgba(255, 255, 255, 1)";
              target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              target.style.transform = "scale(1)";
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "var(--foreground)",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "rgba(255, 255, 255, 1)";
              target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              target.style.transform = "scale(1)";
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Play/Pause Button */}
      {activeImages.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={toggleAutoPlay}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "var(--foreground)",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = "rgba(255, 255, 255, 1)";
            target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            target.style.transform = "scale(1)";
          }}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Dot Indicators */}
      {activeImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-3 h-3 rounded-full transition-all duration-200"
              style={{
                backgroundColor:
                  index === currentIndex
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
                transform:
                  index === currentIndex ? "scale(1.2)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                  target.style.transform = "scale(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                  target.style.transform = "scale(1)";
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {activeImages.length > 1 && (
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm text-white"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          {currentIndex + 1} / {activeImages.length}
        </div>
      )}
    </div>
  );
}
