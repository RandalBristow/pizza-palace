import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Save,
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
import ImageSelector from "../ui/image-selector";
import { useImages } from "../../hooks/useSupabase";

export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  order: number;
}

interface CarouselFormProps {
  carouselImages: CarouselImage[];
  createCarouselImage: (carouselImage: any) => Promise<any>;
  updateCarouselImage: (id: string, updates: any) => Promise<any>;
  deleteCarouselImage: (id: string) => Promise<void>;
}

export default function CarouselForm({
  carouselImages,
  createCarouselImage,
  updateCarouselImage,
  deleteCarouselImage
}: CarouselFormProps) {
  const [isAddingCarouselImage, setIsAddingCarouselImage] = useState(false);
  const [editingCarouselImage, setEditingCarouselImage] =
    useState<CarouselImage | null>(null);
  const { images } = useImages();
  const [newCarouselImage, setNewCarouselImage] = useState({
    url: "",
    title: "",
    subtitle: "",
    order: 1,
    isActive: true,
  });
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);

  const handleAddCarouselImage = async () => {
    try {
      await createCarouselImage(newCarouselImage);
      setIsAddingCarouselImage(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create carousel image:', error);
    }
  };

  const handleEditCarouselImage = (carouselImage: CarouselImage) => {
    setEditingCarouselImage(carouselImage);
    setNewCarouselImage({
      url: carouselImage.url || "",
      title: carouselImage.title || "",
      subtitle: carouselImage.subtitle || "",
      order: carouselImage.order || 1,
      isActive: carouselImage.isActive ?? true,
    });
  };

  const handleUpdateCarouselImage = async () => {
    if (!editingCarouselImage) return;

    try {
      await updateCarouselImage(editingCarouselImage.id, newCarouselImage);
      setEditingCarouselImage(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update carousel image:', error);
    }
  };

  const handleDeleteCarouselImage = async (id: string) => {
    try {
      await deleteCarouselImage(id);
    } catch (error) {
      console.error('Failed to delete carousel image:', error);
    }
  };

  const toggleCarouselImageStatus = async (id: string) => {
    const image = carouselImages.find(img => img.id === id);
    if (!image) return;

    try {
      await updateCarouselImage(id, { ...image, isActive: !image.isActive });
    } catch (error) {
      console.error('Failed to toggle carousel image status:', error);
    }
  };

  const resetForm = () => {
    setNewCarouselImage({
      url: "",
      title: "",
      subtitle: "",
      order: 1,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Carousel Images</h2>
        <Dialog
          open={isAddingCarouselImage}
          onOpenChange={setIsAddingCarouselImage}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Carousel Image</DialogTitle>
              <DialogDescription>
                Add a new image to the homepage carousel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={newCarouselImage.url}
                  onChange={(e) =>
                    setNewCarouselImage({
                      ...newCarouselImage,
                      url: e.target.value,
                    })
                  }
                />
              </div>
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
                  onClick={() => {
                    setIsAddingCarouselImage(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCarouselImage}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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

      {/* Edit Carousel Image Dialog */}
      <Dialog
        open={editingCarouselImage !== null}
        onOpenChange={(open) => !open && setEditingCarouselImage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Carousel Image</DialogTitle>
            <DialogDescription>
              Update the carousel image details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editImageUrl">Image URL</Label>
              <Input
                id="editImageUrl"
                placeholder="https://example.com/image.jpg"
                value={newCarouselImage.url}
                onChange={(e) =>
                  setNewCarouselImage({
                    ...newCarouselImage,
                    url: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="editImageTitle">Title</Label>
              <Input
                id="editImageTitle"
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
              <Label htmlFor="editImageSubtitle">Subtitle</Label>
              <Input
                id="editImageSubtitle"
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
              <Label htmlFor="editImageOrder">Display Order</Label>
              <Input
                id="editImageOrder"
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
                onClick={() => {
                  setEditingCarouselImage(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCarouselImage}>
                <Save className="h-4 w-4 mr-2" />
                Update Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
