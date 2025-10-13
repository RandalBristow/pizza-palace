import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RequiredFieldLabel } from "../ui/required-field-label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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

  // Validation: require name, menuItemCategory, and order > 0
  const hasName = (formData.name || "").trim().length > 0;
  const hasCategory = (formData.menuItemCategory || "").trim().length > 0;
  const orderValid = Number.isFinite(Number(formData.order)) && Number(formData.order) > 0;
  const canSave = hasName && hasCategory && orderValid;

  const handleSave = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save topping category:", error);
    }
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
            <RequiredFieldLabel
              htmlFor="categoryName"
              style={{ color: "var(--foreground)" }}
            >
              Category Name
            </RequiredFieldLabel>
            <Input
              id="categoryName"
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
            <RequiredFieldLabel
              htmlFor="menuItemCategory"
              style={{ color: "var(--foreground)" }}
            >
              Menu Category
            </RequiredFieldLabel>
            <Select
              value={formData.menuItemCategory}
              disabled={!hasName}
              onValueChange={(value) =>
                setFormData({ ...formData, menuItemCategory: value })
              }
              required
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
              min="1"
              value={formData.order}
              disabled={!hasName}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)]"
              style={{ transition: 'all 0.2s ease' }}
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
              type="submit"
              className="bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
              disabled={!canSave}
              style={{ transition: 'all 0.2s ease' }}
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
              {toppingCategory ? "Update" : "Create"} Topping Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

