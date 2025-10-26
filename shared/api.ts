/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Menu Item related types
 */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategoryId?: string;
  imageId?: string;
  customizerTemplateId?: string;
  isActive: boolean;
  image?: string;
  defaultToppings?: string[] | Record<string, { amount: "normal" | "extra" }>;
  defaultListSelections?: Record<string, string>;
  availableToppings?: string[];
  showAddToCart?: boolean;
}

export interface ToppingCategory {
  id: string;
  name: string;
  menuItemCategory: string;
  order: number;
  isActive: boolean;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: string;
  menuItemCategory: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CategorySize {
  id: string;
  categoryId: string;
  sizeName: string;
  displayOrder: number;
  isActive: boolean;
}
