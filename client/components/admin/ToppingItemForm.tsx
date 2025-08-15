import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
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
import { Plus, Edit, Trash2, Save, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Category } from "./MenuCategoryForm";
import { ToppingCategory } from "./ToppingCategoryForm";

export interface Topping {
  id: string;
  name: string;
  price?: number; // Made optional since we're using size-based pricing
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
  updateToppingSizePrices: (toppingId: string, sizePrices: { categorySizeId: string; price: number }[]) => Promise<void>;
  getToppingSizePrices: (toppingId: string) => any[];
  getToppingPriceForSize: (toppingId: string, categorySizeId: string) => number;
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
}: ToppingItemFormProps) {
  const [isAddingTopping, setIsAddingTopping] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [newTopping, setNewTopping] = useState({
    name: "",
    menuItemCategory: "",
    category: "",
    isActive: true,
  });
  const [sizePrices, setSizePrices] = useState<Record<string, number>>({});

  // Get available sizes for the selected menu category
  const getAvailableSizes = (menuCategoryId: string) => {
    return categorySizes
      .filter(size => size.categoryId === menuCategoryId && size.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  // Reset form
  const resetForm = () => {
    setNewTopping({
      name: "",
      menuItemCategory: "",
      category: "",
      isActive: true,
    });
    setSizePrices({});
  };

  // Handle adding topping
  const handleAddTopping = async () => {
    try {
      const createdTopping = await createTopping(newTopping);
      
      // Add size prices if any were set
      const sizePriceEntries = Object.entries(sizePrices)
        .filter(([_, price]) => price > 0)
        .map(([categorySizeId, price]) => ({ categorySizeId, price }));
      
      if (sizePriceEntries.length > 0) {
        await updateToppingSizePrices(createdTopping.id, sizePriceEntries);
      }
      
      setIsAddingTopping(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create topping:", error);
    }
  };

  // Handle editing topping
  const handleEditTopping = (topping: Topping) => {
    setEditingTopping(topping);
    setNewTopping({
      name: topping.name,
      menuItemCategory: topping.menuItemCategory,
      category: topping.category,
      isActive: topping.isActive,
    });

    // Load existing size prices
    const existingPrices: Record<string, number> = {};
    const toppingSizes = getToppingSizePrices(topping.id);
    toppingSizes.forEach(tp => {
      existingPrices[tp.categorySizeId] = tp.price;
    });
    setSizePrices(existingPrices);
  };

  // Handle updating topping
  const handleUpdateTopping = async () => {
    if (!editingTopping) return;

    try {
      await updateTopping(editingTopping.id, newTopping);
      
      // Update size prices
      const sizePriceEntries = Object.entries(sizePrices)
        .map(([categorySizeId, price]) => ({ categorySizeId, price: price || 0 }));
      
      await updateToppingSizePrices(editingTopping.id, sizePriceEntries);
      
      setEditingTopping(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update topping:", error);
    }
  };

  // Handle deleting topping
  const handleDeleteTopping = async (id: string) => {
    try {
      await deleteTopping(id);
    } catch (error) {
      console.error("Failed to delete topping:", error);
    }
  };

  // Toggle topping status
  const toggleToppingStatus = async (id: string) => {
    const topping = toppings.find((t) => t.id === id);
    if (!topping) return;

    try {
      await updateTopping(id, { ...topping, isActive: !topping.isActive });
    } catch (error) {
      console.error("Failed to toggle topping status:", error);
    }
  };

  // Filter toppings by selected category
  const filteredToppings = toppings.filter(
    (topping) =>
      selectedToppingCategory === "all" || topping.category === selectedToppingCategory
  );

  // Handle size price change
  const handleSizePriceChange = (categorySizeId: string, price: string) => {
    setSizePrices(prev => ({
      ...prev,
      [categorySizeId]: parseFloat(price) || 0
    }));
  };

  // Clear size prices when menu category changes
  useEffect(() => {
    if (newTopping.menuItemCategory) {
      const availableSizes = getAvailableSizes(newTopping.menuItemCategory);
      const newSizePrices: Record<string, number> = {};
      availableSizes.forEach(size => {
        if (!sizePrices[size.id]) {
          newSizePrices[size.id] = 0;
        }
      });
      setSizePrices(prev => ({ ...newSizePrices, ...prev }));
    }
  }, [newTopping.menuItemCategory]);

  const renderToppingForm = (isEdit: boolean = false) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        
        <div>
          <Label htmlFor="menuItemCategory">Menu Category *</Label>
          <Select
            value={newTopping.menuItemCategory}
            onValueChange={(value) => {
              setNewTopping({ ...newTopping, menuItemCategory: value });
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
            value={newTopping.category}
            onValueChange={(value) =>
              setNewTopping({ ...newTopping, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select topping category..." />
            </SelectTrigger>
            <SelectContent>
              {toppingCategories
                .filter((tc) => 
                  tc.isActive && 
                  (tc.menuItemCategory === newTopping.menuItemCategory || !newTopping.menuItemCategory)
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
            value={newTopping.name}
            onChange={(e) =>
              setNewTopping({ ...newTopping, name: e.target.value })
            }
          />
        </div>
      </div>

      {/* Right Side - Size-based Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Size-based Pricing</h3>
        
        {newTopping.menuItemCategory ? (
          <div className="space-y-3">
            {getAvailableSizes(newTopping.menuItemCategory).map((size) => (
              <div key={size.id} className="flex items-center justify-between space-x-3">
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
                    onChange={(e) => handleSizePriceChange(size.id, e.target.value)}
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
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingTopping(null);
            } else {
              setIsAddingTopping(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={isEdit ? handleUpdateTopping : handleAddTopping}
          disabled={!newTopping.name || !newTopping.menuItemCategory || !newTopping.category}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? "Update Topping" : "Save Topping"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Toppings</h2>
        <Dialog open={isAddingTopping} onOpenChange={setIsAddingTopping}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Topping
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Topping</DialogTitle>
              <DialogDescription>
                Create a new topping with size-specific pricing
              </DialogDescription>
            </DialogHeader>
            {renderToppingForm(false)}
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="categoryFilter">Filter by Category:</Label>
        <Select value={selectedToppingCategory} onValueChange={onSelectedCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {toppingCategories
              .filter((tc) => tc.isActive)
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toppings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredToppings.map((topping) => {
          const toppingSizes = getToppingSizePrices(topping.id);
          const menuCategory = categories.find(c => c.id === topping.menuItemCategory);
          const toppingCategory = toppingCategories.find(tc => tc.id === topping.category);

          return (
            <Card key={topping.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{topping.name}</h4>
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
                
                <div className="text-sm text-gray-600 mb-3">
                  <p><strong>Menu:</strong> {menuCategory?.name || "Unknown"}</p>
                  <p><strong>Category:</strong> {toppingCategory?.name || "Unknown"}</p>
                </div>

                {/* Size Prices */}
                {toppingSizes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Size Prices:</p>
                    <div className="space-y-1">
                      {toppingSizes.map((ts) => {
                        const size = categorySizes.find(cs => cs.id === ts.categorySizeId);
                        return size ? (
                          <div key={ts.id} className="flex justify-between text-xs">
                            <span>{size.sizeName}:</span>
                            <span>${ts.price.toFixed(2)}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
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
                  </div>
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredToppings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No toppings found for the selected category.</p>
        </div>
      )}

      {/* Edit Topping Dialog */}
      <Dialog
        open={editingTopping !== null}
        onOpenChange={(open) => !open && setEditingTopping(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Topping</DialogTitle>
            <DialogDescription>
              Update the topping details and size-specific pricing
            </DialogDescription>
          </DialogHeader>
          {renderToppingForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
