import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Pizza,
  Coffee,
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";

interface Topping {
  id: string;
  name: string;
  price: number;
  category: "sauce" | "cheese" | "meat" | "veggie";
}

interface PizzaTopping extends Topping {
  placement: "left" | "right" | "whole";
}

interface PizzaOrder {
  size: string;
  crust: string;
  toppings: PizzaTopping[];
  basePrice: number;
}

const pizzaSizes = [
  { size: '10"', price: 10.99, label: "10 inch - Personal" },
  { size: '12"', price: 13.99, label: "12 inch - Small" },
  { size: '14"', price: 16.99, label: "14 inch - Medium" },
  { size: '16"', price: 19.99, label: "16 inch - Large" },
  { size: '10" GF', price: 12.99, label: "10 inch - Gluten Free" },
];

const crustTypes = [
  { id: "regular", name: "Regular Crust" },
  { id: "thin", name: "Thin Crust" },
  { id: "thick", name: "Thick Crust" },
];

const toppings: Topping[] = [
  // Sauces
  { id: "s1", name: "Marinara Sauce", price: 0, category: "sauce" },
  { id: "s2", name: "White Sauce", price: 1.0, category: "sauce" },
  { id: "s3", name: "BBQ Sauce", price: 1.0, category: "sauce" },
  { id: "s4", name: "Pesto Sauce", price: 1.5, category: "sauce" },

  // Cheese
  { id: "ch1", name: "Mozzarella", price: 0, category: "cheese" },
  { id: "ch2", name: "Extra Mozzarella", price: 2.0, category: "cheese" },
  { id: "ch3", name: "Parmesan", price: 1.5, category: "cheese" },
  { id: "ch4", name: "Ricotta", price: 2.0, category: "cheese" },
  { id: "ch5", name: "Feta", price: 2.5, category: "cheese" },

  // Meat
  { id: "m1", name: "Pepperoni", price: 2.0, category: "meat" },
  { id: "m2", name: "Italian Sausage", price: 2.5, category: "meat" },
  { id: "m3", name: "Ham", price: 2.0, category: "meat" },
  { id: "m4", name: "Bacon", price: 2.5, category: "meat" },
  { id: "m5", name: "Ground Beef", price: 2.5, category: "meat" },
  { id: "m6", name: "Chicken", price: 3.0, category: "meat" },

  // Vegetables
  { id: "v1", name: "Mushrooms", price: 1.5, category: "veggie" },
  { id: "v2", name: "Bell Peppers", price: 1.5, category: "veggie" },
  { id: "v3", name: "Red Onions", price: 1.0, category: "veggie" },
  { id: "v4", name: "Black Olives", price: 1.5, category: "veggie" },
  { id: "v5", name: "Green Olives", price: 1.5, category: "veggie" },
  { id: "v6", name: "Tomatoes", price: 1.5, category: "veggie" },
  { id: "v7", name: "Spinach", price: 2.0, category: "veggie" },
  { id: "v8", name: "Jalapeños", price: 1.0, category: "veggie" },
  { id: "v9", name: "Pineapple", price: 1.5, category: "veggie" },
];

const ToppingRow = ({
  topping,
  selectedToppings,
  onToppingChange,
}: {
  topping: Topping;
  selectedToppings: PizzaTopping[];
  onToppingChange: (topping: Topping, placement: string | null) => void;
}) => {
  const selectedTopping = selectedToppings.find((t) => t.id === topping.id);

  const handlePlacementClick = (placement: "left" | "right" | "whole") => {
    console.log(`Changing placement for ${topping.name} to ${placement}`);
    onToppingChange(topping, placement);
  };

  const handleRemoveTopping = () => {
    console.log(`Removing topping ${topping.name}`);
    onToppingChange(topping, null);
  };

  const getCircle = (
    placement: "left" | "right" | "whole",
    isActive: boolean,
  ) => {
    const baseClasses =
      "w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110";
    const borderColor = isActive ? "border-red-500" : "border-gray-300";

    switch (placement) {
      case "left":
        return (
          <div
            className={`${baseClasses} ${borderColor} bg-white relative overflow-hidden`}
            onClick={() => handlePlacementClick("left")}
          >
            <div
              className={`absolute left-0 top-0 w-3 h-6 rounded-l-full ${isActive ? "bg-red-500" : "bg-gray-200"}`}
            ></div>
          </div>
        );
      case "right":
        return (
          <div
            className={`${baseClasses} ${borderColor} bg-white relative overflow-hidden`}
            onClick={() => handlePlacementClick("right")}
          >
            <div
              className={`absolute right-0 top-0 w-3 h-6 rounded-r-full ${isActive ? "bg-red-500" : "bg-gray-200"}`}
            ></div>
          </div>
        );
      case "whole":
        return (
          <div
            className={`${baseClasses} ${borderColor} ${isActive ? "bg-red-500" : "bg-gray-200"}`}
            onClick={() => handlePlacementClick("whole")}
          ></div>
        );
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-50">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">
          {topping.name}
        </span>
      </div>

      {/* Placement circles */}
      <div className="flex items-center space-x-3 mx-6">
        {getCircle("left", selectedTopping?.placement === "left")}
        {getCircle("whole", selectedTopping?.placement === "whole")}
        {getCircle("right", selectedTopping?.placement === "right")}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {selectedTopping && (
          <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
            Extra
          </Button>
        )}
        {selectedTopping ? (
          <Button
            size="sm"
            className="text-xs px-2 py-1 h-7 bg-red-500 hover:bg-red-600 text-white"
          >
            Normal
          </Button>
        ) : null}
        {selectedTopping && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemoveTopping}
            className="text-xs px-2 py-1 h-7 text-red-600 hover:text-red-700"
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default function Order() {
  const [pizzaOrder, setPizzaOrder] = useState<PizzaOrder>({
    size: "",
    crust: "",
    toppings: [],
    basePrice: 0,
  });
  const [selectedToppingCategory, setSelectedToppingCategory] =
    useState("sauce");

  const toppingCategories = [
    { id: "sauce", name: "Sauce", icon: "🍅" },
    { id: "cheese", name: "Cheese", icon: "🧀" },
    { id: "meat", name: "Meat", icon: "🥓" },
    { id: "veggie", name: "Vegetables", icon: "🥬" },
  ];

  const handleSizeChange = (size: string) => {
    const sizeInfo = pizzaSizes.find((s) => s.size === size);
    setPizzaOrder((prev) => ({
      ...prev,
      size,
      basePrice: sizeInfo?.price || 0,
    }));
  };

  const handleCrustChange = (crust: string) => {
    setPizzaOrder((prev) => ({ ...prev, crust }));
  };

  const handleToppingChange = (topping: Topping, placement: string | null) => {
    console.log(
      `handleToppingChange called: ${topping.name}, placement: ${placement}`,
    );

    setPizzaOrder((prev) => {
      const existingToppings = prev.toppings.filter((t) => t.id !== topping.id);

      if (placement === null) {
        console.log(`Removing topping ${topping.name}`);
        return { ...prev, toppings: existingToppings };
      }

      const newTopping: PizzaTopping = {
        ...topping,
        placement: placement as "left" | "right" | "whole",
      };

      console.log(`Adding/updating topping:`, newTopping);
      const newState = { ...prev, toppings: [...existingToppings, newTopping] };
      console.log(`New toppings array:`, newState.toppings);
      return newState;
    });
  };

  const calculateTotal = () => {
    const toppingsTotal = pizzaOrder.toppings.reduce(
      (sum, topping) => sum + topping.price,
      0,
    );
    return pizzaOrder.basePrice + toppingsTotal;
  };

  const filteredToppings = toppings.filter(
    (topping) => topping.category === selectedToppingCategory,
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/menu"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Menu
              </Link>
              <div className="flex items-center space-x-2">
                <Pizza className="h-6 w-6 text-red-600" />
                <span className="text-lg font-semibold">Build Your Pizza</span>
              </div>
            </div>
            <Button variant="outline" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pizza Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Size Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Choose Size</CardTitle>
                <CardDescription>
                  Select your pizza size (gluten-free available in 10" only)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={pizzaOrder.size}
                  onValueChange={handleSizeChange}
                  className="space-y-3"
                >
                  {pizzaSizes.map((size) => (
                    <div
                      key={size.size}
                      className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50"
                    >
                      <RadioGroupItem value={size.size} id={size.size} />
                      <Label
                        htmlFor={size.size}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span>{size.label}</span>
                          <span className="font-semibold">
                            ${size.price.toFixed(2)}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Crust Selection */}
            <Card>
              <CardHeader>
                <CardTitle>2. Choose Crust</CardTitle>
                <CardDescription>
                  Pick your preferred crust style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={pizzaOrder.crust}
                  onValueChange={handleCrustChange}
                  className="space-y-3"
                >
                  {crustTypes.map((crust) => (
                    <div
                      key={crust.id}
                      className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50"
                    >
                      <RadioGroupItem value={crust.id} id={crust.id} />
                      <Label
                        htmlFor={crust.id}
                        className="flex-1 cursor-pointer"
                      >
                        {crust.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Toppings Selection */}
            <Card>
              <CardHeader>
                <CardTitle>3. Add Toppings</CardTitle>
                <CardDescription>
                  Choose toppings and specify placement (left half, right half,
                  or whole pizza)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={selectedToppingCategory}
                  onValueChange={setSelectedToppingCategory}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100">
                    <TabsTrigger
                      value="meat"
                      className="text-sm py-2 data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                      Meats
                    </TabsTrigger>
                    <TabsTrigger
                      value="veggie"
                      className="text-sm py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      Veggies
                    </TabsTrigger>
                    <TabsTrigger
                      value="cheese"
                      className="text-sm py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      Cheese
                    </TabsTrigger>
                    <TabsTrigger
                      value="sauce"
                      className="text-sm py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      Sauce
                    </TabsTrigger>
                  </TabsList>

                  {toppingCategories.map((category) => (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="mt-0 bg-white border border-t-0 rounded-b-lg"
                    >
                      <div className="divide-y divide-gray-200">
                        {filteredToppings.map((topping) => (
                          <ToppingRow
                            key={topping.id}
                            topping={topping}
                            selectedToppings={pizzaOrder.toppings}
                            onToppingChange={handleToppingChange}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pizza Visualization */}
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

                {/* Pizza Base */}
                {pizzaOrder.size && (
                  <div className="flex justify-between">
                    <span>
                      {pizzaOrder.size} {pizzaOrder.crust} Pizza
                    </span>
                    <span>${pizzaOrder.basePrice.toFixed(2)}</span>
                  </div>
                )}

                {/* Toppings */}
                {pizzaOrder.toppings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Toppings:</h4>
                    {pizzaOrder.toppings.map((topping, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {topping.name} ({topping.placement})
                        </span>
                        <span>
                          {topping.price > 0 && `+$${topping.price.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Debug Info */}
                <div className="text-xs text-gray-400 border-t pt-2">
                  <p>Debug: {pizzaOrder.toppings.length} toppings selected</p>
                  {pizzaOrder.toppings.map((t, i) => (
                    <p key={i}>
                      {t.name}: {t.placement}
                    </p>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full"
                  disabled={!pizzaOrder.size || !pizzaOrder.crust}
                >
                  Add to Cart
                </Button>

                <Button variant="outline" className="w-full" asChild>
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
