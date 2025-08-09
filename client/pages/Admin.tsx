import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import AdminSidebar from "../components/AdminSidebar";
import { FileText } from "lucide-react";
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

// Import form components
import SettingsForm from "../components/admin/SettingsForm";
import MenuCategoryForm from "../components/admin/MenuCategoryForm";
import MenuItemForm from "../components/admin/MenuItemForm";
import ToppingCategoryForm from "../components/admin/ToppingCategoryForm";
import ToppingItemForm from "../components/admin/ToppingItemForm";
import SpecialForm from "../components/admin/SpecialForm";
import CarouselForm from "../components/admin/CarouselForm";
import CustomerFavoriteForm from "../components/admin/CustomerFavoriteForm";

// Interfaces for carousel and customer favorites
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

interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

interface Settings {
  taxRate: number;
  deliveryFee: number;
  businessHours: {
    [key: string]: BusinessHours;
  };
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

  // Initialize carousel images from localStorage or use default
  const getInitialCarouselImages = () => {
    try {
      const stored = localStorage.getItem("carouselImages");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading carousel images:", error);
    }

    return [
      {
        id: "1",
        url: "https://cdn.builder.io/api/v1/image/assets%2F8595ba96a391483e886f01139655b832%2F3eb3e3851578457ebc6357b42054ea36?format=webp&width=800",
        title: "Fresh Pizza & Premium Coffee",
        subtitle: "Made to Order",
        isActive: true,
        order: 1,
      },
    ];
  };

  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(
    getInitialCarouselImages(),
  );

  // Initialize customer favorites from localStorage or use default
  const getInitialCustomerFavorites = () => {
    try {
      const stored = localStorage.getItem("customerFavorites");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading customer favorites:", error);
    }

    return [
      {
        id: "1",
        title: "Fresh Ingredients",
        description: "We use only the freshest ingredients in all our dishes",
        icon: "🥬",
        isActive: true,
        order: 1,
      },
      {
        id: "2",
        title: "Fast Delivery",
        description: "Quick and reliable delivery to your doorstep",
        icon: "🚚",
        isActive: true,
        order: 2,
      },
      {
        id: "3",
        title: "Great Taste",
        description: "Delicious flavors that keep customers coming back",
        icon: "😋",
        isActive: true,
        order: 3,
      },
    ];
  };

  const [customerFavorites, setCustomerFavorites] = useState<
    CustomerFavorite[]
  >(getInitialCustomerFavorites());

  // Initialize settings from localStorage or use default
  const getInitialSettings = () => {
    try {
      const stored = localStorage.getItem("restaurantSettings");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }

    return {
      taxRate: 8.5,
      deliveryFee: 2.99,
      businessHours: {
        monday: { open: "09:00", close: "22:00", closed: false },
        tuesday: { open: "09:00", close: "22:00", closed: false },
        wednesday: { open: "09:00", close: "22:00", closed: false },
        thursday: { open: "09:00", close: "22:00", closed: false },
        friday: { open: "09:00", close: "23:00", closed: false },
        saturday: { open: "10:00", close: "23:00", closed: false },
        sunday: { open: "10:00", close: "21:00", closed: false },
      },
    };
  };

  const [settings, setSettings] = useState<Settings>(getInitialSettings());

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("toppings", JSON.stringify(toppings));
  }, [toppings]);

  useEffect(() => {
    localStorage.setItem(
      "toppingCategories",
      JSON.stringify(toppingCategories),
    );
  }, [toppingCategories]);

  useEffect(() => {
    localStorage.setItem("specials", JSON.stringify(specials));
  }, [specials]);

  useEffect(() => {
    localStorage.setItem("carouselImages", JSON.stringify(carouselImages));
  }, [carouselImages]);

  useEffect(() => {
    localStorage.setItem(
      "customerFavorites",
      JSON.stringify(customerFavorites),
    );
  }, [customerFavorites]);

  useEffect(() => {
    localStorage.setItem("restaurantSettings", JSON.stringify(settings));
  }, [settings]);

  const generateMenuPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const menuHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pronto Pizza Cafe - Menu</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .category { margin-bottom: 30px; }
          .category-title { font-size: 24px; font-weight: bold; color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; }
          .menu-item { margin-bottom: 15px; padding: 10px; border-left: 3px solid #e74c3c; }
          .item-name { font-weight: bold; font-size: 18px; }
          .item-description { color: #666; margin: 5px 0; }
          .item-price { font-weight: bold; color: #e74c3c; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Pronto Pizza Cafe</h1>
          <p>Fresh Pizza & Premium Coffee</p>
          <p>914 Ashland Rd, Mansfield, OH 44905 | (419) 589-7777</p>
        </div>
        ${categories
          .filter((cat) => cat.isActive)
          .map(
            (category) => `
          <div class="category">
            <h2 class="category-title">${category.name}</h2>
            ${menuItems
              .filter((item) => item.category === category.id && item.isActive)
              .map(
                (item) => `
              <div class="menu-item">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `,
          )
          .join("")}
      </body>
      </html>
    `;

    printWindow.document.write(menuHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "settings":
        return (
          <SettingsForm settings={settings} onSettingsChange={setSettings} />
        );
      case "categories":
        return (
          <MenuCategoryForm
            categories={categories}
            menuItems={menuItems}
            toppingCategories={toppingCategories}
            onCategoriesChange={setCategories}
          />
        );
      case "menu-items":
        return (
          <MenuItemForm
            menuItems={menuItems}
            categories={categories}
            toppingCategories={toppingCategories}
            toppings={toppings}
            selectedMenuCategory={selectedMenuCategory}
            onMenuItemsChange={setMenuItems}
            onSelectedCategoryChange={setSelectedMenuCategory}
          />
        );
      case "topping-categories":
        return (
          <ToppingCategoryForm
            toppingCategories={toppingCategories}
            categories={categories}
            toppings={toppings}
            selectedToppingCategory={selectedToppingCategory}
            onToppingCategoriesChange={setToppingCategories}
            onSelectedCategoryChange={setSelectedToppingCategory}
          />
        );
      case "topping-items":
        return (
          <ToppingItemForm
            toppings={toppings}
            categories={categories}
            toppingCategories={toppingCategories}
            selectedToppingCategory={selectedToppingCategory}
            onToppingsChange={setToppings}
            onSelectedCategoryChange={setSelectedToppingCategory}
          />
        );
      case "specials":
        return (
          <SpecialForm
            specials={specials}
            categories={categories}
            menuItems={menuItems}
            onSpecialsChange={setSpecials}
          />
        );
      case "carousel-images":
        return (
          <CarouselForm
            carouselImages={carouselImages}
            onCarouselImagesChange={setCarouselImages}
          />
        );
      case "customer-favorites":
        return (
          <CustomerFavoriteForm
            customerFavorites={customerFavorites}
            onCustomerFavoritesChange={setCustomerFavorites}
          />
        );
      default:
        return (
          <SettingsForm settings={settings} onSettingsChange={setSettings} />
        );
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
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
