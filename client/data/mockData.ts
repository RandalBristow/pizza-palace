// Shared data for admin and menu pages
// This will be replaced with actual backend data in production

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isActive: boolean;
  sizes?: { size: string; price: number }[];
  defaultToppings?: string[];
}

export interface ToppingCategory {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  menuItemCategory: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: string;
  menuItemCategory: string;
  isActive: boolean;
}

export interface Special {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly";
  startDate: string;
  endDate: string;
  dayOfWeek?: number;
  menuItems: string[];
  isActive: boolean;
}

// Mock categories
export const mockCategories: Category[] = [
  { id: "pizza", name: "Pizza", isActive: true, order: 1 },
  { id: "wings", name: "Wings", isActive: true, order: 2 },
  { id: "coffee", name: "Coffee", isActive: true, order: 3 },
  { id: "calzone", name: "Calzones", isActive: true, order: 4 },
  { id: "drinks", name: "Drinks", isActive: true, order: 5 },
  { id: "salads", name: "Salads", isActive: true, order: 6 },
];

// Mock topping categories
export const mockToppingCategories: ToppingCategory[] = [
  {
    id: "cheese",
    name: "Cheese",
    order: 1,
    isActive: true,
    menuItemCategory: "pizza",
  },
  {
    id: "meat",
    name: "Meat",
    order: 2,
    isActive: true,
    menuItemCategory: "pizza",
  },
  {
    id: "veggies",
    name: "Vegetables",
    order: 3,
    isActive: true,
    menuItemCategory: "pizza",
  },
  {
    id: "dressings",
    name: "Dressings",
    order: 1,
    isActive: true,
    menuItemCategory: "salads",
  },
  {
    id: "sauces",
    name: "Sauces",
    order: 1,
    isActive: true,
    menuItemCategory: "wings",
  },
];

// Mock toppings
export const mockToppings: Topping[] = [
  {
    id: "mozzarella",
    name: "Mozzarella",
    price: 1.5,
    category: "cheese",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "cheddar",
    name: "Cheddar",
    price: 1.5,
    category: "cheese",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    price: 2.0,
    category: "meat",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "sausage",
    name: "Sausage",
    price: 2.0,
    category: "meat",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "mushrooms",
    name: "Mushrooms",
    price: 1.0,
    category: "veggies",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "onions",
    name: "Onions",
    price: 1.0,
    category: "veggies",
    menuItemCategory: "pizza",
    isActive: true,
  },
  {
    id: "italian-dressing",
    name: "Italian Dressing",
    price: 0.5,
    category: "dressings",
    menuItemCategory: "salads",
    isActive: true,
  },
  {
    id: "ranch",
    name: "Ranch",
    price: 0.5,
    category: "dressings",
    menuItemCategory: "salads",
    isActive: true,
  },
  {
    id: "buffalo",
    name: "Buffalo Sauce",
    price: 0.75,
    category: "sauces",
    menuItemCategory: "wings",
    isActive: true,
  },
  {
    id: "bbq",
    name: "BBQ Sauce",
    price: 0.75,
    category: "sauces",
    menuItemCategory: "wings",
    isActive: true,
  },
];

// Mock menu items
export const mockMenuItems: MenuItem[] = [
  // Pizzas
  {
    id: "p1",
    name: "Margherita Pizza",
    description:
      "Fresh mozzarella, tomato sauce, and basil on our signature crust",
    price: 12.99,
    category: "pizza",
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
    sizes: [{ size: '10"', price: 15.99 }],
  },

  // Wings
  {
    id: "w1",
    name: "Buffalo Wings",
    description: "Classic buffalo wings with celery and blue cheese (8 pieces)",
    price: 9.99,
    category: "wings",
    isActive: true,
  },
  {
    id: "w2",
    name: "BBQ Wings",
    description: "Smoky BBQ glazed wings with ranch dressing (8 pieces)",
    price: 9.99,
    category: "wings",
    isActive: true,
  },
  {
    id: "w3",
    name: "Garlic Parmesan Wings",
    description: "Wings tossed in garlic parmesan sauce (8 pieces)",
    price: 10.99,
    category: "wings",
    isActive: true,
  },
  {
    id: "w4",
    name: "Honey Hot Wings",
    description: "Sweet and spicy honey hot sauce wings (8 pieces)",
    price: 10.99,
    category: "wings",
    isActive: true,
  },

  // Coffee
  {
    id: "c1",
    name: "Pronto House Blend",
    description: "Our signature roast with notes of chocolate and caramel",
    price: 2.49,
    category: "coffee",
    isActive: true,
  },
  {
    id: "c2",
    name: "Espresso",
    description: "Rich, bold espresso shot",
    price: 1.99,
    category: "coffee",
    isActive: true,
  },
  {
    id: "c3",
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam",
    price: 3.49,
    category: "coffee",
    isActive: true,
  },
  {
    id: "c4",
    name: "Latte",
    description: "Espresso with steamed milk",
    price: 3.99,
    category: "coffee",
    isActive: true,
  },

  // Calzones
  {
    id: "cal1",
    name: "Classic Calzone",
    description: "Ricotta, mozzarella, and your choice of three toppings",
    price: 11.99,
    category: "calzone",
    isActive: true,
  },
  {
    id: "cal2",
    name: "Meat Lovers Calzone",
    description:
      "Pepperoni, sausage, ham, and bacon with ricotta and mozzarella",
    price: 14.99,
    category: "calzone",
    isActive: true,
  },

  // Drinks
  {
    id: "d1",
    name: "Soft Drinks",
    description: "Coke, Pepsi, Sprite, Dr. Pepper (16oz)",
    price: 2.49,
    category: "drinks",
    isActive: true,
  },
  {
    id: "d2",
    name: "Bottled Water",
    description: "Pure spring water (16.9oz)",
    price: 1.99,
    category: "drinks",
    isActive: true,
  },
  {
    id: "d3",
    name: "Fresh Juice",
    description: "Orange, Apple, or Cranberry (12oz)",
    price: 3.49,
    category: "drinks",
    isActive: true,
  },

  // Salads
  {
    id: "s1",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with caesar dressing and croutons",
    price: 8.99,
    category: "salads",
    isActive: true,
  },
  {
    id: "s2",
    name: "Garden Salad",
    description:
      "Mixed greens with tomatoes, cucumbers, and your choice of dressing",
    price: 7.99,
    category: "salads",
    isActive: true,
  },
];

// Mock specials
export const mockSpecials: Special[] = [
  {
    id: "sp1",
    name: "Pizza Monday",
    description: "All large pizzas 20% off",
    type: "weekly",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    dayOfWeek: 1,
    menuItems: ["p1", "p2", "p3"],
    isActive: true,
  },
  {
    id: "sp2",
    name: "Wing Wednesday",
    description: "Buy 2 orders of wings, get 1 free",
    type: "weekly",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    dayOfWeek: 3,
    menuItems: ["w1", "w2", "w3", "w4"],
    isActive: true,
  },
];
