import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import SiteImageDialog from "../dialog_components/SiteImageDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Upload,
  Search,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        {showTitle && <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Image Manager</h2>}
        <div className="flex-1 ml-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
            <Input
              placeholder="Search images by name..."
              value={searchFilter || ""}
              onChange={(e) => setSearchFilter(e.target.value || "")}
              className="pl-10"
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2 ml-8">
            <Label style={{ color: 'var(--foreground)' }}>Thumbnail Size:</Label>
            <Select
              value={thumbnailSize}
              onValueChange={(value: "small" | "medium" | "large") =>
                setThumbnailSize(value || "medium")
              }
            >
              <SelectTrigger 
                className="w-32"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = `0 0 0 2px var(--ring)`;
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = 'none';
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                <SelectItem value="small" style={{ color: 'var(--popover-foreground)' }}>Small</SelectItem>
                <SelectItem value="medium" style={{ color: 'var(--popover-foreground)' }}>Medium</SelectItem>
                <SelectItem value="large" style={{ color: 'var(--popover-foreground)' }}>Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.altText || image.name}
                  className={`${getThumbnailSize()} object-cover w-full`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    style={{
                      backgroundColor: image.isActive ? '#bbf7d0' : '#fecaca',
                      color: image.isActive ? '#14532d' : '#991b1b',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {image.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm truncate mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  {image.name}
                </h4>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleImageStatus(image.id)}
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
                              <ThumbsUp className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                            ) : (
                              <ThumbsDown className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
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
                            onClick={() => handleEditImage(image)}
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
                            <Edit className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Edit Image</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteImage(image.id)}
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
                          <Trash2 className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Delete Image</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--card-foreground)' }}>
            {searchFilter ? "No images found" : "No images uploaded"}
          </h3>
          <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
            {searchFilter
              ? "Try adjusting your search term"
              : "Get started by uploading your first image"}
          </p>
          {!searchFilter && !hideAddButton && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
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
    </div>
  );
}
