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
import { ToppingCategory } from "../admin/ToppingCategoriesForm";

export interface Topping {
  id: string;
  name: string;
  price?: number;
  category: string;
  menuItemCategory: string;
  isActive: boolean;
}

export interface CategorySize {
  id: string;
  categoryId: string;
  sizeName: string;
  displayOrder: number;
  isActive: boolean;
}

interface ToppingItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topping?: Topping | null;
  categories: Category[];
  toppingCategories: ToppingCategory[];
  categorySizes: CategorySize[];
  getToppingSizePrices: (toppingId: string) => any[];
  onSave: (
    toppingData: any,
    sizePrices: Record<string, number>,
  ) => Promise<void>;
}

export default function ToppingItemDialog({
  isOpen,
  onClose,
  topping,
  categories,
  toppingCategories,
  categorySizes,
  getToppingSizePrices,
  onSave,
}: ToppingItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    menuItemCategory: "",
    category: "",
    isActive: true,
  });
  const [sizePrices, setSizePrices] = useState<Record<string, number>>({});

  const isEdit = !!topping;

  // Get available sizes for the selected menu category
  const getAvailableSizes = (menuCategoryId: string) => {
    return categorySizes
      .filter((size) => size.categoryId === menuCategoryId && size.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  useEffect(() => {
    if (topping) {
      setFormData({
        name: topping.name || "",
        menuItemCategory: topping.menuItemCategory || "",
        category: topping.category || "",
        isActive: topping.isActive ?? true,
      });

      // Load existing size prices
      const existingPrices: Record<string, number> = {};
      const toppingSizes = getToppingSizePrices(topping.id);
      toppingSizes.forEach((tp) => {
        existingPrices[tp.categorySizeId] = tp.price;
      });
      setSizePrices(existingPrices);
    } else {
      resetForm();
    }
  }, [topping]);

  // Clear size prices when menu category changes
  useEffect(() => {
    if (formData.menuItemCategory) {
      const availableSizes = getAvailableSizes(formData.menuItemCategory);
      const newSizePrices: Record<string, number> = {};
      availableSizes.forEach((size) => {
        if (!sizePrices[size.id]) {
          newSizePrices[size.id] = 0;
        }
      });
      setSizePrices((prev) => ({ ...newSizePrices, ...prev }));
    }
  }, [formData.menuItemCategory]);

  const resetForm = () => {
    setFormData({
      name: "",
      menuItemCategory: "",
      category: "",
      isActive: true,
    });
    setSizePrices({});
  };

  const handleSizePriceChange = (categorySizeId: string, price: string) => {
    setSizePrices((prev) => ({
      ...prev,
      [categorySizeId]: parseFloat(price) || 0,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData, sizePrices);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to save topping:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--card-foreground)" }}>
            {topping ? "Edit Topping" : "Add New Topping"}
          </DialogTitle>
          <DialogDescription>
            {topping
              ? "Update the topping details and size-specific pricing"
              : "Create a new topping with size-specific pricing"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label
              htmlFor="name"
              style={{ color: "var(--foreground)" }}
            >
              Topping Name
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
              style={{ color: "var(--foreground)" }}
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
              htmlFor="toppingCategory"
              style={{ color: "var(--foreground)" }}
            >
              Topping Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
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
                <SelectValue placeholder="Select topping category" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                }}
              >
                {toppingCategories
                  .filter(
                    (tc) =>
                      tc.isActive &&
                      (tc.menuItemCategory === formData.menuItemCategory ||
                        !formData.menuItemCategory)
                  )
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

          {/* Right Side - Size-based Pricing */}
          <div className="space-y-2 w-full h-full">
            <h3 className="text-lg font-medium mb-0">Size-Based Pricing</h3>

            <div className="py-1 px-2 overflow-hidden border rounded">
              {formData.menuItemCategory ? (
                <div className="space-y-1">
                  {getAvailableSizes(formData.menuItemCategory).map((size) => (
                    <div
                      key={size.id}
                      className="flex items-center justify-between"
                    >
                      <Label className="text-xs min-w-[60px] font-medium">
                        {size.sizeName}
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-24 h-7 py-0 px-0 text-xs text-right"
                        value={
                          sizePrices[size.id]
                            ? sizePrices[size.id].toFixed(2)
                            : ""
                        }
                        onChange={(e) =>
                          handleSizePriceChange(size.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a menu category to see available sizes</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="lg:col-span-2 flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--card-foreground)",
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
              {topping ? "Update" : "Create"} Topping
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
