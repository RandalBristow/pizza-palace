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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Category } from "./MenuCategoryForm";
import { ToppingCategory } from "./ToppingCategoryForm";

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: string;
  menuItemCategory: string;
  isActive: boolean;
}

interface ToppingItemFormProps {
  toppings: Topping[];
  categories: Category[];
  toppingCategories: ToppingCategory[];
  selectedToppingCategory: string;
  onToppingsChange: (toppings: Topping[]) => void;
  onSelectedCategoryChange: (category: string) => void;
}

export default function ToppingItemForm({
  toppings,
  categories,
  toppingCategories,
  selectedToppingCategory,
  onToppingsChange,
  onSelectedCategoryChange
}: ToppingItemFormProps) {
  const [isAddingTopping, setIsAddingTopping] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [newTopping, setNewTopping] = useState({
    name: "",
    price: 0,
    category: "",
    menuItemCategory: "",
    isActive: true,
  });

  const handleAddTopping = () => {
    const id = `${newTopping.category}-${newTopping.name.toLowerCase().replace(/\s+/g, "-")}`;
    onToppingsChange([...toppings, { ...newTopping, id } as Topping]);
    setIsAddingTopping(false);
    setNewTopping({
      name: "",
      price: 0,
      category: "",
      menuItemCategory: "",
      isActive: true,
    });
  };

  const handleEditTopping = (topping: Topping) => {
    setEditingTopping(topping);
    setNewTopping({
      name: topping.name,
      price: topping.price,
      category: topping.category,
      menuItemCategory: topping.menuItemCategory,
      isActive: topping.isActive,
    });
  };

  const handleUpdateTopping = () => {
    if (!editingTopping) return;

    const updatedToppings = toppings.map((topping) =>
      topping.id === editingTopping.id
        ? { ...topping, ...newTopping }
        : topping
    );
    onToppingsChange(updatedToppings);
    setEditingTopping(null);
    setNewTopping({
      name: "",
      price: 0,
      category: "",
      menuItemCategory: "",
      isActive: true,
    });
  };

  const handleDeleteTopping = (id: string) => {
    onToppingsChange(toppings.filter((topping) => topping.id !== id));
  };

  const toggleToppingStatus = (id: string) => {
    const updatedToppings = toppings.map((topping) =>
      topping.id === id ? { ...topping, isActive: !topping.isActive } : topping
    );
    onToppingsChange(updatedToppings);
  };

  const filteredToppings = selectedToppingCategory === "all"
    ? toppings
    : toppings.filter((topping) => topping.menuItemCategory === selectedToppingCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Topping Items</h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedToppingCategory} onValueChange={onSelectedCategoryChange}>
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
          <Dialog open={isAddingTopping} onOpenChange={setIsAddingTopping}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Topping
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Topping</DialogTitle>
                <DialogDescription>
                  Create a new topping item
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="menuItemCategory">Menu Category</Label>
                  <Select
                    value={newTopping.menuItemCategory}
                    onValueChange={(value) => {
                      setNewTopping({
                        ...newTopping,
                        menuItemCategory: value,
                        category: "", // Reset topping category when menu category changes
                      });
                    }}
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
                  <Label htmlFor="toppingCategory">Topping Category</Label>
                  <Select
                    value={newTopping.category}
                    onValueChange={(value) =>
                      setNewTopping({
                        ...newTopping,
                        category: value,
                      })
                    }
                    disabled={!newTopping.menuItemCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topping category" />
                    </SelectTrigger>
                    <SelectContent>
                      {toppingCategories
                        .filter(
                          (tc) =>
                            tc.menuItemCategory === newTopping.menuItemCategory &&
                            tc.isActive
                        )
                        .map((toppingCategory) => (
                          <SelectItem key={toppingCategory.id} value={toppingCategory.id}>
                            {toppingCategory.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="toppingName">Topping Name</Label>
                  <Input
                    id="toppingName"
                    placeholder="e.g., Extra Cheese"
                    value={newTopping.name}
                    onChange={(e) =>
                      setNewTopping({
                        ...newTopping,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="toppingPrice">Price ($)</Label>
                  <Input
                    id="toppingPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newTopping.price}
                    onChange={(e) =>
                      setNewTopping({
                        ...newTopping,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingTopping(false);
                      setNewTopping({
                        name: "",
                        price: 0,
                        category: "",
                        menuItemCategory: "",
                        isActive: true,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTopping}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Topping
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredToppings.map((topping) => (
          <Card key={topping.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{topping.name}</h3>
                  <p className="text-sm text-gray-600">
                    {toppingCategories.find(tc => tc.id === topping.category)?.name || "Unknown Category"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Menu: {categories.find(c => c.id === topping.menuItemCategory)?.name || "Unknown"}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    +${topping.price.toFixed(2)}
                  </p>
                </div>
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
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-1">
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
                      <TooltipContent>
                        Edit Topping
                      </TooltipContent>
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
                      <TooltipContent>
                        Delete Topping
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Topping Dialog */}
      <Dialog open={editingTopping !== null} onOpenChange={(open) => !open && setEditingTopping(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topping</DialogTitle>
            <DialogDescription>Update the topping details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editMenuItemCategory">Menu Category</Label>
              <Select
                value={newTopping.menuItemCategory}
                onValueChange={(value) => {
                  setNewTopping({
                    ...newTopping,
                    menuItemCategory: value,
                    category: "", // Reset topping category when menu category changes
                  });
                }}
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
              <Label htmlFor="editToppingCategory">Topping Category</Label>
              <Select
                value={newTopping.category}
                onValueChange={(value) =>
                  setNewTopping({
                    ...newTopping,
                    category: value,
                  })
                }
                disabled={!newTopping.menuItemCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topping category" />
                </SelectTrigger>
                <SelectContent>
                  {toppingCategories
                    .filter(
                      (tc) =>
                        tc.menuItemCategory === newTopping.menuItemCategory &&
                        tc.isActive
                    )
                    .map((toppingCategory) => (
                      <SelectItem key={toppingCategory.id} value={toppingCategory.id}>
                        {toppingCategory.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editToppingName">Topping Name</Label>
              <Input
                id="editToppingName"
                placeholder="e.g., Extra Cheese"
                value={newTopping.name}
                onChange={(e) =>
                  setNewTopping({
                    ...newTopping,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="editToppingPrice">Price ($)</Label>
              <Input
                id="editToppingPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTopping.price}
                onChange={(e) =>
                  setNewTopping({
                    ...newTopping,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTopping(null);
                  setNewTopping({
                    name: "",
                    price: 0,
                    category: "",
                    menuItemCategory: "",
                    isActive: true,
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateTopping}>
                <Save className="h-4 w-4 mr-2" />
                Update Topping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
