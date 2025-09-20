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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Save } from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface SubCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory?: SubCategory | null; // null for add, SubCategory for edit
  categories: Category[];
  onSave: (subCategoryData: any) => Promise<void>;
}

export default function SubCategoryDialog({
  isOpen,
  onClose,
  subCategory,
  categories,
  onSave,
}: SubCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    displayOrder: 1,
    isActive: true,
  });

  const isEdit = !!subCategory;

  useEffect(() => {
    if (subCategory) {
      setFormData({
        name: subCategory.name,
        categoryId: subCategory.categoryId,
        displayOrder: subCategory.displayOrder,
        isActive: subCategory.isActive,
      });
    } else {
      setFormData({ name: "", categoryId: "", displayOrder: 1, isActive: true });
    }
  }, [subCategory]);

  const handleSave = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save sub-category:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", categoryId: "", displayOrder: 1, isActive: true });
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
            {isEdit ? "Edit Sub-Category" : "Add New Sub-Category"}
          </DialogTitle>
          <DialogDescription style={{ color: "var(--muted-foreground)" }}>
            {isEdit
              ? "Update the sub-category details"
              : "Create a new sub-category"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category" style={{ color: 'var(--destructive)' }}>
              * Category
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
              required
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
                <SelectValue placeholder="Select category..." style={{ color: 'var(--muted-foreground)' }} />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                {categories
                  .filter((c) => c.isActive)
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id} style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="subCategoryName"
              style={{ color: "var(--destructive)" }}
            >
              * Sub-Category Name
            </Label>
            <Input
              id="subCategoryName"
              placeholder="e.g., Boneless Wings"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
              htmlFor="displayOrder"
              style={{ color: "var(--destructive)" }}
            >
              * Display Order
            </Label>
            <Input
              id="displayOrder"
              type="number"
              placeholder="1"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayOrder: parseInt(e.target.value) || 1,
                })
              }
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
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderColor: "var(--primary)",
                cursor: 'pointer'
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
              {isEdit ? "Update Sub-Category" : "Save Sub-Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}