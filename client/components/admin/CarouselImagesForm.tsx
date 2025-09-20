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
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        {showTitle && <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Carousel Images</h2>}
        {!hideAddButton && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderColor: 'var(--primary)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-1px)';
              target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
          >
            <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
            Add Image
          </Button>
        )}
      </div>

      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Manage images that appear in the homepage carousel.
        </p>
        {carouselImages.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
            <p style={{ color: 'var(--muted-foreground)' }}>No carousel images yet.</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Add images to display in the homepage carousel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carouselImages.map((image) => (
              <div key={image.id} className="rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>{image.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{image.subtitle}</p>
                <div className="mt-2 flex justify-between items-center">
                  <Badge
                    style={{
                      backgroundColor: image.isActive ? '#bbf7d0' : '#fecaca',
                      color: image.isActive ? '#14532d' : '#991b1b',
                      border: '1px solid var(--border)'
                    }}
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
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--muted-foreground)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--accent)';
                              target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--card)';
                              target.style.transform = 'scale(1)';
                            }}
                          >
                            {image.isActive ? (
                              <ThumbsUp className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                            ) : (
                              <ThumbsDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
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
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--muted-foreground)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--accent)';
                              target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--card)';
                              target.style.transform = 'scale(1)';
                            }}
                          >
                            <Edit className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Edit Image</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCarouselImage(image.id)}
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--muted-foreground)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--accent)';
                              target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--card)';
                              target.style.transform = 'scale(1)';
                            }}
                          >
                            <Trash2 className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Delete Image</TooltipContent>
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
