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
  onSave: (toppingData: any, sizePrices: Record<string, number>) => Promise<void>;
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Topping" : "Add New Topping"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the topping details and size-specific pricing"
              : "Create a new topping with size-specific pricing"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>

            <div>
              <Label htmlFor="menuItemCategory">Menu Category *</Label>
              <Select
                value={formData.menuItemCategory}
                onValueChange={(value) => {
                  setFormData({ ...formData, menuItemCategory: value });
                  setSizePrices({}); // Reset size prices when category changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select menu category..." />
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
              <Label htmlFor="toppingCategory">Topping Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topping category..." />
                </SelectTrigger>
                <SelectContent>
                  {toppingCategories
                    .filter(
                      (tc) =>
                        tc.isActive &&
                        (tc.menuItemCategory === formData.menuItemCategory ||
                          !formData.menuItemCategory),
                    )
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="toppingName">Topping Name *</Label>
              <Input
                id="toppingName"
                placeholder="e.g., Pepperoni"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Right Side - Size-based Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Size-based Pricing</h3>

            {formData.menuItemCategory ? (
              <div className="space-y-3">
                {getAvailableSizes(formData.menuItemCategory).map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center justify-between space-x-3"
                  >
                    <Label className="flex-1 text-sm font-medium">
                      {size.sizeName}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-20 text-right"
                        value={sizePrices[size.id] || ""}
                        onChange={(e) =>
                          handleSizePriceChange(size.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select a menu category to see available sizes</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="lg:col-span-2 flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                !formData.menuItemCategory ||
                !formData.category
              }
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Topping" : "Save Topping"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}