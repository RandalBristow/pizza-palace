import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RequiredFieldLabel } from "../ui/required-field-label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Category } from "../admin/MenuCategoriesForm";
import { ToppingCategory } from "../admin/ToppingCategoriesForm";

export interface Topping {
  id: string;
  name: string;
  price?: number;
  category: string;
  menuItemCategory: string;
  displayOrder: number;
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
    displayOrder: 1,
    isActive: true,
  });
  const [sizePrices, setSizePrices] = useState<Record<string, number>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

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
        displayOrder: topping.displayOrder || 1,
        isActive: topping.isActive ?? true,
      });

      // Load existing size prices
      const existingPrices: Record<string, number> = {};
      const existingInputs: Record<string, string> = {};
      const toppingSizes = getToppingSizePrices(topping.id);
      toppingSizes.forEach((tp) => {
        existingPrices[tp.categorySizeId] = tp.price;
        existingInputs[tp.categorySizeId] = tp.price.toFixed(2);
      });
      setSizePrices(existingPrices);
      setInputValues(existingInputs);
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

  // Validation: require name, menuItemCategory, and category
  const hasName = (formData.name || "").trim().length > 0;
  const hasMenuCategory = (formData.menuItemCategory || "").trim().length > 0;
  const hasToppingCategory = (formData.category || "").trim().length > 0;
  const canSave = hasName && hasMenuCategory && hasToppingCategory;

  const resetForm = () => {
    setFormData({
      name: "",
      menuItemCategory: "",
      category: "",
      displayOrder: 1,
      isActive: true,
    });
    setSizePrices({});
    setInputValues({});
  };

  const handleSizePriceChange = (categorySizeId: string, value: string) => {
    // Allow only numbers and one decimal point while typing
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (cleanValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    // Update the raw input value (what user sees)
    setInputValues((prev) => ({
      ...prev,
      [categorySizeId]: cleanValue,
    }));
  };

  const handlePriceBlur = (categorySizeId: string) => {
    // Format and save the price when user leaves the field
    const rawValue = inputValues[categorySizeId] || '0';
    const price = parseFloat(rawValue) || 0;
    
    setSizePrices((prev) => ({
      ...prev,
      [categorySizeId]: price,
    }));
    
    // Format the display value
    setInputValues((prev) => ({
      ...prev,
      [categorySizeId]: price.toFixed(2),
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md max-h-[80vh] p-0 flex flex-col"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle style={{ color: "var(--card-foreground)" }}>
            {topping ? "Edit Topping" : "Add New Topping"}
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
            {topping
              ? "Update the topping details and size-specific pricing"
              : "Create a new topping with size-specific pricing"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex-1 flex flex-col"
        >
          <div className="px-6 space-y-4 overflow-y-auto">
          <div>
            <RequiredFieldLabel
              htmlFor="name"
              style={{ color: "var(--foreground)" }}
            >
              Topping Name
            </RequiredFieldLabel>
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
            <RequiredFieldLabel
              htmlFor="menuItemCategory"
              style={{ color: "var(--foreground)" }}
            >
              Menu Category
            </RequiredFieldLabel>
            <Select
              value={formData.menuItemCategory}
              onValueChange={(value) => {
                // When menu category changes, clear the dependent topping category
                setFormData({ ...formData, menuItemCategory: value, category: "" });
              }}
              disabled={!hasName}
            >
              <SelectTrigger
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select menu category" />
              </SelectTrigger>
              <SelectContent
                className="bg-[var(--popover)] border-[var(--border)]"
              >
                {categories
                  .filter((c) => c.isActive)
                  .map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="text-[var(--popover-foreground)]"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <RequiredFieldLabel
              htmlFor="toppingCategory"
              style={{ color: "var(--foreground)" }}
            >
              Topping Category
            </RequiredFieldLabel>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              disabled={!hasName || !hasMenuCategory}
            >
              <SelectTrigger
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select topping category" />
              </SelectTrigger>
              <SelectContent
                className="bg-[var(--popover)] border-[var(--border)]"
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
                      className="text-[var(--popover-foreground)]"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="displayOrder"
              style={{ color: "var(--muted-foreground)" }}
            >
              Display Order
            </Label>
            <Input
              id="displayOrder"
              type="number"
              min="1"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })
              }
              disabled={!hasName}
              className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Lower numbers appear first in the list
            </p>
          </div>

          {hasName && hasMenuCategory && hasToppingCategory && (
            <div className="space-y-2 w-full">
              <h3 className="text-sm font-medium mb-1 text-[var(--foreground)]">Size-Based Pricing</h3>

              <div className="py-1 px-2 overflow-hidden border rounded bg-[var(--card)] border-[var(--border)]">
                {getAvailableSizes(formData.menuItemCategory).length === 0 ? (
                  <div className="text-center py-8 text-[var(--muted-foreground)]">
                    <p>No sizes defined for this topping category</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {getAvailableSizes(formData.menuItemCategory).map((size) => (
                      <div
                        key={size.id}
                        className="flex items-center justify-between py-1"
                      >
                        <Label className="text-sm font-medium text-[var(--foreground)]">
                          {size.sizeName}
                        </Label>
                        <div className="relative w-32">
                          <span 
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            $
                          </span>
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="h-9 pl-6 pr-3 text-sm text-right bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                            style={{
                              outline: 'none'
                            }}
                            value={inputValues[size.id] || ""}
                            onChange={(e) =>
                              handleSizePriceChange(size.id, e.target.value)
                            }
                            onFocus={(e) => {
                              e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = 'none';
                              handlePriceBlur(size.id);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          </div>

          {/* Form Actions */}
          <div className="lg:col-span-2 mt-0 flex justify-end space-x-2 p-6 bg-[var(--card)]">
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
              {topping ? "Update" : "Create"} Topping
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
