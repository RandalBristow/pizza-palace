import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import CustomizerView from "../components/CustomizerView";
import { Button } from "../components/ui/button";
import { useCart, CartItem } from "../contexts/CartContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  useCustomizerTemplates,
  useCustomizerPanels,
  useCustomizerPanelItems,
  useCustomizerPanelItemConditionals,
  useCategorySizes,
  useToppings,
  useToppingCategories,
  useCategories,
  useMenuItems,
  useSubCategories,
  useMenuItemSizes,
  useToppingSizePrices,
  useSettings,
} from "../hooks/useSupabase";

interface Topping {
  id: string;
  name: string;
  price?: number;
  category: string;
  menuItemCategory: string;
}

interface PizzaTopping extends Topping {
  placement: "left" | "right" | "whole";
  amount?: "normal" | "extra";
}

interface PizzaOrder {
  size: string;
  crust: string;
  sauce: string;
  toppings: PizzaTopping[];
  basePrice: number;
}

// Hardcoded data removed - now using dynamic customizer panels

export default function Order() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);
  const [searchParams] = useSearchParams();

  // Legacy pizza order state (for fallback)
  const [pizzaOrder, setPizzaOrder] = useState<PizzaOrder>({
    size: "",
    crust: "",
    sauce: "",
    toppings: [],
    basePrice: 0,
  });

  // New customizer state
  const [customizerSelections, setCustomizerSelections] = useState<Record<string, any>>({});
  const [menuItemId, setMenuItemId] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const [currentMenuItem, setCurrentMenuItem] = useState<any>(null);
  const [selectionsInitialized, setSelectionsInitialized] = useState(false);

  // Fetch data
  const { customizerTemplates, loading: templatesLoading } = useCustomizerTemplates();
  const { customizerPanels, loading: panelsLoading } = useCustomizerPanels();
  const { customizerPanelItems, loading: itemsLoading } = useCustomizerPanelItems();
  const { customizerPanelItemConditionals, loading: conditionalsLoading } = useCustomizerPanelItemConditionals();
  const { categorySizes: catSizes, loading: sizesLoading } = useCategorySizes();
  const { toppings: allToppings, loading: toppingsLoading } = useToppings();
  const { toppingCategories, loading: toppingCategoriesLoading } = useToppingCategories();
  const { categories, loading: categoriesLoading } = useCategories();
  const { menuItems, loading: menuItemsLoading } = useMenuItems();
  const { subCategories, loading: subCategoriesLoading } = useSubCategories();
  const { menuItemSizes, loading: menuItemSizesLoading } = useMenuItemSizes();
  const { toppingSizePrices, loading: toppingSizePricesLoading } = useToppingSizePrices();
  const { settings, loading: settingsLoading } = useSettings();
  const { addItem, items: cartItems, removeItem } = useCart();
  const navigate = useNavigate();
  
  // Check if we're editing an existing cart item
  const editItemId = searchParams.get("edit");
  const editingItem = cartItems.find(item => item.id === editItemId) || null;

  // Option B: Do not auto-open delivery modal on this page; let header control it

  // Load menu item from URL params
  useEffect(() => {
    const itemId = searchParams.get("item");
    
    if (!itemId) {
      // Reset when navigating away
      setMenuItemId(null);
      setCurrentMenuItem(null);
      setSubCategoryId(null);
      setSelectionsInitialized(false);
      return;
    }
    
    if (menuItemsLoading || !menuItems.length) return;
    
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;
    
    // Set menu item data
    setMenuItemId(itemId);
    setCurrentMenuItem(menuItem);
    setSubCategoryId(menuItem.subCategoryId || null);
    setSelectionsInitialized(false); // Will trigger building selections
  }, [searchParams, menuItems, menuItemsLoading]);

  const getSizePrice = useCallback((menuItemId: string, categorySizeId: string) => {
    const priceRecord = menuItemSizes.find((size) => {
      const recordMenuItemId = String(size.menu_item_id ?? size.menuItemId ?? "");
      const recordSizeId = String(size.category_size_id ?? size.categorySizeId ?? size.sizeId ?? "");
      return (
        recordMenuItemId === String(menuItemId) &&
        recordSizeId === String(categorySizeId)
      );
    });
    return priceRecord?.price ?? 0;
  }, [menuItemSizes]);

  const buildInitialSelections = useCallback((template: any, menuItem: any, sizeParam: string | null, editItem: CartItem | null = null) => {
    const initialSelections: Record<string, any> = {};
    const panels = customizerPanels.filter((p) => p.customizerTemplateId === template.id && p.isActive);
    
    // If editing, restore selections from cart item
    if (editItem && editItem.selections && editItem.selections.length > 0) {
      // Build a map of panel titles to their selections
      const selectionsByPanel: Record<string, any> = {};
      editItem.selections.forEach((sel: any) => {
        if (sel.panelTitle) {
          selectionsByPanel[sel.panelTitle] = sel;
        }
      });
      
      // Restore each panel's selection
      panels.forEach((panel) => {
        // For size panels, check the cart item's size field
        if (panel.panelType === 'size' && editItem.size) {
          const panelItems = customizerPanelItems.filter((item) => item.customizerPanelId === panel.id && item.isActive);
          const matchingItem = panelItems.find(item => {
            const itemName = item.itemType === "custom" ? item.customName : 
                           item.itemType === "size" ? catSizes.find(s => s.id === item.itemId)?.sizeName :
                           item.name;
            return itemName === editItem.size;
          });
          
          if (matchingItem) {
            // Get price from size-based pricing or custom price
            const price = matchingItem.itemType === "custom" 
              ? matchingItem.customPrice || 0 
              : getSizePrice(menuItem.id, matchingItem.itemId);
            
            initialSelections[panel.id] = {
              itemId: matchingItem.id,
              name: editItem.size,
              price: price,
            };
          }
        } else {
          // For other panels, check selections array
          const savedSelection = selectionsByPanel[panel.title];
          if (savedSelection) {
            // Find the panel item that matches this selection
            const panelItems = customizerPanelItems.filter((item) => item.customizerPanelId === panel.id && item.isActive);
            const matchingItem = panelItems.find(item => {
              const itemName = item.itemType === "custom" ? item.customName : 
                             item.itemType === "size" ? catSizes.find(s => s.id === item.itemId)?.sizeName :
                             item.name;
              return itemName === savedSelection.itemName;
            });
            
            if (matchingItem) {
              initialSelections[panel.id] = {
                itemId: matchingItem.id,
                name: savedSelection.itemName,
                price: savedSelection.price || 0,
              };
            }
          }
        }
      });
      
      // Restore toppings
      if (editItem.toppings && editItem.toppings.length > 0) {
        initialSelections.toppings = editItem.toppings;
      }
      
      setCustomizerSelections(initialSelections);
      return;
    }
    
    panels.forEach((panel) => {
      const panelItems = customizerPanelItems.filter((item) => item.customizerPanelId === panel.id && item.isActive);
      
      if (panel.panelType === "size") {
        let sizeItem = null;
        
        // Try to find size matching URL parameter first
        if (sizeParam) {
          sizeItem = panelItems.find((item) => {
            if (item.itemType === "custom") {
              return item.customName?.includes(sizeParam);
            } else if (item.itemType === "size") {
              const size = catSizes.find((s) => s.id === item.itemId);
              return size?.sizeName?.includes(sizeParam);
            }
            return false;
          });
        }
        
        // If no match or no sizeParam, use first item as default
        if (!sizeItem && panelItems.length > 0) {
          sizeItem = panelItems[0];
        }
        
        if (sizeItem) {
          const sizeName = sizeItem.itemType === "custom" 
            ? sizeItem.customName 
            : catSizes.find((s) => s.id === sizeItem.itemId)?.sizeName || "";
          
          // Get price from size-based pricing or custom price
          const price = sizeItem.itemType === "custom" 
            ? sizeItem.customPrice || 0 
            : getSizePrice(menuItem.id, sizeItem.itemId);
          
          initialSelections[panel.id] = {
            itemId: sizeItem.id,
            name: sizeName,
            price: price,
          };
        }
      } else if (panel.panelType === "list" || panel.panelType === "custom_list") {
        // Check if there's a default selection for this panel
        const defaultListSelections = (menuItem as any)?.defaultListSelections || {};
        const defaultItemId = defaultListSelections[panel.id];
        
        
        let selectedItem = panelItems[0]; // fallback to first item
        
        if (defaultItemId) {
          const defaultItem = panelItems.find(item => item.id === defaultItemId);
          if (defaultItem) {
            selectedItem = defaultItem;
          }
        }
        
        const itemName = selectedItem.itemType === "custom" 
          ? selectedItem.customName 
          : selectedItem.name || "";
        const price = selectedItem.itemType === "custom" ? selectedItem.customPrice || 0 : 0;
        
        
        initialSelections[panel.id] = {
          itemId: selectedItem.id,
          name: itemName,
          price: price,
        };
      } else if (panel.panelType === "topping" && menuItem?.defaultToppings) {
        // Pre-select default toppings - default toppings are free
        // Support both old array format and new object format with amounts
        const defaultToppingsData = menuItem.defaultToppings;
        let toppingEntries: Array<{ toppingId: string; amount: "normal" | "extra" }> = [];
        
        if (Array.isArray(defaultToppingsData)) {
          // Old format: array of topping IDs (assume "normal" amount)
          toppingEntries = defaultToppingsData.map((toppingId: string) => ({
            toppingId,
            amount: "normal" as const
          }));
        } else if (typeof defaultToppingsData === 'object') {
          // New format: object with amount info
          toppingEntries = Object.keys(defaultToppingsData).map(toppingId => ({
            toppingId,
            amount: (defaultToppingsData as any)[toppingId]?.amount || "normal"
          }));
        }
        
        const defaultToppings = toppingEntries.map(({ toppingId, amount }) => {
          const topping = allToppings.find((t) => t.id === toppingId);
          if (topping) {
            return {
              id: topping.id,
              name: topping.name,
              price: 0, // Default toppings are free
              category: topping.category || "",
              menuItemCategory: topping.menuItemCategory || "",
              displayOrder: topping.displayOrder || 0,
              placement: "whole" as const,
              amount: amount, // Use the amount from menu item definition
            };
          }
          return null;
        }).filter(Boolean);
        
        initialSelections.toppings = defaultToppings;
      }
    });
    
    setCustomizerSelections(initialSelections);
  }, [customizerPanels, customizerPanelItems, catSizes, allToppings, getSizePrice]);

  // Helper function to get template for menu item
  // Returns the item's assigned template (required for items with customizers)
  const getTemplateForMenuItem = useCallback((menuItem: any) => {
    if (!menuItem) return null;
    
    // Item must have a template assigned if customizer exists
    if (menuItem.customizerTemplateId) {
      return customizerTemplates.find(
        (t) => t.id === menuItem.customizerTemplateId && t.isActive
      );
    }
    
    return null;
  }, [customizerTemplates]);

  // Build initial selections when menu item and data are ready
  useEffect(() => {
    if (!currentMenuItem || !menuItemId) return;
    if (selectionsInitialized) return;
    if (templatesLoading || panelsLoading || itemsLoading || sizesLoading || menuItemSizesLoading) return;
    if (customizerTemplates.length === 0 || customizerPanels.length === 0) return;
    if (customizerPanelItems.length === 0) return;
    
    const sizeParam = searchParams.get("size");
    
    const template = getTemplateForMenuItem(currentMenuItem);
    
    if (template) {
      buildInitialSelections(template, currentMenuItem, sizeParam, editingItem);
      setSelectionsInitialized(true);
    }
  }, [currentMenuItem, menuItemId, selectionsInitialized, templatesLoading, panelsLoading, itemsLoading, sizesLoading, menuItemSizesLoading, buildInitialSelections, editingItem, getTemplateForMenuItem]);

  // Legacy handlers kept for backward compatibility
  const handleToppingChange = (topping: Topping, placement: string | null, amount?: "normal" | "extra") => {
    setPizzaOrder((prev) => {
      const existingToppings = prev.toppings.filter((t) => t.id !== topping.id);

      if (placement === null) {
        return { ...prev, toppings: existingToppings };
      }

      const newTopping: PizzaTopping = {
        ...topping,
        placement: placement as "left" | "right" | "whole",
        amount: amount || "normal",
      };

      return { ...prev, toppings: [...existingToppings, newTopping] };
    });
  };

  const calculateTotal = () => {
    const toppingsTotal = pizzaOrder.toppings.reduce(
      (sum, topping) => {
        const basePrice = topping.price || 0;
        const multiplier = topping.amount === "extra" ? 1.5 : 1;
        return sum + (basePrice * multiplier);
      },
      0,
    );
    return pizzaOrder.basePrice + toppingsTotal;
  };

  const handleAddToCart = () => {
    if (!currentMenuItem) return;

    if (useDynamicCustomizer) {
      // Base price from non-topping selections
      const baseTotal = Object.entries(customizerSelections).reduce((sum, [key, sel]: any) => {
        if (key === 'toppings') return sum;
        if (sel && typeof sel === 'object' && sel.price) return sum + (sel.price || 0);
        return sum;
      }, 0);

      // Determine selected size name and size id for display and size-based topping prices
      const sizePanel = templatePanels.find(p => p.panelType === 'size');
      const sizeSelection = sizePanel ? customizerSelections[sizePanel.id] : null;
      const sizeName: string | undefined = sizeSelection?.name;
      let categorySizeId: string | null = null;
      if (sizeSelection?.itemId) {
        const sizeItem = customizerPanelItems.find(i => i.id === sizeSelection.itemId);
        if (sizeItem?.itemType === 'size') categorySizeId = sizeItem.itemId;
      }

      // Helper to extract default topping info (supports both array and object formats)
      const getDefaultToppingsInfo = (defaultToppingsData: any) => {
        const ids: string[] = [];
        const amountsMap: Record<string, "normal" | "extra"> = {};
        
        if (Array.isArray(defaultToppingsData)) {
          defaultToppingsData.forEach((id: string) => {
            ids.push(id);
            amountsMap[id] = "normal";
          });
        } else if (typeof defaultToppingsData === 'object' && defaultToppingsData !== null) {
          Object.keys(defaultToppingsData).forEach(id => {
            ids.push(id);
            amountsMap[id] = defaultToppingsData[id]?.amount || "normal";
          });
        }
        
        return { ids, amountsMap };
      };
      
      const { ids: defaultToppingIds, amountsMap: defaultAmounts } = getDefaultToppingsInfo(currentMenuItem?.defaultToppings);
      const swappableDefaultItems = settings?.swappableDefaultItems ?? true;
      const halfPriceToppings = settings?.halfPriceToppings ?? true;

      const selectedToppings: any[] = Array.isArray(customizerSelections.toppings)
        ? customizerSelections.toppings
        : [];

      // Count default toppings: each default topping (regardless of amount) = 1 free credit
      let freeRemaining = swappableDefaultItems ? defaultToppingIds.length : 0;
      const defaultsSelected = selectedToppings.filter((t: any) => defaultToppingIds.includes(t.id));
      const nonDefaultsSelected = selectedToppings.filter((t: any) => !defaultToppingIds.includes(t.id));
      const chargeUnitsMap: Record<string, number> = {};

      const allocGroup = (group: any[]) => {
        group.forEach((t: any) => {
          const qty = t.amount === 'extra' ? 2 : 1;
          if (swappableDefaultItems) {
            if (freeRemaining > 0) {
              const usedFree = Math.min(freeRemaining, qty);
              freeRemaining -= usedFree;
              chargeUnitsMap[t.id] = qty - usedFree;
            } else {
              chargeUnitsMap[t.id] = qty;
            }
          } else {
            const isDefault = defaultToppingIds.includes(t.id);
            chargeUnitsMap[t.id] = isDefault ? (t.amount === 'extra' ? 1 : 0) : (t.amount === 'extra' ? 2 : 1);
          }
        });
      };
      if (swappableDefaultItems) {
        allocGroup(defaultsSelected);
        allocGroup(nonDefaultsSelected);
      } else {
        allocGroup(selectedToppings);
      }

      const toppingsForCart = selectedToppings.map((t: any) => {
        // Base price with size override
        let basePrice = t.price || 0;
        if (categorySizeId && toppingSizePrices.length > 0) {
          const sizePrice = toppingSizePrices.find(sp => String(sp.toppingId) === String(t.id) && String(sp.categorySizeId) === String(categorySizeId));
          if (sizePrice) basePrice = sizePrice.price;
        }
        let priceMultiplier = 1;
        if (halfPriceToppings && (t.placement === 'left' || t.placement === 'right')) priceMultiplier = 0.5;
        const units = chargeUnitsMap[t.id] ?? 0;
        const displayPrice = units * basePrice * priceMultiplier;
        return {
          id: t.id,
          name: t.name,
          placement: t.placement,
          amount: t.amount,
          price: displayPrice,
        };
      });

      // Dynamically collect ALL panel selections (not just crust/sauce)
      const selections: Array<{panelTitle: string; itemName: string; price?: number}> = [];
      
      templatePanels.forEach(panel => {
        if (panel.panelType === 'list' || panel.panelType === 'custom_list') {
          const selection = customizerSelections[panel.id];
          if (selection && selection.name) {
            selections.push({
              panelTitle: panel.title || 'Selection',
              itemName: selection.name,
              price: selection.price || 0
            });
          }
        }
      });

      const orderItemToAdd = {
        menuItemId: String(currentMenuItem.id),
        name: currentMenuItem.name,
        price: baseTotal,
        quantity: 1,
        size: sizeName,
        toppings: toppingsForCart,
        selections: selections,
      };

      
      addItem(orderItemToAdd);
    } else {
      // Legacy path
      const baseTotal = pizzaOrder.basePrice || 0;
      const toppingsForCart = pizzaOrder.toppings.map((t) => {
        const multiplier = t.amount === 'extra' ? 1.5 : 1;
        return {
          id: t.id,
          name: t.name,
          placement: t.placement,
          amount: t.amount,
          price: (t.price || 0) * multiplier,
        };
      });
      addItem({
        menuItemId: String(currentMenuItem?.id || ''),
        name: currentMenuItem?.name || 'Custom Item',
        price: baseTotal,
        quantity: 1,
        size: pizzaOrder.size || undefined,
        crust: pizzaOrder.crust || undefined,
        toppings: toppingsForCart,
      });
    }
    
    // If we're editing an existing item, remove the old one first
    if (editingItem) {
      removeItem(editingItem.id);
      alert('Item updated successfully!');
    } else {
      alert('Item added to cart successfully!');
    }
    
    // Navigate back to cart after editing, or stay for new items
    if (editingItem) {
      navigate('/cart');
    }
  };

  // Determine if we should use the dynamic customizer
  const customizerTemplate = currentMenuItem
    ? getTemplateForMenuItem(currentMenuItem)
    : null;
  const useDynamicCustomizer = !!customizerTemplate;

  // Get panels and items for the current template
  const templatePanels = customizerPanels.filter(
    (p) => p.customizerTemplateId === customizerTemplate?.id && p.isActive
  );

  const isLoading =
    templatesLoading ||
    panelsLoading ||
    itemsLoading ||
    conditionalsLoading ||
    sizesLoading ||
    toppingsLoading ||
    menuItemsLoading ||
    categoriesLoading ||
    toppingCategoriesLoading ||
    subCategoriesLoading ||
    menuItemSizesLoading ||
    toppingSizePricesLoading ||
    settingsLoading;

  const calculateCustomizerTotal = () => {
    let total = 0;
    
    // Add up prices from all panel selections (size, crust, sauce, etc.)
    Object.values(customizerSelections).forEach((selection: any) => {
      if (selection && typeof selection === 'object') {
        if (selection.price) {
          total += selection.price;
        }
      }
    });

    // Calculate topping prices with new logic
    if (customizerSelections.toppings && Array.isArray(customizerSelections.toppings)) {
      const selectedToppings = customizerSelections.toppings;
      
      // Helper to extract default topping info (supports both array and object formats)
      const getDefaultToppingsInfo = (defaultToppingsData: any) => {
        const ids: string[] = [];
        const amountsMap: Record<string, "normal" | "extra"> = {};
        
        if (Array.isArray(defaultToppingsData)) {
          defaultToppingsData.forEach((id: string) => {
            ids.push(id);
            amountsMap[id] = "normal";
          });
        } else if (typeof defaultToppingsData === 'object' && defaultToppingsData !== null) {
          Object.keys(defaultToppingsData).forEach(id => {
            ids.push(id);
            amountsMap[id] = defaultToppingsData[id]?.amount || "normal";
          });
        }
        
        return { ids, amountsMap };
      };
      
      const { ids: defaultToppingIds } = getDefaultToppingsInfo(currentMenuItem?.defaultToppings);
      const swappableDefaultItems = settings?.swappableDefaultItems ?? true;
      const halfPriceToppings = settings?.halfPriceToppings ?? true;
      
      // Get the selected size to determine topping prices
      const sizePanel = templatePanels.find(p => p.panelType === 'size');
      const selectedSizeId = sizePanel ? customizerSelections[sizePanel.id]?.itemId : null;
      
      let categorySizeId = null;
      if (selectedSizeId) {
        const selectedSizeItem = customizerPanelItems.find(item => item.id === selectedSizeId);
        if (selectedSizeItem?.itemType === 'size') {
          categorySizeId = selectedSizeItem.itemId;
        }
      }

      // Swappable logic: allocate free units to default toppings first, then non-defaults
      let freeRemaining = swappableDefaultItems ? defaultToppingIds.length : 0;
      const defaultsSelected = selectedToppings.filter((t: any) => defaultToppingIds.includes(t.id));
      const nonDefaultsSelected = selectedToppings.filter((t: any) => !defaultToppingIds.includes(t.id));

      const processGroup = (group: any[]) => {
        group.forEach((topping: any) => {
          // Determine base price (size-based override if available)
          let basePrice = topping.price || 0;
          if (categorySizeId && toppingSizePrices.length > 0) {
            const sizePrice = toppingSizePrices.find(
              tsp => tsp.toppingId === topping.id && tsp.categorySizeId === categorySizeId
            );
            if (sizePrice) basePrice = sizePrice.price;
          }

          // Placement multiplier (half price for half-side if enabled)
          let priceMultiplier = 1;
          if (halfPriceToppings && (topping.placement === 'left' || topping.placement === 'right')) {
            priceMultiplier = 0.5;
          }

          // Each topping is 1 unit; "extra" means 2 units
          const quantity = topping.amount === 'extra' ? 2 : 1;

          let chargeableUnits = 0;
          if (swappableDefaultItems) {
            // Consume available free units first
            if (freeRemaining > 0) {
              const usedFree = Math.min(freeRemaining, quantity);
              freeRemaining -= usedFree;
              chargeableUnits = quantity - usedFree;
            } else {
              chargeableUnits = quantity;
            }
          } else {
            // Non-swappable: default normal is free (0 units), default extra charges 1 unit;
            // non-default normal charges 1 unit; non-default extra charges 2 units
            const isDefault = defaultToppingIds.includes(topping.id);
            if (isDefault) {
              chargeableUnits = topping.amount === 'extra' ? 1 : 0;
            } else {
              chargeableUnits = topping.amount === 'extra' ? 2 : 1;
            }
          }

          if (chargeableUnits > 0) {
            total += chargeableUnits * basePrice * priceMultiplier;
          }
        });
      };

      if (swappableDefaultItems) {
        processGroup(defaultsSelected);
        processGroup(nonDefaultsSelected);
      } else {
        processGroup(selectedToppings);
      }
    }

    return total;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto" style={{ borderColor: 'var(--primary)' }}></div>
          <p className="mt-4" style={{ color: 'var(--muted-foreground)' }}>Loading customizer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <HeaderWithDelivery
        breadcrumbs={[
          { label: "Menu", href: "/menu" },
          { label: currentMenuItem?.name || "Customize Order" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customizer or Legacy Pizza Builder */}
          <div className="lg:col-span-2 space-y-6">
            {useDynamicCustomizer ? (
              <>
                {/* Item Being Customized */}
                {currentMenuItem && (
                  <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{currentMenuItem.name}</h2>
                          {currentMenuItem.description && (
                            <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>{currentMenuItem.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <CustomizerView
                  template={customizerTemplate}
                  panels={templatePanels}
                  panelItems={customizerPanelItems}
                  conditionals={customizerPanelItemConditionals}
                  categorySizes={catSizes}
                  toppings={allToppings}
                  toppingCategories={toppingCategories}
                  subCategories={subCategories}
                  menuItemSizes={menuItemSizes}
                  toppingSizePrices={toppingSizePrices}
                  currentMenuItemId={menuItemId}
                  availableToppings={currentMenuItem?.availableToppings}
                  onSelectionChange={setCustomizerSelections}
                  initialSelections={customizerSelections}
                />
              </>
            ) : (
              <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Customizer Coming Soon!</CardTitle>
                  <CardDescription className="text-lg mt-4">
                    We're working on building a customizer for this item. Please check back soon!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    In the meantime, you can browse our other menu items or contact us to place a custom order.
                  </p>
                  <div className="mt-6">
                    <Link to="/menu">
                      <Button variant="default">
                        Back to Menu
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-32" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--card-foreground)' }}>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Dynamic Customizer Summary */}
                {useDynamicCustomizer ? (
                  <>
                    {/* Menu Item Name */}
                    {currentMenuItem && (
                      <h3 className="font-semibold text-md mb-1" style={{ color: 'var(--foreground)' }}>
                        {currentMenuItem.name}
                      </h3>
                    )}
                    
                    <div className="space-y-0 mb-4">
                    {Object.entries(customizerSelections).map(([panelId, selection]: [string, any]) => {
                      if (panelId === 'toppings') return null; // Handle toppings separately
                      if (!selection || typeof selection !== 'object') return null;
                      
                      // Find the panel to get its title
                      const panel = templatePanels.find(p => p.id === panelId);
                      const panelTitle = panel?.title || '';
                      
                      return (
                        <div key={panelId} className="flex justify-between text-sm">
                          <span style={{ color: 'var(--muted-foreground)' }}>
                            {panelTitle ? `${panelTitle}: ${selection.name}` : selection.name}
                          </span>
                          {selection.price > 0 && (
                            <span style={{ color: 'var(--foreground)' }}>${selection.price.toFixed(2)}</span>
                          )}
                        </div>
                      );
                    })}

                    {/* Toppings */}
                    {customizerSelections.toppings && Array.isArray(customizerSelections.toppings) && customizerSelections.toppings.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Toppings:</p>
                        <div className="space-y-0">
                        {(() => {
                          const selectedToppings = customizerSelections.toppings;
                          
                          // Helper to extract default topping info (supports both array and object formats)
                          const getDefaultToppingsInfo = (defaultToppingsData: any) => {
                            const ids: string[] = [];
                            if (Array.isArray(defaultToppingsData)) {
                              ids.push(...defaultToppingsData);
                            } else if (typeof defaultToppingsData === 'object' && defaultToppingsData !== null) {
                              ids.push(...Object.keys(defaultToppingsData));
                            }
                            return ids;
                          };
                          
                          const defaultToppingIds = getDefaultToppingsInfo(currentMenuItem?.defaultToppings);
                          const swappableDefaultItems = settings?.swappableDefaultItems ?? true;
                          const halfPriceToppings = settings?.halfPriceToppings ?? true;
                          
                          // Get the selected size
                          const sizePanel = templatePanels.find(p => p.panelType === 'size');
                          const selectedSizeId = sizePanel ? customizerSelections[sizePanel.id]?.itemId : null;
                          
                          let categorySizeId = null;
                          if (selectedSizeId) {
                            const selectedSizeItem = customizerPanelItems.find(item => item.id === selectedSizeId);
                            if (selectedSizeItem?.itemType === 'size') {
                              categorySizeId = selectedSizeItem.itemId;
                            }
                          }
                          
                          // Compute chargeable units per topping with default-first allocation
                          let freeRemaining = swappableDefaultItems ? defaultToppingIds.length : 0;
                          const defaultsSelected = selectedToppings.filter((t: any) => defaultToppingIds.includes(t.id));
                          const nonDefaultsSelected = selectedToppings.filter((t: any) => !defaultToppingIds.includes(t.id));
                          const chargeUnitsMap: Record<string, number> = {};

                          const allocGroup = (group: any[]) => {
                            group.forEach((topping: any) => {
                              const quantity = topping.amount === 'extra' ? 2 : 1;
                              if (swappableDefaultItems) {
                                if (freeRemaining > 0) {
                                  const usedFree = Math.min(freeRemaining, quantity);
                                  freeRemaining -= usedFree;
                                  chargeUnitsMap[topping.id] = quantity - usedFree;
                                } else {
                                  chargeUnitsMap[topping.id] = quantity;
                                }
                              } else {
                                const isDefault = defaultToppingIds.includes(topping.id);
                                chargeUnitsMap[topping.id] = isDefault
                                  ? (topping.amount === 'extra' ? 1 : 0)
                                  : (topping.amount === 'extra' ? 2 : 1);
                              }
                            });
                          };

                          if (swappableDefaultItems) {
                            allocGroup(defaultsSelected);
                            allocGroup(nonDefaultsSelected);
                          } else {
                            allocGroup(selectedToppings);
                          }

                          return selectedToppings.map((topping: any, index: number) => {
                            // Get the correct price for this topping
                            let basePrice = topping.price || 0;
                            
                            if (categorySizeId && toppingSizePrices.length > 0) {
                              const sizePrice = toppingSizePrices.find(
                                tsp => tsp.toppingId === topping.id && tsp.categorySizeId === categorySizeId
                              );
                              if (sizePrice) {
                                basePrice = sizePrice.price;
                              }
                            }
                            
                            // Determine chargeable units and display price (mirrors total logic)
                            let priceMultiplier = 1;
                            if (halfPriceToppings && (topping.placement === 'left' || topping.placement === 'right')) {
                              priceMultiplier = 0.5;
                            }
                            const chargeableUnits = chargeUnitsMap[topping.id] ?? 0;
                            const displayPrice = chargeableUnits * basePrice * priceMultiplier;
                            
                            return (
                              <div key={index} className="flex justify-between text-sm">
                                <span style={{ color: 'var(--muted-foreground)' }}>
                                  {topping.name} ({topping.placement}) - {topping.amount === "extra" ? "Extra" : "Normal"}
                                </span>
                                <span style={{ color: 'var(--foreground)' }}>
                                  {displayPrice > 0 ? `+$${displayPrice.toFixed(2)}` : 'Free'}
                                </span>
                              </div>
                            );
                          });
                        })()}
                        </div>
                      </div>
                    )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Legacy Pizza Visualization */}
                    {pizzaOrder.size && (
                  <div className="flex justify-center mb-4">
                    <div className="relative w-24 h-24 bg-yellow-200 rounded-full border-4 border-yellow-300 shadow-lg">
                      {/* Show selected toppings visually */}
                      {pizzaOrder.toppings.map((topping, index) => {
                        if (
                          topping.category === "meat" &&
                          topping.name.toLowerCase().includes("pepperoni")
                        ) {
                          return (
                            <div key={index}>
                              {topping.placement === "left" && (
                                <div className="absolute top-4 left-3 w-3 h-3 bg-red-700 rounded-full"></div>
                              )}
                              {topping.placement === "right" && (
                                <div className="absolute top-4 right-3 w-3 h-3 bg-red-700 rounded-full"></div>
                              )}
                              {topping.placement === "whole" && (
                                <>
                                  <div className="absolute top-4 left-3 w-3 h-3 bg-red-700 rounded-full"></div>
                                  <div className="absolute top-4 right-3 w-3 h-3 bg-red-700 rounded-full"></div>
                                  <div className="absolute bottom-4 left-6 w-3 h-3 bg-red-700 rounded-full"></div>
                                </>
                              )}
                            </div>
                          );
                        }
                        if (
                          topping.category === "veggie" &&
                          topping.name.toLowerCase().includes("mushroom")
                        ) {
                          return (
                            <div key={index}>
                              {topping.placement === "left" && (
                                <div className="absolute top-6 left-4 w-2 h-2 bg-amber-600 rounded-t-full"></div>
                              )}
                              {topping.placement === "right" && (
                                <div className="absolute top-6 right-4 w-2 h-2 bg-amber-600 rounded-t-full"></div>
                              )}
                              {topping.placement === "whole" && (
                                <>
                                  <div className="absolute top-6 left-4 w-2 h-2 bg-amber-600 rounded-t-full"></div>
                                  <div className="absolute bottom-6 right-4 w-2 h-2 bg-amber-600 rounded-t-full"></div>
                                </>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })}
                      {/* Crust indicator */}
                      <div
                        className={`absolute inset-0 rounded-full ${
                          pizzaOrder.crust === "thin"
                            ? "border-2 border-amber-400"
                            : pizzaOrder.crust === "thick"
                              ? "border-8 border-amber-600"
                              : "border-4 border-amber-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Toppings (Legacy - for backward compatibility) */}
                {pizzaOrder.toppings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Toppings:</h4>
                    {pizzaOrder.toppings.map((topping, index) => {
                      const basePrice = topping.price || 0;
                      const multiplier = topping.amount === "extra" ? 1.5 : 1;
                      const toppingPrice = basePrice * multiplier;
                      
                      return (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {topping.name} ({topping.placement}) - {topping.amount === "extra" ? "Extra" : "Normal"}
                          </span>
                          <span>
                            {toppingPrice > 0 && `+$${toppingPrice.toFixed(2)}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                    {/* Debug Info */}
                    <div className="text-xs text-gray-400 border-t pt-2">
                      <p>Debug: {pizzaOrder.toppings.length} toppings selected</p>
                      {pizzaOrder.toppings.map((t, i) => (
                        <p key={i}>
                          {t.name}: {t.placement} - {t.amount || "normal"}
                        </p>
                      ))}
                    </div>
                  </>
                )}
                
                {/* Total */}
                <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex justify-between font-bold text-lg">
                    <span style={{ color: 'var(--foreground)' }}>Total:</span>
                    <span style={{ color: 'var(--primary)' }}>
                      ${useDynamicCustomizer ? calculateCustomizerTotal().toFixed(2) : calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full mt-4"
                  disabled={
                    useDynamicCustomizer 
                      ? (() => {
                          // Check if required panels have selections
                          const requiredPanels = templatePanels.filter(p => p.panelType !== 'topping');
                          const hasRequiredSelections = requiredPanels.every(panel => 
                            customizerSelections[panel.id] && customizerSelections[panel.id].itemId
                          );
                          return !hasRequiredSelections;
                        })()
                      : !pizzaOrder.size || !pizzaOrder.crust || !pizzaOrder.sauce
                  }
                  onClick={handleAddToCart}
                >
                  {editingItem ? 'Update Cart' : 'Add to Cart'}
                </Button>

                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link to="/menu">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
