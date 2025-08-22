
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
  const [sizeToppings, setSizeToppings] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});
  const [defaultToppings, setDefaultToppings] = useState<{
    [key: string]: boolean;
  }>({});

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
      <DialogContent className="max-w-6xl h-[calc(68vh+100px)] flex flex-col p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update menu item details and size-based pricing"
              : "Create a new menu item with size-based pricing"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
          {/* Left Column - Item Details */}
          <div className="p-6 pl-8 border-r border-gray-200 space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEdit
                  ? "Update menu item details and size-based pricing"
                  : "Create a new menu item with size-based pricing"}
              </p>
            </div>

            {/* Category and Sub-Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-red-600">
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                <Label htmlFor="subCategory" className="text-red-600">
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories
                      .filter(
                        (sub) =>
                          sub.categoryId === formData.category && sub.isActive,
                      )
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((subCategory) => (
                        <SelectItem key={subCategory.id} value={subCategory.id}>
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
                <Label htmlFor="name" className="text-red-600">
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
              <Label htmlFor="description" className="text-red-600">
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
              />
            </div>

            {/* Size-based Pricing */}
            {formData.category && formData.subCategoryId && (
              <div>
                <Label className="text-red-600">* Size-based Pricing</Label>
                <div className="mt-1 border rounded-lg py-1 px-4">
                  {getAvailableSizes(
                    formData.category,
                    formData.subCategoryId,
                  ).length === 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
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
                        <div key={size.id} className="flex items-center space-x-2">
                          <Label className="text-xs min-w-[60px] font-medium">
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
                            className="w-24 h-7 py-0 text-xs"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.category && !formData.subCategoryId && (
              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Please select a sub-category to configure size-based pricing.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Toppings */}
          <div className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Topping Management
              </h2>
              <p className="text-sm text-gray-500">
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
                  <Label htmlFor="sizeSelect">Select Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a size to manage toppings..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSizes(
                        formData.category,
                        formData.subCategoryId,
                      ).map((size) => (
                        <SelectItem key={size.id} value={size.id}>
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
                      className="w-full h-full rounded-md overflow-hidden border-2 border-red-600"
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
                      <div className="mt-4 flex-1 overflow-y-auto">
                        {availableCategories.map((toppingCategory) => (
                          <TabsContent
                            key={toppingCategory.id}
                            value={toppingCategory.id}
                            className="mt-0 space-y-2"
                          >
                            <div className="space-y-2">
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
                                      className="flex items-center justify-between p-2 border rounded text-xs"
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
                                          className="w-3 h-3"
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
                                              className="ml-2 h-6 w-6 p-0"
                                              onClick={() =>
                                                handleToppingToggle(
                                                  topping.id,
                                                  !isActive,
                                                )
                                              }
                                            >
                                              {isActive ? (
                                                <ThumbsUp className="h-3 w-3" />
                                              ) : (
                                                <ThumbsDown className="h-3 w-3" />
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
                <div className="flex items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <p>Select category, sub-category, and size to manage toppings</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
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
              >
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Update Item" : "Save Item"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

