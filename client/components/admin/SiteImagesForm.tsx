import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import SiteImageDialog from "../dialog_components/SiteImageDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Upload, Search } from "lucide-react";
import ActivationButton from "../shared_components/ActivationButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import ImageCard from "../shared_components/ImageCard";

export interface Image {
  id: string;
  name: string;
  storagePath?: string;
  url?: string;
  altText?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  isActive: boolean;
}

interface ImageManagerFormProps {
  images: Image[];
  uploadImageFile: (file: File, name: string) => Promise<any>;
  createImageFromUrl: (
    url: string,
    name: string,
    altText?: string,
  ) => Promise<any>;
  updateImage: (id: string, updates: any) => Promise<any>;
  deleteImage: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function ImageManagerForm({
  images,
  uploadImageFile,
  createImageFromUrl,
  updateImage,
  deleteImage,
  showTitle = true,
  hideAddButton = false,
}: ImageManagerFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [thumbnailSize, setThumbnailSize] = useState<
    "small" | "medium" | "large"
  >("medium");
  // Confirm handled by shared DeleteButton

  const handleEditImage = (image: Image) => {
    setEditingImage(image);
    setIsDialogOpen(true);
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage(id);
    } catch (error) {
      let errorMessage = "Failed to delete image";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("error" in error && typeof error.error === "string") {
          errorMessage = error.error;
        } else if ("details" in error && typeof error.details === "string") {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to delete image: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error("Failed to delete image:", error);
    }
  };

  const toggleImageStatus = async (id: string) => {
    const image = images.find((img) => img.id === id);
    if (!image) return;

    try {
      await updateImage(id, { ...image, isActive: !image.isActive });
    } catch (error) {
      let errorMessage = "Failed to toggle image status";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("error" in error && typeof error.error === "string") {
          errorMessage = error.error;
        } else if ("details" in error && typeof error.details === "string") {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to toggle image status: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error("Failed to toggle image status:", error);
    }
  };

  const getThumbnailSize = () => {
    switch (thumbnailSize) {
      case "small":
        return "w-20 h-20";
      case "medium":
        return "w-32 h-32";
      case "large":
        return "w-48 h-48";
      default:
        return "w-32 h-32";
    }
  };

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  return (
    <div className="space-y-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Image Manager
          </h2>
        )}
        <div className="flex-1 ml-6">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              style={{ color: "var(--muted-foreground)" }}
            />
            <Input
              placeholder="Search images by name..."
              value={searchFilter || ""}
              onChange={(e) => setSearchFilter(e.target.value || "")}
              className="pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2 ml-8">
            <Label style={{ color: "var(--foreground)" }}>
              Thumbnail Size:
            </Label>
            <Select
              value={thumbnailSize}
              onValueChange={(value: "small" | "medium" | "large") =>
                setThumbnailSize(value || "medium")
              }
            >
              <SelectTrigger
                className="w-32 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
                style={{
                  backgroundColor: "var(--input)",
                  borderColor: "var(--border)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                }}
              >
                <SelectItem
                  value="small"
                  style={{ color: "var(--popover-foreground)" }}
                >
                  Small
                </SelectItem>
                <SelectItem
                  value="medium"
                  style={{ color: "var(--popover-foreground)" }}
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="large"
                  style={{ color: "var(--popover-foreground)" }}
                >
                  Large
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <ImageCard
            key={image.id}
            imageUrl={image.url}
            alt={image.altText || image.name}
            title={image.name}
            isActive={image.isActive}
            thumbClassName={getThumbnailSize()}
            onImageError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
            }}
            rightActions={
              <>
                <ActivationButton
                  isActive={image.isActive}
                  onToggle={() => toggleImageStatus(image.id)}
                  activeTooltip="Deactivate"
                  inactiveTooltip="Activate"
                />
                <EditButton label="Edit Image" onClick={() => handleEditImage(image)} />
                <DeleteButton
                  entityTitle="Image"
                  subjectName={image.name}
                  tooltipWhenAllowed="Delete Image"
                  tooltipWhenBlocked="Cannot Delete"
                  onConfirm={() => handleDeleteImage(image.id)}
                />
              </>
            }
          />
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <Upload
            className="h-16 w-16 mx-auto mb-4"
            style={{ color: "var(--muted-foreground)" }}
          />
          <h3
            className="text-lg font-medium mb-2"
            style={{ color: "var(--card-foreground)" }}
          >
            {searchFilter ? "No images found" : "No images uploaded"}
          </h3>
          <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
            {searchFilter
              ? "Try adjusting your search term"
              : "Get started by uploading your first image"}
          </p>
          {!searchFilter && !hideAddButton && (
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
              Add Your First Image
            </Button>
          )}
        </div>
      )}

      <SiteImageDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingImage(null);
        }}
        image={editingImage}
        uploadImageFile={uploadImageFile}
        createImageFromUrl={createImageFromUrl}
        updateImage={updateImage}
      />

      {/* Delete handled by shared DeleteButton in each ImageCard */}
    </div>
  );
}
