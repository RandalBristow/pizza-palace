import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Sub-Category" : "Add New Sub-Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the sub-category details. Sizes are managed separately in the Category Sizes section."
              : "Create a new sub-category within a menu category. Sizes will be managed separately in the Category Sizes section."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="parentCategory">Parent Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => {
                setFormData({ ...formData, categoryId: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.isActive)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subCategoryName">Sub-Category Name</Label>
            <Input
              id="subCategoryName"
              placeholder="e.g., Build Your Own, Boneless Wings, Traditional Wings"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="subDisplayOrder">Display Order</Label>
            <Input
              id="subDisplayOrder"
              type="number"
              placeholder="1"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayOrder: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Sizes for this sub-category will be managed in
              the Category Sizes section. Create the sub-category first, then go to
              Category Sizes to define which sizes apply to this sub-category.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.categoryId}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Sub-Category" : "Save Sub-Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}