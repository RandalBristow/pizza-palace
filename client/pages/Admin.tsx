import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import AdminSidebar from "../components/AdminSidebar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Settings,
  Calendar,
  FileText,
  Star,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  mockCategories as initialCategories,
  mockMenuItems as initialMenuItems,
  mockToppings as initialToppings,
  mockToppingCategories as initialToppingCategories,
  mockSpecials as initialSpecials,
  type Category,
  type MenuItem,
  type Topping,
  type ToppingCategory,
  type Special,
} from "../data/mockData";

// New interfaces for carousel and customer favorites
interface CarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  order: number;
}

interface CustomerFavorite {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export default function Admin() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [toppings, setToppings] = useState<Topping[]>(initialToppings);
  const [toppingCategories, setToppingCategories] = useState<ToppingCategory[]>(
    initialToppingCategories,
  );
  const [specials, setSpecials] = useState<Special[]>(initialSpecials);
  const [selectedItem, setSelectedItem] = useState("categories");

  // Filter states
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("all");
  const [selectedToppingCategory, setSelectedToppingCategory] = useState("all");

  // Modal states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [isAddingToppingCategory, setIsAddingToppingCategory] = useState(false);
  const [isAddingTopping, setIsAddingTopping] = useState(false);
  const [isAddingSpecial, setIsAddingSpecial] = useState(false);
  const [isAddingCarouselImage, setIsAddingCarouselImage] = useState(false);
  const [isAddingCustomerFavorite, setIsAddingCustomerFavorite] = useState(false);

  // New item form states
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    defaultToppings: [],
    isActive: true
  });
  const [newSpecial, setNewSpecial] = useState<Partial<Special>>({
    name: "",
    description: "",
    type: "daily",
    startDate: "",
    endDate: "",
    menuItems: [],
    discountType: "percentage",
    discountValue: 0,
    isActive: true
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    isActive: true,
    order: 1,
  });
  const [newToppingCategory, setNewToppingCategory] = useState({
    name: "",
    order: 1,
    isActive: true,
    menuItemCategory: "",
  });
  const [newTopping, setNewTopping] = useState({
    name: "",
    price: 0,
    category: "",
    menuItemCategory: "",
    isActive: true,
  });
  const [newCarouselImage, setNewCarouselImage] = useState({
    url: "",
    title: "",
    subtitle: "",
    order: 1,
    isActive: true,
  });
  const [newCustomerFavorite, setNewCustomerFavorite] = useState({
    title: "",
    description: "",
    icon: "",
    order: 1,
    isActive: true,
  });

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingToppingCategory, setEditingToppingCategory] = useState<ToppingCategory | null>(null);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [editingSpecial, setEditingSpecial] = useState<Special | null>(null);
  const [editingCarouselImage, setEditingCarouselImage] = useState<CarouselImage | null>(null);
  const [editingCustomerFavorite, setEditingCustomerFavorite] = useState<CustomerFavorite | null>(null);

  // New state for carousel images and customer favorites
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([
    {
      id: "1",
      url: "https://cdn.builder.io/api/v1/image/assets%2F8595ba96a391483e886f01139655b832%2F3eb3e3851578457ebc6357b42054ea36?format=webp&width=800",
      title: "Fresh Pizza & Premium Coffee",
      subtitle: "Made to Order",
      isActive: true,
      order: 1,
    }
  ]);

  // Save carousel images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('carouselImages', JSON.stringify(carouselImages));
  }, [carouselImages]);

  // Helper functions for deactivate/delete operations
  const canDeleteCategory = (categoryId: string) => {
    return !menuItems.some(item => item.category === categoryId) &&
           !toppingCategories.some(tc => tc.menuItemCategory === categoryId);
  };

  const canDeleteToppingCategory = (toppingCategoryId: string) => {
    return !toppings.some(topping => topping.category === toppingCategoryId);
  };

  const toggleItemActive = (id: string, items: any[], setItems: any) => {
    setItems(items.map(item =>
      item.id === id ? {...item, isActive: !item.isActive} : item
    ));
  };

  const deleteItem = (id: string, items: any[], setItems: any) => {
    setItems(items.filter(item => item.id !== id));
  };
  const [customerFavorites, setCustomerFavorites] = useState<CustomerFavorite[]>([
    {
      id: "1",
      title: "Fresh Ingredients",
      description: "We use only the finest, freshest ingredients in every pizza.",
      icon: "🍕",
      isActive: true,
      order: 1,
    },
    {
      id: "2",
      title: "Fast Delivery",
      description: "Hot, fresh pizza delivered to your door in 30 minutes or less.",
      icon: "🚚",
      isActive: true,
      order: 2,
    },
    {
      id: "3",
      title: "Premium Coffee",
      description: "Freshly brewed coffee made from premium beans.",
      icon: "☕",
      isActive: true,
      order: 3,
    }
  ]);

  const generateMenuPDF = () => {
    // PDF generation logic would go here
    console.log("Generating PDF...");
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "categories":
        return renderMenuCategories();
      case "menu-items":
        return renderMenuItems();
      case "topping-categories":
        return renderToppingCategories();
      case "topping-items":
        return renderToppingItems();
      case "specials":
        return renderSpecials();
      case "carousel-images":
        return renderCarouselImages();
      case "customer-favorites":
        return renderCustomerFavorites();
      default:
        return renderMenuCategories();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery breadcrumbs={[{ label: "Admin Dashboard" }]} />

      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={generateMenuPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print Menu PDF
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );

  // Individual render functions for each section
  function renderMenuCategories() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Menu Categories</h2>
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new menu category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="e.g., Appetizers"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="categoryOrder">Display Order</Label>
                  <Input
                    id="categoryOrder"
                    type="number"
                    placeholder="1"
                    value={newCategory.order}
                    onChange={(e) => setNewCategory({...newCategory, order: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategory({name: "", isActive: true, order: 1});
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-');
                    setCategories([...categories, {...newCategory, id} as Category]);
                    setIsAddingCategory(false);
                    setNewCategory({name: "", isActive: true, order: 1});
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{category.name}</h3>
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleItemActive(category.id, categories, setCategories)}
                    >
                      {category.isActive ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (canDeleteCategory(category.id)) {
                          if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                            deleteItem(category.id, categories, setCategories);
                          }
                        } else {
                          alert("Cannot delete category with associated menu items or topping categories.");
                        }
                      }}
                      disabled={!canDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editCategoryName">Category Name</Label>
                  <Input
                    id="editCategoryName"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editCategoryOrder">Display Order</Label>
                  <Input
                    id="editCategoryOrder"
                    type="number"
                    value={editingCategory.order}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      order: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setCategories(categories.map(category =>
                      category.id === editingCategory.id ? editingCategory : category
                    ));
                    setEditingCategory(null);
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function renderMenuItems() {
    const filteredMenuItems = selectedMenuCategory === "all"
      ? menuItems
      : menuItems.filter(item => item.category === selectedMenuCategory);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="category-filter">Filter by Category:</Label>
              <Select value={selectedMenuCategory} onValueChange={setSelectedMenuCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.filter(cat => cat.isActive).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
                  {/* Left Column - Item Details */}
                  <div className="p-6 pl-8 border-r space-y-4">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Add New Menu Item</h2>
                      <p className="text-sm text-gray-500">
                        Create a new menu item for your restaurant
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
                          {categories.filter(c => c.isActive).map((category) => (
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
                        Select which toppings should come with this item by
                        default
                      </p>
                    </div>

                    {/* Toppings content that grows to fill space */}
                    <div className="flex-1 overflow-hidden">
                      {newMenuItem.category ? (
                        (() => {
                          const availableCategories =
                            toppingCategories.filter(
                              (tc) =>
                                tc.menuItemCategory ===
                                  newMenuItem.category && tc.isActive,
                            );
                          return (
                            <Tabs
                              defaultValue={availableCategories[0]?.id}
                              className="w-full h-full"
                              key={newMenuItem.category}
                            >
                              <TabsList className="w-full justify-start">
                                {availableCategories.map(
                                  (toppingCategory) => (
                                    <TabsTrigger
                                      key={toppingCategory.id}
                                      value={toppingCategory.id}
                                      className="text-sm"
                                    >
                                      {toppingCategory.name}
                                    </TabsTrigger>
                                  ),
                                )}
                              </TabsList>

                              {availableCategories.map((toppingCategory) => {
                                const categoryToppings = toppings.filter(
                                  (topping) =>
                                    topping.category === toppingCategory.id &&
                                    topping.menuItemCategory ===
                                      newMenuItem.category &&
                                    topping.isActive,
                                );

                                return (
                                  <TabsContent
                                    key={toppingCategory.id}
                                    value={toppingCategory.id}
                                    className="mt-4"
                                  >
                                    <div className="max-h-80 overflow-y-auto border rounded-lg p-4 space-y-2">
                                      {categoryToppings.length > 0 ? (
                                        categoryToppings.map((topping) => (
                                          <div
                                            key={topping.id}
                                            className="flex items-center space-x-2"
                                          >
                                            <Checkbox
                                              id={`topping-${topping.id}`}
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
                                                    defaultToppings:
                                                      currentToppings.filter(
                                                        (id) =>
                                                          id !== topping.id,
                                                      ),
                                                  });
                                                }
                                              }}
                                            />
                                            <Label
                                              htmlFor={`topping-${topping.id}`}
                                              className="text-sm cursor-pointer flex-1"
                                            >
                                              {topping.name}
                                              {topping.price > 0 && (
                                                <span className="text-gray-500 ml-1">
                                                  (+$
                                                  {topping.price.toFixed(2)})
                                                </span>
                                              )}
                                            </Label>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-gray-500 text-center py-4">
                                          No{" "}
                                          {toppingCategory.name.toLowerCase()}{" "}
                                          toppings available for this category
                                        </p>
                                      )}
                                    </div>
                                  </TabsContent>
                                );
                              })}
                            </Tabs>
                          );
                        })()
                      ) : (
                        <div className="border rounded-lg p-8 text-center flex items-center justify-center h-full">
                          <p className="text-gray-500">
                            Select a category first to see available toppings
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons fixed at bottom of entire dialog */}
                <div className="flex justify-end space-x-2 p-6 border-t bg-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingMenuItem(false);
                      setNewMenuItem({
                        name: "",
                        description: "",
                        price: 0,
                        category: "",
                        defaultToppings: [],
                        isActive: true
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // Add the new menu item to the list
                    const id = `item-${Date.now()}`;
                    setMenuItems([...menuItems, {
                      ...newMenuItem,
                      id
                    } as MenuItem]);
                    setIsAddingMenuItem(false);
                    setNewMenuItem({
                      name: "",
                      description: "",
                      price: 0,
                      category: "",
                      defaultToppings: [],
                      isActive: true
                    });
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filteredMenuItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <Badge variant="outline">
                      {categories.find(c => c.id === item.category)?.name}
                    </Badge>
                    <Badge
                      variant={item.isActive ? "default" : "secondary"}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      ${item.price.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMenuItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleItemActive(item.id, menuItems, setMenuItems)}
                    >
                      {item.isActive ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                          deleteItem(item.id, menuItems, setMenuItems);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Menu Item Dialog */}
        <Dialog open={!!editingMenuItem} onOpenChange={() => setEditingMenuItem(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update the menu item details
              </DialogDescription>
            </DialogHeader>
            {editingMenuItem && (
              <div className="flex h-full max-h-[80vh]">
                {/* Left Column - Basic Info */}
                <div className="w-1/2 pr-6 pl-4 space-y-4 overflow-y-auto">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Menu Item</h2>
                    <p className="text-sm text-gray-500">
                      Update the menu item details and default toppings
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="editItemCategory">Category</Label>
                    <Select
                      value={editingMenuItem.category}
                      onValueChange={(value) => setEditingMenuItem({
                        ...editingMenuItem,
                        category: value,
                        defaultToppings: [] // Reset toppings when category changes
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.isActive).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editItemName">Name</Label>
                    <Input
                      id="editItemName"
                      value={editingMenuItem.name}
                      onChange={(e) => setEditingMenuItem({
                        ...editingMenuItem,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editItemPrice">Price</Label>
                    <Input
                      id="editItemPrice"
                      type="number"
                      step="0.01"
                      value={editingMenuItem.price}
                      onChange={(e) => setEditingMenuItem({
                        ...editingMenuItem,
                        price: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editItemDescription">Description</Label>
                    <Textarea
                      id="editItemDescription"
                      value={editingMenuItem.description}
                      onChange={(e) => setEditingMenuItem({
                        ...editingMenuItem,
                        description: e.target.value
                      })}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editItemImage">Image</Label>
                    <div className="mt-1">
                      <Button variant="outline" type="button">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Default Toppings */}
                <div className="w-1/2 pl-6 border-l flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Default Toppings</h3>
                    <p className="text-sm text-gray-500">
                      Select which toppings should come with this item by default
                    </p>
                  </div>

                  {/* Toppings content that grows to fill space */}
                  <div className="flex-1 overflow-hidden">
                    {editingMenuItem.category ? (
                      (() => {
                        const availableCategories = toppingCategories.filter(
                          (tc) => tc.menuItemCategory === editingMenuItem.category && tc.isActive
                        );
                        return (
                          <Tabs
                            defaultValue={availableCategories[0]?.id}
                            className="w-full h-full"
                            key={editingMenuItem.category}
                          >
                            <TabsList className="w-full justify-start">
                              {availableCategories.map((toppingCategory) => (
                                <TabsTrigger
                                  key={toppingCategory.id}
                                  value={toppingCategory.id}
                                  className="text-sm"
                                >
                                  {toppingCategory.name}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {availableCategories.map((toppingCategory) => {
                              const categoryToppings = toppings.filter(
                                (topping) =>
                                  topping.category === toppingCategory.id &&
                                  topping.menuItemCategory === editingMenuItem.category &&
                                  topping.isActive
                              );

                              return (
                                <TabsContent
                                  key={toppingCategory.id}
                                  value={toppingCategory.id}
                                  className="mt-4"
                                >
                                  <div className="max-h-80 overflow-y-auto border rounded-lg p-4 space-y-2">
                                    {categoryToppings.length > 0 ? (
                                      categoryToppings.map((topping) => (
                                        <div
                                          key={topping.id}
                                          className="flex items-center space-x-2"
                                        >
                                          <Checkbox
                                            id={`edit-topping-${topping.id}`}
                                            checked={
                                              editingMenuItem.defaultToppings?.includes(topping.id) || false
                                            }
                                            onCheckedChange={(checked) => {
                                              const currentToppings = editingMenuItem.defaultToppings || [];
                                              if (checked) {
                                                setEditingMenuItem({
                                                  ...editingMenuItem,
                                                  defaultToppings: [...currentToppings, topping.id],
                                                });
                                              } else {
                                                setEditingMenuItem({
                                                  ...editingMenuItem,
                                                  defaultToppings: currentToppings.filter(
                                                    (id) => id !== topping.id
                                                  ),
                                                });
                                              }
                                            }}
                                          />
                                          <Label
                                            htmlFor={`edit-topping-${topping.id}`}
                                            className="text-sm cursor-pointer flex-1"
                                          >
                                            {topping.name}
                                            {topping.price > 0 && (
                                              <span className="text-gray-500 ml-1">
                                                (+${topping.price.toFixed(2)})
                                              </span>
                                            )}
                                          </Label>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-center py-4">
                                        No {toppingCategory.name.toLowerCase()} toppings available for this category
                                      </p>
                                    )}
                                  </div>
                                </TabsContent>
                              );
                            })}
                          </Tabs>
                        );
                      })()
                    ) : (
                      <div className="border rounded-lg p-8 text-center flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          Select a category first to see available toppings
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons fixed at bottom of entire dialog */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-end space-x-2 p-6 border-t bg-gray-50">
                  <Button variant="outline" onClick={() => setEditingMenuItem(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setMenuItems(menuItems.map(item =>
                      item.id === editingMenuItem.id ? editingMenuItem : item
                    ));
                    setEditingMenuItem(null);
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function renderToppingCategories() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Topping Categories</h2>
          <Dialog open={isAddingToppingCategory} onOpenChange={setIsAddingToppingCategory}>
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
                  <Select value={newToppingCategory.menuItemCategory} onValueChange={(value) => setNewToppingCategory({...newToppingCategory, menuItemCategory: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select menu category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.isActive).map((category) => (
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
                    onChange={(e) => setNewToppingCategory({...newToppingCategory, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="toppingCategoryOrder">Display Order</Label>
                  <Input
                    id="toppingCategoryOrder"
                    type="number"
                    placeholder="1"
                    value={newToppingCategory.order}
                    onChange={(e) => setNewToppingCategory({...newToppingCategory, order: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddingToppingCategory(false);
                    setNewToppingCategory({name: "", order: 1, isActive: true, menuItemCategory: ""});
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    const id = `${newToppingCategory.menuItemCategory}-${newToppingCategory.name.toLowerCase().replace(/\s+/g, '-')}`;
                    setToppingCategories([...toppingCategories, {...newToppingCategory, id} as ToppingCategory]);
                    setIsAddingToppingCategory(false);
                    setNewToppingCategory({name: "", order: 1, isActive: true, menuItemCategory: ""});
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {toppingCategories.map((toppingCategory) => (
            <Card key={toppingCategory.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{toppingCategory.name}</h3>
                    <Badge variant="outline">Order: {toppingCategory.order}</Badge>
                    <Badge
                      variant={toppingCategory.isActive ? "default" : "secondary"}
                    >
                      {toppingCategory.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      {toppings.filter(
                        (t) => t.category === toppingCategory.id && t.isActive,
                      ).length} toppings
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingToppingCategory(toppingCategory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleItemActive(toppingCategory.id, toppingCategories, setToppingCategories)}
                    >
                      {toppingCategory.isActive ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (canDeleteToppingCategory(toppingCategory.id)) {
                          if (confirm(`Are you sure you want to delete "${toppingCategory.name}"?`)) {
                            deleteItem(toppingCategory.id, toppingCategories, setToppingCategories);
                          }
                        } else {
                          alert("Cannot delete topping category with associated toppings.");
                        }
                      }}
                      disabled={!canDeleteToppingCategory(toppingCategory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Topping Category Dialog */}
        <Dialog open={!!editingToppingCategory} onOpenChange={() => setEditingToppingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Topping Category</DialogTitle>
              <DialogDescription>
                Update the topping category details
              </DialogDescription>
            </DialogHeader>
            {editingToppingCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editMenuItemType">Menu Category</Label>
                  <Select
                    value={editingToppingCategory.menuItemCategory}
                    onValueChange={(value) => setEditingToppingCategory({
                      ...editingToppingCategory,
                      menuItemCategory: value
                    })}
                  >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.isActive).map((category) => (
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
                    value={editingToppingCategory.name}
                    onChange={(e) => setEditingToppingCategory({
                      ...editingToppingCategory,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editToppingCategoryOrder">Display Order</Label>
                  <Input
                    id="editToppingCategoryOrder"
                    type="number"
                    value={editingToppingCategory.order}
                    onChange={(e) => setEditingToppingCategory({
                      ...editingToppingCategory,
                      order: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingToppingCategory(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setToppingCategories(toppingCategories.map(category =>
                      category.id === editingToppingCategory.id ? editingToppingCategory : category
                    ));
                    setEditingToppingCategory(null);
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function renderToppingItems() {
    const filteredToppings = selectedToppingCategory === "all"
      ? toppings
      : toppings.filter(topping => topping.category === selectedToppingCategory);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Topping Items</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="topping-category-filter">Filter by Category:</Label>
              <Select value={selectedToppingCategory} onValueChange={setSelectedToppingCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {toppingCategories.filter(cat => cat.isActive).map((toppingCategory) => (
                    <SelectItem key={toppingCategory.id} value={toppingCategory.id}>
                      {toppingCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                    Create a new topping for your menu items
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="toppingName">Name</Label>
                    <Input
                      id="toppingName"
                      placeholder="Topping name"
                      value={newTopping.name}
                      onChange={(e) => setNewTopping({...newTopping, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="toppingCategory">Category</Label>
                    <Select value={newTopping.category} onValueChange={(value) => {
                      const category = toppingCategories.find(tc => tc.id === value);
                      setNewTopping({
                        ...newTopping,
                        category: value,
                        menuItemCategory: category?.menuItemCategory || ""
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {toppingCategories.filter(tc => tc.isActive).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name} ({categories.find(c => c.id === category.menuItemCategory)?.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="toppingPrice">Price</Label>
                    <Input
                      id="toppingPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newTopping.price}
                      onChange={(e) => setNewTopping({...newTopping, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsAddingTopping(false);
                      setNewTopping({name: "", price: 0, category: "", menuItemCategory: "", isActive: true});
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      const id = `${newTopping.category}-${newTopping.name.toLowerCase().replace(/\s+/g, '-')}`;
                      setToppings([...toppings, {...newTopping, id} as Topping]);
                      setIsAddingTopping(false);
                      setNewTopping({name: "", price: 0, category: "", menuItemCategory: "", isActive: true});
                    }}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Topping
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filteredToppings.map((topping) => (
            <Card key={topping.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{topping.name}</h3>
                    <Badge variant="outline">
                      {toppingCategories.find(c => c.id === topping.category)?.name}
                    </Badge>
                    <Badge
                      variant={topping.isActive ? "default" : "secondary"}
                    >
                      {topping.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      +${topping.price.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTopping(topping)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleItemActive(topping.id, toppings, setToppings)}
                    >
                      {topping.isActive ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${topping.name}"?`)) {
                          deleteItem(topping.id, toppings, setToppings);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Topping Dialog */}
        <Dialog open={!!editingTopping} onOpenChange={() => setEditingTopping(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Topping</DialogTitle>
              <DialogDescription>
                Update the topping details
              </DialogDescription>
            </DialogHeader>
            {editingTopping && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editToppingName">Name</Label>
                  <Input
                    id="editToppingName"
                    value={editingTopping.name}
                    onChange={(e) => setEditingTopping({
                      ...editingTopping,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editToppingCategory">Category</Label>
                  <Select
                    value={editingTopping.category}
                    onValueChange={(value) => setEditingTopping({
                      ...editingTopping,
                      category: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toppingCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editToppingPrice">Price</Label>
                  <Input
                    id="editToppingPrice"
                    type="number"
                    step="0.01"
                    value={editingTopping.price}
                    onChange={(e) => setEditingTopping({
                      ...editingTopping,
                      price: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingTopping(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setToppings(toppings.map(topping =>
                      topping.id === editingTopping.id ? editingTopping : topping
                    ));
                    setEditingTopping(null);
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function renderSpecials() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Specials</h2>
          <Dialog open={isAddingSpecial} onOpenChange={setIsAddingSpecial}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Special
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Special</DialogTitle>
                <DialogDescription>
                  Create a new hourly, daily, or weekly special offer with menu selection and discount options
                </DialogDescription>
              </DialogHeader>
              <div className="flex h-full max-h-[80vh]">
                {/* Left Column - Basic Info */}
                <div className="w-1/2 pr-6 pl-4 space-y-4 overflow-y-auto">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Add New Special</h2>
                    <p className="text-sm text-gray-500">
                      Create a new special offer with menu items and discount settings
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="specialName">Special Name</Label>
                    <Input
                      id="specialName"
                      placeholder="e.g., Lunch Pizza Special"
                      value={newSpecial.name}
                      onChange={(e) => setNewSpecial({...newSpecial, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialDescription">Description</Label>
                    <Textarea
                      id="specialDescription"
                      placeholder="Describe the special offer"
                      rows={3}
                      value={newSpecial.description}
                      onChange={(e) => setNewSpecial({...newSpecial, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialType">Type</Label>
                    <Select value={newSpecial.type} onValueChange={(value: any) => setNewSpecial({...newSpecial, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly by Day (e.g., lunch specials)</SelectItem>
                        <SelectItem value="daily">Daily (every day for a period)</SelectItem>
                        <SelectItem value="weekly">Weekly (specific day each week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conditional fields based on type */}
                  {newSpecial.type === "hourly" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={newSpecial.startTime || ""}
                            onChange={(e) => setNewSpecial({...newSpecial, startTime: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={newSpecial.endTime || ""}
                            onChange={(e) => setNewSpecial({...newSpecial, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Days of Week</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={`day-${index}`}
                                checked={newSpecial.daysOfWeek?.includes(index) || false}
                                onCheckedChange={(checked) => {
                                  const days = newSpecial.daysOfWeek || [];
                                  if (checked) {
                                    setNewSpecial({...newSpecial, daysOfWeek: [...days, index]});
                                  } else {
                                    setNewSpecial({...newSpecial, daysOfWeek: days.filter(d => d !== index)});
                                  }
                                }}
                              />
                              <Label htmlFor={`day-${index}`} className="text-sm">{day}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {newSpecial.type === "weekly" && (
                    <div>
                      <Label>Day of Week</Label>
                      <Select value={newSpecial.dayOfWeek?.toString()} onValueChange={(value) => setNewSpecial({...newSpecial, dayOfWeek: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sunday</SelectItem>
                          <SelectItem value="1">Monday</SelectItem>
                          <SelectItem value="2">Tuesday</SelectItem>
                          <SelectItem value="3">Wednesday</SelectItem>
                          <SelectItem value="4">Thursday</SelectItem>
                          <SelectItem value="5">Friday</SelectItem>
                          <SelectItem value="6">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newSpecial.startDate}
                        onChange={(e) => setNewSpecial({...newSpecial, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newSpecial.endDate}
                        onChange={(e) => setNewSpecial({...newSpecial, endDate: e.target.value})}
                      />
                    </div>
                  </div>


                </div>

                {/* Right Column - Menu Selection */}
                <div className="w-1/2 pl-6 border-l flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
                    <p className="text-sm text-gray-500">
                      Select which menu items this special applies to
                    </p>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {(() => {
                      const activeCategories = categories.filter(c => c.isActive);
                      return (
                        <Tabs
                          defaultValue={activeCategories[0]?.id}
                          className="w-full h-full"
                        >
                          <TabsList className="w-full justify-start">
                            {activeCategories.map((category) => (
                              <TabsTrigger
                                key={category.id}
                                value={category.id}
                                className="text-sm"
                              >
                                {category.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {activeCategories.map((category) => {
                            const categoryMenuItems = menuItems.filter(
                              (item) => item.category === category.id && item.isActive
                            );

                            return (
                              <TabsContent
                                key={category.id}
                                value={category.id}
                                className="mt-4"
                              >
                                <div className="max-h-80 overflow-y-auto border rounded-lg p-4 space-y-2">
                                  {categoryMenuItems.length > 0 ? (
                                    categoryMenuItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={`special-item-${item.id}`}
                                          checked={newSpecial.menuItems?.includes(item.id) || false}
                                          onCheckedChange={(checked) => {
                                            const items = newSpecial.menuItems || [];
                                            if (checked) {
                                              setNewSpecial({...newSpecial, menuItems: [...items, item.id]});
                                            } else {
                                              setNewSpecial({...newSpecial, menuItems: items.filter(i => i !== item.id)});
                                            }
                                          }}
                                        />
                                        <Label
                                          htmlFor={`special-item-${item.id}`}
                                          className="text-sm cursor-pointer flex-1"
                                        >
                                          <div className="flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <span className="text-gray-500 text-xs">
                                              ${item.price.toFixed(2)}
                                              {newSpecial.discountType === "percentage" && newSpecial.discountValue > 0 && (
                                                <span className="ml-2 text-green-600">
                                                  → ${(item.price * (1 - newSpecial.discountValue / 100)).toFixed(2)}
                                                </span>
                                              )}
                                              {newSpecial.discountType === "flat" && newSpecial.discountValue > 0 && (
                                                <span className="ml-2 text-green-600">
                                                  → ${newSpecial.discountValue.toFixed(2)}
                                                </span>
                                              )}
                                            </span>
                                          </div>
                                        </Label>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500 text-center py-4">
                                      No active menu items in {category.name}
                                    </p>
                                  )}
                                </div>
                              </TabsContent>
                            );
                          })}
                        </Tabs>
                      );
                    })()}
                  </div>

                  {/* Discount Section */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Discount Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="discountType">Discount Type</Label>
                        <Select value={newSpecial.discountType} onValueChange={(value: any) => setNewSpecial({...newSpecial, discountType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage Off</SelectItem>
                            <SelectItem value="flat">Flat Price</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discountValue">
                            {newSpecial.discountType === "percentage" ? "Percentage (%)" : "Flat Price ($)"}
                          </Label>
                          <Input
                            id="discountValue"
                            type="number"
                            step={newSpecial.discountType === "percentage" ? "1" : "0.01"}
                            min="0"
                            max={newSpecial.discountType === "percentage" ? "100" : undefined}
                            placeholder={newSpecial.discountType === "percentage" ? "e.g., 20" : "e.g., 9.99"}
                            value={newSpecial.discountValue}
                            onChange={(e) => setNewSpecial({...newSpecial, discountValue: parseFloat(e.target.value) || 0})}
                          />
                        </div>

                        {newSpecial.discountType === "percentage" && newSpecial.discountValue > 0 && (
                          <div>
                            <Label>Preview Discount</Label>
                            <div className="p-2 bg-green-50 border rounded text-sm text-green-700">
                              Example: $10.00 → ${(10 * (1 - newSpecial.discountValue / 100)).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons fixed at bottom of entire dialog */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-end space-x-2 p-6 border-t bg-gray-50">
                  <Button variant="outline" onClick={() => {
                    setIsAddingSpecial(false);
                    setNewSpecial({
                      name: "",
                      description: "",
                      type: "daily",
                      startDate: "",
                      endDate: "",
                      menuItems: [],
                      discountType: "percentage",
                      discountValue: 0,
                      isActive: true
                    });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    const id = `special-${Date.now()}`;
                    setSpecials([...specials, {...newSpecial, id} as Special]);
                    setIsAddingSpecial(false);
                    setNewSpecial({
                      name: "",
                      description: "",
                      type: "daily",
                      startDate: "",
                      endDate: "",
                      menuItems: [],
                      discountType: "percentage",
                      discountValue: 0,
                      isActive: true
                    });
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Special
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {specials.map((special) => (
            <Card key={special.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{special.name}</h3>
                      <Badge variant="outline">
                        {special.type === "hourly" ? "Hourly" : special.type === "daily" ? "Daily" : "Weekly"}
                      </Badge>
                      <Badge
                        variant={special.isActive ? "default" : "secondary"}
                      >
                        {special.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {special.description}
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>
                        {special.startDate} to {special.endDate}
                      </div>
                      {special.type === "hourly" && special.startTime && special.endTime && (
                        <div>
                          {special.startTime} - {special.endTime}
                          {special.daysOfWeek && (
                            <span className="ml-2">
                              ({special.daysOfWeek.map(d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")})
                            </span>
                          )}
                        </div>
                      )}
                      {special.type === "weekly" && special.dayOfWeek !== undefined && (
                        <div>
                          Every {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][special.dayOfWeek]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSpecial({...special})}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleItemActive(special.id, specials, setSpecials)}
                    >
                      {special.isActive ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${special.name}"?`)) {
                          deleteItem(special.id, specials, setSpecials);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Special Dialog */}
        <Dialog open={!!editingSpecial} onOpenChange={() => setEditingSpecial(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Edit Special</DialogTitle>
              <DialogDescription>
                Update the special details with menu selection and discount options
              </DialogDescription>
            </DialogHeader>
            {editingSpecial && (
              <div className="flex h-full max-h-[80vh]">
                {/* Left Column - Basic Info */}
                <div className="w-1/2 pr-6 space-y-4 overflow-y-auto">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Special</h2>
                    <p className="text-sm text-gray-500">
                      Update the special offer details and settings
                    </p>
                  </div>
                <div>
                  <Label htmlFor="editSpecialName">Special Name</Label>
                  <Input
                    id="editSpecialName"
                    value={editingSpecial.name}
                    onChange={(e) => setEditingSpecial({
                      ...editingSpecial,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editSpecialDescription">Description</Label>
                  <Textarea
                    id="editSpecialDescription"
                    value={editingSpecial.description}
                    onChange={(e) => setEditingSpecial({
                      ...editingSpecial,
                      description: e.target.value
                    })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="editSpecialType">Type</Label>
                  <Select value={editingSpecial.type} onValueChange={(value: any) => setEditingSpecial({...editingSpecial, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly by Day</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingSpecial.type === "hourly" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editStartTime">Start Time</Label>
                        <Input
                          id="editStartTime"
                          type="time"
                          value={editingSpecial.startTime || ""}
                          onChange={(e) => setEditingSpecial({...editingSpecial, startTime: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editEndTime">End Time</Label>
                        <Input
                          id="editEndTime"
                          type="time"
                          value={editingSpecial.endTime || ""}
                          onChange={(e) => setEditingSpecial({...editingSpecial, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Days of Week</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-day-${index}`}
                              checked={editingSpecial.daysOfWeek?.includes(index) || false}
                              onCheckedChange={(checked) => {
                                const days = editingSpecial.daysOfWeek || [];
                                if (checked) {
                                  setEditingSpecial({...editingSpecial, daysOfWeek: [...days, index]});
                                } else {
                                  setEditingSpecial({...editingSpecial, daysOfWeek: days.filter(d => d !== index)});
                                }
                              }}
                            />
                            <Label htmlFor={`edit-day-${index}`} className="text-sm">{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {editingSpecial.type === "weekly" && (
                  <div>
                    <Label>Day of Week</Label>
                    <Select value={editingSpecial.dayOfWeek?.toString()} onValueChange={(value) => setEditingSpecial({...editingSpecial, dayOfWeek: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sunday</SelectItem>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editStartDate">Start Date</Label>
                    <Input
                      id="editStartDate"
                      type="date"
                      value={editingSpecial.startDate}
                      onChange={(e) => setEditingSpecial({
                        ...editingSpecial,
                        startDate: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEndDate">End Date</Label>
                    <Input
                      id="editEndDate"
                      type="date"
                      value={editingSpecial.endDate}
                      onChange={(e) => setEditingSpecial({
                        ...editingSpecial,
                        endDate: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editDiscountType">Discount Type</Label>
                  <Select value={editingSpecial.discountType} onValueChange={(value: any) => setEditingSpecial({...editingSpecial, discountType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="flat">Flat Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="editDiscountValue">
                    {editingSpecial.discountType === "percentage" ? "Percentage (%)" : "Flat Price ($)"}
                  </Label>
                  <Input
                    id="editDiscountValue"
                    type="number"
                    step={editingSpecial.discountType === "percentage" ? "1" : "0.01"}
                    min="0"
                    max={editingSpecial.discountType === "percentage" ? "100" : undefined}
                    value={editingSpecial.discountValue}
                    onChange={(e) => setEditingSpecial({...editingSpecial, discountValue: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <Label>Applicable Menu Items</Label>
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                    {menuItems.filter(item => item.isActive).map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-item-${item.id}`}
                          checked={editingSpecial.menuItems?.includes(item.id) || false}
                          onCheckedChange={(checked) => {
                            const items = editingSpecial.menuItems || [];
                            if (checked) {
                              setEditingSpecial({...editingSpecial, menuItems: [...items, item.id]});
                            } else {
                              setEditingSpecial({...editingSpecial, menuItems: items.filter(i => i !== item.id)});
                            }
                          }}
                        />
                        <Label htmlFor={`edit-item-${item.id}`} className="text-sm">{item.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingSpecial(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setSpecials(specials.map(special =>
                      special.id === editingSpecial.id ? editingSpecial : special
                    ));
                    setEditingSpecial(null);
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function renderCarouselImages() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Carousel Images</h2>
          <Dialog open={isAddingCarouselImage} onOpenChange={setIsAddingCarouselImage}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Carousel Image</DialogTitle>
                <DialogDescription>
                  Add a new image to the homepage carousel
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={newCarouselImage.url}
                    onChange={(e) => setNewCarouselImage({...newCarouselImage, url: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="imageTitle">Title</Label>
                  <Input
                    id="imageTitle"
                    placeholder="Image title"
                    value={newCarouselImage.title}
                    onChange={(e) => setNewCarouselImage({...newCarouselImage, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="imageSubtitle">Subtitle</Label>
                  <Input
                    id="imageSubtitle"
                    placeholder="Image subtitle"
                    value={newCarouselImage.subtitle}
                    onChange={(e) => setNewCarouselImage({...newCarouselImage, subtitle: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="imageOrder">Display Order</Label>
                  <Input
                    id="imageOrder"
                    type="number"
                    placeholder="1"
                    value={newCarouselImage.order}
                    onChange={(e) => setNewCarouselImage({...newCarouselImage, order: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddingCarouselImage(false);
                    setNewCarouselImage({url: "", title: "", subtitle: "", order: 1, isActive: true});
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    const id = `carousel-${Date.now()}`;
                    setCarouselImages([...carouselImages, {...newCarouselImage, id} as CarouselImage]);
                    setIsAddingCarouselImage(false);
                    setNewCarouselImage({url: "", title: "", subtitle: "", order: 1, isActive: true});
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Image
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-gray-600 mb-4">
            Manage images that appear in the homepage carousel.
          </p>
          {carouselImages.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No carousel images yet.</p>
              <p className="text-sm text-gray-400">Add images to display in the homepage carousel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {carouselImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4">
                  <img src={image.url} alt={image.title} className="w-full h-32 object-cover rounded mb-2" />
                  <h3 className="font-semibold">{image.title}</h3>
                  <p className="text-sm text-gray-600">{image.subtitle}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant={image.isActive ? "default" : "secondary"}>
                      {image.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCarouselImage(image)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleItemActive(image.id, carouselImages, setCarouselImages)}
                      >
                        {image.isActive ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${image.title}"?`)) {
                            deleteItem(image.id, carouselImages, setCarouselImages);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Carousel Image Dialog */}
        <Dialog open={!!editingCarouselImage} onOpenChange={() => setEditingCarouselImage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Carousel Image</DialogTitle>
              <DialogDescription>
                Update the carousel image details
              </DialogDescription>
            </DialogHeader>
            {editingCarouselImage && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editImageUrl">Image URL</Label>
                  <Input
                    id="editImageUrl"
                    value={editingCarouselImage.url}
                    onChange={(e) => setEditingCarouselImage({
                      ...editingCarouselImage,
                      url: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editImageTitle">Title</Label>
                  <Input
                    id="editImageTitle"
                    value={editingCarouselImage.title}
                    onChange={(e) => setEditingCarouselImage({
                      ...editingCarouselImage,
                      title: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editImageSubtitle">Subtitle</Label>
                  <Input
                    id="editImageSubtitle"
                    value={editingCarouselImage.subtitle}
                    onChange={(e) => setEditingCarouselImage({
                      ...editingCarouselImage,
                      subtitle: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editImageOrder">Display Order</Label>
                  <Input
                    id="editImageOrder"
                    type="number"
                    value={editingCarouselImage.order}
                    onChange={(e) => setEditingCarouselImage({
                      ...editingCarouselImage,
                      order: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingCarouselImage(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setCarouselImages(carouselImages.map(image =>
                      image.id === editingCarouselImage.id ? editingCarouselImage : image
                    ));
                    setEditingCarouselImage(null);
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function renderCustomerFavorites() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customer Favorites</h2>
          <Dialog open={isAddingCustomerFavorite} onOpenChange={setIsAddingCustomerFavorite}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Favorite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Customer Favorite</DialogTitle>
                <DialogDescription>
                  Add a new customer favorite item for the homepage
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="favoriteTitle">Title</Label>
                  <Input
                    id="favoriteTitle"
                    placeholder="e.g., Fresh Ingredients"
                    value={newCustomerFavorite.title}
                    onChange={(e) => setNewCustomerFavorite({...newCustomerFavorite, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="favoriteDescription">Description</Label>
                  <Textarea
                    id="favoriteDescription"
                    placeholder="Description of this favorite"
                    rows={3}
                    value={newCustomerFavorite.description}
                    onChange={(e) => setNewCustomerFavorite({...newCustomerFavorite, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="favoriteIcon">Icon (Emoji)</Label>
                  <Input
                    id="favoriteIcon"
                    placeholder="🍕"
                    value={newCustomerFavorite.icon}
                    onChange={(e) => setNewCustomerFavorite({...newCustomerFavorite, icon: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="favoriteOrder">Display Order</Label>
                  <Input
                    id="favoriteOrder"
                    type="number"
                    placeholder="1"
                    value={newCustomerFavorite.order}
                    onChange={(e) => setNewCustomerFavorite({...newCustomerFavorite, order: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddingCustomerFavorite(false);
                    setNewCustomerFavorite({title: "", description: "", icon: "", order: 1, isActive: true});
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    const id = `favorite-${Date.now()}`;
                    setCustomerFavorites([...customerFavorites, {...newCustomerFavorite, id} as CustomerFavorite]);
                    setIsAddingCustomerFavorite(false);
                    setNewCustomerFavorite({title: "", description: "", icon: "", order: 1, isActive: true});
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Favorite
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-gray-600 mb-4">
            Manage customer favorite items displayed on the homepage.
          </p>
          {customerFavorites.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No customer favorites yet.</p>
              <p className="text-sm text-gray-400">Add favorite items to showcase on the homepage.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerFavorites.map((favorite) => (
                <div key={favorite.id} className="border rounded-lg p-4">
                  <div className="text-2xl mb-2">{favorite.icon}</div>
                  <h3 className="font-semibold">{favorite.title}</h3>
                  <p className="text-sm text-gray-600">{favorite.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant={favorite.isActive ? "default" : "secondary"}>
                      {favorite.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCustomerFavorite(favorite)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleItemActive(favorite.id, customerFavorites, setCustomerFavorites)}
                      >
                        {favorite.isActive ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${favorite.title}"?`)) {
                            deleteItem(favorite.id, customerFavorites, setCustomerFavorites);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Customer Favorite Dialog */}
        <Dialog open={!!editingCustomerFavorite} onOpenChange={() => setEditingCustomerFavorite(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer Favorite</DialogTitle>
              <DialogDescription>
                Update the customer favorite details
              </DialogDescription>
            </DialogHeader>
            {editingCustomerFavorite && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editFavoriteTitle">Title</Label>
                  <Input
                    id="editFavoriteTitle"
                    value={editingCustomerFavorite.title}
                    onChange={(e) => setEditingCustomerFavorite({
                      ...editingCustomerFavorite,
                      title: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editFavoriteDescription">Description</Label>
                  <Textarea
                    id="editFavoriteDescription"
                    value={editingCustomerFavorite.description}
                    onChange={(e) => setEditingCustomerFavorite({
                      ...editingCustomerFavorite,
                      description: e.target.value
                    })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="editFavoriteIcon">Icon (Emoji)</Label>
                  <Input
                    id="editFavoriteIcon"
                    value={editingCustomerFavorite.icon}
                    onChange={(e) => setEditingCustomerFavorite({
                      ...editingCustomerFavorite,
                      icon: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="editFavoriteOrder">Display Order</Label>
                  <Input
                    id="editFavoriteOrder"
                    type="number"
                    value={editingCustomerFavorite.order}
                    onChange={(e) => setEditingCustomerFavorite({
                      ...editingCustomerFavorite,
                      order: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingCustomerFavorite(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setCustomerFavorites(customerFavorites.map(favorite =>
                      favorite.id === editingCustomerFavorite.id ? editingCustomerFavorite : favorite
                    ));
                    setEditingCustomerFavorite(null);
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
