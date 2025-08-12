import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImages } from "../hooks/useSupabase";

interface CarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  imageId?: string;
  isActive: boolean;
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
  const { images: dbImages } = useImages();

  const activeImages = images.filter((img) => img.isActive);

  useEffect(() => {
    if (!autoPlay || activeImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, activeImages.length]);

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

  if (activeImages.length === 0) {
    return (
      <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No Images Available
          </h2>
          <p className="text-gray-500">
            Please add carousel images in the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const currentImage = activeImages[currentIndex];

  return (
    <div className="relative h-96 overflow-hidden rounded-lg bg-gray-900">
      {/* Sliding Images Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeImages.map((image, index) => {
          const dbImage = image.imageId
            ? dbImages.find((img) => img.id === image.imageId)
            : null;
          const imageUrl = dbImage?.url || image.url;

          return (
            <div
              key={image.id}
              className="w-full h-full flex-shrink-0 relative bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${imageUrl}')`,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              {/* Content Overlay */}
              <div className="relative h-full flex items-center justify-center text-center text-white">
                <div className="max-w-2xl mx-auto px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {image.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8">{image.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      {activeImages.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/50 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/50 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {activeImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
