import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import ActivationButton from "../shared_components/ActivationButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import PriceListCard from "../shared_components/PriceListCard";
import ToppingItemDialog from "../dialog_components/ToppingItemDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus } from "lucide-react";
import { Category } from "./MenuCategoriesForm";
import { ToppingCategory } from "./ToppingCategoriesForm";

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

interface ToppingItemFormProps {
  toppings: Topping[];
  categories: Category[];
  toppingCategories: ToppingCategory[];
  categorySizes: CategorySize[];
  toppingSizePrices: any[];
  selectedToppingCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  createTopping: (topping: any) => Promise<any>;
  updateTopping: (id: string, updates: any) => Promise<any>;
  deleteTopping: (id: string) => Promise<void>;
  updateToppingSizePrices: (
    toppingId: string,
    sizePrices: { categorySizeId: string; price: number }[],
  ) => Promise<void>;
  getToppingSizePrices: (toppingId: string) => any[];
  getToppingPriceForSize: (toppingId: string, categorySizeId: string) => number;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function ToppingItemForm({
  toppings,
  categories,
  toppingCategories,
  categorySizes,
  toppingSizePrices,
  selectedToppingCategory,
  onSelectedCategoryChange,
  createTopping,
  updateTopping,
  deleteTopping,
  updateToppingSizePrices,
  getToppingSizePrices,
  getToppingPriceForSize,
  showTitle = true,
  hideAddButton = false,
}: ToppingItemFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  // Using shared DeleteButton's internal confirm dialog; no local confirm state needed

  const handleSave = async (toppingData: any, sizePrices: Record<string, number>) => {
    try {
      let toppingId: string;
      
      if (editingTopping) {
        await updateTopping(editingTopping.id, toppingData);
        toppingId = editingTopping.id;
      } else {
        const createdTopping = await createTopping(toppingData);
        toppingId = createdTopping.id;
      }

      // Update size prices
      const sizePriceEntries = Object.entries(sizePrices).map(
        ([categorySizeId, price]) => ({ categorySizeId, price: price || 0 }),
      );

      // Always call to ensure existing rows are cleared when list is empty
      await updateToppingSizePrices(toppingId, sizePriceEntries);

      setEditingTopping(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "An unknown error occurred";
      console.error("Failed to save topping:", errorMessage);
      alert(`Failed to save topping: ${errorMessage}`);
      throw error;
    }
  };

  const handleEditTopping = (topping: Topping) => {
    setEditingTopping(topping);
    setIsDialogOpen(true);
  };

  const handleDeleteTopping = async (id: string) => {
    try {
      await deleteTopping(id);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "An unknown error occurred";
      console.error("Failed to delete topping:", errorMessage);
      alert(`Failed to delete topping: ${errorMessage}`);
    }
  };

  const toggleToppingStatus = async (id: string) => {
    const topping = toppings.find((t) => t.id === id);
    if (!topping) return;

    try {
      await updateTopping(id, { ...topping, isActive: !topping.isActive });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "An unknown error occurred";
      console.error("Failed to toggle topping status:", errorMessage);
      alert(`Failed to toggle topping status: ${errorMessage}`);
    }
  };

  const filteredToppings = toppings.filter(
    (topping) =>
      selectedToppingCategory === "all" ||
      topping.menuItemCategory === selectedToppingCategory,
  );

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Toppings</h2>
            <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Manage topping items with size-specific pricing
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedToppingCategory}
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
              <SelectItem value="all" style={{ color: 'var(--popover-foreground)' }}>All Menu Categories</SelectItem>
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
              onClick={() => setIsDialogOpen(true)}
              className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)'
              }}
            >
              <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
              Add Topping
            </Button>
          )}
        </div>
      </div>

      {/* Toppings List - Table Layout */}
      {filteredToppings.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: 'var(--muted-foreground)' }}>No toppings found for the selected category.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((menuCategory) => {
            const menuCategoryToppings = filteredToppings.filter(
              (topping) => topping.menuItemCategory === menuCategory.id,
            );
            if (menuCategoryToppings.length === 0) return null;

            // Group by topping category within this menu category
            const toppingCategoryGroups = toppingCategories.reduce((acc, toppingCategory) => {
              const categoryToppings = menuCategoryToppings.filter(
                (topping) => topping.category === toppingCategory.id,
              );
              if (categoryToppings.length > 0) {
                acc.push({
                  toppingCategory,
                  toppings: categoryToppings,
                });
              }
              return acc;
            }, [] as { toppingCategory: ToppingCategory; toppings: Topping[] }[]);

            if (toppingCategoryGroups.length === 0) return null;

            // Get unique sizes for this menu category
            const menuCategorySizes = categorySizes
              .filter((size) => size.categoryId === menuCategory.id && size.isActive)
              .sort((a, b) => a.displayOrder - b.displayOrder);

            return (
              <div key={menuCategory.id}>
                {/* Menu Category Header */}
                <h3 
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{ 
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)',
                  }}
                >
                  {menuCategory.name}
                </h3>

                {/* Tables Grid for this Category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {toppingCategoryGroups.map(({ toppingCategory, toppings: categoryToppings }) => (
                  <div key={`${menuCategory.id}-${toppingCategory.id}`} className="flex flex-col h-full">
                    <h4 
                      className="font-semibold text-sm mb-1 px-2 py-1 rounded-t-lg text-center" 
                      style={{ 
                        color: 'var(--card-foreground)',
                        backgroundColor: 'var(--muted)',
                      }}
                    >
                      {toppingCategory.name}
                    </h4>
                    <div className="overflow-x-auto rounded-lg flex-1" style={{ border: '1px solid var(--border)' }}>
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                            <th className="text-left py-1 px-2 font-medium text-xs" style={{ color: 'var(--foreground)', width: '140px' }}>
                              Name
                            </th>
                            {menuCategorySizes.map((size) => (
                              <th 
                                key={size.id} 
                                className="text-center py-1 px-1 font-medium text-xs" 
                                style={{ color: 'var(--foreground)', width: '70px' }}
                              >
                                {size.sizeName}
                              </th>
                            ))}
                            <th className="text-center py-1 px-2 font-medium text-xs" style={{ color: 'var(--foreground)', width: '100px' }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryToppings.map((topping, index) => (
                            <tr 
                              key={topping.id}
                              style={{ 
                                backgroundColor: index % 2 === 0 ? 'var(--card)' : 'var(--accent)',
                                borderBottom: '1px solid var(--border)',
                              }}
                            >
                              <td className="py-1 px-2 text-xs" style={{ color: 'var(--foreground)' }}>
                                <div className="flex items-center gap-2">
                                  <span 
                                    className="inline-flex items-center justify-center h-5 min-w-5 px-2 text-xs font-mono tabular-nums rounded-full border"
                                    style={{
                                      backgroundColor: 'var(--accent)',
                                      borderColor: 'var(--border)',
                                      color: 'var(--accent-foreground)',
                                    }}
                                  >
                                    {topping.displayOrder}
                                  </span>
                                  <span className={topping.isActive ? '' : 'opacity-50'}>
                                    {topping.name}
                                  </span>
                                </div>
                              </td>
                              {menuCategorySizes.map((size) => {
                                const price = getToppingPriceForSize(topping.id, size.id);
                                return (
                                  <td 
                                    key={size.id} 
                                    className="text-center py-1 px-1 font-mono text-xs"
                                    style={{ color: 'var(--muted-foreground)' }}
                                  >
                                    ${price.toFixed(2)}
                                  </td>
                                );
                              })}
                              <td className="py-1 px-2">
                                <div className="flex items-center justify-center gap-0.5">
                                  <ActivationButton
                                    isActive={topping.isActive}
                                    onToggle={() => toggleToppingStatus(topping.id)}
                                    activeTooltip="Deactivate"
                                    inactiveTooltip="Activate"
                                  />
                                  <EditButton
                                    label="Edit Topping"
                                    onClick={() => handleEditTopping(topping)}
                                  />
                                  <DeleteButton
                                    entityTitle="Topping"
                                    subjectName={topping.name}
                                    onConfirm={() => handleDeleteTopping(topping.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ToppingItemDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTopping(null);
        }}
        topping={editingTopping}
        categories={categories}
        toppingCategories={toppingCategories}
        categorySizes={categorySizes}
        getToppingSizePrices={getToppingSizePrices}
        onSave={handleSave}
      />
    </div>
  );
}
