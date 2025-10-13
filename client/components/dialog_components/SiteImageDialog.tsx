import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RequiredFieldLabel } from "../ui/required-field-label";
import { Alert, AlertDescription } from "../ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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

  const canSave = (() => {
    if (isLoading) return false;
    if (isEdit) {
      return (
        (newImage.name || "").trim().length > 0 &&
        (newImage.altText || "").trim().length > 0
      );
    }
    if (uploadType === "file") {
      return (
        !!selectedFile &&
        (newImage.name || "").trim().length > 0 &&
        (newImage.altText || "").trim().length > 0
      );
    }
    if (uploadType === "url") {
      return (
        (newImage.url || "").trim().length > 0 &&
        (newImage.name || "").trim().length > 0 &&
        (newImage.altText || "").trim().length > 0
      );
    }
    return false;
  })();

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
  }, [image, isOpen]);

  const handleSave = async () => {
    if (!canSave) return;
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
      let errorMessage = isEdit
        ? "Failed to update image"
        : "Failed to create image";

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
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--card-foreground)" }}>
            {isEdit ? "Edit Image" : "Add New Image"}
          </DialogTitle>
          <DialogDescription style={{ color: "var(--muted-foreground)" }}>
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

          {!isEdit && (
            <div>
              <RequiredFieldLabel
                htmlFor="uploadType"
                style={{ color: "var(--foreground)" }}
              >
                Upload Method
              </RequiredFieldLabel>
              <Select
                value={uploadType}
                onValueChange={(value: "file" | "url") =>
                  setUploadType(value || "file")
                }
              >
                <SelectTrigger
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
                  style={{
                    backgroundColor: "var(--input)",
                    borderColor: "var(--border)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                  }}
                >
                  <SelectItem
                    value="file"
                    style={{ color: "var(--popover-foreground)" }}
                  >
                    Upload File
                  </SelectItem>
                  <SelectItem
                    value="url"
                    style={{ color: "var(--popover-foreground)" }}
                  >
                    From URL
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <RequiredFieldLabel
              htmlFor="imageAltText"
              style={{ color: "var(--foreground)" }}
            >
              Name
            </RequiredFieldLabel>
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
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {!isEdit && uploadType === "file" ? (
            <div>
              <RequiredFieldLabel
                htmlFor="imageAltText"
                style={{ color: "var(--foreground)" }}
              >
                Image File
              </RequiredFieldLabel>
              <Input
                key={`file-input-${isOpen ? "open" : "closed"}`}
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
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
                style={{
                  backgroundColor: "var(--input)",
                  borderColor: "var(--border)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          ) : (
            !isEdit && (
              <div>
                <RequiredFieldLabel
                  htmlFor="imageAltText"
                  style={{ color: "var(--foreground)" }}
                >
                  Image URL
                </RequiredFieldLabel>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={newImage.url || ""}
                  onChange={(e) =>
                    setNewImage({ ...newImage, url: e.target.value || "" })
                  }
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
                  style={{
                    backgroundColor: "var(--input)",
                    borderColor: "var(--border)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            )
          )}

          <div>
            <RequiredFieldLabel
              htmlFor="imageAltText"
              style={{ color: "var(--foreground)" }}
            >
              Alt Text
            </RequiredFieldLabel>
            <Input
              id="imageAltText"
              placeholder="Description of the image"
              value={newImage.altText || ""}
              onChange={(e) =>
                setNewImage({ ...newImage, altText: e.target.value || "" })
              }
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {(newImage.url || selectedFile) && (
            <div>
              <Label style={{ color: "var(--foreground)" }}>Preview</Label>
              <div
                className="border rounded-lg p-2"
                style={{ borderColor: "var(--border)" }}
              >
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
              className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)]"
              style={{
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="transition-all duration-200 hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderColor: "var(--primary)",
                cursor: !canSave || isLoading ? "not-allowed" : "pointer",
              }}
            >
              <Save
                className="h-4 w-4 mr-2"
                style={{ color: "var(--primary-foreground)" }}
              />
              {isLoading ? "Saving..." : isEdit ? "Update Image" : "Save Image"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
