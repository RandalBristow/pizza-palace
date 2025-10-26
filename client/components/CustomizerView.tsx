 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { AlertDescription } from "./ui/alert";
import ToppingSelector from "./ToppingSelector";

interface CustomizerViewProps {
  template: any;
  panels: any[];
  panelItems: any[];
  conditionals: any[];
  categorySizes: any[];
  toppings: any[];
  toppingCategories?: any[];
  subCategories?: any[];
  menuItemSizes?: any[];
  toppingSizePrices?: any[];
  currentMenuItemId?: string | null;
  availableToppings?: string[];
  onSelectionChange: (selections: Record<string, any>) => void;
  initialSelections?: Record<string, any>;
}

interface ToppingSelection {
  id: string;
  name: string;
  price?: number;
  category: string;
  menuItemCategory: string;
  displayOrder: number;
  placement: "left" | "right" | "whole";
  amount?: "normal" | "extra";
}

export default function CustomizerView({
  template,
  panels,
  panelItems,
  conditionals,
  categorySizes,
  toppings,
  toppingCategories = [],
  subCategories = [],
  menuItemSizes = [],
  toppingSizePrices = [],
  currentMenuItemId = null,
  availableToppings = [],
  onSelectionChange,
  initialSelections = {},
}: CustomizerViewProps) {
  // Controlled component: derive selections from props and only notify parent on user actions
  const selections = initialSelections;
  const toppingSelections: ToppingSelection[] = initialSelections.toppings || [];

  const handlePanelSelection = (panelId: string, itemId: string, itemData: any) => {
    onSelectionChange({
      ...selections,
      [panelId]: { itemId, ...itemData },
      toppings: toppingSelections,
    });
  };

  const handleToppingChange = (topping: any, placement: "left" | "right" | "whole" | null, amount?: "normal" | "extra") => {
    let nextToppings = toppingSelections;
    if (placement === null) {
      nextToppings = toppingSelections.filter((t) => t.id !== topping.id);
    } else {
      const existing = toppingSelections.filter((t) => t.id !== topping.id);
      nextToppings = [
        ...existing,
        {
          id: topping.id,
          name: topping.name,
          price: topping.price || 0,
          category: topping.category || "",
          menuItemCategory: topping.menuItemCategory || "",
          displayOrder: topping.displayOrder || 0,
          placement,
          amount: amount || "normal",
        },
      ];
    }
    onSelectionChange({
      ...selections,
      toppings: nextToppings,
    });
  };

  const isPanelVisible = (panel: any, panelIndex: number) => {
    // First panel is always visible
    if (panelIndex === 0) return true;

    // Topping panels are always visible (they don't depend on previous selections)
    if (panel.panelType === "topping") return true;

    // Check if there are panel-level conditionals (conditionals without childPanelItemId)
    const panelLevelConditionals = conditionals.filter(
      (c) => c.customizerPanelId === panel.id && !c.childPanelItemId
    );
    
    if (panelLevelConditionals.length === 0) {
      // No panel-level conditionals means always visible
      return true;
    }

    // Get the previous panel selection
    const previousPanel = panels[panelIndex - 1];
    const previousSelection = selections[previousPanel?.id];

    if (!previousSelection) {
      // No selection made yet in previous panel
      return false;
    }

    // Check if any conditional allows this panel to be visible
    const hasVisibleConditional = panelLevelConditionals.some((conditional) => {
      return (
        conditional.parentPanelItemId === previousSelection.itemId &&
        conditional.isVisible
      );
    });

    return hasVisibleConditional;
  };

  const getVisiblePanelItems = (panel: any, panelIndex: number) => {
    const items = panelItems.filter((item) => item.customizerPanelId === panel.id && item.isActive);

    if (panelIndex === 0) {
      // First panel shows all items
      return items;
    }

    // Get the previous panel selection
    const previousPanel = panels[panelIndex - 1];
    const previousSelection = selections[previousPanel?.id];

    if (!previousSelection) {
      return items;
    }

    // Filter items based on conditionals
    return items.filter((item) => {
      const itemConditionals = conditionals.filter(
        (c) =>
          c.customizerPanelId === panel.id &&
          c.childPanelItemId === item.id &&
          c.parentPanelItemId === previousSelection.itemId
      );

      if (itemConditionals.length === 0) {
        // No conditionals for this item means always visible
        return true;
      }

      // Check if any conditional allows this item to be visible
      return itemConditionals.some((c) => c.isVisible);
    });
  };

  const getItemDisplayName = (item: any) => {
    if (item.itemType === "custom") {
      return item.customName;
    } else if (item.itemType === "size") {
      const size = categorySizes.find((s) => s.id === item.itemId);
      return size?.sizeName || "Unknown Size";
    } else if (item.itemType === "topping") {
      const topping = toppings.find((t) => t.id === item.itemId);
      return topping?.name || "Unknown Topping";
    }
    return "Unknown Item";
  };

  const getItemPrice = (item: any) => {
    if (item.itemType === "custom") {
      return item.customPrice || 0;
    } else if (item.itemType === "size") {
      // Find price from menuItemSizes
      if (!currentMenuItemId) {
        return 0;
      }
      
      const sizePrice = menuItemSizes.find(
        (mis) => {
          // Use snake_case field names from database
          const dbMenuItemId = mis.menu_item_id || mis.menuItemId;
          const dbSizeId = mis.category_size_id || mis.categorySizeId || mis.sizeId;
          
          const menuItemMatch = String(dbMenuItemId).trim() === String(currentMenuItemId).trim();
          const sizeIdMatch = String(dbSizeId).trim() === String(item.itemId).trim();
          return menuItemMatch && sizeIdMatch;
        }
      );
      
      return sizePrice?.price || 0;
    }
    // For topping items, price would come from the referenced data
    return 0;
  };

  const renderSizePanel = (panel: any, visibleItems: any[]) => {
    return (
      <RadioGroup
        value={selections[panel.id]?.itemId || ""}
        onValueChange={(itemId) => {
          const item = visibleItems.find((i) => i.id === itemId);
          if (item) {
            handlePanelSelection(panel.id, itemId, {
              name: getItemDisplayName(item),
              price: getItemPrice(item),
            });
          }
        }}
        className="space-y-3"
      >
        {visibleItems.map((item) => {
          const displayName = getItemDisplayName(item);
          const price = getItemPrice(item);
          const isSelected = selections[panel.id]?.itemId === item.id;
          return (
            <div
              key={item.id}
              className="flex items-center space-x-2 p-3 rounded transition-all duration-200"
              style={{
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isSelected ? 'var(--accent)' : 'var(--card)',
                boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--card)';
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              <RadioGroupItem value={item.id} id={item.id} />
              <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--foreground)', fontWeight: isSelected ? '600' : '400' }}>{displayName}</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
                  </span>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  const renderCustomListPanel = (panel: any, visibleItems: any[]) => {
    return (
      <RadioGroup
        value={selections[panel.id]?.itemId || ""}
        onValueChange={(itemId) => {
          const item = visibleItems.find((i) => i.id === itemId);
          if (item) {
            handlePanelSelection(panel.id, itemId, {
              name: getItemDisplayName(item),
              price: getItemPrice(item),
            });
          }
        }}
        className="space-y-3"
      >
        {visibleItems.map((item) => {
          const displayName = getItemDisplayName(item);
          const price = getItemPrice(item);
          const isSelected = selections[panel.id]?.itemId === item.id;
          return (
            <div
              key={item.id}
              className="flex items-center space-x-2 p-3 rounded transition-all duration-200"
              style={{
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isSelected ? 'var(--accent)' : 'var(--card)',
                boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--card)';
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              <RadioGroupItem value={item.id} id={item.id} />
              <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--foreground)', fontWeight: isSelected ? '600' : '400' }}>{displayName}</span>
                  {price > 0 && (
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>${price.toFixed(2)}</span>
                  )}
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  const renderToppingPanel = (panel: any, visibleItems: any[]) => {
    // Get menu category from template
    const subCategory = subCategories.find(s => s.id === template?.subCategoryId);
    const menuCategoryId = subCategory?.categoryId;
    
    if (!menuCategoryId) {
      return <p style={{ color: 'var(--muted-foreground)' }}>No toppings available</p>;
    }

    // Get the selected size to determine topping prices
    const sizePanel = panels.find(p => p.panelType === 'size');
    const selectedSizeId = sizePanel ? selections[sizePanel.id]?.itemId : null;
    
    // Find the category_size_id from the selected size panel item
    let categorySizeId = null;
    if (selectedSizeId) {
      const selectedSizeItem = panelItems.find(item => item.id === selectedSizeId);
      if (selectedSizeItem?.itemType === 'size') {
        categorySizeId = selectedSizeItem.itemId;
      }
    }

    // Enrich toppings with size-based prices
    const toppingsWithPrices = toppings.map(topping => {
      let price = topping.price || 0;
      
      // If we have a selected size, look up the size-specific price
      if (categorySizeId && toppingSizePrices.length > 0) {
        const sizePrice = toppingSizePrices.find(
          tsp => tsp.toppingId === topping.id && tsp.categorySizeId === categorySizeId
        );
        if (sizePrice) {
          price = sizePrice.price;
        }
      }
      
      return { ...topping, price };
    });

    return (
      <ToppingSelector
        toppings={toppingsWithPrices}
        toppingCategories={toppingCategories}
        menuCategoryId={menuCategoryId}
        availableToppings={availableToppings}
        selectedToppings={toppingSelections}
        onToppingChange={handleToppingChange}
        readonly={false}
        title=""
        description=""
        showPlacementControls={(panel as any).showPlacementControls ?? true}
      />
    );
  };

  const sortedPanels = [...panels].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {sortedPanels.map((panel, index) => {
        const isVisible = isPanelVisible(panel, index);
        if (!isVisible) return null;

        const visibleItems = getVisiblePanelItems(panel, index);

        return (
          <Card key={panel.id} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--card-foreground)' }}>
                {index + 1}. {panel.title}
              </CardTitle>
              {panel.subtitle && <CardDescription style={{ color: 'var(--muted-foreground)' }}>{panel.subtitle}</CardDescription>}
            </CardHeader>
            <CardContent>
              {panel.panelType === "size" && renderSizePanel(panel, visibleItems)}
              {panel.panelType === "custom_list" && renderCustomListPanel(panel, visibleItems)}
              {panel.panelType === "topping" && renderToppingPanel(panel, visibleItems)}


            </CardContent> 
                  
            <AlertDescription className="px-4 pb-4" style={{ color: 'var(--muted-foreground)' }}>{panel.message}</AlertDescription>

          </Card> 
        );
      })}
    </div>
  );
}
