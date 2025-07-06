import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import DeliverySelection from "../components/DeliverySelection";
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
import { Pizza, Coffee, ArrowLeft, ShoppingCart, Star } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  isGlutenFree?: boolean;
  isVegetarian?: boolean;
  sizes?: { size: string; price: number }[];
}

const mockMenuItems: MenuItem[] = [
  // Pizzas
  {
    id: "p1",
    name: "Margherita Pizza",
    description:
      "Fresh mozzarella, tomato sauce, and basil on our signature crust",
    price: 12.99,
    category: "pizza",
    rating: 4.8,
    isVegetarian: true,
    sizes: [
      { size: '10"', price: 12.99 },
      { size: '12"', price: 15.99 },
      { size: '14"', price: 18.99 },
      { size: '16"', price: 21.99 },
    ],
  },
  {
    id: "p2",
    name: "Pepperoni Classic",
    description:
      "Traditional pepperoni with mozzarella cheese and our signature sauce",
    price: 14.99,
    category: "pizza",
    rating: 4.9,
    sizes: [
      { size: '10"', price: 14.99 },
      { size: '12"', price: 17.99 },
      { size: '14"', price: 20.99 },
      { size: '16"', price: 23.99 },
    ],
  },
  {
    id: "p3",
    name: "Supreme Pizza",
    description: "Pepperoni, sausage, peppers, onions, mushrooms, and olives",
    price: 18.99,
    category: "pizza",
    rating: 4.7,
    sizes: [
      { size: '10"', price: 18.99 },
      { size: '12"', price: 21.99 },
      { size: '14"', price: 24.99 },
      { size: '16"', price: 27.99 },
    ],
  },
  {
    id: "p4",
    name: "Gluten-Free Margherita",
    description: 'Classic margherita on our gluten-free crust (10" only)',
    price: 15.99,
    category: "pizza",
    rating: 4.6,
    isGlutenFree: true,
    isVegetarian: true,
    sizes: [{ size: '10"', price: 15.99 }],
  },

  // Coffee
  {
    id: "c1",
    name: "Pronto House Blend",
    description: "Our signature roast with notes of chocolate and caramel",
    price: 2.99,
    category: "coffee",
    rating: 4.9,
  },
  {
    id: "c2",
    name: "Espresso",
    description: "Rich, bold shot of pure Italian-style espresso",
    price: 2.49,
    category: "coffee",
    rating: 4.8,
  },
  {
    id: "c3",
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam, dusted with cocoa",
    price: 4.49,
    category: "coffee",
    rating: 4.7,
  },
  {
    id: "c4",
    name: "Cafe Latte",
    description: "Smooth espresso with steamed milk and light foam",
    price: 4.99,
    category: "coffee",
    rating: 4.8,
  },

  // Calzones
  {
    id: "cal1",
    name: "Classic Calzone",
    description: "Ricotta, mozzarella, and your choice of two toppings",
    price: 11.99,
    category: "calzone",
    rating: 4.6,
  },
  {
    id: "cal2",
    name: "Meat Lovers Calzone",
    description: "Pepperoni, sausage, ham, and bacon with mozzarella",
    price: 14.99,
    category: "calzone",
    rating: 4.8,
  },

  // Wings
  {
    id: "w1",
    name: "Buffalo Wings",
    description: "Classic buffalo wings with celery and blue cheese (8 pieces)",
    price: 9.99,
    category: "wings",
    rating: 4.7,
  },
  {
    id: "w2",
    name: "BBQ Wings",
    description: "Smoky BBQ glazed wings with ranch dressing (8 pieces)",
    price: 9.99,
    category: "wings",
    rating: 4.6,
  },
  {
    id: "w3",
    name: "Garlic Parmesan Wings",
    description: "Wings tossed in garlic parmesan sauce (8 pieces)",
    price: 10.99,
    category: "wings",
    rating: 4.8,
  },
  {
    id: "w4",
    name: "Honey Hot Wings",
    description: "Sweet and spicy honey hot sauce wings (8 pieces)",
    price: 10.99,
    category: "wings",
    rating: 4.5,
  },

  // Drinks
  {
    id: "d1",
    name: "Soft Drinks",
    description: "Coke, Pepsi, Sprite, Dr. Pepper (16oz)",
    price: 2.49,
    category: "drinks",
  },
  {
    id: "d2",
    name: "Bottled Water",
    description: "Pure spring water (16.9oz)",
    price: 1.99,
    category: "drinks",
  },
  {
    id: "d3",
    name: "Fresh Juice",
    description: "Orange, Apple, or Cranberry (12oz)",
    price: 3.49,
    category: "drinks",
  },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("pizza");
  const [cart, setCart] = useState<any[]>([]);
  const [showDeliverySelection, setShowDeliverySelection] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const { deliveryDetails, setDeliveryDetails, hasDeliveryDetails } =
    useOrder();

  const categories = [
    { id: "pizza", name: "Pizza", icon: Pizza },
    { id: "wings", name: "Wings", icon: Pizza },
    { id: "coffee", name: "Coffee", icon: Coffee },
    { id: "calzone", name: "Calzones", icon: Pizza },
    { id: "drinks", name: "Drinks", icon: Coffee },
  ];

  const filteredItems = mockMenuItems.filter(
    (item) => item.category === selectedCategory,
  );

  const addToCart = (item: MenuItem, size?: string) => {
    if (!hasDeliveryDetails) {
      setPendingAction(() => () => addToCart(item, size));
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

  const handleOrderStart = () => {
    if (!hasDeliveryDetails) {
      setShowDeliverySelection(true);
      return;
    }
    // Navigate to order page
    window.location.href = "/order";
  };

  const handleDeliveryConfirm = (details: any) => {
    setDeliveryDetails(details);
    setShowDeliverySelection(false);
    // Execute pending action if any
    if (pendingAction) {
      pendingAction();
      setPendingAction(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center space-x-2">
                <Pizza className="h-6 w-6 text-red-600" />
                <Coffee className="h-5 w-5 text-amber-700" />
                <span className="text-lg font-semibold">Menu</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {hasDeliveryDetails && (
                <Button
                  variant="outline"
                  onClick={() => setShowDeliverySelection(true)}
                  className="text-sm"
                >
                  {deliveryDetails?.method === "carryout"
                    ? "CARRYOUT FROM"
                    : "DELIVERY TO"}
                  <br />
                  <span className="text-xs">
                    {deliveryDetails?.method === "carryout"
                      ? "914 Ashland Rd"
                      : deliveryDetails?.address?.city || ""}
                  </span>
                </Button>
              )}
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              <Button onClick={handleOrderStart}>Start Order</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600">
            Fresh ingredients, made to order. All pizzas available on regular,
            thin, or thick crust.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center space-x-2"
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-lg h-fit"
                  >
                    {/* Pizza Image */}
                    <div
                      className="h-32 relative overflow-hidden bg-cover bg-center"
                      style={{
                        backgroundImage: (() => {
                          if (category.id === "pizza") {
                            if (
                              item.name.toLowerCase().includes("margherita")
                            ) {
                              return `url('https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg')`;
                            } else if (
                              item.name.toLowerCase().includes("pepperoni")
                            ) {
                              return `url('https://images.pexels.com/photos/2762939/pexels-photo-2762939.jpeg')`;
                            } else if (
                              item.name.toLowerCase().includes("supreme")
                            ) {
                              return `url('https://images.pexels.com/photos/5903312/pexels-photo-5903312.jpeg')`;
                            } else {
                              return `url('https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg')`;
                            }
                          } else if (category.id === "calzone") {
                            return `url('https://images.pexels.com/photos/5903094/pexels-photo-5903094.jpeg')`;
                          } else if (category.id === "coffee") {
                            return `url('https://images.pexels.com/photos/10303534/pexels-photo-10303534.jpeg')`;
                          } else if (category.id === "wings") {
                            return `url('https://images.pexels.com/photos/6369302/pexels-photo-6369302.jpeg')`;
                          } else {
                            return `url('https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg')`;
                          }
                        })(),
                      }}
                    />

                    {/* Card Content */}
                    <div className="p-3">
                      <h3 className="font-bold text-lg text-blue-600 mb-1 line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.isGlutenFree && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            GF
                          </Badge>
                        )}
                        {item.isVegetarian && (
                          <Badge
                            variant="outline"
                            className="text-xs border-green-500 text-green-700"
                          >
                            V
                          </Badge>
                        )}
                      </div>

                      {/* Description - truncated for smaller cards */}
                      <p className="text-gray-700 text-xs mb-3 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Buttons */}
                      <div className="space-y-1">
                        {category.id === "pizza" ? (
                          <>
                            <Button
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 text-sm"
                              onClick={handleOrderStart}
                            >
                              ADD TO ORDER
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-1.5 text-sm"
                              onClick={handleOrderStart}
                            >
                              CUSTOMIZE
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 text-sm"
                            onClick={() => addToCart(item)}
                          >
                            ADD - ${item.price.toFixed(2)}
                          </Button>
                        )}
                      </div>

                      {/* Size options for non-pizza items */}
                      {item.sizes && category.id !== "pizza" && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Choose Size:
                          </p>
                          {item.sizes.map((sizeOption) => (
                            <div
                              key={sizeOption.size}
                              className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                            >
                              <span className="text-sm">
                                {sizeOption.size} - $
                                {sizeOption.price.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(item, sizeOption.size)}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Delivery Selection Modal */}
        <DeliverySelection
          isOpen={showDeliverySelection}
          onClose={() => setShowDeliverySelection(false)}
          onConfirm={handleDeliveryConfirm}
          currentDetails={deliveryDetails || undefined}
        />
      </main>
    </div>
  );
}
