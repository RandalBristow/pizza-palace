import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Plus, Edit, Trash2, ThumbsUp, ThumbsDown, Image as ImageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import CarouselImageDialog from "../dialog_components/CarouselImageDialog";
import ActivationBadge from "../shared_components/ActivationBadge";

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
  const [editingCarouselImage, setEditingCarouselImage] =
    useState<CarouselImage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
    title?: string;
  }>({ open: false, id: null });

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
    <div className="space-y-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Carousel Images
          </h2>
        )}
        {!hideAddButton && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderColor: "var(--primary)",
            }}
          >
            <Plus
              className="h-4 w-4 mr-2"
              style={{ color: "var(--primary-foreground)" }}
            />
            Add Image
          </Button>
        )}
      </div>

      {carouselImages.length === 0 ? (
        <div className="text-center py-8">
          <ImageIcon
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "var(--muted-foreground)" }}
          />
          <p style={{ color: "var(--muted-foreground)" }}>
            No carousel images yet.
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Add images to display in the homepage carousel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {carouselImages.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
              }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="object-cover w-full"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                  <div className="absolute top-2 right-2"></div>
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-start gap-2">
                    <h3
                      className="font-semibold mb-0"
                      style={{ color: "var(--muted-foreground)" }}
                      title={image.title}
                    >
                      {image.title}
                    </h3>
                    <ActivationBadge isActive={image.isActive} />
                  </div>
                  <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    {image.subtitle}
                  </p>
                  <div className="flex justify-end items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCarouselImageStatus(image.id)}
                            className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)]"
                          >
                            {image.isActive ? (
                              <ThumbsUp
                                className="h-3 w-3"
                                style={{ color: "var(--muted-foreground)" }}
                              />
                            ) : (
                              <ThumbsDown
                                className="h-3 w-3"
                                style={{ color: "var(--muted-foreground)" }}
                              />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          style={{
                            backgroundColor: "var(--popover)",
                            color: "var(--popover-foreground)",
                          }}
                        >
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
                            className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)]"
                          >
                            <Edit
                              className="h-3 w-3"
                              style={{ color: "var(--muted-foreground)" }}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          style={{
                            backgroundColor: "var(--popover)",
                            color: "var(--popover-foreground)",
                          }}
                        >
                          Edit Image
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setConfirmDelete({
                                open: true,
                                id: image.id,
                                title: image.title,
                              })
                            }
                            className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)]"
                          >
                            <Trash2
                              className="h-3 w-3"
                              style={{ color: "var(--muted-foreground)" }}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          style={{
                            backgroundColor: "var(--popover)",
                            color: "var(--popover-foreground)",
                          }}
                        >
                          Delete Image
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent
          style={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            color: "var(--popover-foreground)",
            animation: "none",
            transition: "none",
          }}
          className="border data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0"
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "var(--popover-foreground)" }}>
              Delete Image
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{ color: "var(--muted-foreground)" }}
            >
              {`Are you sure you want to delete "${confirmDelete.title || "this image"}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)]"
              onClick={() => setConfirmDelete({ open: false, id: null })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="transition-colors duration-200 hover:opacity-90"
              style={{
                backgroundColor: "var(--destructive)",
                color: "var(--destructive-foreground)",
                borderColor: "var(--destructive)",
              }}
              onClick={async () => {
                if (confirmDelete.id) {
                  await handleDeleteCarouselImage(confirmDelete.id);
                }
                setConfirmDelete({ open: false, id: null });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
