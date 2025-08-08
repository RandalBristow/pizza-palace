import { useState } from "react";
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
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
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>
                    Create a new menu item for your restaurant
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="itemName">Name</Label>
                    <Input id="itemName" placeholder="Item name" />
                  </div>
                  <div>
                    <Label htmlFor="itemCategory">Category</Label>
                    <Select>
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
                  <div>
                    <Label htmlFor="itemPrice">Price</Label>
                    <Input id="itemPrice" type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="itemDescription">Description</Label>
                    <Textarea id="itemDescription" placeholder="Item description" rows={3} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingMenuItem(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddingMenuItem(false)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Item
                    </Button>
                  </div>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Menu Item Dialog */}
        <Dialog open={!!editingMenuItem} onOpenChange={() => setEditingMenuItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update the menu item details
              </DialogDescription>
            </DialogHeader>
            {editingMenuItem && (
              <div className="space-y-4">
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
                  <Label htmlFor="editItemCategory">Category</Label>
                  <Select
                    value={editingMenuItem.category}
                    onValueChange={(value) => setEditingMenuItem({
                      ...editingMenuItem,
                      category: value
                    })}
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
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Topping Category
          </Button>
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
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                    <Input id="toppingName" placeholder="Topping name" />
                  </div>
                  <div>
                    <Label htmlFor="toppingCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                    <Label htmlFor="toppingPrice">Price</Label>
                    <Input id="toppingPrice" type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingTopping(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddingTopping(false)}>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTopping(topping)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Special
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {specials.map((special) => (
            <Card key={special.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
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
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function renderCarouselImages() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Carousel Images</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
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
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderCustomerFavorites() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customer Favorites</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Favorite
          </Button>
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
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
