import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import ToppingItemDialog from "../dialog_components/ToppingItemDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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

      if (sizePriceEntries.length > 0) {
        await updateToppingSizePrices(toppingId, sizePriceEntries);
      }

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold">Toppings</h2>
            <p className="text-gray-600 mt-1">
              Manage topping items with size-specific pricing
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedToppingCategory}
            onValueChange={onSelectedCategoryChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Menu Categories</SelectItem>
              {categories
                .filter((c) => c.isActive)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!hideAddButton && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Topping
            </Button>
          )}
        </div>
      </div>

      {/* Toppings List */}
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {filteredToppings.map((topping) => {
          const toppingSizes = getToppingSizePrices(topping.id);
          const menuCategory = categories.find(
            (c) => c.id === topping.menuItemCategory,
          );
          const toppingCategory = toppingCategories.find(
            (tc) => tc.id === topping.category,
          );

          return (
            <Card key={topping.id}>
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h6 className="font-medium">{topping.name}</h6>
                  <Badge
                    className={
                      topping.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {topping.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  <p>
                    <strong>Menu:</strong> {menuCategory?.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Category: </strong>
                    {toppingCategory?.name || "Unknown"}
                  </p>
                </div>
                {/* Size Prices */}
                {toppingSizes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Size Prices:</p>
                    <div className="space-y-1">
                      {toppingSizes.map((ts) => {
                        const size = categorySizes.find(
                          (cs) => cs.id === ts.categorySizeId,
                        );
                        return size ? (
                          <div
                            key={ts.id}
                            className="flex justify-between text-xs"
                          >
                            <span>{size.sizeName}:</span>
                            <span>${ts.price.toFixed(2)}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end items-center mt-auto">
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleToppingStatus(topping.id)}
                          >
                            {topping.isActive ? (
                              <ThumbsUp className="h-4 w-4" />
                            ) : (
                              <ThumbsDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {topping.isActive ? "Deactivate" : "Activate"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTopping(topping)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Topping</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTopping(topping.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Topping</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredToppings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No toppings found for the selected category.
          </p>
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
