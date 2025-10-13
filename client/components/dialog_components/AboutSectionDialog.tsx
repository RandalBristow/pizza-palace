import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ImageSelector from "../ui/image-selector";
import { RequiredFieldLabel } from "../ui/required-field-label";

// Local copy of the AboutSection shape to avoid runtime circular deps
export interface AboutSection {
  id: string;
  type: "text" | "image" | "text_with_image";
  title?: string;
  content?: string;
  imageUrl?: string;
  imageAltText?: string;
  imagePosition?: "left" | "right";
  links: { text: string; url: string; type: "text" | "image" }[];
  textOverlay?: {
    text: string;
    position: "top" | "center" | "bottom";
    style?: any;
  };
  columns: number;
  order: number;
  isActive: boolean;
}

interface AboutSectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  section?: AboutSection | null;
  images?: any[];
  onSave: (data: Partial<AboutSection>) => Promise<void>;
}

export default function AboutSectionDialog({
  isOpen,
  onClose,
  section,
  images = [],
  onSave,
}: AboutSectionDialogProps) {
  const isEdit = !!section;

  const [form, setForm] = useState<Partial<AboutSection>>({
    type: "text",
    title: "",
    content: "",
    imageUrl: "",
    imageAltText: "",
    imagePosition: "right",
    links: [],
    textOverlay: undefined,
    columns: 1,
    order: 1,
    isActive: true,
  });
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (section) {
      setForm({
        type: section.type || "text",
        title: section.title || "",
        content: section.content || "",
        imageUrl: section.imageUrl || "",
        imageAltText: section.imageAltText || "",
        imagePosition: section.imagePosition || "right",
        links: section.links || [],
        textOverlay: section.textOverlay,
        columns: section.columns || 1,
        order: section.order || 1,
        isActive: section.isActive ?? true,
      });
      const selected = images.find((img) => img.url === section.imageUrl);
      setSelectedImageId(selected?.id);
    } else {
      // reset to defaults when opening for add
      setForm({
        type: "text",
        title: "",
        content: "",
        imageUrl: "",
        imageAltText: "",
        imagePosition: "right",
        links: [],
        textOverlay: undefined,
        columns: 1,
        order: 1,
        isActive: true,
      });
      setSelectedImageId(undefined);
    }
  }, [section, isOpen, images]);

  const addLink = () => {
    setForm((prev) => ({
      ...prev,
      links: [...(prev.links || []), { text: "", url: "", type: "text" }],
    }));
  };

  const updateLink = (index: number, field: string, value: string) => {
    const updated = [...(form.links || [])];
    updated[index] = { ...updated[index], [field]: value } as any;
    setForm({ ...form, links: updated });
  };

  const removeLink = (index: number) => {
    const updated = (form.links || []).filter((_, i) => i !== index);
    setForm({ ...form, links: updated });
  };

  const handleSave = async () => {
    await onSave(form);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isContentRequired = form.type === "text" || form.type === "text_with_image";
  const isImageRequired = form.type === "image" || form.type === "text_with_image";
  const hasContent = (form.content || "").trim().length > 0;
  const hasImage = (form.imageUrl || "").trim().length > 0;
  const canSave = (!isContentRequired || hasContent) && (!isImageRequired || hasImage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl border bg-[var(--card)] border-[var(--border)] text-[var(--card-foreground)]"
      >
        <DialogHeader>
          <DialogTitle className="text-[var(--card-foreground)]">
            {isEdit ? "Edit Section" : "Add New Section"}
          </DialogTitle>
          <DialogDescription className="text-[var(--muted-foreground)]">
            {isEdit
              ? "Update the section details and settings"
              : "Create a new section for the about page"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 pl-2">

          {/* Section Type & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sectionType" className="text-[var(--foreground)]">
                Section Type
              </Label>
              <Select
                value={form.type}
                onValueChange={(value: any) => setForm({ ...form, type: value })}
              >
                <SelectTrigger
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
                >
                  <SelectValue placeholder="Select section type" />
                </SelectTrigger>
                <SelectContent
                  className="bg-[var(--popover)] border-[var(--border)]"
                >
                  <SelectItem
                    value="text"
                    className="text-[var(--popover-foreground)]"
                  >
                    Text Only
                  </SelectItem>
                  <SelectItem
                    value="image"
                    className="text-[var(--popover-foreground)]"
                  >
                    Image Only
                  </SelectItem>
                  <SelectItem
                    value="text_with_image"
                    className="text-[var(--popover-foreground)]"
                  >
                    Text with Image
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="sectionTitle"
                className="text-[var(--foreground)]"
              >
                Title (optional)
              </Label>
              <Input
                id="sectionTitle"
                placeholder="Section title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Section Content */}
          {(form.type === "text" || form.type === "text_with_image") && (
            <div>
              <RequiredFieldLabel
                htmlFor="sectionContent"
                className="text-[var(--foreground)]"
              >
                Content
              </RequiredFieldLabel>
              <Textarea
                id="sectionContent"
                placeholder="Section content"
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required={isContentRequired}
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              />
            </div>
          )}

          {/* Section Image & Image Position */}
          {(form.type === "image" || form.type === "text_with_image") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label id="about-image-selector-label" className="text-[var(--foreground)] mb-0">
                  Image <span className="text-[var(--destructive)]">*</span>
                </Label>
                <ImageSelector
                  images={images}
                  selectedImageId={selectedImageId}
                  onImageSelect={(imageId, imageUrl) => {
                    setSelectedImageId(imageId);
                    setForm({
                      ...form,
                      imageUrl: imageUrl || "",
                      imageAltText: imageId
                        ? images.find((img) => img.id === imageId)?.altText || ""
                        : "",
                    });
                  }}
                  label=""
                  ariaLabelledBy="about-image-selector-label"
                  placeholder="Choose an image..."
                  required={isImageRequired}
                  showPreview={false}
                />
              </div>

              <div>
                {form.type === "text_with_image" && (
                  <div className="">
                    <Label
                      htmlFor="imagePosition"
                      className="text-[var(--foreground)]"
                    >
                      Image Position
                    </Label>
                    <Select
                      value={form.imagePosition || "right"}
                      onValueChange={(value: any) =>
                        setForm({ ...form, imagePosition: value })
                      }
                    >
                      <SelectTrigger
                        className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
                      >
                        <SelectValue placeholder="Select image position" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-[var(--popover)] border-[var(--border)]"
                      >
                        <SelectItem
                          value="left"
                          className="text-[var(--popover-foreground)]"
                        >
                          Left of text
                        </SelectItem>
                        <SelectItem
                          value="right"
                          className="text-[var(--popover-foreground)]"
                        >
                          Right of text
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section Column Span & Display Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="sectionColumns"
                className="text-[var(--foreground)]"
              >
                Column Span
              </Label>
              <Select
                value={form.columns?.toString() || "1"}
                onValueChange={(value) =>
                  setForm({ ...form, columns: parseInt(value) })
                }
              >
                <SelectTrigger
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
                >
                  <SelectValue placeholder="Select column span" />
                </SelectTrigger>
                <SelectContent
                  className="bg-[var(--popover)] border-[var(--border)]"
                >
                  <SelectItem
                    value="1"
                    className="text-[var(--popover-foreground)]"
                  >
                    1 Column (1/3 width)
                  </SelectItem>
                  <SelectItem
                    value="2"
                    className="text-[var(--popover-foreground)]"
                  >
                    2 Columns (2/3 width)
                  </SelectItem>
                  <SelectItem
                    value="3"
                    className="text-[var(--popover-foreground)]"
                  >
                    3 Columns (Full width)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="sectionOrder"
                className="text-[var(--foreground)]"
              >
                Order
              </Label>
              <Input
                id="sectionOrder"
                type="number"
                min="1"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) || 1 })
                }
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Links Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[var(--foreground)]">
                Links (optional)
              </Label>
              <Button
                type="button"
                size="sm"
                onClick={addLink}
                className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
              >
                + Add Link
              </Button>
            </div>
            {(form.links || []).map((link, index) => (
              <div
                key={index}
                className="space-y-2 p-3 border rounded-md mb-2 bg-[var(--card)] border-[var(--border)]"
              >
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Link text"
                    value={link.text}
                    onChange={(e) => updateLink(index, "text", e.target.value)}
                    className="flex-1 bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
                  />
                  <Select
                    value={link.type}
                    onValueChange={(value) => updateLink(index, "type", value)}
                  >
                    <SelectTrigger
                      className="w-32 bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-[var(--popover)] border-[var(--border)]"
                    >
                      <SelectItem
                        value="text"
                        className="text-[var(--popover-foreground)]"
                      >
                        Text Link
                      </SelectItem>
                      <SelectItem
                        value="image"
                        className="text-[var(--popover-foreground)]"
                      >
                        Image Link
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeLink(index)}
                    className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
                  >
                    Remove
                  </Button>
                </div>
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
                />
              </div>
            ))}
          </div>

          {/* Text Overlay for Image Sections */}
          {form.type === "image" && (
            <div>
              <Label className="text-[var(--foreground)]">
                Text Overlay (optional)
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="Overlay text"
                  value={form.textOverlay?.text || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      textOverlay: {
                        ...(form.textOverlay || {}),
                        text: e.target.value,
                        position: form.textOverlay?.position || "center",
                      },
                    })
                  }
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
                />
                <Select
                  value={form.textOverlay?.position || "center"}
                  onValueChange={(value: any) =>
                    setForm({
                      ...form,
                      textOverlay: {
                        ...(form.textOverlay || {}),
                        text: form.textOverlay?.text || "",
                        position: value,
                      },
                    })
                  }
                >
                  <SelectTrigger
                    className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[var(--ring)] data-[state=open]:ring-offset-0"
                  >
                    <SelectValue placeholder="Overlay position" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-[var(--popover)] border-[var(--border)]"
                  >
                    <SelectItem
                      value="top"
                      className="text-[var(--popover-foreground)]"
                    >
                      Top
                    </SelectItem>
                    <SelectItem
                      value="center"
                      className="text-[var(--popover-foreground)]"
                    >
                      Center
                    </SelectItem>
                    <SelectItem
                      value="bottom"
                      className="text-[var(--popover-foreground)]"
                    >
                      Bottom
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] border border-[var(--primary)] transition-colors duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {isEdit ? "Update Section" : "Save Section"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
