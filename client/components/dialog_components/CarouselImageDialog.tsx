
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Save } from "lucide-react";
import ImageSelector from "../ui/image-selector";

export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  imageId?: string;
  isActive: boolean;
  order: number;
}

interface CarouselImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  carouselImage?: CarouselImage | null;
  images: any[];
  createCarouselImage: (carouselImage: any) => Promise<any>;
  updateCarouselImage: (id: string, updates: any) => Promise<any>;
}

export default function CarouselImageDialog({
  isOpen,
  onClose,
  carouselImage,
  images,
  createCarouselImage,
  updateCarouselImage,
}: CarouselImageDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);
  const [newCarouselImage, setNewCarouselImage] = useState({
    url: "",
    title: "",
    subtitle: "",
    imageId: undefined,
    order: 1,
    isActive: true,
  });

  const isEdit = !!carouselImage;

  useEffect(() => {
    if (carouselImage) {
      setNewCarouselImage({
        url: carouselImage.url || "",
        title: carouselImage.title || "",
        subtitle: carouselImage.subtitle || "",
        imageId: carouselImage.imageId,
        order: carouselImage.order || 1,
        isActive: carouselImage.isActive ?? true,
      });
      
      // Find the image ID from the URL
      const selectedImage = images.find((img) => img.url === carouselImage.url);
      setSelectedImageId(selectedImage?.id || carouselImage.imageId);
    } else {
      resetForm();
    }
  }, [carouselImage, images]);

  const handleSave = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (isEdit) {
        await updateCarouselImage(carouselImage!.id, {
          ...newCarouselImage,
          imageId: selectedImageId,
        });
      } else {
        await createCarouselImage({
          ...newCarouselImage,
          imageId: selectedImageId,
        });
      }

      onClose();
      resetForm();
    } catch (error) {
      let errorMessage = isEdit ? "Failed to update carousel image" : "Failed to create carousel image";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setError(errorMessage);
      console.error(`Failed to ${isEdit ? "update" : "create"} carousel image:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewCarouselImage({
      url: "",
      title: "",
      subtitle: "",
      imageId: undefined,
      order: 1,
      isActive: true,
    });
    setSelectedImageId(undefined);
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Carousel Image" : "Add Carousel Image"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the carousel image details" : "Add a new image to the homepage carousel"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ImageSelector
            images={images}
            selectedImageId={selectedImageId}
            onImageSelect={(imageId, imageUrl) => {
              setSelectedImageId(imageId);
              setNewCarouselImage({
                ...newCarouselImage,
                url: imageUrl || "",
              });
            }}
            label="Carousel Image"
            placeholder="Select an image..."
            required={true}
            showPreview={false}
          />

          <div>
            <Label htmlFor="imageTitle">Title</Label>
            <Input
              id="imageTitle"
              placeholder="Image title"
              value={newCarouselImage.title}
              onChange={(e) =>
                setNewCarouselImage({
                  ...newCarouselImage,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="imageSubtitle">Subtitle</Label>
            <Input
              id="imageSubtitle"
              placeholder="Image subtitle"
              value={newCarouselImage.subtitle}
              onChange={(e) =>
                setNewCarouselImage({
                  ...newCarouselImage,
                  subtitle: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="imageOrder">Display Order</Label>
            <Input
              id="imageOrder"
              type="number"
              placeholder="1"
              value={newCarouselImage.order}
              onChange={(e) =>
                setNewCarouselImage({
                  ...newCarouselImage,
                  order: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : isEdit ? "Update Image" : "Save Image"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

