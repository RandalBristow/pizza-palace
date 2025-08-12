import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Edit, Trash2, Save, ThumbsUp, ThumbsDown, Upload, Search } from "lucide-react";
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
  createImageFromUrl: (url: string, name: string, altText?: string) => Promise<any>;
  updateImage: (id: string, updates: any) => Promise<any>;
  deleteImage: (id: string) => Promise<void>;
}

export default function ImageManagerForm({
  images,
  uploadImageFile,
  createImageFromUrl,
  updateImage,
  deleteImage
}: ImageManagerFormProps) {
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [thumbnailSize, setThumbnailSize] = useState<"small" | "medium" | "large">("medium");
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<Partial<Image>>({
    name: "",
    url: "",
    altText: "",
    isActive: true,
  });

  const handleAddImage = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (uploadType === "file" && selectedFile && (newImage.name || "").trim()) {
        await uploadImageFile(selectedFile, (newImage.name || selectedFile.name).trim());
      } else if (uploadType === "url" && (newImage.url || "").trim() && (newImage.name || "").trim()) {
        await createImageFromUrl((newImage.url || "").trim(), (newImage.name || "Uploaded Image").trim(), (newImage.altText || "").trim());
      } else {
        throw new Error("Please provide a name and either a file or URL");
      }

      setIsAddingImage(false);
      resetForm();
    } catch (error) {
      let errorMessage = 'Failed to create image';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to create image: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to create image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditImage = (image: Image) => {
    setEditingImage(image);
    setNewImage({
      name: image.name || "",
      url: image.url || "",
      altText: image.altText || "",
      isActive: image.isActive ?? true,
    });
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    setError(null);
    setIsLoading(true);

    try {
      await updateImage(editingImage.id, newImage);
      setEditingImage(null);
      resetForm();
    } catch (error) {
      let errorMessage = 'Failed to update image';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to update image: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to update image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage(id);
    } catch (error) {
      let errorMessage = 'Failed to delete image';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to delete image: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to delete image:', error);
    }
  };

  const toggleImageStatus = async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    try {
      await updateImage(id, { ...image, isActive: !image.isActive });
    } catch (error) {
      let errorMessage = 'Failed to toggle image status';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to toggle image status: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to toggle image status:', error);
    }
  };

  const resetForm = () => {
    setNewImage({
      name: "",
      url: "",
      altText: "",
      isActive: true,
    });
    setSelectedFile(null);
    setUploadType("file");
    setError(null);
  };

  const getThumbnailSize = () => {
    switch (thumbnailSize) {
      case "small": return "w-20 h-20";
      case "medium": return "w-32 h-32";
      case "large": return "w-48 h-48";
      default: return "w-32 h-32";
    }
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const renderImageForm = (isEdit: boolean = false) => (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="uploadType">Upload Method</Label>
        <Select value={uploadType} onValueChange={(value: any) => setUploadType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="file">Upload File</SelectItem>
            <SelectItem value="url">From URL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="imageName">Name *</Label>
        <Input
          id="imageName"
          placeholder={selectedFile ? selectedFile.name || "Enter image name" : "Enter image name"}
          value={newImage.name || ""}
          onChange={(e) =>
            setNewImage({ ...newImage, name: e.target.value || "" })
          }
        />
      </div>

      {uploadType === "file" ? (
        <div>
          <Label htmlFor="imageFile">Select Image File *</Label>
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFile(file || null);
              if (file && !(newImage.name || "").trim()) {
                setNewImage({ ...newImage, name: file.name.split('.').slice(0, -1).join('.') || "" });
              }
            }}
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="imageUrl">Image URL *</Label>
          <Input
            id="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={newImage.url || ""}
            onChange={(e) =>
              setNewImage({ ...newImage, url: e.target.value || "" })
            }
          />
        </div>
      )}

      <div>
        <Label htmlFor="imageAltText">Alt Text</Label>
        <Input
          id="imageAltText"
          placeholder="Description of the image"
          value={newImage.altText || ""}
          onChange={(e) =>
            setNewImage({ ...newImage, altText: e.target.value || "" })
          }
        />
      </div>

      {(newImage.url || selectedFile) && (
        <div>
          <Label>Preview</Label>
          <div className="mt-2 border rounded-lg p-4">
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : (newImage.url || "")}
              alt={newImage.altText || "Preview"}
              className="max-w-full max-h-48 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingImage(null);
            } else {
              setIsAddingImage(false);
            }
            resetForm();
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={isEdit ? handleUpdateImage : handleAddImage}
          disabled={isLoading || !(newImage.name || "").trim() || (uploadType === "file" ? !selectedFile : !(newImage.url || "").trim())}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : (isEdit ? "Update Image" : "Save Image")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Image Manager</h2>
        <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
              <DialogDescription>
                Upload a new image by URL or file upload (future feature)
              </DialogDescription>
            </DialogHeader>
            {renderImageForm(false)}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search images by name..."
              value={searchFilter || ""}
              onChange={(e) => setSearchFilter(e.target.value || "")}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label>Thumbnail Size:</Label>
          <Select value={thumbnailSize} onValueChange={(value: any) => setThumbnailSize(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
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
          <Card key={image.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.altText || image.name}
                  className={`${getThumbnailSize()} object-cover w-full`}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    className={
                      image.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {image.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm truncate mb-2">{image.name}</h4>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleImageStatus(image.id)}
                          >
                            {image.isActive ? (
                              <ThumbsUp className="h-3 w-3" />
                            ) : (
                              <ThumbsDown className="h-3 w-3" />
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
                            onClick={() => handleEditImage(image)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Image</TooltipContent>
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
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Image</TooltipContent>
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
          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchFilter ? "No images found" : "No images uploaded"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchFilter ? "Try adjusting your search term" : "Get started by uploading your first image"}
          </p>
          {!searchFilter && (
            <Button onClick={() => setIsAddingImage(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Image
            </Button>
          )}
        </div>
      )}

      {/* Edit Image Dialog */}
      <Dialog
        open={editingImage !== null}
        onOpenChange={(open) => !open && setEditingImage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Update the image details and settings
            </DialogDescription>
          </DialogHeader>
          {renderImageForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
