import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
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
  Edit,
  Trash2,
  Save,
  Upload,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ImageSelector from "../ui/image-selector";
import { useImages } from "../../hooks/useSupabase";
import { Category } from "./MenuCategoryForm";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  defaultToppings: string[];
  isActive: boolean;
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

interface MenuItemFormProps {
  menuItems: MenuItem[];
  categories: Category[];
  toppingCategories: ToppingCategory[];
  toppings: Topping[];
  selectedMenuCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  createMenuItem: (menuItem: any) => Promise<any>;
  updateMenuItem: (id: string, updates: any) => Promise<any>;
  deleteMenuItem: (id: string) => Promise<void>;
}

export default function MenuItemForm({
  menuItems,
  categories,
  toppingCategories,
  toppings,
  selectedMenuCategory,
  onSelectedCategoryChange,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
}: MenuItemFormProps) {
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const { images } = useImages();
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    defaultToppings: [],
    isActive: true,
  });

  const handleAddMenuItem = async () => {
    try {
      await createMenuItem(newMenuItem);
      setIsAddingMenuItem(false);
      setNewMenuItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        defaultToppings: [],
        isActive: true,
      });
    } catch (error) {
      console.error('Failed to create menu item:', error);
    }
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setNewMenuItem({
      ...menuItem,
      name: menuItem.name || "",
      description: menuItem.description || "",
      price: menuItem.price || 0,
      category: menuItem.category || "",
      defaultToppings: menuItem.defaultToppings || [],
      isActive: menuItem.isActive ?? true,
    });
  };

  const handleUpdateMenuItem = async () => {
    if (!editingMenuItem) return;

    try {
      await updateMenuItem(editingMenuItem.id, newMenuItem);
      setEditingMenuItem(null);
      setNewMenuItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        defaultToppings: [],
        isActive: true,
      });
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  const toggleMenuItemStatus = async (id: string) => {
    const menuItem = menuItems.find(item => item.id === id);
    if (!menuItem) return;

    try {
      await updateMenuItem(id, { ...menuItem, isActive: !menuItem.isActive });
    } catch (error) {
      console.error('Failed to toggle menu item status:', error);
    }
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
              ? "Update menu item details"
              : "Create a new menu item for your restaurant"}
          </p>
        </div>

        {/* Category moved to top */}
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
                defaultToppings: [], // Reset toppings when category changes
              });
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

        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="price" className="text-red-600">
              * Price
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={newMenuItem.price}
              onChange={(e) =>
                setNewMenuItem({
                  ...newMenuItem,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              required
            />
          </div>
        </div>
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
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          <span className="text-sm text-gray-500">
            Optional: Add item image
          </span>
        </div>
      </div>

      {/* Right Column - Default Toppings */}
      <div className="p-6 flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Default Toppings
          </h2>
          <p className="text-sm text-gray-500">
            Select which toppings should come with this item by default
          </p>
        </div>

        {/* Toppings content that grows to fill space */}
        <div className="flex-1 overflow-hidden">
          {newMenuItem.category ? (
            (() => {
              const availableCategories = toppingCategories.filter(
                (tc) =>
                  tc.menuItemCategory === newMenuItem.category && tc.isActive,
              );
              return (
                <Tabs
                  defaultValue={availableCategories[0]?.id}
                  className="w-full h-full"
                  key={newMenuItem.category}
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
                        {toppings
                          .filter(
                            (t) =>
                              t.category === toppingCategory.id && t.isActive,
                          )
                          .map((topping) => (
                            <div
                              key={topping.id}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={
                                    newMenuItem.defaultToppings?.includes(
                                      topping.id,
                                    ) || false
                                  }
                                  onCheckedChange={(checked) => {
                                    const currentToppings =
                                      newMenuItem.defaultToppings || [];
                                    if (checked) {
                                      setNewMenuItem({
                                        ...newMenuItem,
                                        defaultToppings: [
                                          ...currentToppings,
                                          topping.id,
                                        ],
                                      });
                                    } else {
                                      setNewMenuItem({
                                        ...newMenuItem,
                                        defaultToppings: currentToppings.filter(
                                          (id) => id !== topping.id,
                                        ),
                                      });
                                    }
                                  }}
                                />
                                <span className="text-sm">{topping.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                +${topping.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              );
            })()
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a category to see available toppings</p>
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
              setNewMenuItem({
                name: "",
                description: "",
                price: 0,
                category: "",
                defaultToppings: [],
                isActive: true,
              });
            }}
          >
            Cancel
          </Button>
          <Button onClick={isEdit ? handleUpdateMenuItem : handleAddMenuItem}>
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
        <h2 className="text-xl font-semibold">Menu Items</h2>
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
            <DialogContent className="max-w-6xl h-[68vh] flex flex-col p-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              {renderMenuItemForm(false)}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenuItems.map((menuItem) => (
          <Card key={menuItem.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{menuItem.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {menuItem.description}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${menuItem.price.toFixed(2)}
                  </p>
                </div>
                <Badge
                  className={
                    menuItem.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {menuItem.isActive ? "Active" : "Inactive"}
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
                          onClick={() => toggleMenuItemStatus(menuItem.id)}
                        >
                          {menuItem.isActive ? (
                            <ThumbsUp className="h-4 w-4" />
                          ) : (
                            <ThumbsDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {menuItem.isActive ? "Deactivate" : "Activate"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMenuItem(menuItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Menu Item</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMenuItem(menuItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Menu Item</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Menu Item Dialog */}
      <Dialog
        open={editingMenuItem !== null}
        onOpenChange={(open) => !open && setEditingMenuItem(null)}
      >
        <DialogContent className="max-w-6xl h-[68vh] flex flex-col p-0">
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
