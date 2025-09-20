import { useState, useEffect, useMemo, useCallback } from "react";
import MenuItem from "../page_components/MenuItem";
import MenuItemDialog from "../dialog_components/MenuItemDialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus } from "lucide-react";
import { Category } from "./MenuCategoriesForm";

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
  showTitle?: boolean;
  hideAddButton?: boolean;
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
  showTitle = true,
  hideAddButton = false,
}: MenuItemFormProps) {
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  const handleSaveMenuItem = async (
    menuItemData: any,
    sizePrices: any,
    defaultToppings: string[],
  ) => {
    try {
      if (editingMenuItem) {
        // Update existing item
        await updateMenuItem(editingMenuItem.id, {
          ...menuItemData,
          defaultToppings,
        });

        // Update size-based pricing
        const sizes = Object.keys(sizePrices).map((sizeId) => ({
          categorySizeId: sizeId,
          price: sizePrices[sizeId] || 0,
        }));

        if (updateMenuItemSizesForItem) {
          await updateMenuItemSizesForItem(editingMenuItem.id, sizes);
        }
      } else {
        // Create new item
        const createdMenuItem = await createMenuItem({
          ...menuItemData,
          defaultToppings,
        });

        // Create size-based pricing
        const sizes = Object.keys(sizePrices).map((sizeId) => ({
          categorySizeId: sizeId,
          price: sizePrices[sizeId] || 0,
        }));

        if (sizes.length > 0 && updateMenuItemSizesForItem) {
          await updateMenuItemSizesForItem(createdMenuItem.id, sizes);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "An unknown error occurred";
      console.error("Failed to save menu item:", errorMessage);
      alert(`Failed to save menu item: ${errorMessage}`);
      throw error; // Re-throw to prevent dialog from closing
    }
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
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

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Menu Items</h2>
            <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Manage menu items with size-based pricing and toppings
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedMenuCategory}
            onValueChange={onSelectedCategoryChange}
          >
            <SelectTrigger 
              className="w-48"
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
            >
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
              <SelectItem value="all" style={{ color: 'var(--popover-foreground)' }}>All Categories</SelectItem>
              {categories
                .filter((c) => c.isActive)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id} style={{ color: 'var(--popover-foreground)' }}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!hideAddButton && (
            <Button 
              onClick={() => setIsAddingMenuItem(true)}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)',
                transition: 'all 0.2s ease'
              }}
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
              <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
              Add Menu Item
            </Button>
          )}
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

      {filteredMenuItems.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: 'var(--muted-foreground)' }}>
            No menu items found for the selected category.
          </p>
        </div>
      )}

      {/* Add Menu Item Dialog */}
      <MenuItemDialog
        isOpen={isAddingMenuItem}
        onClose={() => setIsAddingMenuItem(false)}
        categories={categories}
        subCategories={subCategories}
        toppingCategories={toppingCategories}
        toppings={toppings}
        categorySizes={categorySizes}
        subCategorySizes={subCategorySizes}
        menuItemSizes={menuItemSizes}
        images={images}
        onSave={handleSaveMenuItem}
        getToppingPriceForSize={getToppingPriceForSize}
      />

      {/* Edit Menu Item Dialog */}
      <MenuItemDialog
        isOpen={editingMenuItem !== null}
        onClose={() => setEditingMenuItem(null)}
        menuItem={editingMenuItem}
        categories={categories}
        subCategories={subCategories}
        toppingCategories={toppingCategories}
        toppings={toppings}
        categorySizes={categorySizes}
        subCategorySizes={subCategorySizes}
        menuItemSizes={menuItemSizes}
        images={images}
        onSave={handleSaveMenuItem}
        getToppingPriceForSize={getToppingPriceForSize}
      />
    </div>
  );
}
