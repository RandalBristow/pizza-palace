import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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
import { Plus, Edit, Trash2, Save, ThumbsUp, ThumbsDown, Image as ImageIcon, Type, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ImageSelector from "../ui/image-selector";
import { useImages } from "../../hooks/useSupabase";

export interface AboutSection {
  id: string;
  type: "text" | "image" | "text_with_image";
  title?: string;
  content?: string;
  imageUrl?: string;
  imageAltText?: string;
  imagePosition?: "left" | "right";
  links: { text: string; url: string; type: "text" | "image" }[];
  textOverlay?: { text: string; position: "top" | "center" | "bottom"; style?: any };
  columns: number;
  order: number;
  isActive: boolean;
}

interface AboutPageFormProps {
  aboutSections: AboutSection[];
  createAboutSection: (section: any) => Promise<any>;
  updateAboutSection: (id: string, updates: any) => Promise<any>;
  deleteAboutSection: (id: string) => Promise<void>;
}

export default function AboutPageForm({
  aboutSections,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection
}: AboutPageFormProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { images } = useImages();
  const [newSection, setNewSection] = useState<Partial<AboutSection>>({
    type: "text",
    title: "",
    content: "",
    imageUrl: "",
    imageAltText: "",
    imagePosition: "right",
    links: [],
    textOverlay: undefined,
    columns: 1,
    order: aboutSections.length + 1,
    isActive: true,
  });
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);

  const handleAddSection = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await createAboutSection(newSection);
      setIsAddingSection(false);
      resetForm();
    } catch (error) {
      let errorMessage = 'Failed to create section';

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
          errorMessage = `Failed to create section: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to create section:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: AboutSection) => {
    setEditingSection(section);
    setNewSection({
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

    // Find the image ID from the URL
    const selectedImage = images.find(img => img.url === section.imageUrl);
    setSelectedImageId(selectedImage?.id);
  };

  const handleUpdateSection = async () => {
    if (!editingSection) return;

    setError(null);
    setIsLoading(true);

    try {
      await updateAboutSection(editingSection.id, newSection);
      setEditingSection(null);
      resetForm();
    } catch (error) {
      let errorMessage = 'Failed to update section';

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
          errorMessage = `Failed to update section: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to update section:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      await deleteAboutSection(id);
    } catch (error) {
      let errorMessage = 'Failed to delete section';

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
          errorMessage = `Failed to delete section: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to delete section:', error);
    }
  };

  const toggleSectionStatus = async (id: string) => {
    const section = aboutSections.find(s => s.id === id);
    if (!section) return;

    try {
      await updateAboutSection(id, { ...section, isActive: !section.isActive });
    } catch (error) {
      let errorMessage = 'Failed to toggle section status';

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
          errorMessage = `Failed to toggle section status: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to toggle section status:', error);
    }
  };

  const resetForm = () => {
    setNewSection({
      type: "text",
      title: "",
      content: "",
      imageUrl: "",
      imageAltText: "",
      imagePosition: "right",
      links: [],
      textOverlay: undefined,
      columns: 1,
      order: aboutSections.length + 1,
      isActive: true,
    });
    setSelectedImageId(undefined);
    setError(null);
  };

  const addLink = () => {
    setNewSection({
      ...newSection,
      links: [...(newSection.links || []), { text: "", url: "", type: "text" }]
    });
  };

  const updateLink = (index: number, field: string, value: string) => {
    const updatedLinks = [...(newSection.links || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setNewSection({ ...newSection, links: updatedLinks });
  };

  const removeLink = (index: number) => {
    const updatedLinks = (newSection.links || []).filter((_, i) => i !== index);
    setNewSection({ ...newSection, links: updatedLinks });
  };

  const renderSectionForm = (isEdit: boolean = false) => (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="sectionType">Section Type</Label>
        <Select
          value={newSection.type}
          onValueChange={(value: any) =>
            setNewSection({ ...newSection, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select section type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text Only</SelectItem>
            <SelectItem value="image">Image Only</SelectItem>
            <SelectItem value="text_with_image">Text with Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sectionTitle">Title (optional)</Label>
        <Input
          id="sectionTitle"
          placeholder="Section title"
          value={newSection.title}
          onChange={(e) =>
            setNewSection({ ...newSection, title: e.target.value })
          }
        />
      </div>

      {(newSection.type === "text" || newSection.type === "text_with_image") && (
        <div>
          <Label htmlFor="sectionContent">Content</Label>
          <Textarea
            id="sectionContent"
            placeholder="Section content"
            rows={6}
            value={newSection.content}
            onChange={(e) =>
              setNewSection({ ...newSection, content: e.target.value })
            }
          />
        </div>
      )}

      {(newSection.type === "image" || newSection.type === "text_with_image") && (
        <>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={newSection.imageUrl}
              onChange={(e) =>
                setNewSection({ ...newSection, imageUrl: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="imageAltText">Image Alt Text</Label>
            <Input
              id="imageAltText"
              placeholder="Description of the image"
              value={newSection.imageAltText}
              onChange={(e) =>
                setNewSection({ ...newSection, imageAltText: e.target.value })
              }
            />
          </div>
          {newSection.type === "text_with_image" && (
            <div>
              <Label htmlFor="imagePosition">Image Position</Label>
              <Select
                value={newSection.imagePosition || "right"}
                onValueChange={(value: any) =>
                  setNewSection({ ...newSection, imagePosition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select image position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left of text</SelectItem>
                  <SelectItem value="right">Right of text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sectionColumns">Column Span</Label>
          <Select
            value={newSection.columns?.toString() || "1"}
            onValueChange={(value) =>
              setNewSection({ ...newSection, columns: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column span" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Column (1/3 width)</SelectItem>
              <SelectItem value="2">2 Columns (2/3 width)</SelectItem>
              <SelectItem value="3">3 Columns (Full width)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sectionOrder">Order</Label>
          <Input
            id="sectionOrder"
            type="number"
            min="1"
            value={newSection.order}
            onChange={(e) =>
              setNewSection({ ...newSection, order: parseInt(e.target.value) || 1 })
            }
          />
        </div>
      </div>

      {/* Links Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Links (optional)</Label>
          <Button type="button" size="sm" onClick={addLink}>
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
        {(newSection.links || []).map((link, index) => (
          <div key={index} className="space-y-2 p-3 border rounded-md mb-2">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Link text"
                value={link.text}
                onChange={(e) => updateLink(index, "text", e.target.value)}
                className="flex-1"
              />
              <Select
                value={link.type}
                onValueChange={(value) => updateLink(index, "type", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Link</SelectItem>
                  <SelectItem value="image">Image Link</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => removeLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Text Overlay for Image Sections */}
      {newSection.type === "image" && (
        <div>
          <Label>Text Overlay (optional)</Label>
          <div className="space-y-2">
            <Input
              placeholder="Overlay text"
              value={newSection.textOverlay?.text || ""}
              onChange={(e) =>
                setNewSection({
                  ...newSection,
                  textOverlay: {
                    ...newSection.textOverlay,
                    text: e.target.value,
                    position: newSection.textOverlay?.position || "center"
                  }
                })
              }
            />
            <Select
              value={newSection.textOverlay?.position || "center"}
              onValueChange={(value: any) =>
                setNewSection({
                  ...newSection,
                  textOverlay: {
                    ...newSection.textOverlay,
                    text: newSection.textOverlay?.text || "",
                    position: value
                  }
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Overlay position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingSection(null);
            } else {
              setIsAddingSection(false);
            }
            resetForm();
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={isEdit ? handleUpdateSection : handleAddSection}
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : (isEdit ? "Update Section" : "Save Section")}
        </Button>
      </div>
    </div>
  );

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "text": return <Type className="h-4 w-4" />;
      case "image": return <ImageIcon className="h-4 w-4" />;
      case "text_with_image": return <FileText className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">About Page Sections</h2>
        <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
              <DialogDescription>
                Create a new section for the about page with text, images, and links
              </DialogDescription>
            </DialogHeader>
            {renderSectionForm(false)}
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {aboutSections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getSectionIcon(section.type)}
                    <h3 className="font-semibold">
                      {section.title || `${section.type} Section`}
                    </h3>
                    <Badge variant="outline">
                      Order: {section.order}
                    </Badge>
                    <Badge variant="outline">
                      {section.columns} Column{section.columns !== 1 ? 's' : ''}
                    </Badge>
                    <Badge
                      className={
                        section.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {section.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {section.content && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {section.content}
                    </p>
                  )}
                  {section.imageUrl && (
                    <div className="text-xs text-gray-500 mb-2">
                      Image: {section.imageUrl}
                    </div>
                  )}
                  {section.links && section.links.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Links: {section.links.length}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSectionStatus(section.id)}
                        >
                          {section.isActive ? (
                            <ThumbsUp className="h-4 w-4" />
                          ) : (
                            <ThumbsDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {section.isActive ? "Deactivate" : "Activate"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSection(section)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Section</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Section</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Section Dialog */}
      <Dialog
        open={editingSection !== null}
        onOpenChange={(open) => !open && setEditingSection(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update the section details and settings
            </DialogDescription>
          </DialogHeader>
          {renderSectionForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
