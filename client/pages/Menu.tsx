import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import DeliverySelection from "../components/DeliverySelection";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import { useOrder } from "../contexts/OrderContext";
import { useCart } from "../contexts/CartContext";
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
import {
  useCategories,
  useMenuItems,
  useImages,
  useCategorySizes,
  useCategorySizeSubCategories,
  useMenuItemSizes,
  useSubCategories,
  useToppings,
  useToppingCategories,
  useCustomizerPanelItems,
  useCustomizerPanels,
  useCustomizerTemplates,
} from "../hooks/useSupabase";

// Define MenuItem type (adjust fields as needed)
type MenuItem = {
  id: string;
  name: string;
  description?: string;
  category: string;
  subCategoryId?: string;
  imageId?: string;
  customizerTemplateId?: string;
  price?: number;
  isActive: boolean;
  showAddToCart?: boolean;
};

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDeliverySelection, setShowDeliverySelection] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
    {},
  );
  const [pendingAction, setPendingAction] = useState<{
    action: () => void;
    type: string;
  } | null>(null);
  const { deliveryDetails, setDeliveryDetails, hasDeliveryDetails } =
    useOrder();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Load data from database
  const { categories: dbCategories, loading: categoriesLoading } =
    useCategories();
  const { menuItems: dbMenuItems, loading: menuItemsLoading } = useMenuItems();
  const { subCategories: dbSubCategories, loading: subCategoriesLoading } =
    useSubCategories();
  const { images, loading: imagesLoading } = useImages();
  const { categorySizes, loading: categorySizesLoading } = useCategorySizes();
  const { categorySizeSubCategories, loading: categorySizeSubCategoriesLoading } = useCategorySizeSubCategories();
  const { menuItemSizes, loading: menuItemSizesLoading } = useMenuItemSizes();
  const { toppings: allToppings, loading: toppingsLoading } = useToppings();
  const { toppingCategories, loading: toppingCategoriesLoading } = useToppingCategories();
  const { customizerPanelItems, loading: panelItemsLoading } = useCustomizerPanelItems();
  const { customizerPanels, loading: panelsLoading } = useCustomizerPanels();
  const { customizerTemplates, loading: templatesLoading } = useCustomizerTemplates();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (
      !menuItemsLoading &&
      !categorySizesLoading &&
      !menuItemSizesLoading &&
      selectedCategory
    ) {
      const newSelectedSizes: { [key: string]: string } = {};

      dbMenuItems.forEach((item) => {
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
        setSelectedSizes((prev) => ({ ...prev, ...newSelectedSizes }));
      }
    }
  }, [
    selectedCategory,
    dbMenuItems,
    menuItemsLoading,
    categorySizesLoading,
    menuItemSizesLoading,
  ]);

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

  // Helper function to get sizes for a category and sub-category
  const getCategorySizes = (categoryId: string, subCategoryId?: string) => {
    let filteredSizes = categorySizes.filter(
      (size) => size.categoryId === categoryId && size.isActive
    );

    // If subCategoryId is provided, filter by sub-category associations
    if (subCategoryId) {
      const allowedSizeIds = categorySizeSubCategories
        .filter((assoc) => assoc.subCategoryId === subCategoryId)
        .map((assoc) => assoc.categorySizeId);
      
      filteredSizes = filteredSizes.filter((size) =>
        allowedSizeIds.includes(size.id)
      );
    }

    return filteredSizes.sort((a, b) => a.displayOrder - b.displayOrder);
  };

  // Helper function to get menu item size pricing
  const getMenuItemSizes = (menuItemId: string) => {
    return menuItemSizes.filter((size) => size.menu_item_id === menuItemId);
  };

  // Helper function to get price for a menu item size
  const getSizePrice = (menuItemId: string, categorySizeId: string) => {
    const itemSize = menuItemSizes.find(
      (size) =>
        size.menu_item_id === menuItemId &&
        size.category_size_id === categorySizeId,
    );
    return itemSize?.price ?? 0;
  };

  // Helper function to get the display price for an item
  const getItemDisplayPrice = (item: any) => {
    const itemSizes = getMenuItemSizes(item.id);
    if (itemSizes.length > 0) {
      // Return the lowest price if multiple sizes
      return Math.min(...itemSizes.map((size) => size.price));
    }
    return item.price ?? 0;
  };

  // Helper function to get size options for an item
  const getItemSizeOptions = (item: any) => {
    const categorySizesForItem = getCategorySizes(item.category, item.subCategoryId);
    const itemSizes = getMenuItemSizes(item.id);

    if (categorySizesForItem.length === 0 || itemSizes.length === 0) {
      return [];
    }

    return categorySizesForItem
      .map((categorySize) => {
        const price = getSizePrice(item.id, categorySize.id);
        return {
          size: categorySize.sizeName,
          price: price,
          categorySizeId: categorySize.id,
        };
      })
      .filter((option) => option.price > 0); // Only show sizes with prices
  };

  const handleSizeChange = (itemId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [itemId]: size,
    }));
  };

  const getSelectedSize = (itemId: string) => {
    const sizeOptions = getItemSizeOptions(
      dbMenuItems.find((item) => item.id === itemId) || {},
    );
    const selectedSize = selectedSizes[itemId];
    // If no size is selected and there are size options, return the last one
    if (!selectedSize && sizeOptions.length > 0) {
      return sizeOptions[sizeOptions.length - 1].size;
    }
    return selectedSize || "";
  };

  const addToCart = (item: MenuItem, size?: string) => {
    const selectedSize = size || getSelectedSize(item.id);

    const performAdd = () => {
      const sizeOptions = getItemSizeOptions(item);
      const selectedOption = sizeOptions.find((opt) => opt.size === selectedSize);
      const price = selectedOption ? selectedOption.price : (item.price ?? 0);
      
      // Include default toppings if the item has them
      const defaultToppings = (item as any).defaultToppings || {};
      const itemToppings = Object.entries(defaultToppings).map(([toppingId, toppingData]: [string, any]) => {
        const topping = allToppings.find((t) => t.id === toppingId);
        if (topping) {
          return {
            id: topping.id,
            name: topping.name,
            price: 0, // Default toppings are typically free
            placement: "whole" as const,
            amount: toppingData?.amount || "normal" as const,
          };
        }
        return null;
      }).filter(Boolean);
      
      // Include default list selections if the item has them
      const defaultListSelections = (item as any).defaultListSelections || {};
      const selections: Array<{panelTitle: string; itemName: string; price?: number}> = [];
      
      // Convert panel item IDs to selections array with panel titles
      Object.entries(defaultListSelections).forEach(([panelId, itemId]: [string, string]) => {
        if (!itemId || itemId === "none") return; // Skip empty selections
        
        const panelItem = customizerPanelItems.find(pi => pi.id === itemId);
        if (panelItem) {
          const itemName = panelItem.name || panelItem.customName || '';
          // Find the panel this item belongs to so we can get the panel title
          const panel = customizerPanels.find(p => p.id === panelItem.customizerPanelId);
          const panelTitle = panel?.title || 'Selection';
          
          selections.push({
            panelTitle: panelTitle,
            itemName: itemName,
            price: panelItem.customPrice || 0
          });
        }
      });
      
      // Get topping category name if item has toppings but no selections (no customizer)
      let toppingCategoryName = undefined;
      if (itemToppings.length > 0 && selections.length === 0) {
        // Get the first topping's category
        const firstToppingId = Object.keys(defaultToppings)[0];
        const firstTopping = allToppings.find((t) => t.id === firstToppingId);
        if (firstTopping && firstTopping.category) {
          const toppingCategory = toppingCategories.find((tc) => tc.id === firstTopping.category);
          if (toppingCategory) {
            toppingCategoryName = toppingCategory.name;
          }
        }
      }
      
      const itemToAdd = {
        menuItemId: item.id,
        name: item.name,
        price,
        quantity: 1,
        size: selectedSize || undefined,
        toppings: itemToppings,
        selections: selections,
        toppingCategoryName: toppingCategoryName,
      };
      
      addItem(itemToAdd);
    };

    if (!hasDeliveryDetails) {
      setPendingAction({
        action: performAdd,
        type: "addToCart",
      });
      setShowDeliverySelection(true);
      return;
    }

    performAdd();
  };

  // Check if an item has a customizer template
  const hasCustomizer = (item: MenuItem) => {
    if (!item.subCategoryId) return false;
    
    // Check if item has specific template assigned
    if (item.customizerTemplateId) {
      return customizerTemplates.some(
        (t) => t.id === item.customizerTemplateId && t.isActive
      );
    }
    
    // Check if there's any template for the sub-category
    return customizerTemplates.some(
      (t) => t.isActive && t.subCategoryId === item.subCategoryId
    );
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
  if (
    categoriesLoading ||
    menuItemsLoading ||
    subCategoriesLoading ||
    imagesLoading ||
    categorySizesLoading ||
    categorySizeSubCategoriesLoading ||
    menuItemSizesLoading ||
    toppingsLoading ||
    panelItemsLoading ||
    panelsLoading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto" style={{ borderColor: 'var(--primary)' }}></div>
          <p className="mt-4" style={{ color: 'var(--muted-foreground)' }}>Loading menu...</p>
        </div>
      </div>
    );
  }

  const renderMenuItemCard = (item: any) => {
    const sizeOptions = getItemSizeOptions(item);
    const currentSelectedSize = getSelectedSize(item.id);
    const selectedSizeOption = sizeOptions.find(
      (opt) => opt.size === currentSelectedSize,
    );

    return (
      <Card 
        key={item.id} 
        className="flex flex-col h-full"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}
      >
        <div className="aspect-[4/3] rounded-t-lg overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
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
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
                <Pizza className="h-16 w-16" />
              </div>
            );
          })()}
        </div>
        <CardContent className="flex flex-col flex-1 p-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--primary)' }}>
                {item.name}
              </h3>
              <div className="flex items-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>4.8</span>
              </div>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{item.description}</p>
          </div>

          <div className="mt-auto space-y-3">
            {sizeOptions.length > 1 ? (
              <>
                <Select
                  value={currentSelectedSize}
                  onValueChange={(value) => handleSizeChange(item.id, value)}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.boxShadow = `0 0 0 2px var(--ring)`;
                    }}
                    onBlur={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.boxShadow = 'none';
                    }}
                  >
                    <SelectValue>
                      {selectedSizeOption
                        ? `${selectedSizeOption.size} - $${selectedSizeOption.price.toFixed(2)}`
                        : `${sizeOptions[sizeOptions.length - 1]?.size} - $${sizeOptions[sizeOptions.length - 1]?.price.toFixed(2)}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    {sizeOptions.map((sizeOption) => (
                      <SelectItem 
                        key={sizeOption.size} 
                        value={sizeOption.size}
                        style={{ color: 'var(--popover-foreground)' }}
                      >
                        {sizeOption.size} - ${sizeOption.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  {hasCustomizer(item) && (
                    <Button
                      variant="outline"
                      className={item.showAddToCart !== false ? "flex-1" : "w-full"}
                      style={{
                        color: 'var(--primary)',
                        borderColor: 'var(--primary)',
                        backgroundColor: 'var(--card)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.backgroundColor = 'var(--accent)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.backgroundColor = 'var(--card)';
                      }}
                      onClick={() => customizeItem(item)}
                    >
                      CUSTOMIZE
                    </Button>
                  )}
                  {item.showAddToCart !== false && (
                    <Button
                      className={hasCustomizer(item) ? "flex-1" : "w-full"}
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.transform = 'translateY(-1px)';
                        target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.transform = 'translateY(0)';
                        target.style.boxShadow = 'none';
                      }}
                      onClick={() => addToCart(item)}
                    >
                      ADD TO ORDER
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                {hasCustomizer(item) && (
                  <Button
                    variant="outline"
                    className={item.showAddToCart !== false ? "flex-1" : "w-full"}
                    style={{
                      color: 'var(--primary)',
                      borderColor: 'var(--primary)',
                      backgroundColor: 'var(--card)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = 'var(--card)';
                    }}
                    onClick={() => customizeItem(item)}
                  >
                    CUSTOMIZE
                  </Button>
                )}
                {item.showAddToCart !== false && (
                  <Button
                    className={hasCustomizer(item) ? "flex-1" : "w-full"}
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(-1px)';
                      target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(0)';
                      target.style.boxShadow = 'none';
                    }}
                    onClick={() => addToCart(item)}
                  >
                    ADD TO ORDER
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <HeaderWithDelivery breadcrumbs={[{ label: "Menu" }]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Our Menu</h1>
          <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Fresh ingredients, authentic flavors
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList 
            className="grid w-full grid-cols-6 mb-8"
            style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center space-x-2"
                  style={{
                    color: selectedCategory === category.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                    backgroundColor: selectedCategory === category.id ? 'var(--primary)' : 'transparent'
                  }}
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
              .filter((sub) => sub.categoryId === category.id && sub.isActive)
              .sort((a, b) => a.displayOrder - b.displayOrder);

            const itemsBySubCategory = categorySubCategories.reduce(
              (acc, subCat) => {
                acc[subCat.id] = filteredItems.filter(
                  (item) => item.subCategoryId === subCat.id,
                );
                return acc;
              },
              {} as { [key: string]: any[] },
            );

            // Items without sub-category
            const itemsWithoutSubCategory = filteredItems.filter(
              (item) => !item.subCategoryId,
            );

            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-8">
                  {/* Items without sub-category */}
                  {itemsWithoutSubCategory.length > 0 && (
                    <div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {itemsWithoutSubCategory.map((item) =>
                          renderMenuItemCard(item),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items grouped by sub-category */}
                  {categorySubCategories.map((subCategory) => {
                    const subCategoryItems =
                      itemsBySubCategory[subCategory.id] || [];
                    if (subCategoryItems.length === 0) return null;

                    return (
                      <div key={subCategory.id}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                          {subCategory.name}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {subCategoryItems.map((item) =>
                            renderMenuItemCard(item),
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Show message if no items in category */}
                  {filteredItems.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                        <Pizza className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                        No items available
                      </h3>
                      <p style={{ color: 'var(--muted-foreground)' }}>
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