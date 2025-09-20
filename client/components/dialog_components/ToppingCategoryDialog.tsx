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
      <DialogContent
        className="max-w-md"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          border: "1px solid var(--border)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--card-foreground)" }}>
            {toppingCategory
              ? "Edit Topping Category"
              : "Add New Topping Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label
              htmlFor="name"
              style={{ color: "var(--muted-foreground)" }}
            >
              Category Name
            </Label>
            <Input
              id="name"
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
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <Label
              htmlFor="menuItemCategory"
              style={{ color: "var(--muted-foreground)" }}
            >
              Menu Category
            </Label>
            <Select
              value={formData.menuItemCategory}
              onValueChange={(value) =>
                setFormData({ ...formData, menuItemCategory: value })
              }
            >
              <SelectTrigger
                style={{
                  backgroundColor: "var(--input)",
                  borderColor: "var(--border)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              >
                <SelectValue placeholder="Select menu category" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                }}
              >
                {categories
                  .filter((c) => c.isActive)
                  .map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      style={{ color: "var(--popover-foreground)" }}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="order"
              style={{ color: "var(--muted-foreground)" }}
            >
              Display Order
            </Label>
            <Input
              id="order"
              type="number"
              min="0"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
              }
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderColor: "var(--primary)",
              }}
            >
              {toppingCategory ? "Update" : "Create"} Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

