import { RequestHandler } from "express";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isActive: boolean;
  sizes?: { size: string; price: number }[];
  isGlutenFree?: boolean;
  isVegetarian?: boolean;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: "sauce" | "cheese" | "meat" | "veggie";
  isActive: boolean;
}

// Mock data
let mockMenuItems: MenuItem[] = [
  {
    id: "p1",
    name: "Margherita Pizza",
    description:
      "Fresh mozzarella, tomato sauce, and basil on our signature crust",
    price: 12.99,
    category: "pizza",
    isActive: true,
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
    isActive: true,
    rating: 4.9,
    sizes: [
      { size: '10"', price: 14.99 },
      { size: '12"', price: 17.99 },
      { size: '14"', price: 20.99 },
      { size: '16"', price: 23.99 },
    ],
  },
  {
    id: "c1",
    name: "Pronto House Blend",
    description: "Our signature roast with notes of chocolate and caramel",
    price: 2.99,
    category: "coffee",
    isActive: true,
    rating: 4.9,
  },
  {
    id: "c2",
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam, dusted with cocoa",
    price: 4.49,
    category: "coffee",
    isActive: true,
    rating: 4.7,
  },
];

let mockCategories: Category[] = [
  { id: "pizza", name: "Pizza", isActive: true, order: 1 },
  { id: "coffee", name: "Coffee", isActive: true, order: 2 },
  { id: "calzone", name: "Calzones", isActive: true, order: 3 },
  { id: "drinks", name: "Drinks", isActive: true, order: 4 },
];

let mockToppings: Topping[] = [
  {
    id: "s1",
    name: "Marinara Sauce",
    price: 0,
    category: "sauce",
    isActive: true,
  },
  {
    id: "s2",
    name: "White Sauce",
    price: 1.0,
    category: "sauce",
    isActive: true,
  },
  {
    id: "ch1",
    name: "Mozzarella",
    price: 0,
    category: "cheese",
    isActive: true,
  },
  {
    id: "ch2",
    name: "Extra Mozzarella",
    price: 2.0,
    category: "cheese",
    isActive: true,
  },
  { id: "m1", name: "Pepperoni", price: 2.0, category: "meat", isActive: true },
  {
    id: "m2",
    name: "Italian Sausage",
    price: 2.5,
    category: "meat",
    isActive: true,
  },
  {
    id: "v1",
    name: "Mushrooms",
    price: 1.5,
    category: "veggie",
    isActive: true,
  },
  {
    id: "v2",
    name: "Bell Peppers",
    price: 1.5,
    category: "veggie",
    isActive: true,
  },
];

export const getMenuItems: RequestHandler = (req, res) => {
  try {
    const { category } = req.query;

    let items = mockMenuItems.filter((item) => item.isActive);

    if (category && typeof category === "string") {
      items = items.filter((item) => item.category === category);
    }

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
    });
  }
};

export const getCategories: RequestHandler = (req, res) => {
  try {
    const activeCategories = mockCategories
      .filter((cat) => cat.isActive)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: activeCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

export const getToppings: RequestHandler = (req, res) => {
  try {
    const { category } = req.query;

    let toppings = mockToppings.filter((topping) => topping.isActive);

    if (category && typeof category === "string") {
      toppings = toppings.filter((topping) => topping.category === category);
    }

    res.json({
      success: true,
      data: toppings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching toppings",
    });
  }
};

// Admin endpoints
export const createMenuItem: RequestHandler = (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      sizes,
      isGlutenFree,
      isVegetarian,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and price are required",
      });
    }

    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name,
      description: description || "",
      price: parseFloat(price),
      category,
      isActive: true,
      sizes,
      isGlutenFree: !!isGlutenFree,
      isVegetarian: !!isVegetarian,
    };

    mockMenuItems.push(newItem);

    res.json({
      success: true,
      data: newItem,
      message: "Menu item created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating menu item",
    });
  }
};

export const updateMenuItem: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const itemIndex = mockMenuItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    mockMenuItems[itemIndex] = { ...mockMenuItems[itemIndex], ...updates };

    res.json({
      success: true,
      data: mockMenuItems[itemIndex],
      message: "Menu item updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
    });
  }
};

export const deleteMenuItem: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const itemIndex = mockMenuItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Soft delete - just mark as inactive
    mockMenuItems[itemIndex].isActive = false;

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting menu item",
    });
  }
};
