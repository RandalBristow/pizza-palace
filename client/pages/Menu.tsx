import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import DeliverySelection from "../components/DeliverySelection";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import { useOrder } from "../context/OrderContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Pizza, Coffee, Star } from "lucide-react";
import { useCategories, useMenuItems, useImages, useCategorySizes, useMenuItemSizes } from "../hooks/useSupabase";
import { type MenuItem } from "../data/mockData";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [showDeliverySelection, setShowDeliverySelection] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: () => void;
    type: string;
  } | null>(null);
  const { deliveryDetails, setDeliveryDetails, hasDeliveryDetails } =
    useOrder();
  const navigate = useNavigate();

  // Load data from database
  const { categories: dbCategories, loading: categoriesLoading } =
    useCategories();
  const { menuItems: dbMenuItems, loading: menuItemsLoading } = useMenuItems();
  const { images, loading: imagesLoading } = useImages();

  // Set initial category when data loads
  useEffect(() => {
    if (!categoriesLoading && dbCategories.length > 0 && !selectedCategory) {
      const firstActiveCategory = dbCategories.find((cat) => cat.isActive);
      if (firstActiveCategory) {
        setSelectedCategory(firstActiveCategory.id);
      }
    }
  }, [dbCategories, categoriesLoading, selectedCategory]);

  // Use database categories and filter active ones
  const categories = dbCategories
    .filter((cat) => cat.isActive)
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.id === "coffee" || cat.id === "drinks" ? Coffee : Pizza,
    }));

  // Filter menu items by category and only show active items
  const filteredItems = dbMenuItems.filter(
    (item) => item.category === selectedCategory && item.isActive,
  );

  const addToCart = (item: MenuItem, size?: string) => {
    if (!hasDeliveryDetails) {
      setPendingAction({
        action: () => {
          const cartItem = {
            ...item,
            selectedSize: size,
            cartId: `${item.id}-${size || "default"}-${Date.now()}`,
          };
          setCart((prev) => [...prev, cartItem]);
        },
        type: "addToCart",
      });
      setShowDeliverySelection(true);
      return;
    }

    const cartItem = {
      ...item,
      selectedSize: size,
      cartId: `${item.id}-${size || "default"}-${Date.now()}`,
    };
    setCart((prev) => [...prev, cartItem]);
  };

  const customizeItem = (item: MenuItem, size?: string) => {
    const customizationPath =
      item.category === "wings"
        ? `/wings?item=${item.id}&size=${size || ""}`
        : `/order?item=${item.id}&size=${size || ""}`;

    if (!hasDeliveryDetails) {
      setPendingAction({
        action: () => navigate(customizationPath),
        type: "customize",
      });
      setShowDeliverySelection(true);
      return;
    }

    navigate(customizationPath);
  };

  const handleDeliveryConfirm = (details: any) => {
    setDeliveryDetails(details);
    setShowDeliverySelection(false);
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
  };

  // Show loading state while data is being fetched
  if (categoriesLoading || menuItemsLoading || imagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery cart={cart} breadcrumbs={[{ label: "Menu" }]} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-gray-600 mt-1">
            Fresh ingredients, authentic flavors
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <Card key={item.id} className="flex flex-col h-full">
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        {(() => {
                          const menuItemImage = item.imageId
                            ? images.find((img) => img.id === item.imageId)
                            : null;
                          return menuItemImage ? (
                            <img
                              src={menuItemImage.url}
                              alt={menuItemImage.altText || item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Pizza className="h-16 w-16" />
                            </div>
                          );
                        })()}
                      </div>
                      <CardContent className="flex flex-col flex-1 p-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-blue-600">
                              {item.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>4.8</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="outline">
                              ${(item.price ?? 0).toFixed(2)}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-auto space-y-2">
                          {item.sizes && item.sizes.length > 1 ? (
                            <div className="space-y-2">
                              {item.sizes.map((sizeOption) => (
                                <div
                                  key={sizeOption.size}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm font-medium">
                                    {sizeOption.size} - $
                                    {(sizeOption.price ?? 0).toFixed(2)}
                                  </span>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        customizeItem(item, sizeOption.size)
                                      }
                                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                    >
                                      CUSTOMIZE
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        addToCart(item, sizeOption.size)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      ADD TO ORDER
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                                onClick={() => customizeItem(item)}
                              >
                                CUSTOMIZE
                              </Button>
                              <Button
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={() => addToCart(item)}
                              >
                                ADD TO ORDER
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Pizza className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No items available
                    </h3>
                    <p className="text-gray-500">
                      We're working on adding items to this category.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <DeliverySelection
        isOpen={showDeliverySelection}
        onClose={() => {
          setShowDeliverySelection(false);
          setPendingAction(null);
        }}
        onConfirm={handleDeliveryConfirm}
        currentDetails={deliveryDetails}
      />
    </div>
  );
}
