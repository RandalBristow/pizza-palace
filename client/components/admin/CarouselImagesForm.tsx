import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CarouselImageDialog from "../dialog_components/CarouselImageDialog";

export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  imageId?: string;
  isActive: boolean;
  order: number;
}

interface CarouselFormProps {
  carouselImages: CarouselImage[];
  images?: any[];
  createCarouselImage: (carouselImage: any) => Promise<any>;
  updateCarouselImage: (id: string, updates: any) => Promise<any>;
  deleteCarouselImage: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function CarouselForm({
  carouselImages,
  images = [],
  createCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
  showTitle = true,
  hideAddButton = false,
}: CarouselFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCarouselImage, setEditingCarouselImage] = useState<CarouselImage | null>(null);

  const handleEditCarouselImage = (carouselImage: CarouselImage) => {
    setEditingCarouselImage(carouselImage);
    setIsDialogOpen(true);
  };

  const handleDeleteCarouselImage = async (id: string) => {
    try {
      await deleteCarouselImage(id);
    } catch (error) {
      console.error("Failed to delete carousel image:", error);
    }
  };

  const toggleCarouselImageStatus = async (id: string) => {
    const image = carouselImages.find((img) => img.id === id);
    if (!image) return;

    try {
      await updateCarouselImage(id, { ...image, isActive: !image.isActive });
    } catch (error) {
      console.error("Failed to toggle carousel image status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {showTitle && <h2 className="text-xl font-semibold">Carousel Images</h2>}
        {!hideAddButton && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600 mb-4">
          Manage images that appear in the homepage carousel.
        </p>
        {carouselImages.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No carousel images yet.</p>
            <p className="text-sm text-gray-400">
              Add images to display in the homepage carousel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carouselImages.map((image) => (
              <div key={image.id} className="border rounded-lg p-4">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-semibold">{image.title}</h3>
                <p className="text-sm text-gray-600">{image.subtitle}</p>
                <div className="mt-2 flex justify-between items-center">
                  <Badge
                    className={
                      image.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {image.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCarouselImageStatus(image.id)}
                          >
                            {image.isActive ? (
                              <ThumbsUp className="h-4 w-4" />
                            ) : (
                              <ThumbsDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {image.isActive ? "Deactivate" : "Activate"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCarouselImage(image)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Image</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCarouselImage(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Image</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CarouselImageDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCarouselImage(null);
        }}
        carouselImage={editingCarouselImage}
        images={images}
        createCarouselImage={createCarouselImage}
        updateCarouselImage={updateCarouselImage}
      />
    </div>
  );
}
