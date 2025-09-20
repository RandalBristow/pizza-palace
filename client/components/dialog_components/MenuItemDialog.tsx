import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Save,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ImageSelector from "../ui/image-selector";
import { Category } from "../admin/MenuCategoriesForm";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategoryId?: string;
  imageId?: string;
  isActive: boolean;
  image?: string;
  defaultToppings?: string[];
}

export interface ToppingCategory {
  id: string;
  name: string;
  menuItemCategory: string;
  order: number;
  isActive: boolean;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
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

interface MenuItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem?: MenuItem | null;
  categories: Category[];
  subCategories?: any[];
  toppingCategories: ToppingCategory[];
  toppings: Topping[];
  categorySizes?: CategorySize[];
  subCategorySizes?: any[];
  menuItemSizes?: any[];
  images?: any[];
  onSave: (menuItemData: any, sizePrices: any, defaultToppings: string[]) => Promise<void>;
  getToppingPriceForSize?: (toppingId: string, sizeId: string) => number;
}

export default function MenuItemDialog({
  isOpen,
  onClose,
  menuItem,
  categories,
  subCategories = [],
  toppingCategories,
  toppings,
  categorySizes = [],
  subCategorySizes = [],
  menuItemSizes = [],
  images = [],
  onSave,
  getToppingPriceForSize,
}: MenuItemDialogProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    category: "",
    subCategoryId: undefined,
    imageId: undefined,
    isActive: true,
  });
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizePrices, setSizePrices] = useState<{ [key: string]: number }>({});
  const [sizeToppings, setSizeToppings] = useState<{ [key: string]: { [key: string]: boolean }; }>({});
  const [defaultToppings, setDefaultToppings] = useState<{ [key: string]: boolean; }>({});

  const isEdit = !!menuItem;

  useEffect(() => {
    if (menuItem) {
      setFormData({
        ...menuItem,
        name: menuItem.name || "",
        description: menuItem.description || "",
        category: menuItem.category || "",
        subCategoryId: menuItem.subCategoryId,
        imageId: menuItem.imageId,
        isActive: menuItem.isActive ?? true,
      });

      setSelectedImageId(menuItem.imageId);

      // Load existing prices for this menu item
      const itemSizes = menuItemSizes.filter(
        (ms) => ms.menu_item_id === menuItem.id,
      );
      const prices: { [key: string]: number } = {};
      itemSizes.forEach((itemSize) => {
        prices[itemSize.category_size_id] = itemSize.price;
      });
      setSizePrices(prices);

      // Set default selected size to first available size
      const availableSizes = getAvailableSizes(
        menuItem.category,
        menuItem.subCategoryId,
      );
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0].id);
      }

      // Load default toppings
      if (menuItem.defaultToppings && Array.isArray(menuItem.defaultToppings)) {
        const defaultToppingsMap: { [key: string]: boolean } = {};
        menuItem.defaultToppings.forEach((toppingId: string) => {
          defaultToppingsMap[toppingId] = true;
        });
        setDefaultToppings(defaultToppingsMap);
      }
    } else {
      resetForm();
    }
  }, [menuItem, menuItemSizes]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      subCategoryId: undefined,
      imageId: undefined,
      isActive: true,
    });
    setSelectedImageId(undefined);
    setSizePrices({});
    setSizeToppings({});
    setDefaultToppings({});
    setSelectedSize("");
  };

  const getAvailableSizes = (categoryId: string, subCategoryId?: string) => {
    if (!subCategoryId) {
      return [];
    }

    const subCategorySizeIds = subCategorySizes
      .filter((scs) => scs.subCategoryId === subCategoryId)
      .map((scs) => scs.categorySizeId);

    const availableSizes = categorySizes
      .filter(
        (size) =>
          size.categoryId === categoryId &&
          size.isActive &&
          subCategorySizeIds.includes(size.id),
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return availableSizes;
  };

  const handleSizePriceChange = (sizeId: string, price: number) => {
    setSizePrices((prev) => ({
      ...prev,
      [sizeId]: price,
    }));
  };

  const handleToppingToggle = (toppingId: string, isActive: boolean) => {
    if (!selectedSize) return;

    setSizeToppings((prev) => ({
      ...prev,
      [selectedSize]: {
        ...prev[selectedSize],
        [toppingId]: isActive,
      },
    }));

    if (!isActive && defaultToppings[toppingId]) {
      setDefaultToppings((prev) => ({
        ...prev,
        [toppingId]: false,
      }));
    }
  };

  const handleDefaultToppingToggle = (
    toppingId: string,
    isDefault: boolean,
  ) => {
    setDefaultToppings((prev) => ({
      ...prev,
      [toppingId]: isDefault,
    }));
  };

  const handleSave = async () => {
    try {
      const defaultToppingsArray = Object.keys(defaultToppings).filter(
        (toppingId) => defaultToppings[toppingId],
      );

      await onSave(
        {
          ...formData,
          imageId: selectedImageId,
        },
        sizePrices,
        defaultToppingsArray
      );

      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to save menu item:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl h-[calc(68vh+100px)] flex flex-col p-0"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle style={{ color: 'var(--card-foreground)' }}>
            {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
            {isEdit
              ? "Update menu item details and size-based pricing"
              : "Create a new menu item with size-based pricing"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
          {/* Left Column - Item Details */}
          <div className="p-6 pl-8 space-y-4" style={{ borderRight: '1px solid var(--border)' }}>
            <div className="mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {isEdit
                  ? "Update menu item details and size-based pricing"
                  : "Create a new menu item with size-based pricing"}
              </p>
            </div>

            {/* Category and Sub-Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" style={{ color: 'var(--destructive)' }}>
                  * Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      category: value,
                      subCategoryId: undefined,
                    });
                    setSizePrices({});
                    setSizeToppings({});
                    setSelectedSize("");
                  }}
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
                    <SelectValue placeholder="Select category" style={{ color: 'var(--muted-foreground)' }} />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    {categories
                      .filter((c) => c.isActive)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id} style={{ color: 'var(--popover-foreground)' }}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subCategory" style={{ color: 'var(--destructive)' }}>
                  * Sub-Category
                </Label>
                <Select
                  value={formData.subCategoryId || ""}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      subCategoryId: value || undefined,
                    });
                    setSizePrices({});
                    setSelectedSize("");
                  }}
                  disabled={!formData.category}
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
                    <SelectValue placeholder="Select sub-category" style={{ color: 'var(--muted-foreground)' }} />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    {subCategories
                      .filter(
                        (sub) =>
                          sub.categoryId === formData.category && sub.isActive,
                      )
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((subCategory) => (
                        <SelectItem key={subCategory.id} value={subCategory.id} style={{ color: 'var(--popover-foreground)' }}>
                          {subCategory.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Name and Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" style={{ color: 'var(--destructive)' }}>
                  * Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Item name"
                  required
                  style={{
                    backgroundColor: 'var(--input)',
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = `0 0 0 2px var(--ring)`;
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <ImageSelector
                  images={images}
                  selectedImageId={selectedImageId}
                  onImageSelect={(imageId, imageUrl) => {
                    setSelectedImageId(imageId);
                    setFormData({ ...formData, image: imageUrl || "" });
                  }}
                  placeholder="Select an image (optional)..."
                  label="Menu Item Image"
                  required={false}
                  showPreview={false}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" style={{ color: 'var(--destructive)' }}>
                * Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                placeholder="Item description"
                rows={3}
                required
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = `0 0 0 2px var(--ring)`;
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Size-based Pricing */}
            {formData.category && formData.subCategoryId && (
              <div>
                <Label style={{ color: 'var(--destructive)' }}>* Size-based Pricing</Label>
                <div className="mt-1 rounded-lg py-1 px-4" style={{ border: '1px solid var(--border)' }}>
                  {getAvailableSizes(
                    formData.category,
                    formData.subCategoryId,
                  ).length === 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        No sizes defined for this sub-category. Please configure
                        sizes for the sub-category first.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                      {getAvailableSizes(
                        formData.category,
                        formData.subCategoryId,
                      ).map((size) => (
                        <div key={size.id} className="flex items-center justify-between">
                          <Label className="text-xs min-w-[60px] font-medium" style={{ color: 'var(--foreground)' }}>
                            {size.sizeName}:
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={sizePrices[size.id] || ""}
                            onChange={(e) =>
                              handleSizePriceChange(
                                size.id,
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-24 h-7 py-0 px-0 text-xs text-right"
                            required
                            style={{
                              backgroundColor: 'var(--input)',
                              borderColor: 'var(--border)',
                              border: '1px solid var(--border)',
                              color: 'var(--foreground)',
                              outline: 'none'
                            }}
                            onFocus={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.boxShadow = `0 0 0 2px var(--ring)`;
                            }}
                            onBlur={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.category && !formData.subCategoryId && (
              <div className="rounded-lg p-3" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--accent)' }}>
                <p className="text-sm" style={{ color: 'var(--card-foreground)' }}>
                  Please select a sub-category to configure size-based pricing.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Toppings */}
          <div className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                Topping Management
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Select a size to enable/disable toppings. Check boxes to set default
                toppings for this menu item.
              </p>
            </div>

            {/* Size Dropdown */}
            {formData.category &&
              formData.subCategoryId &&
              getAvailableSizes(formData.category, formData.subCategoryId)
                .length > 0 && (
                <div className="mb-4">
                  <Label htmlFor="sizeSelect" style={{ color: 'var(--foreground)' }}>Select Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
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
                      <SelectValue placeholder="Select a size to manage toppings..." style={{ color: 'var(--muted-foreground)' }} />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                      {getAvailableSizes(
                        formData.category,
                        formData.subCategoryId,
                      ).map((size) => (
                        <SelectItem key={size.id} value={size.id} style={{ color: 'var(--popover-foreground)' }}>
                          {size.sizeName} - $
                          {sizePrices[size.id]?.toFixed(2) || "0.00"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            {/* Toppings Tabs */}
            <div className="flex-1 overflow-hidden">
              {formData.category && selectedSize ? (
                (() => {
                  const availableCategories = toppingCategories.filter(
                    (tc) =>
                      tc.menuItemCategory === formData.category && tc.isActive,
                  );
                  return (
                    <Tabs
                      defaultValue={availableCategories[0]?.id}
                      className="w-full h-full overflow-hidden border rounded"
                      key={`${formData.category}-${selectedSize}`}
                    >
                      <TabsList className="w-full justify-start">
                        {availableCategories.map((toppingCategory) => (
                          <TabsTrigger
                            key={toppingCategory.id}
                            value={toppingCategory.id}
                            className="text-xs"
                          >
                            {toppingCategory.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <div className="mt-3 flex-1 overflow-y-auto">
                        {availableCategories.map((toppingCategory) => (
                          <TabsContent
                            key={toppingCategory.id}
                            value={toppingCategory.id}
                            className="mt-0 space-y-2"
                          >
                            <div className="space-y-1">
                              {toppings
                                .filter(
                                  (t) =>
                                    t.category === toppingCategory.id && t.isActive,
                                )
                                .map((topping) => {
                                  const isActive =
                                    sizeToppings[selectedSize]?.[topping.id] ??
                                    true;
                                  const isDefault =
                                    defaultToppings[topping.id] ?? false;
                                  const toppingPrice = getToppingPriceForSize
                                    ? getToppingPriceForSize(
                                        topping.id,
                                        selectedSize,
                                      )
                                    : topping.price || 0;

                                  return (
                                    <div
                                      key={topping.id}
                                      className="flex items-center justify-between mx-1 py-1 px-2 border rounded text-xs"
                                    >
                                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        <Checkbox
                                          id={`default-${topping.id}`}
                                          checked={isDefault && isActive}
                                          disabled={!isActive}
                                          onCheckedChange={(checked) =>
                                            handleDefaultToppingToggle(
                                              topping.id,
                                              !!checked,
                                            )
                                          }
                                          className="w-4 h-4"
                                        />
                                        <div className="flex flex-col flex-1 min-w-0">
                                          <span className="font-medium truncate">
                                            {topping.name}
                                          </span>
                                          <span className="text-gray-500">
                                            +${toppingPrice.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                handleToppingToggle(
                                                  topping.id,
                                                  !isActive,
                                                )
                                              }
                                            >
                                              {isActive ? (
                                                <ThumbsUp className="h-4 w-4" />
                                              ) : (
                                                <ThumbsDown className="h-4 w-4" />
                                              )}
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {isActive ? "Deactivate" : "Activate"}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabsContent>
                        ))}
                      </div>
                    </Tabs>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <div className="text-center">
                    <p>Select category, sub-category, and size to manage toppings</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
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
                disabled={
                  !formData.name ||
                  !formData.description ||
                  !formData.category ||
                  !formData.subCategoryId ||
                  getAvailableSizes(formData.category, formData.subCategoryId)
                    .length === 0 ||
                  getAvailableSizes(
                    formData.category,
                    formData.subCategoryId,
                  ).some((size) => !sizePrices[size.id] || sizePrices[size.id] <= 0)
                }
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)',
                  cursor: (!formData.name || !formData.description || !formData.category || !formData.subCategoryId || getAvailableSizes(formData.category, formData.subCategoryId).length === 0 || getAvailableSizes(formData.category, formData.subCategoryId).some((size) => !sizePrices[size.id] || sizePrices[size.id] <= 0)) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'translateY(-1px)';
                    target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
                {isEdit ? "Update Item" : "Save Item"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

