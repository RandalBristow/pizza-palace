import { useState, useEffect } from "react";
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
    const cartItem = {
      ...item,
      selectedSize: size,
      cartId: `${item.id}-${size || "default"}-${Date.now()}`,
    };
    setCart((prev) => [...prev, cartItem]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              <Button asChild>
                <Link to="/order">Start Order</Link>
              </Button>
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden flex items-center justify-center">
                      {(category.id === "pizza" ||
                        category.id === "calzone") && (
                        <div className="relative">
                          {/* Pizza illustration */}
                          <div className="w-28 h-28 bg-yellow-200 rounded-full border-4 border-yellow-300 shadow-lg">
                            {/* Different toppings based on item name */}
                            {item.name.toLowerCase().includes("margherita") && (
                              <>
                                <div className="absolute top-6 left-8 w-3 h-2 bg-green-600 rounded-full transform rotate-45"></div>
                                <div className="absolute bottom-8 right-6 w-3 h-2 bg-green-600 rounded-full transform -rotate-45"></div>
                                <div className="absolute top-10 right-8 w-3 h-2 bg-green-600 rounded-full"></div>
                              </>
                            )}
                            {item.name.toLowerCase().includes("pepperoni") && (
                              <>
                                <div className="absolute top-4 left-6 w-4 h-4 bg-red-700 rounded-full"></div>
                                <div className="absolute top-8 right-4 w-4 h-4 bg-red-700 rounded-full"></div>
                                <div className="absolute bottom-6 left-8 w-4 h-4 bg-red-700 rounded-full"></div>
                                <div className="absolute bottom-4 right-8 w-4 h-4 bg-red-700 rounded-full"></div>
                                <div className="absolute top-12 left-12 w-4 h-4 bg-red-700 rounded-full"></div>
                              </>
                            )}
                            {item.name.toLowerCase().includes("supreme") && (
                              <>
                                <div className="absolute top-3 left-4 w-3 h-3 bg-red-700 rounded-full"></div>
                                <div className="absolute top-6 right-3 w-3 h-3 bg-red-700 rounded-full"></div>
                                <div className="absolute bottom-5 left-6 w-3 h-3 bg-red-700 rounded-full"></div>
                                <div className="absolute top-8 left-8 w-4 h-2 bg-amber-800 rounded-full"></div>
                                <div className="absolute top-5 right-8 w-2 h-3 bg-green-500 rounded"></div>
                                <div className="absolute bottom-6 left-10 w-2 h-3 bg-green-500 rounded"></div>
                                <div className="absolute top-10 right-6 w-3 h-2 bg-amber-600 rounded-t-full"></div>
                                <div className="absolute bottom-4 right-10 w-2 h-2 bg-gray-800 rounded-full"></div>
                              </>
                            )}
                            {!item.name.toLowerCase().includes("margherita") &&
                              !item.name.toLowerCase().includes("pepperoni") &&
                              !item.name.toLowerCase().includes("supreme") && (
                                <>
                                  <div className="absolute top-6 left-8 w-3 h-3 bg-red-600 rounded-full"></div>
                                  <div className="absolute bottom-8 right-6 w-3 h-3 bg-green-500 rounded"></div>
                                </>
                              )}
                          </div>
                        </div>
                      )}
                      {category.id === "wings" && (
                        <div className="relative">
                          {/* Wings illustration */}
                          <div className="flex space-x-2">
                            {/* Wing 1 */}
                            <div className="relative">
                              <div className="w-8 h-4 bg-orange-400 rounded-full shadow-md"></div>
                              <div className="absolute top-1 left-1 w-2 h-1 bg-red-500 rounded-full"></div>
                              <div className="absolute bottom-0 right-1 w-1 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                            {/* Wing 2 */}
                            <div className="relative">
                              <div className="w-8 h-4 bg-orange-400 rounded-full shadow-md"></div>
                              <div className="absolute top-1 left-1 w-2 h-1 bg-red-500 rounded-full"></div>
                              <div className="absolute bottom-0 right-1 w-1 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                            {/* Wing 3 */}
                            <div className="relative">
                              <div className="w-8 h-4 bg-orange-400 rounded-full shadow-md"></div>
                              <div className="absolute top-1 left-1 w-2 h-1 bg-red-500 rounded-full"></div>
                              <div className="absolute bottom-0 right-1 w-1 h-2 bg-orange-600 rounded-full"></div>
                            </div>
                          </div>
                          {/* Sauce drips for different wing types */}
                          {item.name.toLowerCase().includes("buffalo") && (
                            <div className="absolute bottom-0 left-2 w-6 h-1 bg-red-600 opacity-70 rounded-full"></div>
                          )}
                          {item.name.toLowerCase().includes("bbq") && (
                            <div className="absolute bottom-0 left-2 w-6 h-1 bg-amber-800 opacity-70 rounded-full"></div>
                          )}
                          {item.name.toLowerCase().includes("garlic") && (
                            <div className="absolute bottom-0 left-2 w-6 h-1 bg-yellow-400 opacity-70 rounded-full"></div>
                          )}
                          {item.name.toLowerCase().includes("honey") && (
                            <div className="absolute bottom-0 left-2 w-6 h-1 bg-orange-500 opacity-70 rounded-full"></div>
                          )}
                        </div>
                      )}
                      {category.id === "coffee" && (
                        <div className="relative">
                          {/* Coffee cup illustration */}
                          <div className="w-16 h-20 bg-white rounded-b-2xl border-4 border-amber-200 shadow-lg">
                            <div className="w-full h-14 bg-amber-900 rounded-b-xl mt-1"></div>
                            <div className="absolute top-1 left-1 right-1 h-3 bg-amber-100 rounded-t-xl"></div>
                          </div>
                          <div className="absolute right-0 top-3 w-3 h-6 border-4 border-amber-200 rounded-r-full"></div>
                          {/* Steam lines */}
                          <div className="absolute -top-1 left-4 w-1 h-4 bg-gray-400 opacity-60 rounded-full animate-pulse"></div>
                          <div
                            className="absolute -top-1 left-6 w-1 h-3 bg-gray-400 opacity-60 rounded-full animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                          <div
                            className="absolute -top-1 left-8 w-1 h-4 bg-gray-400 opacity-60 rounded-full animate-pulse"
                            style={{ animationDelay: "1s" }}
                          ></div>
                        </div>
                      )}
                      {category.id === "drinks" && (
                        <div className="relative">
                          {/* Drink glass */}
                          <div className="w-12 h-20 bg-blue-100 rounded-b-lg border-4 border-blue-200 shadow-lg">
                            <div className="w-full h-16 bg-blue-300 rounded-b-md mt-1"></div>
                            {/* Ice cubes */}
                            <div className="absolute top-3 left-2 w-2 h-2 bg-white opacity-80 rounded"></div>
                            <div className="absolute top-6 right-2 w-2 h-2 bg-white opacity-80 rounded"></div>
                          </div>
                          {/* Straw */}
                          <div className="absolute top-0 right-2 w-1 h-24 bg-red-400 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {item.rating && (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {item.rating}
                                </span>
                              </div>
                            )}
                            {item.isGlutenFree && (
                              <Badge variant="secondary" className="text-xs">
                                Gluten Free
                              </Badge>
                            )}
                            {item.isVegetarian && (
                              <Badge variant="outline" className="text-xs">
                                Vegetarian
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      {item.sizes ? (
                        <div className="space-y-2">
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
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">
                            ${item.price.toFixed(2)}
                          </span>
                          <Button onClick={() => addToCart(item)}>
                            Add to Cart
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
