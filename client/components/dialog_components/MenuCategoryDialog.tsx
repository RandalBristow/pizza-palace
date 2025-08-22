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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the category details" : "Create a new menu category"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="e.g., Appetizers"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="categoryOrder">Display Order</Label>
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
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Category" : "Save Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

