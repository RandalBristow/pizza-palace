import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import ToppingCategoryDialog from "../dialog_components/ToppingCategoryDialog";
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

export interface ToppingCategory {
  id: string;
  name: string;
  menuItemCategory: string;
  order: number;
  isActive: boolean;
}

interface ToppingCategoryFormProps {
  toppingCategories: ToppingCategory[];
  categories: Category[];
  toppings?: any[];
  selectedToppingCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  createToppingCategory: (toppingCategory: any) => Promise<any>;
  updateToppingCategory: (id: string, updates: any) => Promise<any>;
  deleteToppingCategory: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function ToppingCategoryForm({
  toppingCategories,
  categories,
  toppings = [],
  selectedToppingCategory,
  onSelectedCategoryChange,
  createToppingCategory,
  updateToppingCategory,
  deleteToppingCategory,
  showTitle = true,
  hideAddButton = false,
}: ToppingCategoryFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingToppingCategory, setEditingToppingCategory] =
    useState<ToppingCategory | null>(null);

  const handleSave = async (toppingCategoryData: any) => {
    if (editingToppingCategory) {
      await updateToppingCategory(editingToppingCategory.id, toppingCategoryData);
    } else {
      await createToppingCategory(toppingCategoryData);
    }
    setEditingToppingCategory(null);
  };

  const handleEditToppingCategory = (toppingCategory: ToppingCategory) => {
    setEditingToppingCategory(toppingCategory);
    setIsDialogOpen(true);
  };

  const canDeleteToppingCategory = (toppingCategoryId: string) => {
    const hasToppings = toppings.some(
      (topping) => topping.category === toppingCategoryId,
    );
    return !hasToppings;
  };

  const handleDeleteToppingCategory = async (id: string) => {
    if (!canDeleteToppingCategory(id)) {
      alert(
        "Cannot delete topping category: It has related topping items. Please remove them first.",
      );
      return;
    }
    try {
      await deleteToppingCategory(id);
    } catch (error) {
      console.error("Failed to delete topping category:", error);
    }
  };

  const toggleToppingCategoryStatus = async (id: string) => {
    const toppingCategory = toppingCategories.find((cat) => cat.id === id);
    if (!toppingCategory) return;

    try {
      await updateToppingCategory(id, {
        ...toppingCategory,
        isActive: !toppingCategory.isActive,
      });
    } catch (error) {
      console.error("Failed to toggle topping category status:", error);
    }
  };

  const filteredToppingCategories =
    selectedToppingCategory === "all"
      ? toppingCategories
      : toppingCategories.filter(
          (cat) => cat.menuItemCategory === selectedToppingCategory,
        );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold">Topping Categories</h2>
            <p className="text-gray-600 mt-1">
              Organize toppings into categories for better menu management
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedToppingCategory}
            onValueChange={onSelectedCategoryChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by menu category" />
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
              Add Topping Category
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredToppingCategories.map((toppingCategory) => (
          <Card key={toppingCategory.id}>
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{toppingCategory.name}</h3>
                    <Badge
                      className={
                        toppingCategory.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {toppingCategory.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleToppingCategoryStatus(toppingCategory.id)
                          }
                        >
                          {toppingCategory.isActive ? (
                            <ThumbsUp className="h-4 w-4" />
                          ) : (
                            <ThumbsDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {toppingCategory.isActive ? "Deactivate" : "Activate"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleEditToppingCategory(toppingCategory)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Topping Category</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            !canDeleteToppingCategory(toppingCategory.id)
                          }
                          onClick={() =>
                            handleDeleteToppingCategory(toppingCategory.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {canDeleteToppingCategory(toppingCategory.id)
                          ? "Delete Topping Category"
                          : "Cannot delete: Has related toppings"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                <strong>Menu Category:</strong>{" "}
                {categories.find(
                  (c) => c.id === toppingCategory.menuItemCategory,
                )?.name || "Unknown"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ToppingCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingToppingCategory(null);
        }}
        toppingCategory={editingToppingCategory}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  );
}
