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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Pizza, Coffee, Star } from "lucide-react";
import { useCategories, useMenuItems, useImages, useCategorySizes, useMenuItemSizes, useSubCategories } from "../hooks/useSupabase";
import { type MenuItem } from "../data/mockData";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [showDeliverySelection, setShowDeliverySelection] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
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
  const { subCategories: dbSubCategories, loading: subCategoriesLoading } = useSubCategories();
  const { images, loading: imagesLoading } = useImages();
  const { categorySizes, loading: categorySizesLoading } = useCategorySizes();
  const { menuItemSizes, loading: menuItemSizesLoading } = useMenuItemSizes();

  // Set initial category when data loads
  useEffect(() => {
    if (!categoriesLoading && dbCategories.length > 0 && !selectedCategory) {
      const firstActiveCategory = dbCategories.find((cat) => cat.isActive);
      if (firstActiveCategory) {
        setSelectedCategory(firstActiveCategory.id);
      }
    }
  }, [dbCategories, categoriesLoading, selectedCategory]);

  // Set default size selections for items with multiple sizes
  useEffect(() => {
    if (!menuItemsLoading && !categorySizesLoading && !menuItemSizesLoading && selectedCategory) {
      const newSelectedSizes: { [key: string]: string } = {};
      
      dbMenuItems.forEach(item => {
        if (item.isActive && item.category === selectedCategory) {
          const sizeOptions = getItemSizeOptions(item);
          if (sizeOptions.length > 1 && !selectedSizes[item.id]) {
            // Set default to the last item in the list
            const lastSize = sizeOptions[sizeOptions.length - 1];
            newSelectedSizes[item.id] = lastSize.size;
          }
        }
      });
      
      if (Object.keys(newSelectedSizes).length > 0) {
        setSelectedSizes(prev => ({ ...prev, ...newSelectedSizes }));
      }
    }
  }, [selectedCategory, dbMenuItems, menuItemsLoading, categorySizesLoading, menuItemSizesLoading]);

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

  // Helper function to get sizes for a category
  const getCategorySizes = (categoryId: string) => {
    return categorySizes
      .filter(size => size.categoryId === categoryId && size.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  // Helper function to get menu item size pricing
  const getMenuItemSizes = (menuItemId: string) => {
    return menuItemSizes.filter(size => size.menu_item_id === menuItemId);
  };

  // Helper function to get price for a menu item size
  const getSizePrice = (menuItemId: string, categorySizeId: string) => {
    const itemSize = menuItemSizes.find(
      size => size.menu_item_id === menuItemId && size.category_size_id === categorySizeId
    );
    return itemSize?.price ?? 0;
  };

  // Helper function to get the display price for an item
  const getItemDisplayPrice = (item: any) => {
    const itemSizes = getMenuItemSizes(item.id);
    if (itemSizes.length > 0) {
      // Return the lowest price if multiple sizes
      return Math.min(...itemSizes.map(size => size.price));
    }
    return item.price ?? 0;
  };

  // Helper function to get size options for an item
  const getItemSizeOptions = (item: any) => {
    const categorySizesForItem = getCategorySizes(item.category);
    const itemSizes = getMenuItemSizes(item.id);

    if (categorySizesForItem.length === 0 || itemSizes.length === 0) {
      return [];
    }

    return categorySizesForItem.map(categorySize => {
      const price = getSizePrice(item.id, categorySize.id);
      return {
        size: categorySize.sizeName,
        price: price,
        categorySizeId: categorySize.id
      };
    }).filter(option => option.price > 0); // Only show sizes with prices
  };

  const handleSizeChange = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }));
  };

  const getSelectedSize = (itemId: string) => {
    const sizeOptions = getItemSizeOptions(dbMenuItems.find(item => item.id === itemId) || {});
    const selectedSize = selectedSizes[itemId];
    // If no size is selected and there are size options, return the last one
    if (!selectedSize && sizeOptions.length > 0) {
      return sizeOptions[sizeOptions.length - 1].size;
    }
    return selectedSize || '';
  };

  const addToCart = (item: MenuItem, size?: string) => {
    const selectedSize = size || getSelectedSize(item.id);

    if (!hasDeliveryDetails) {
      setPendingAction({
        action: () => {
          const cartItem = {
            ...item,
            selectedSize: selectedSize,
            cartId: `${item.id}-${selectedSize || "default"}-${Date.now()}`,
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
      selectedSize: selectedSize,
      cartId: `${item.id}-${selectedSize || "default"}-${Date.now()}`,
    };
    setCart((prev) => [...prev, cartItem]);
  };

  const customizeItem = (item: MenuItem, size?: string) => {
    const selectedSize = size || getSelectedSize(item.id);
    const customizationPath =
      item.category === "wings"
        ? `/wings?item=${item.id}&size=${selectedSize || ""}`
        : `/order?item=${item.id}&size=${selectedSize || ""}`;

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
  if (categoriesLoading || menuItemsLoading || subCategoriesLoading || imagesLoading || categorySizesLoading || menuItemSizesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  const renderMenuItemCard = (item: any) => {
    const sizeOptions = getItemSizeOptions(item);
    const currentSelectedSize = getSelectedSize(item.id);
    const selectedSizeOption = sizeOptions.find(opt => opt.size === currentSelectedSize);

    return (
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
          </div>

          <div className="mt-auto space-y-3">
            {sizeOptions.length > 1 ? (
              <>
                <Select
                  value={currentSelectedSize}
                  onValueChange={(value) => handleSizeChange(item.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {selectedSizeOption
                        ? `${selectedSizeOption.size} - $${selectedSizeOption.price.toFixed(2)}`
                        : `${sizeOptions[sizeOptions.length - 1]?.size} - $${sizeOptions[sizeOptions.length - 1]?.price.toFixed(2)}`
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((sizeOption) => (
                      <SelectItem key={sizeOption.size} value={sizeOption.size}>
                        {sizeOption.size} - ${sizeOption.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              </>
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
    );
  };

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

          {categories.map((category) => {
            // Group items by sub-category
            const categorySubCategories = dbSubCategories
              .filter(sub => sub.categoryId === category.id && sub.isActive)
              .sort((a, b) => a.displayOrder - b.displayOrder);

            const itemsBySubCategory = categorySubCategories.reduce((acc, subCat) => {
              acc[subCat.id] = filteredItems.filter(item => item.subCategoryId === subCat.id);
              return acc;
            }, {} as { [key: string]: any[] });

            // Items without sub-category
            const itemsWithoutSubCategory = filteredItems.filter(item => !item.subCategoryId);

            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-8">
                  {/* Items without sub-category */}
                  {itemsWithoutSubCategory.length > 0 && (
                    <div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itemsWithoutSubCategory.map((item) => renderMenuItemCard(item))}
                      </div>
                    </div>
                  )}

                  {/* Items grouped by sub-category */}
                  {categorySubCategories.map((subCategory) => {
                    const subCategoryItems = itemsBySubCategory[subCategory.id] || [];
                    if (subCategoryItems.length === 0) return null;

                    return (
                      <div key={subCategory.id}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {subCategory.name}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {subCategoryItems.map((item) => renderMenuItemCard(item))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Show message if no items in category */}
                  {filteredItems.length === 0 && (
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
            );
          })}
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
