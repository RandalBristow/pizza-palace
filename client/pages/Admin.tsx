import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Settings,
  Calendar,
  DollarSign,
  Home,
  FileText,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isActive: boolean;
  sizes?: { size: string; price: number }[];
  defaultToppings?: string[]; // topping IDs
}

interface Category {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface Topping {
  id: string;
  name: string;
  price: number;
  category: string;
  menuItemCategory: string; // pizza, sandwich, etc.
  isActive: boolean;
}

interface Special {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly";
  startDate: string;
  endDate: string;
  dayOfWeek?: number;
  menuItems: string[];
  isActive: boolean;
}

interface ToppingCategory {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
}

const mockMenuItems: MenuItem[] = [
  {
    id: "p1",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil",
    price: 12.99,
    category: "pizza",
    defaultToppings: ["ch1", "s1"], // Default mozzarella and marinara
    isActive: true,
    sizes: [
      { size: '10"', price: 12.99 },
      { size: '12"', price: 15.99 },
      { size: '14"', price: 18.99 },
      { size: '16"', price: 21.99 },
    ],
  },
  {
    id: "c1",
    name: "House Blend Coffee",
    description: "Our signature roast",
    price: 2.99,
    category: "coffee",
    defaultToppings: [],
    isActive: true,
  },
];

const mockCategories: Category[] = [
  { id: "pizza", name: "Pizza", isActive: true, order: 1 },
  { id: "wings", name: "Wings", isActive: true, order: 2 },
  { id: "coffee", name: "Coffee", isActive: true, order: 3 },
  { id: "calzone", name: "Calzones", isActive: true, order: 4 },
  { id: "drinks", name: "Drinks", isActive: true, order: 5 },
];

const mockToppings: Topping[] = [
  {
    id: "t1",
    name: "Pepperoni",
    price: 2.0,
    category: "meat",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "t2",
    name: "Mushrooms",
    price: 1.5,
    category: "veggie",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "t3",
    name: "Extra Cheese",
    price: 2.0,
    category: "cheese",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "ch1",
    name: "Mozzarella",
    price: 0,
    category: "cheese",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "s1",
    name: "Marinara Sauce",
    price: 0,
    category: "sauce",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "t4",
    name: "Turkey",
    price: 2.5,
    category: "meat",
    menuItemCategory: "sandwich",
    isActive: true,
  },
  {
    id: "t5",
    name: "Lettuce",
    price: 0.5,
    category: "veggie",
    menuItemCategory: "sandwich",
    isActive: true,
  },
];

const mockSpecials: Special[] = [
  {
    id: "s1",
    name: "Pizza Monday",
    description: "20% off all pizzas every Monday",
    type: "weekly",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    dayOfWeek: 1,
    menuItems: ["p1"],
    isActive: true,
  },
];

const mockToppingCategories: ToppingCategory[] = [
  { id: "sauce", name: "Sauce", order: 1, isActive: true },
  { id: "cheese", name: "Cheese", order: 2, isActive: true },
  { id: "meat", name: "Meat", order: 3, isActive: true },
  { id: "veggie", name: "Vegetables", order: 4, isActive: true },
];

export default function Admin() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [toppings, setToppings] = useState<Topping[]>(mockToppings);
  const [toppingCategories, setToppingCategories] = useState<ToppingCategory[]>(
    mockToppingCategories,
  );
  const [specials, setSpecials] = useState<Special[]>(mockSpecials);
  const [selectedTab, setSelectedTab] = useState("menu");

  // Add states
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [isAddingSpecial, setIsAddingSpecial] = useState(false);
  const [isAddingTopping, setIsAddingTopping] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingToppingCategory, setIsAddingToppingCategory] = useState(false);

  // Edit states
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [editingToppingCategory, setEditingToppingCategory] =
    useState<ToppingCategory | null>(null);
  const [editingSpecial, setEditingSpecial] = useState<Special | null>(null);

  // Form states
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    defaultToppings: [],
    isActive: true,
  });

  const [newSpecial, setNewSpecial] = useState<Partial<Special>>({
    name: "",
    description: "",
    type: "daily",
    startDate: "",
    endDate: "",
    menuItems: [],
    isActive: true,
  });

  const [newTopping, setNewTopping] = useState({
    name: "",
    price: 0,
    category: "meat" as "sauce" | "cheese" | "meat" | "veggie",
    menuItemCategory: "pizza",
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    order: categories.length + 1,
  });

  const [newToppingCategory, setNewToppingCategory] = useState({
    name: "",
    order: toppingCategories.length + 1,
  });

  // Handlers
  const handleAddMenuItem = () => {
    if (newMenuItem.name && newMenuItem.category) {
      const item: MenuItem = {
        id: `item_${Date.now()}`,
        name: newMenuItem.name!,
        description: newMenuItem.description || "",
        price: newMenuItem.price || 0,
        category: newMenuItem.category!,
        defaultToppings: newMenuItem.defaultToppings || [],
        isActive: true,
      };
      setMenuItems([...menuItems, item]);
      setNewMenuItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        defaultToppings: [],
        isActive: true,
      });
      setIsAddingMenuItem(false);
    }
  };

  const handleAddSpecial = () => {
    if (newSpecial.name && newSpecial.startDate && newSpecial.endDate) {
      const special: Special = {
        id: `special_${Date.now()}`,
        name: newSpecial.name!,
        description: newSpecial.description || "",
        type: newSpecial.type || "daily",
        startDate: newSpecial.startDate!,
        endDate: newSpecial.endDate!,
        dayOfWeek: newSpecial.dayOfWeek,
        menuItems: newSpecial.menuItems || [],
        isActive: true,
      };
      setSpecials([...specials, special]);
      setNewSpecial({
        name: "",
        description: "",
        type: "daily",
        startDate: "",
        endDate: "",
        menuItems: [],
        isActive: true,
      });
      setIsAddingSpecial(false);
    }
  };

  const handleEditSpecial = (special: Special) => {
    setEditingSpecial(special);
  };

  const handleSaveSpecial = () => {
    if (editingSpecial) {
      setSpecials(
        specials.map((s) => (s.id === editingSpecial.id ? editingSpecial : s)),
      );
      setEditingSpecial(null);
    }
  };

  const handleAddTopping = () => {
    if (newTopping.name) {
      const topping: Topping = {
        id: `topping_${Date.now()}`,
        name: newTopping.name,
        price: newTopping.price,
        category: newTopping.category,
        menuItemCategory: newTopping.menuItemCategory,
        isActive: true,
      };
      setToppings([...toppings, topping]);
      setNewTopping({
        name: "",
        price: 0,
        category: "meat",
        menuItemCategory: "pizza",
      });
      setIsAddingTopping(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      const category: Category = {
        id: `cat_${Date.now()}`,
        name: newCategory.name,
        isActive: true,
        order: newCategory.order,
      };
      setCategories([...categories, category]);
      setNewCategory({
        name: "",
        order: categories.length + 2,
      });
      setIsAddingCategory(false);
    }
  };

  const handleAddToppingCategory = () => {
    if (newToppingCategory.name) {
      const toppingCategory: ToppingCategory = {
        id: `topcat_${Date.now()}`,
        name: newToppingCategory.name,
        order: newToppingCategory.order,
        isActive: true,
      };
      setToppingCategories([...toppingCategories, toppingCategory]);
      setNewToppingCategory({
        name: "",
        order: toppingCategories.length + 2,
      });
      setIsAddingToppingCategory(false);
    }
  };

  // Edit handlers
  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
  };

  const handleSaveMenuItem = () => {
    if (editingMenuItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingMenuItem.id ? editingMenuItem : item,
        ),
      );
      setEditingMenuItem(null);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat,
        ),
      );
      setEditingCategory(null);
    }
  };

  const handleEditTopping = (topping: Topping) => {
    setEditingTopping(topping);
  };

  const handleSaveTopping = () => {
    if (editingTopping) {
      setToppings(
        toppings.map((topping) =>
          topping.id === editingTopping.id ? editingTopping : topping,
        ),
      );
      setEditingTopping(null);
    }
  };

  const handleEditToppingCategory = (toppingCategory: ToppingCategory) => {
    setEditingToppingCategory(toppingCategory);
  };

  const handleSaveToppingCategory = () => {
    if (editingToppingCategory) {
      setToppingCategories(
        toppingCategories.map((tc) =>
          tc.id === editingToppingCategory.id ? editingToppingCategory : tc,
        ),
      );
      setEditingToppingCategory(null);
    }
  };

  const toggleItemActive = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item,
      ),
    );
  };

  const toggleToppingActive = (id: string) => {
    setToppings(
      toppings.map((topping) =>
        topping.id === id
          ? { ...topping, isActive: !topping.isActive }
          : topping,
      ),
    );
  };

  const generateMenuPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.text("Pronto Pizza Cafe Menu", 20, 30);

      doc.setFontSize(12);
      doc.text("914 Ashland Rd, Mansfield, OH 44905", 20, 40);
      doc.text("Phone: (419) 589-7777", 20, 50);
      doc.text("Website: https://getprontos.com/", 20, 60);

      let yPosition = 80;

      // Group items by category
      const itemsByCategory = menuItems.reduce(
        (acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        },
        {} as Record<string, MenuItem[]>,
      );

      // Add categories and items
      Object.entries(itemsByCategory).forEach(([categoryId, items]) => {
        const category = categories.find((c) => c.id === categoryId);
        if (category) {
          doc.setFontSize(16);
          doc.text(category.name.toUpperCase(), 20, yPosition);
          yPosition += 10;

          items.forEach((item) => {
            doc.setFontSize(12);
            doc.text(`${item.name} - $${item.price.toFixed(2)}`, 30, yPosition);
            yPosition += 6;
            if (item.description) {
              doc.setFontSize(10);
              doc.text(item.description, 30, yPosition);
              yPosition += 6;
            }
            yPosition += 4;

            // Add new page if needed
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 30;
            }
          });

          yPosition += 10;
        }
      });

      doc.save("pronto-pizza-menu.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="categories">Menu Item Categories</TabsTrigger>
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="toppings">Toppings</TabsTrigger>
            <TabsTrigger value="topping-categories">
              Topping Categories
            </TabsTrigger>
            <TabsTrigger value="specials">Specials</TabsTrigger>
          </TabsList>

          {/* Menu Items Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Menu Items</h2>
              <Dialog
                open={isAddingMenuItem}
                onOpenChange={setIsAddingMenuItem}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-[68vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                    <DialogDescription>
                      Create a new menu item for your restaurant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6 min-h-[56vh]">
                    {/* Left Column - Item Details */}
                    <div className="space-y-4">
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
                            {categories.map((category) => (
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
                                price: parseFloat(e.target.value),
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
                    <div className="flex flex-col">
                      <div className="mb-4">
                        <Label className="text-lg font-semibold">
                          Default Toppings
                        </Label>
                        <p className="text-sm text-gray-500">
                          Select which toppings should come with this item by
                          default
                        </p>
                      </div>

                      {/* Toppings content that grows to fill space */}
                      <div className="flex-1">
                        {newMenuItem.category ? (
                          <Tabs
                            defaultValue={toppingCategories[0]?.id}
                            className="w-full h-full"
                            key={newMenuItem.category}
                          >
                            <TabsList className="grid w-full grid-cols-4">
                              {toppingCategories.map((toppingCategory) => (
                                <TabsTrigger
                                  key={toppingCategory.id}
                                  value={toppingCategory.id}
                                  className="text-sm"
                                >
                                  {toppingCategory.name}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {toppingCategories.map((toppingCategory) => {
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
                                                newMenuItem.defaultToppings ||
                                                [];
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
                                                      (id) => id !== topping.id,
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
                                                (+${topping.price.toFixed(2)})
                                              </span>
                                            )}
                                          </Label>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-center py-4">
                                        No {toppingCategory.name.toLowerCase()}{" "}
                                        toppings available for this category
                                      </p>
                                    )}
                                  </div>
                                </TabsContent>
                              );
                            })}
                          </Tabs>
                        ) : (
                          <div className="border rounded-lg p-8 text-center h-64 flex items-center justify-center">
                            <p className="text-gray-500">
                              Select a category first to see available toppings
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Buttons fixed at bottom right */}
                      <div className="flex justify-end space-x-2 pt-4 mt-auto">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingMenuItem(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddMenuItem}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Item
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Menu Item Dialog */}
              <Dialog
                open={!!editingMenuItem}
                onOpenChange={() => setEditingMenuItem(null)}
              >
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Menu Item</DialogTitle>
                    <DialogDescription>
                      Update the menu item details
                    </DialogDescription>
                  </DialogHeader>
                  {editingMenuItem && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editName">Name</Label>
                          <Input
                            id="editName"
                            value={editingMenuItem.name}
                            onChange={(e) =>
                              setEditingMenuItem({
                                ...editingMenuItem,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="editPrice">Price</Label>
                          <Input
                            id="editPrice"
                            type="number"
                            step="0.01"
                            value={editingMenuItem.price}
                            onChange={(e) =>
                              setEditingMenuItem({
                                ...editingMenuItem,
                                price: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="editCategory">Category</Label>
                        <Select
                          value={editingMenuItem.category}
                          onValueChange={(value) =>
                            setEditingMenuItem({
                              ...editingMenuItem,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editDescription">Description</Label>
                        <Textarea
                          id="editDescription"
                          value={editingMenuItem.description}
                          onChange={(e) =>
                            setEditingMenuItem({
                              ...editingMenuItem,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingMenuItem(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveMenuItem}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge
                            variant={item.isActive ? "default" : "secondary"}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.description}
                        </p>
                        <p className="font-semibold text-green-600 mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleItemActive(item.id)}
                        >
                          {item.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMenuItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Dialog
                open={isAddingCategory}
                onOpenChange={setIsAddingCategory}
              >
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
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Appetizers"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryOrder">Display Order</Label>
                      <Input
                        id="categoryOrder"
                        type="number"
                        value={newCategory.order}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            order: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingCategory(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddCategory}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Category Dialog */}
              <Dialog
                open={!!editingCategory}
                onOpenChange={() => setEditingCategory(null)}
              >
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
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="editCategoryOrder">Display Order</Label>
                        <Input
                          id="editCategoryOrder"
                          type="number"
                          value={editingCategory.order}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              order: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingCategory(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveCategory}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Topping Categories Tab */}
          <TabsContent value="topping-categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Topping Categories</h2>
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
                      <Label htmlFor="toppingCategoryName">Category Name</Label>
                      <Input
                        id="toppingCategoryName"
                        value={newToppingCategory.name}
                        onChange={(e) =>
                          setNewToppingCategory({
                            ...newToppingCategory,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Premium Toppings"
                      />
                    </div>
                    <div>
                      <Label htmlFor="toppingCategoryOrder">
                        Display Order
                      </Label>
                      <Input
                        id="toppingCategoryOrder"
                        type="number"
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
                        onClick={() => setIsAddingToppingCategory(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddToppingCategory}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Topping Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Topping Category Dialog */}
              <Dialog
                open={!!editingToppingCategory}
                onOpenChange={() => setEditingToppingCategory(null)}
              >
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
                        <Label htmlFor="editToppingCategoryName">
                          Category Name
                        </Label>
                        <Input
                          id="editToppingCategoryName"
                          value={editingToppingCategory.name}
                          onChange={(e) =>
                            setEditingToppingCategory({
                              ...editingToppingCategory,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="editToppingCategoryOrder">
                          Display Order
                        </Label>
                        <Input
                          id="editToppingCategoryOrder"
                          type="number"
                          value={editingToppingCategory.order}
                          onChange={(e) =>
                            setEditingToppingCategory({
                              ...editingToppingCategory,
                              order: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingToppingCategory(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveToppingCategory}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {toppingCategories.map((toppingCategory) => (
                <Card key={toppingCategory.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">
                            {toppingCategory.name}
                          </h3>
                          <Badge variant="outline">
                            Order: {toppingCategory.order}
                          </Badge>
                          <Badge
                            variant={
                              toppingCategory.isActive ? "default" : "secondary"
                            }
                          >
                            {toppingCategory.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {
                            toppings.filter(
                              (t) =>
                                t.category === toppingCategory.id && t.isActive,
                            ).length
                          }{" "}
                          active toppings
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleEditToppingCategory(toppingCategory)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setToppingCategories((prev) =>
                              prev.map((tc) =>
                                tc.id === toppingCategory.id
                                  ? { ...tc, isActive: !tc.isActive }
                                  : tc,
                              ),
                            );
                          }}
                        >
                          {toppingCategory.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Toppings Tab */}
          <TabsContent value="toppings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Toppings</h2>
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
                      <Label htmlFor="menuItemCategory">Menu Item Type</Label>
                      <Select
                        value={newTopping.menuItemCategory}
                        onValueChange={(value) =>
                          setNewTopping({
                            ...newTopping,
                            menuItemCategory: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select menu item type" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
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
                        onValueChange={(
                          value: "sauce" | "cheese" | "meat" | "veggie",
                        ) => setNewTopping({ ...newTopping, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select topping category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sauce">Sauce</SelectItem>
                          <SelectItem value="cheese">Cheese</SelectItem>
                          <SelectItem value="meat">Meat</SelectItem>
                          <SelectItem value="veggie">Vegetables</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="toppingName">Topping Name</Label>
                        <Input
                          id="toppingName"
                          value={newTopping.name}
                          onChange={(e) =>
                            setNewTopping({
                              ...newTopping,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Pepperoni"
                        />
                      </div>
                      <div>
                        <Label htmlFor="toppingPrice">Price</Label>
                        <Input
                          id="toppingPrice"
                          type="number"
                          step="0.01"
                          value={newTopping.price}
                          onChange={(e) =>
                            setNewTopping({
                              ...newTopping,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingTopping(false)}
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

              {/* Edit Topping Dialog */}
              <Dialog
                open={!!editingTopping}
                onOpenChange={() => setEditingTopping(null)}
              >
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
                        <Label htmlFor="editToppingName">Topping Name</Label>
                        <Input
                          id="editToppingName"
                          value={editingTopping.name}
                          onChange={(e) =>
                            setEditingTopping({
                              ...editingTopping,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="editToppingPrice">Price</Label>
                        <Input
                          id="editToppingPrice"
                          type="number"
                          step="0.01"
                          value={editingTopping.price}
                          onChange={(e) =>
                            setEditingTopping({
                              ...editingTopping,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="editToppingCategory">Category</Label>
                        <Select
                          value={editingTopping.category}
                          onValueChange={(
                            value: "sauce" | "cheese" | "meat" | "veggie",
                          ) =>
                            setEditingTopping({
                              ...editingTopping,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sauce">Sauce</SelectItem>
                            <SelectItem value="cheese">Cheese</SelectItem>
                            <SelectItem value="meat">Meat</SelectItem>
                            <SelectItem value="veggie">Vegetables</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingTopping(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveTopping}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {toppings.map((topping) => (
                <Card key={topping.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{topping.name}</h3>
                          <Badge variant="outline">{topping.category}</Badge>
                          <Badge
                            variant={topping.isActive ? "default" : "secondary"}
                          >
                            {topping.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="font-semibold text-green-600 mt-1">
                          +${topping.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleToppingActive(topping.id)}
                        >
                          {topping.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTopping(topping)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Specials Tab */}
          <TabsContent value="specials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Specials</h2>
              <Dialog open={isAddingSpecial} onOpenChange={setIsAddingSpecial}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Special
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Special</DialogTitle>
                    <DialogDescription>
                      Create a new daily or weekly special offer
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Special Details */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="specialName">Special Name</Label>
                        <Input
                          id="specialName"
                          value={newSpecial.name}
                          onChange={(e) =>
                            setNewSpecial({
                              ...newSpecial,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Pizza Monday"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialDescription">Description</Label>
                        <Textarea
                          id="specialDescription"
                          value={newSpecial.description}
                          onChange={(e) =>
                            setNewSpecial({
                              ...newSpecial,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the special offer"
                          rows={3}
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <Label htmlFor="specialImage">Special Image</Label>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Upload an image to showcase this special offer
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newSpecial.startDate}
                            onChange={(e) =>
                              setNewSpecial({
                                ...newSpecial,
                                startDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newSpecial.endDate}
                            onChange={(e) =>
                              setNewSpecial({
                                ...newSpecial,
                                endDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="specialType">Special Type</Label>
                        <Select
                          value={newSpecial.type}
                          onValueChange={(value: "daily" | "weekly") =>
                            setNewSpecial({ ...newSpecial, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newSpecial.type === "weekly" && (
                        <div>
                          <Label htmlFor="dayOfWeek">Day of Week</Label>
                          <Select
                            value={newSpecial.dayOfWeek?.toString()}
                            onValueChange={(value) =>
                              setNewSpecial({
                                ...newSpecial,
                                dayOfWeek: parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Monday</SelectItem>
                              <SelectItem value="2">Tuesday</SelectItem>
                              <SelectItem value="3">Wednesday</SelectItem>
                              <SelectItem value="4">Thursday</SelectItem>
                              <SelectItem value="5">Friday</SelectItem>
                              <SelectItem value="6">Saturday</SelectItem>
                              <SelectItem value="0">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingSpecial(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddSpecial}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Special
                        </Button>
                      </div>
                    </div>

                    {/* Right Column - Affected Menu Items by Category */}
                    <div>
                      <Label className="text-lg font-semibold">
                        Affected Menu Items
                      </Label>
                      <p className="text-sm text-gray-500 mb-4">
                        Select which menu items this special applies to
                      </p>

                      <Accordion
                        type="multiple"
                        className="w-full max-h-96 overflow-y-auto"
                      >
                        {categories
                          .filter((cat) => cat.isActive)
                          .map((category) => {
                            const categoryItems = menuItems.filter(
                              (item) =>
                                item.isActive && item.category === category.id,
                            );

                            if (categoryItems.length === 0) return null;

                            return (
                              <AccordionItem
                                key={category.id}
                                value={category.id}
                              >
                                {/* Category header with separate checkbox */}
                                <div className="flex items-center space-x-2 p-3 border-b">
                                  <Checkbox
                                    checked={
                                      categoryItems.length > 0 &&
                                      categoryItems.every(
                                        (item) =>
                                          newSpecial.menuItems?.includes(
                                            item.id,
                                          ) || false,
                                      )
                                    }
                                    onCheckedChange={(checked) => {
                                      const currentItems =
                                        newSpecial.menuItems || [];
                                      const categoryItemIds = categoryItems.map(
                                        (item) => item.id,
                                      );

                                      if (checked) {
                                        // Add all category items
                                        const newItems = [...currentItems];
                                        categoryItemIds.forEach((id) => {
                                          if (!newItems.includes(id)) {
                                            newItems.push(id);
                                          }
                                        });
                                        setNewSpecial({
                                          ...newSpecial,
                                          menuItems: newItems,
                                        });
                                      } else {
                                        // Remove all category items
                                        setNewSpecial({
                                          ...newSpecial,
                                          menuItems: currentItems.filter(
                                            (id) =>
                                              !categoryItemIds.includes(id),
                                          ),
                                        });
                                      }
                                    }}
                                  />
                                  <span className="font-medium flex-1">
                                    {category.name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {
                                      categoryItems.filter(
                                        (item) =>
                                          newSpecial.menuItems?.includes(
                                            item.id,
                                          ) || false,
                                      ).length
                                    }
                                    /{categoryItems.length} selected
                                  </span>
                                </div>
                                <AccordionTrigger className="hover:no-underline px-3 py-2">
                                  <span className="text-sm">View Items</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-2 pt-2">
                                    {categoryItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={`special-item-${item.id}`}
                                          checked={
                                            newSpecial.menuItems?.includes(
                                              item.id,
                                            ) || false
                                          }
                                          onCheckedChange={(checked) => {
                                            const currentItems =
                                              newSpecial.menuItems || [];
                                            if (checked) {
                                              setNewSpecial({
                                                ...newSpecial,
                                                menuItems: [
                                                  ...currentItems,
                                                  item.id,
                                                ],
                                              });
                                            } else {
                                              setNewSpecial({
                                                ...newSpecial,
                                                menuItems: currentItems.filter(
                                                  (id) => id !== item.id,
                                                ),
                                              });
                                            }
                                          }}
                                        />
                                        <Label
                                          htmlFor={`special-item-${item.id}`}
                                          className="text-sm cursor-pointer flex-1"
                                        >
                                          {item.name} - ${item.price.toFixed(2)}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                      </Accordion>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Special Dialog */}
              <Dialog
                open={!!editingSpecial}
                onOpenChange={() => setEditingSpecial(null)}
              >
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Special</DialogTitle>
                    <DialogDescription>
                      Update the special offer details and affected menu items
                    </DialogDescription>
                  </DialogHeader>
                  {editingSpecial && (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column - Special Details */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="editSpecialName">Special Name</Label>
                          <Input
                            id="editSpecialName"
                            value={editingSpecial.name}
                            onChange={(e) =>
                              setEditingSpecial({
                                ...editingSpecial,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="editSpecialDescription">
                            Description
                          </Label>
                          <Textarea
                            id="editSpecialDescription"
                            value={editingSpecial.description}
                            onChange={(e) =>
                              setEditingSpecial({
                                ...editingSpecial,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="editStartDate">Start Date</Label>
                            <Input
                              id="editStartDate"
                              type="date"
                              value={editingSpecial.startDate}
                              onChange={(e) =>
                                setEditingSpecial({
                                  ...editingSpecial,
                                  startDate: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="editEndDate">End Date</Label>
                            <Input
                              id="editEndDate"
                              type="date"
                              value={editingSpecial.endDate}
                              onChange={(e) =>
                                setEditingSpecial({
                                  ...editingSpecial,
                                  endDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setEditingSpecial(null)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveSpecial}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>

                      {/* Right Column - Affected Menu Items */}
                      <div>
                        <Label className="text-lg font-semibold">
                          Affected Menu Items
                        </Label>
                        <p className="text-sm text-gray-500 mb-4">
                          Select which menu items this special applies to
                        </p>
                        <Accordion
                          type="multiple"
                          className="w-full max-h-96 overflow-y-auto"
                        >
                          {categories
                            .filter((cat) => cat.isActive)
                            .map((category) => {
                              const categoryItems = menuItems.filter(
                                (item) =>
                                  item.isActive &&
                                  item.category === category.id,
                              );
                              if (categoryItems.length === 0) return null;
                              return (
                                <AccordionItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  <AccordionTrigger className="hover:no-underline px-3 py-2">
                                    <span className="font-medium">
                                      {category.name}
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2 pt-2">
                                      {categoryItems.map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center space-x-2"
                                        >
                                          <Checkbox
                                            id={`edit-special-item-${item.id}`}
                                            checked={
                                              editingSpecial.menuItems?.includes(
                                                item.id,
                                              ) || false
                                            }
                                            onCheckedChange={(checked) => {
                                              const currentItems =
                                                editingSpecial.menuItems || [];
                                              if (checked) {
                                                setEditingSpecial({
                                                  ...editingSpecial,
                                                  menuItems: [
                                                    ...currentItems,
                                                    item.id,
                                                  ],
                                                });
                                              } else {
                                                setEditingSpecial({
                                                  ...editingSpecial,
                                                  menuItems:
                                                    currentItems.filter(
                                                      (id) => id !== item.id,
                                                    ),
                                                });
                                              }
                                            }}
                                          />
                                          <Label
                                            htmlFor={`edit-special-item-${item.id}`}
                                            className="text-sm cursor-pointer flex-1"
                                          >
                                            {item.name} - $
                                            {item.price.toFixed(2)}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                        </Accordion>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {specials.map((special) => (
                <Card key={special.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{special.name}</h3>
                          <Badge variant="outline">
                            {special.type === "daily" ? "Daily" : "Weekly"}
                          </Badge>
                          <Badge
                            variant={special.isActive ? "default" : "secondary"}
                          >
                            {special.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {special.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {special.startDate} to {special.endDate}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSpecial(special)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
