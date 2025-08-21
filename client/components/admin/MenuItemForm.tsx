import { useState, useEffect, useMemo, useCallback } from "react";
import MenuItem from "../page_components/MenuItem";
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
  DialogTrigger,
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
  Plus,
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
import { Category } from "./MenuCategoryForm";

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

interface MenuItemFormProps {
  menuItems: MenuItem[];
  categories: Category[];
  subCategories?: any[];
  toppingCategories: ToppingCategory[];
  toppings: Topping[];
  categorySizes?: CategorySize[];
  subCategorySizes?: any[];
  menuItemSizes?: any[];
  menuItemSizeToppings?: any[];
  toppingSizePrices?: any[];
  images?: any[];
  selectedMenuCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  createMenuItem: (menuItem: any) => Promise<any>;
  updateMenuItem: (id: string, updates: any) => Promise<any>;
  deleteMenuItem: (id: string) => Promise<void>;
  updateMenuItemSizesForItem?: (
    menuItemId: string,
    sizes: any[],
  ) => Promise<void>;
  updateMenuItemSizeToppings?: (
    menuItemSizeId: string,
    toppings: any[],
  ) => Promise<void>;
  getToppingPriceForSize?: (
    toppingId: string,
    categorySizeId: string,
  ) => number;
}

export default function MenuItemForm({
  menuItems,
  categories,
  subCategories = [],
  toppingCategories,
  toppings,
  categorySizes = [],
  subCategorySizes = [],
  menuItemSizes = [],
  menuItemSizeToppings = [],
  toppingSizePrices = [],
  images = [],
  selectedMenuCategory,
  onSelectedCategoryChange,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuItemSizesForItem,
  updateMenuItemSizeToppings,
  getToppingPriceForSize,
}: MenuItemFormProps) {
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    category: "",
    subCategoryId: undefined,
    imageId: undefined,
    isActive: true,
  });
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(
    undefined,
  );

  // Size-based pricing state
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizePrices, setSizePrices] = useState<{ [key: string]: number }>({});
  const [sizeToppings, setSizeToppings] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  // Default toppings state (per menu item, not per size)
  const [defaultToppings, setDefaultToppings] = useState<{
    [key: string]: boolean;
  }>({});

  const handleAddMenuItem = async () => {
    try {
      const defaultToppingsArray = Object.keys(defaultToppings).filter(
        (toppingId) => defaultToppings[toppingId],
      );

      const createdMenuItem = await createMenuItem({
        ...newMenuItem,
        imageId: selectedImageId,
        defaultToppings: defaultToppingsArray,
      });

      // Create size-based pricing
      const sizes = Object.keys(sizePrices).map((sizeId) => ({
        categorySizeId: sizeId,
        price: sizePrices[sizeId] || 0,
      }));

      if (sizes.length > 0 && updateMenuItemSizesForItem) {
        await updateMenuItemSizesForItem(createdMenuItem.id, sizes);
      }

      setIsAddingMenuItem(false);
      resetForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : error && typeof error === "object" && "message" in error
              ? String(error.message)
              : error && typeof error === "object" && "details" in error
                ? String(error.details)
                : error && typeof error === "object" && "hint" in error
                  ? String(error.hint)
                  : "An unknown error occurred";
      console.error("Failed to create menu item:", errorMessage);
      alert(`Failed to create menu item: ${errorMessage}`);
    }
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setNewMenuItem({
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
  };

  const handleUpdateMenuItem = async () => {
    if (!editingMenuItem) return;

    try {
      const defaultToppingsArray = Object.keys(defaultToppings).filter(
        (toppingId) => defaultToppings[toppingId],
      );

      await updateMenuItem(editingMenuItem.id, {
        ...newMenuItem,
        imageId: selectedImageId,
        defaultToppings: defaultToppingsArray,
      });

      // Update size-based pricing
      const sizes = Object.keys(sizePrices).map((sizeId) => ({
        categorySizeId: sizeId,
        price: sizePrices[sizeId] || 0,
      }));

      if (updateMenuItemSizesForItem) {
        await updateMenuItemSizesForItem(editingMenuItem.id, sizes);
      }

      setEditingMenuItem(null);
      resetForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : error && typeof error === "object" && "message" in error
              ? String(error.message)
              : error && typeof error === "object" && "details" in error
                ? String(error.details)
                : error && typeof error === "object" && "hint" in error
                  ? String(error.hint)
                  : "An unknown error occurred";
      console.error("Failed to update menu item:", errorMessage);
      alert(`Failed to update menu item: ${errorMessage}`);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    }
  };

  const toggleMenuItemStatus = async (id: string) => {
    const menuItem = menuItems.find((item) => item.id === id);
    if (!menuItem) return;

    try {
      await updateMenuItem(id, { ...menuItem, isActive: !menuItem.isActive });
    } catch (error) {
      console.error("Failed to toggle menu item status:", error);
    }
  };

  const resetForm = () => {
    setNewMenuItem({
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

    // Get sizes that are linked to this sub-category
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

    // If deactivating, also uncheck from default toppings
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

  const getMenuItemPrice = (menuItem: MenuItem) => {
    const itemSizes = menuItemSizes.filter(
      (ms) => ms.menu_item_id === menuItem.id,
    );
    if (itemSizes.length === 0) return "No pricing";

    const prices = itemSizes.map((itemSize) => itemSize.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `$${minPrice.toFixed(2)}`;
    }
    return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  };

  const filteredMenuItems =
    selectedMenuCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedMenuCategory);

  const renderMenuItemForm = (isEdit: boolean = false) => (
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
              value={newMenuItem.category}
              onValueChange={(value) => {
                setNewMenuItem({
                  ...newMenuItem,
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
              value={newMenuItem.subCategoryId || ""}
              onValueChange={(value) => {
                setNewMenuItem({
                  ...newMenuItem,
                  subCategoryId: value || undefined,
                });
                // Clear size prices when sub-category changes
                setSizePrices({});
                setSelectedSize("");
              }}
              disabled={!newMenuItem.category}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories
                  .filter(
                    (sub) =>
                      sub.categoryId === newMenuItem.category && sub.isActive,
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
              value={newMenuItem.name}
              onChange={(e) =>
                setNewMenuItem({
                  ...newMenuItem,
                  name: e.target.value,
                })
              }
              placeholder="Item name"
              required
            />
          </div>

          <div>
            {/* Image Selector */}
            <ImageSelector
              images={images}
              selectedImageId={selectedImageId}
              onImageSelect={(imageId, imageUrl) => {
                setSelectedImageId(imageId);
                setNewMenuItem({ ...newMenuItem, image: imageUrl || "" });
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
            value={newMenuItem.description}
            onChange={(e) =>
              setNewMenuItem({
                ...newMenuItem,
                description: e.target.value,
              })
            }
            placeholder="Item description"
            rows={3}
            required
          />
        </div>

        {/* Size-based Pricing - Scrollable */}
        {newMenuItem.category && newMenuItem.subCategoryId && (
          <div>
            <Label className="text-red-600">* Size-based Pricing</Label>
            <div className="mt-1 border rounded-lg py-1 px-4">
              {getAvailableSizes(
                newMenuItem.category,
                newMenuItem.subCategoryId,
              ).length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    No sizes defined for this sub-category. Please configure
                    sizes for the sub-category first.
                  </p>
                  <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                    Debug Info:
                    <br />
                    Category: {newMenuItem.category}
                    <br />
                    SubCategory: {newMenuItem.subCategoryId}
                    <br />
                    SubCategorySizes loaded: {subCategorySizes.length}
                    <br />
                    CategorySizes loaded: {categorySizes.length}
                  </div>
                </div>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                  {getAvailableSizes(
                    newMenuItem.category,
                    newMenuItem.subCategoryId,
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

        {/* Show message if category selected but no sub-category */}
        {newMenuItem.category && !newMenuItem.subCategoryId && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Please select a sub-category to configure size-based pricing.
            </p>
          </div>
        )}
      </div>

      {/* Right Column - Size Selection and Toppings */}
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
        {newMenuItem.category &&
          newMenuItem.subCategoryId &&
          getAvailableSizes(newMenuItem.category, newMenuItem.subCategoryId)
            .length > 0 && (
            <div className="mb-4">
              <Label htmlFor="sizeSelect">Select Size</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a size to manage toppings..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSizes(
                    newMenuItem.category,
                    newMenuItem.subCategoryId,
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

        {/* Toppings content that grows to fill space */}
        <div className="flex-1 overflow-hidden">
          {newMenuItem.category && selectedSize ? (
            (() => {
              const availableCategories = toppingCategories.filter(
                (tc) =>
                  tc.menuItemCategory === newMenuItem.category && tc.isActive,
              );
              return (
                <Tabs
                  defaultValue={availableCategories[0]?.id}
                  className="w-full h-full rounded-md overflow-hidden border-2 border-red-600"
                  key={`${newMenuItem.category}-${selectedSize}`}
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
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a category and size to manage toppings</p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (isEdit) {
                setEditingMenuItem(null);
              } else {
                setIsAddingMenuItem(false);
              }
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={isEdit ? handleUpdateMenuItem : handleAddMenuItem}
            disabled={
              !newMenuItem.name ||
              !newMenuItem.description ||
              !newMenuItem.category ||
              !newMenuItem.subCategoryId ||
              getAvailableSizes(newMenuItem.category, newMenuItem.subCategoryId)
                .length === 0 ||
              getAvailableSizes(
                newMenuItem.category,
                newMenuItem.subCategoryId,
              ).some((size) => !sizePrices[size.id] || sizePrices[size.id] <= 0)
            }
          >
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? "Update Item" : "Save Item"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <p className="text-gray-600 mt-1">
            Manage menu items with size-based pricing and toppings
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedMenuCategory}
            onValueChange={onSelectedCategoryChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories
                .filter((c) => c.isActive)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddingMenuItem} onOpenChange={setIsAddingMenuItem}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl h-[calc(68vh+100px)] flex flex-col p-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              {renderMenuItemForm(false)}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMenuItems.map((menuItem) => {
          const menuItemImage = menuItem.imageId
            ? images.find((img) => img.id === menuItem.imageId)
            : null;

          return (
            <MenuItem
              key={menuItem.id}
              menuItem={menuItem}
              menuItemImage={menuItemImage}
              getMenuItemPrice={getMenuItemPrice}
              toggleMenuItemStatus={toggleMenuItemStatus}
              handleEditMenuItem={handleEditMenuItem}
              handleDeleteMenuItem={handleDeleteMenuItem}
            />
          );
        })}
      </div>

      {/* Edit Menu Item Dialog */}
      <Dialog
        open={editingMenuItem !== null}
        onOpenChange={(open) => !open && setEditingMenuItem(null)}
      >
        <DialogContent className="max-w-6xl h-[calc(68vh+100px)] flex flex-col p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update the menu item details</DialogDescription>
          </DialogHeader>
          {renderMenuItemForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
