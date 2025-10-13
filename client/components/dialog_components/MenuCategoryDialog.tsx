import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Save } from "lucide-react";
import { RequiredFieldLabel } from "../ui/required-field-label";

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface MenuCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null; // null for add, Category for edit
  onSave: (categoryData: any) => Promise<void>;
}

export default function MenuCategoryDialog({
  isOpen,
  onClose,
  category,
  onSave,
}: MenuCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    order: 1,
  });

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        isActive: category.isActive,
        order: category.order,
      });
    } else {
      setFormData({ name: "", isActive: true, order: 1 });
    }
  }, [category]);

  // Validation – require name and a positive order
  const hasName = (formData.name || "").trim().length > 0;
  const orderValid = Number.isFinite(Number(formData.order)) && Number(formData.order) > 0;
  const canSave = hasName && orderValid;

  const handleSave = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", isActive: true, order: 1 });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--card-foreground)" }}>
            {isEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription style={{ color: "var(--muted-foreground)" }}>
            {isEdit
              ? "Update the category details"
              : "Create a new menu category"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <RequiredFieldLabel
              htmlFor="categoryName"
              style={{ color: "var(--foreground)" }}
            >
              Category Name
            </RequiredFieldLabel>
            <Input
              id="categoryName"
              placeholder="e.g., Appetizers"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = "none";
              }}
            />
          </div>
          <div>
            <Label
              htmlFor="categoryOrder"
              style={{ color: "var(--foreground)" }}
            >
              Display Order
            </Label>
            <Input
              id="categoryOrder"
              type="number"
              placeholder="1"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 1,
                })
              }
              required
              min={1}
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = "none";
              }}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--muted-foreground)",
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'var(--accent)';
                target.style.transform = 'scale(1.02)';
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
              disabled={!canSave}
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderColor: "var(--primary)",
                cursor: !canSave ? 'not-allowed' : 'pointer'
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
              <Save
                className="h-4 w-4 mr-2"
                style={{ color: "var(--primary-foreground)" }}
              />
              {isEdit ? "Update Category" : "Save Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

