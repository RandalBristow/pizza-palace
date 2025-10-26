import { useState } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Topping {
  id: string;
  name: string;
  price?: number;
  category: string;
  menuItemCategory: string;
  displayOrder: number;
  isActive?: boolean;
}

interface ToppingCategory {
  id: string;
  name: string;
  menuItemCategory: string;
  order: number;
}

interface PizzaTopping extends Topping {
  placement: "left" | "right" | "whole";
  amount?: "normal" | "extra";
}

interface ToppingSelectorProps {
  toppings: Topping[];
  toppingCategories: ToppingCategory[];
  menuCategoryId: string;
  availableToppings?: string[];
  selectedToppings?: PizzaTopping[];
  onToppingChange?: (topping: Topping, placement: string | null, amount?: "normal" | "extra") => void;
  readonly?: boolean;
  title?: string;
  description?: string;
  showPlacementControls?: boolean;
}

const ToppingRow = ({
  topping,
  selectedToppings,
  onToppingChange,
  readonly = false,
  showPlacementControls = true,
}: {
  topping: Topping;
  selectedToppings: PizzaTopping[];
  onToppingChange?: (topping: Topping, placement: string | null, amount?: "normal" | "extra") => void;
  readonly?: boolean;
  showPlacementControls?: boolean;
}) => {
  const selectedTopping = selectedToppings.find((t) => t.id === topping.id);
  const currentAmount = selectedTopping?.amount || "normal";

  const handlePlacementClick = (placement: "left" | "right" | "whole") => {
    if (readonly || !onToppingChange) return;
    onToppingChange(topping, placement, currentAmount);
  };

  const handleAmountChange = (amount: "normal" | "extra") => {
    if (readonly || !onToppingChange) return;
    const placement = selectedTopping?.placement || "whole";
    onToppingChange(topping, placement, amount);
  };

  const handleQuickNormalClick = () => {
    if (readonly || !onToppingChange) return;
    // When placement controls are hidden, selecting "Normal" adds the topping as whole/normal
    onToppingChange(topping, "whole", "normal");
  };

  const handleRemoveTopping = () => {
    if (readonly || !onToppingChange) return;
    onToppingChange(topping, null);
  };

  const getCircle = (
    placement: "left" | "right" | "whole",
    isActive: boolean,
  ) => {
    const baseClasses = `w-6 h-6 rounded-full border-2 transition-all ${
      readonly ? "cursor-default opacity-60" : "cursor-pointer hover:scale-110 hover:shadow-md"
    }`;

    const handleClick = readonly ? undefined : () => handlePlacementClick(placement);

    switch (placement) {
      case "left":
        return (
          <div
            className={`${baseClasses} relative overflow-hidden`}
            style={{
              borderColor: isActive ? 'var(--primary)' : 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
            onClick={handleClick}
          >
            <div
              className="absolute left-0 top-0 w-3 h-6 rounded-l-full transition-colors"
              style={{ backgroundColor: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}
            ></div>
          </div>
        );
      case "right":
        return (
          <div
            className={`${baseClasses} relative overflow-hidden`}
            style={{
              borderColor: isActive ? 'var(--primary)' : 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
            onClick={handleClick}
          >
            <div
              className="absolute right-0 top-0 w-3 h-6 rounded-r-full transition-colors"
              style={{ backgroundColor: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}
            ></div>
          </div>
        );
      case "whole":
        return (
          <div
            className={baseClasses}
            style={{
              borderColor: isActive ? 'var(--primary)' : 'var(--border)',
              backgroundColor: isActive ? 'var(--primary)' : 'var(--muted-foreground)'
            }}
            onClick={handleClick}
          ></div>
        );
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 hover:bg-accent transition-colors">
      <div className="flex-1">
        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          {topping.name}
          {topping.price !== undefined && topping.price > 0 && (
            <span className="ml-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              ${topping.price.toFixed(2)}
            </span>
          )}
        </span>
      </div>

      {/* Placement circles */}
      {showPlacementControls && (
        <div className="flex items-center space-x-3 mx-6">
          {getCircle("left", selectedTopping?.placement === "left")}
          {getCircle("whole", selectedTopping?.placement === "whole")}
          {getCircle("right", selectedTopping?.placement === "right")}
        </div>
      )}

      {/* Action buttons */}
      {!readonly && (
        <div className="flex items-center space-x-2">
          {showPlacementControls ? (
            // Full controls shown: visible when selected
            selectedTopping ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleAmountChange("normal")}
                  className="text-xs px-2 py-1 h-7"
                  variant={currentAmount === "normal" ? "default" : "outline" as any}
                  style={{ 
                    backgroundColor: currentAmount === "normal" ? 'var(--primary)' : 'var(--secondary)', 
                    color: currentAmount === "normal" ? 'var(--primary-foreground)' : 'var(--primary)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  Normal
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleAmountChange("extra")}
                  className="text-xs px-2 py-1 h-7"
                  variant={currentAmount === "extra" ? "default" : "outline" as any}
                  style={{ 
                    backgroundColor: currentAmount === "extra" ? 'var(--primary)' : 'var(--secondary)', 
                    color: currentAmount === "extra" ? 'var(--destructive-foreground)' : 'var(--primary)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  Extra
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleRemoveTopping}
                  className="h-7 w-7"
                  style={{ 
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : null
          ) : (
            // Minimal mode (no placement): always show a single Normal button; Remove only when selected
            <>
              <Button
                size="sm"
                onClick={handleQuickNormalClick}
                className="text-xs px-2 py-1 h-7"
                variant={selectedTopping ? undefined : "outline" as any}
                style={{ 
                  backgroundColor: selectedTopping ? 'var(--primary)' : undefined,
                  color: selectedTopping ? 'var(--primary-foreground)' : 'var(--primary)',
                  borderColor: 'var(--primary)'
                }}
              >
                Normal
              </Button>
              {selectedTopping && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleRemoveTopping}
                  className="h-7 w-7"
                  style={{ 
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </>
          )}
        </div>
      )}
      {readonly && (
        <div className="w-[140px]"></div>
      )}
    </div>
  );
};

export default function ToppingSelector({
  toppings,
  toppingCategories,
  menuCategoryId,
  availableToppings = [],
  selectedToppings = [],
  onToppingChange,
  readonly = false,
  title = "Add Toppings",
  description = "Choose toppings and specify placement (left half, right half, or whole pizza)",
  showPlacementControls = true,
}: ToppingSelectorProps) {
  // Filter toppings for this menu category (only active ones for customers)
  const filteredToppings = toppings.filter((t) => {
    if (t.menuItemCategory !== menuCategoryId || !t.isActive) return false;
    
    // If availableToppings is provided and not empty, only show toppings in that array
    if (availableToppings && availableToppings.length > 0) {
      return availableToppings.includes(t.id);
    }
    
    // Otherwise show all active toppings (backward compatibility)
    return true;
  });

  // Filter topping categories - only show if they have at least one active topping
  const filteredToppingCategories = toppingCategories
    .filter((tc) => {
      if (tc.menuItemCategory !== menuCategoryId) return false;
      // Check if this category has any active toppings
      const hasActiveToppings = filteredToppings.some(t => t.category === tc.id);
      return hasActiveToppings;
    })
    .sort((a, b) => a.order - b.order);

  const [selectedToppingCategory, setSelectedToppingCategory] = useState(
    filteredToppingCategories[0]?.id || ""
  );

  // Get toppings for the selected category
  const categoryToppings = filteredToppings
    .filter((t) => t.category === selectedToppingCategory)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (filteredToppingCategories.length === 0) {
    return (
      <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--card-foreground)' }}>{title}</CardTitle>
          <CardDescription style={{ color: 'var(--muted-foreground)' }}>
            No topping categories available for this menu category
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <CardContent className="p-0">
        <Tabs
          value={selectedToppingCategory}
          onValueChange={setSelectedToppingCategory}
          className="w-full"
        >
          <TabsList 
            className={`grid w-full h-auto p-1 ${
              filteredToppingCategories.length === 1 ? 'grid-cols-1' :
              filteredToppingCategories.length === 2 ? 'grid-cols-2' :
              filteredToppingCategories.length === 3 ? 'grid-cols-3' :
              filteredToppingCategories.length === 4 ? 'grid-cols-4' :
              filteredToppingCategories.length === 5 ? 'grid-cols-5' :
              'grid-cols-6'
            }`}
            style={{ backgroundColor: 'var(--muted)' }}
          >
            {filteredToppingCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-sm py-2"
                style={{
                  color: 'var(--foreground)',
                }}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredToppingCategories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="mt-0 border border-t-0 rounded-b-lg"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {categoryToppings.length === 0 ? (
                  <div className="py-4 px-4 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
                    No toppings available in this category
                  </div>
                ) : (
                  categoryToppings.map((topping) => (
                    <ToppingRow
                      key={topping.id}
                      topping={topping}
                      selectedToppings={selectedToppings}
                      onToppingChange={onToppingChange}
                      readonly={readonly}
                      showPlacementControls={showPlacementControls}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
