import { useState } from "react";
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
}

export default function ToppingCategoryForm({
  toppingCategories,
  categories,
  toppings = [],
  selectedToppingCategory,
  onSelectedCategoryChange,
  createToppingCategory,
  updateToppingCategory,
  deleteToppingCategory
}: ToppingCategoryFormProps) {
  const [isAddingToppingCategory, setIsAddingToppingCategory] = useState(false);
  const [editingToppingCategory, setEditingToppingCategory] =
    useState<ToppingCategory | null>(null);
  const [newToppingCategory, setNewToppingCategory] = useState({
    name: "",
    order: 1,
    isActive: true,
    menuItemCategory: "",
  });

  const handleAddToppingCategory = async () => {
    try {
      await createToppingCategory(newToppingCategory);
      setIsAddingToppingCategory(false);
      setNewToppingCategory({
        name: "",
        order: 1,
        isActive: true,
        menuItemCategory: "",
      });
    } catch (error) {
      console.error('Failed to create topping category:', error);
    }
  };

  const handleEditToppingCategory = (toppingCategory: ToppingCategory) => {
    setEditingToppingCategory(toppingCategory);
    setNewToppingCategory({
      name: toppingCategory.name || "",
      order: toppingCategory.order || 1,
      isActive: toppingCategory.isActive || true,
      menuItemCategory: toppingCategory.menuItemCategory || "",
    });
  };

  const handleUpdateToppingCategory = async () => {
    if (!editingToppingCategory) return;

    try {
      await updateToppingCategory(editingToppingCategory.id, newToppingCategory);
      setEditingToppingCategory(null);
      setNewToppingCategory({
        name: "",
        order: 1,
        isActive: true,
        menuItemCategory: "",
      });
    } catch (error) {
      console.error('Failed to update topping category:', error);
    }
  };

  const canDeleteToppingCategory = (toppingCategoryId: string) => {
    const hasToppings = toppings.some(
      (topping) => topping.category === toppingCategoryId,
    );
    return !hasToppings;
  };

  const handleDeleteToppingCategory = (id: string) => {
    if (!canDeleteToppingCategory(id)) {
      alert(
        "Cannot delete topping category: It has related topping items. Please remove them first.",
      );
      return;
    }
    try {
      await deleteToppingCategory(id);
    } catch (error) {
      console.error('Failed to delete topping category:', error);
    }
  };

  const toggleToppingCategoryStatus = async (id: string) => {
    const toppingCategory = toppingCategories.find(cat => cat.id === id);
    if (!toppingCategory) return;

    try {
      await updateToppingCategory(id, { ...toppingCategory, isActive: !toppingCategory.isActive });
    } catch (error) {
      console.error('Failed to toggle topping category status:', error);
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
        <h2 className="text-xl font-semibold">Topping Categories</h2>
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
          <Dialog
            open={isAddingToppingCategory}
            onOpenChange={setIsAddingToppingCategory}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Topping Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Topping Category</DialogTitle>
                <DialogDescription>
                  Create a new topping category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="menuItemType">Menu Category</Label>
                  <Select
                    value={newToppingCategory.menuItemCategory}
                    onValueChange={(value) =>
                      setNewToppingCategory({
                        ...newToppingCategory,
                        menuItemCategory: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select menu category" />
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
                  <Label htmlFor="toppingCategoryName">Category Name</Label>
                  <Input
                    id="toppingCategoryName"
                    placeholder="e.g., Premium Toppings"
                    value={newToppingCategory.name}
                    onChange={(e) =>
                      setNewToppingCategory({
                        ...newToppingCategory,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="toppingCategoryOrder">Display Order</Label>
                  <Input
                    id="toppingCategoryOrder"
                    type="number"
                    placeholder="1"
                    value={newToppingCategory.order}
                    onChange={(e) =>
                      setNewToppingCategory({
                        ...newToppingCategory,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingToppingCategory(false);
                      setNewToppingCategory({
                        name: "",
                        order: 1,
                        isActive: true,
                        menuItemCategory: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddToppingCategory}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredToppingCategories.map((toppingCategory) => (
          <Card key={toppingCategory.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{toppingCategory.name}</h3>
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
                  <p className="text-sm text-gray-600">
                    Menu:{" "}
                    {categories.find(
                      (c) => c.id === toppingCategory.menuItemCategory,
                    )?.name || "Unknown"}
                  </p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Topping Category Dialog */}
      <Dialog
        open={editingToppingCategory !== null}
        onOpenChange={(open) => !open && setEditingToppingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topping Category</DialogTitle>
            <DialogDescription>
              Update the topping category details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editMenuItemType">Menu Category</Label>
              <Select
                value={newToppingCategory.menuItemCategory}
                onValueChange={(value) =>
                  setNewToppingCategory({
                    ...newToppingCategory,
                    menuItemCategory: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select menu category" />
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
              <Label htmlFor="editToppingCategoryName">Category Name</Label>
              <Input
                id="editToppingCategoryName"
                placeholder="e.g., Premium Toppings"
                value={newToppingCategory.name}
                onChange={(e) =>
                  setNewToppingCategory({
                    ...newToppingCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="editToppingCategoryOrder">Display Order</Label>
              <Input
                id="editToppingCategoryOrder"
                type="number"
                placeholder="1"
                value={newToppingCategory.order}
                onChange={(e) =>
                  setNewToppingCategory({
                    ...newToppingCategory,
                    order: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingToppingCategory(null);
                  setNewToppingCategory({
                    name: "",
                    order: 1,
                    isActive: true,
                    menuItemCategory: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateToppingCategory}>
                <Save className="h-4 w-4 mr-2" />
                Update Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
