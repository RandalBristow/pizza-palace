import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Image as ImageIcon } from "lucide-react";

interface Image {
  id: string;
  name: string;
  url?: string;
  altText?: string;
  isActive: boolean;
}

interface ImageSelectorProps {
  images: Image[];
  selectedImageId?: string;
  onImageSelect: (imageId: string | undefined, imageUrl?: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showPreview?: boolean;
  ariaLabelledBy?: string;
}

export default function ImageSelector({
  images,
  selectedImageId,
  onImageSelect,
  label = "Select Image",
  placeholder = "Choose an image...",
  required = false,
  showPreview = true,
  ariaLabelledBy,
}: ImageSelectorProps) {
  const activeImages = images.filter((img) => img.isActive);
  const selectedImage = activeImages.find((img) => img.id === selectedImageId);

  const handleSelectionChange = (value: string) => {
    if (value === "none") {
      onImageSelect(undefined, undefined);
    } else {
      const selected = activeImages.find((img) => img.id === value);
      onImageSelect(value, selected?.url);
    }
  };

  return (
    <div>
      {label ? (
        <Label>
          {label} {required && "*"}
        </Label>
      ) : null}

      <Select
        value={selectedImageId || "none"}
        onValueChange={handleSelectionChange}
      >
        <SelectTrigger
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
          style={{
            backgroundColor: "var(--input)",
            borderColor: "var(--border)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          aria-labelledby={ariaLabelledBy}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          style={{ backgroundColor: "var(--popover)", borderColor: "var(--border)" }}
        >
          <SelectItem value="none" style={{ color: "var(--popover-foreground)" }}>
            No image selected
          </SelectItem>
          {activeImages.map((image) => (
            <SelectItem key={image.id} value={image.id} style={{ color: "var(--popover-foreground)" }}>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.altText || image.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--accent)]/40 flex items-center justify-center">
                      <ImageIcon className="w-3 h-3 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                </div>
                <span className="truncate">{image.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showPreview && selectedImage && selectedImage.url && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-start gap-2">
                <span className="text-sm font-medium">Preview:</span>
                <Badge variant="outline" className="text-xs">
                  {selectedImage.name}
                </Badge>
              </div>
              <div className="rounded-lg overflow-hidden border max-w-xs">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText || selectedImage.name}
                  className="w-full h-auto object-cover max-h-48"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeImages.length === 0 && (
        <p className="text-sm text-gray-500">
          No images available. Please upload images first.
        </p>
      )}
    </div>
  );
}
