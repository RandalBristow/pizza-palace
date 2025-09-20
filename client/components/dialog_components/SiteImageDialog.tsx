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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Save } from "lucide-react";

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

interface SiteImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image?: Image | null;
  uploadImageFile: (file: File, name: string) => Promise<any>;
  createImageFromUrl: (
    url: string,
    name: string,
    altText?: string,
  ) => Promise<any>;
  updateImage: (id: string, updates: any) => Promise<any>;
}

export default function SiteImageDialog({
  isOpen,
  onClose,
  image,
  uploadImageFile,
  createImageFromUrl,
  updateImage,
}: SiteImageDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<Partial<Image>>({
    name: "",
    url: "",
    altText: "",
    isActive: true,
  });

  const isEdit = !!image;

  useEffect(() => {
    if (image) {
      setNewImage({
        name: image.name || "",
        url: image.url || "",
        altText: image.altText || "",
        isActive: image.isActive ?? true,
      });
    } else {
      resetForm();
    }
  }, [image]);

  const handleSave = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (isEdit) {
        await updateImage(image!.id, newImage);
      } else {
        if (
          uploadType === "file" &&
          selectedFile &&
          (newImage.name || "").trim()
        ) {
          await uploadImageFile(
            selectedFile,
            (newImage.name || selectedFile.name).trim(),
          );
        } else if (
          uploadType === "url" &&
          (newImage.url || "").trim() &&
          (newImage.name || "").trim()
        ) {
          await createImageFromUrl(
            (newImage.url || "").trim(),
            (newImage.name || "Uploaded Image").trim(),
            (newImage.altText || "").trim(),
          );
        } else {
          throw new Error("Please provide a name and either a file or URL");
        }
      }

      onClose();
      resetForm();
    } catch (error) {
      let errorMessage = isEdit ? "Failed to update image" : "Failed to create image";

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
          errorMessage = `${isEdit ? "Failed to update" : "Failed to create"} image: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error(`Failed to ${isEdit ? "update" : "create"} image:`, error);
    } finally {
      setIsLoading(false);
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

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--card-foreground)' }}>{isEdit ? "Edit Image" : "Add New Image"}</DialogTitle>
          <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
            {isEdit
              ? "Update the image details and settings"
              : "Upload a new image by URL or file upload"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="uploadType" style={{ color: 'var(--foreground)' }}>Upload Method</Label>
            <Select
              value={uploadType}
              onValueChange={(value: "file" | "url") =>
                setUploadType(value || "file")
              }
            >
              <SelectTrigger
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
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                <SelectItem value="file" style={{ color: 'var(--popover-foreground)' }}>Upload File</SelectItem>
                <SelectItem value="url" style={{ color: 'var(--popover-foreground)' }}>From URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="imageName" style={{ color: 'var(--foreground)' }}>Name *</Label>
            <Input
              id="imageName"
              placeholder={
                selectedFile
                  ? selectedFile.name || "Enter image name"
                  : "Enter image name"
              }
              value={newImage.name || ""}
              onChange={(e) =>
                setNewImage({ ...newImage, name: e.target.value || "" })
              }
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

          {uploadType === "file" ? (
            <div>
              <Label htmlFor="imageFile" style={{ color: 'var(--foreground)' }}>Image File *</Label>
              <Input
                key={`file-input-${isEdit ? "edit" : "add"}-${isOpen ? "open" : "closed"}`}
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    if (!newImage.name?.trim()) {
                      setNewImage({
                        ...newImage,
                        name: file.name.replace(/\.[^/.]+$/, ""),
                      });
                    }
                  }
                }}
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
          ) : (
            <div>
              <Label htmlFor="imageUrl" style={{ color: 'var(--foreground)' }}>Image URL *</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={newImage.url || ""}
                onChange={(e) =>
                  setNewImage({ ...newImage, url: e.target.value || "" })
                }
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
          )}

          <div>
            <Label htmlFor="imageAltText" style={{ color: 'var(--foreground)' }}>Alt Text</Label>
            <Input
              id="imageAltText"
              placeholder="Description of the image"
              value={newImage.altText || ""}
              onChange={(e) =>
                setNewImage({ ...newImage, altText: e.target.value || "" })
              }
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

          {(newImage.url || selectedFile) && (
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Preview</Label>
              <div className="border rounded-lg p-2" style={{ borderColor: 'var(--border)' }}>
                <img
                  src={
                    newImage.url ||
                    (selectedFile ? URL.createObjectURL(selectedFile) : "")
                  }
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--muted-foreground)',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = 'var(--accent)';
                  target.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'var(--card)';
                target.style.transform = 'scale(1)';
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
              {isLoading ? "Saving..." : isEdit ? "Update Image" : "Save Image"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}