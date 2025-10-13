import { useState } from "react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Plus, Image as ImageIcon, Type, FileText } from "lucide-react";
import AboutSectionDialog from "../dialog_components/AboutSectionDialog";
import ActivationButton from "../shared_components/ActivationButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import SectionCard from "../shared_components/SectionCard";

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

interface AboutPageFormProps {
  aboutSections: AboutSection[];
  images?: any[];
  createAboutSection: (section: any) => Promise<any>;
  updateAboutSection: (id: string, updates: any) => Promise<any>;
  deleteAboutSection: (id: string) => Promise<void>;
}

export default function AboutPageForm({
  aboutSections,
  images = [],
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
}: AboutPageFormProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  // Delete confirmation handled by shared DeleteButton


  const handleEditSection = (section: AboutSection) => {
    setEditingSection(section);
  };


  const handleDeleteSection = async (id: string) => {
    try {
      await deleteAboutSection(id);
    } catch (error) {
      let errorMessage = "Failed to delete section";

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
          errorMessage = `Failed to delete section: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error("Failed to delete section:", error);
    }
  };

  const toggleSectionStatus = async (id: string) => {
    const section = aboutSections.find((s) => s.id === id);
    if (!section) return;

    try {
      await updateAboutSection(id, { ...section, isActive: !section.isActive });
    } catch (error) {
      let errorMessage = "Failed to toggle section status";

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
          errorMessage = `Failed to toggle section status: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error("Failed to toggle section status:", error);
    }
  };



  const getSectionIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" strokeWidth={3} />;
      case "image":
        return <ImageIcon className="h-4 w-4" strokeWidth={3} />;
      case "text_with_image":
        return <FileText className="h-4 w-4" strokeWidth={3} />;
      default:
        return <Type className="h-4 w-4" strokeWidth={3} />;
    }
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="flex justify-between items-center">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          About Page Sections
        </h2>
        <Button
          className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            borderColor: "var(--primary)",
          }}
          onClick={() => setIsAddingSection(true)}
        >
          <Plus
            className="h-4 w-4 mr-2"
            style={{ color: "var(--primary-foreground)" }}
          />
          Add Section
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>

        </Alert>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {aboutSections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionCard
              key={section.id}
              title={section.title || `${section.type} Section`}
              icon={getSectionIcon(section.type)}
              order={section.order}
              columns={section.columns}
              isActive={section.isActive}
              content={section.content}
              imageUrl={section.imageUrl}
              linksCount={section.links?.length || 0}
              rightActions={
                <>
                  <ActivationButton
                    isActive={section.isActive}
                    onToggle={() => toggleSectionStatus(section.id)}
                    activeTooltip="Deactivate"
                    inactiveTooltip="Activate"
                  />
                  <EditButton
                    label="Edit Section"
                    onClick={() => handleEditSection(section)}
                  />
                  <DeleteButton
                    entityTitle="Section"
                    subjectName={section.title}
                    onConfirm={() => handleDeleteSection(section.id)}
                  />
                </>
              }
            />
          ))}
      </div>

      {/* About Section Dialog Instances */}
      <AboutSectionDialog
        isOpen={isAddingSection}
        onClose={() => {
          setIsAddingSection(false);
        }}
        section={null}
        images={images}
        onSave={async (data) => {
          await createAboutSection(data);
          setIsAddingSection(false);
        }}
      />
      <AboutSectionDialog
        isOpen={editingSection !== null}
        onClose={() => setEditingSection(null)}
        section={editingSection as any}
        images={images}
        onSave={async (data) => {
          if (editingSection) {
            await updateAboutSection(editingSection.id, data);
            setEditingSection(null);
          }
        }}
      />
    </div>
  );
}
