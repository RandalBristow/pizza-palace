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
import { Category } from "../admin/MenuCategoriesForm";

export interface ToppingCategory {
  id: string;
  name: string;
  menuItemCategory: string;
  order: number;
  isActive: boolean;
}

interface ToppingCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  toppingCategory?: ToppingCategory | null;
  categories: Category[];
  onSave: (toppingCategoryData: any) => Promise<void>;
}

export default function ToppingCategoryDialog({
  isOpen,
  onClose,
  toppingCategory,
  categories,
  onSave,
}: ToppingCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    order: 1,
    isActive: true,
    menuItemCategory: "",
  });

  const isEdit = !!toppingCategory;

  useEffect(() => {
    if (toppingCategory) {
      setFormData({
        name: toppingCategory.name || "",
        order: toppingCategory.order || 1,
        isActive: toppingCategory.isActive || true,
        menuItemCategory: toppingCategory.menuItemCategory || "",
      });
    } else {
      setFormData({
        name: "",
        order: 1,
        isActive: true,
        menuItemCategory: "",
      });
    }
  }, [toppingCategory]);

  const handleSave = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save topping category:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      order: 1,
      isActive: true,
      menuItemCategory: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Topping Category" : "Add New Topping Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the topping category details"
              : "Create a new topping category"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="menuItemType">Menu Category</Label>
            <Select
              value={formData.menuItemCategory}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  menuItemCategory: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select menu category" />
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
            <Label htmlFor="toppingCategoryName">Category Name</Label>
            <Input
              id="toppingCategoryName"
              placeholder="e.g., Premium Toppings"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="toppingCategoryOrder">Display Order</Label>
            <Input
              id="toppingCategoryOrder"
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
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.menuItemCategory}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Category" : "Save Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

