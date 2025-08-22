
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Image" : "Add New Image"}</DialogTitle>
          <DialogDescription>
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
            <Label htmlFor="uploadType">Upload Method</Label>
            <Select
              value={uploadType}
              onValueChange={(value: "file" | "url") =>
                setUploadType(value || "file")
              }
            >
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
              placeholder={
                selectedFile
                  ? selectedFile.name || "Enter image name"
                  : "Enter image name"
              }
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
                key={`file-input-${isEdit ? "edit" : "add"}-${isOpen ? "open" : "closed"}`}
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedFile(file || null);
                  if (file && !(newImage.name || "").trim()) {
                    setNewImage({
                      ...newImage,
                      name: file.name.split(".").slice(0, -1).join(".") || "",
                    });
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
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : newImage.url || ""
                  }
                  alt={newImage.altText || "Preview"}
                  className="max-w-full max-h-48 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
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
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                isLoading ||
                !(newImage.name || "").trim() ||
                (!isEdit &&
                  (uploadType === "file"
                    ? !selectedFile
                    : !(newImage.url || "").trim()))
              }
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : isEdit ? "Update Image" : "Save Image"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

