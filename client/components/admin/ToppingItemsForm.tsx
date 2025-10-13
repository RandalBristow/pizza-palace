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

      {/* Toppings List */}
      {filteredToppings.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: 'var(--muted-foreground)' }}>No toppings found for the selected category.</p>
        </div>
      ) : (
        <div className="space-y-6">
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

            return (
              <div key={menuCategory.id} className="space-y-4">
                {toppingCategoryGroups.map(({ toppingCategory, toppings: categoryToppings }) => (
                  <div key={`${menuCategory.id}-${toppingCategory.id}`} className="rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
                    <h4 className="font-semibold text-lg mb-3 flex items-center" style={{ color: 'var(--card-foreground)' }}>
                      {menuCategory.name}: {toppingCategory.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {categoryToppings.map((topping) => {
                        const toppingSizes = getToppingSizePrices(topping.id);
                        const priceList = toppingSizes
                          .map((ts) => {
                            const size = categorySizes.find((cs) => cs.id === ts.categorySizeId);
                            if (!size) return null;
                            return { label: size.sizeName, value: ts.price };
                          })
                          .filter(Boolean) as { label: string; value: number }[];

                        return (
                          <PriceListCard
                            key={topping.id}
                            title={topping.name}
                            isActive={topping.isActive}
                            priceList={priceList}
                            rightActions={
                              <>
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
                              </>
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
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
