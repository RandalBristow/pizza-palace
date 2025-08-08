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
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.name}</h3>
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
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Topping Items</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Topping
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {toppings.map((topping) => (
            <Card key={topping.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{topping.name}</h3>
                    <Badge
                      variant={topping.isActive ? "default" : "secondary"}
                    >
                      {topping.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      +${topping.price.toFixed(2)}
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
