import { createClient } from "@supabase/supabase-js";

// Replace with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "your-supabase-url";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  CATEGORIES: "categories",
  MENU_SUB_CATEGORIES: "menu_sub_categories",
  CATEGORY_SIZES: "category_sizes",
  CATEGORY_SIZE_SUB_CATEGORIES: "category_size_sub_categories", // New junction table
  MENU_ITEMS: "menu_items",
  MENU_ITEM_SIZES: "menu_item_sizes",
  MENU_ITEM_SIZE_TOPPINGS: "menu_item_size_toppings",
  TOPPINGS: "toppings",
  TOPPING_CATEGORIES: "topping_categories",
  TOPPING_SIZE_PRICES: "topping_size_prices",
  SPECIALS: "specials",
  CAROUSEL_IMAGES: "carousel_images",
  CUSTOMER_FAVORITES: "customer_favorites",
  SETTINGS: "settings",
  ABOUT_SECTIONS: "about_sections",
  IMAGES: "images",
  CUSTOMIZER_TEMPLATES: "customizer_templates",
  CUSTOMIZER_PANELS: "customizer_panels",
  CUSTOMIZER_PANEL_ITEMS: "customizer_panel_items",
  CUSTOMIZER_PANEL_ITEM_CONDITIONALS: "customizer_panel_item_conditionals",
} as const;

// Type definitions for Supabase tables
export interface DatabaseCategory {
  id: string;
  name: string;
  is_active: boolean;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMenuSubCategory {
  id: string;
  name: string;
  category_id: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCategorySize {
  id: string;
  category_id: string; // New: unified approach uses category_id
  sub_category_id: string; // Keep for backward compatibility
  size_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCategorySizeSubCategory {
  id: string;
  category_size_id: string;
  sub_category_id: string;
  created_at: string;
}

export interface DatabaseMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  sub_category_id?: string;
  image_id?: string;
  default_toppings?: string[]; // Add this field
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMenuItemSize {
  id: string;
  menu_item_id: string;
  category_size_id: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseToppingCategory {
  id: string;
  name: string;
  menu_item_category_id: string;
  order_num: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTopping {
  id: string;
  name: string;
  price?: number; // Made optional as it's now deprecated
  category_id: string;
  menu_item_category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMenuItemSizeTopping {
  id: string;
  menu_item_size_id: string;
  topping_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseToppingSizePrice {
  id: string;
  topping_id: string;
  category_size_id: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSpecial {
  id: string;
  name: string;
  description: string;
  type: "hourly" | "daily" | "weekly";
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: number[];
  day_of_week?: number;
  menu_items: string[];
  discount_type: "percentage" | "flat";
  discount_value: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseImage {
  id: string;
  name: string;
  storage_path: string;
  public_url?: string;
  alt_text?: string;
  file_size?: number;
  width?: number;
  height?: number;
  mime_type?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  image_id?: string;
  is_active: boolean;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomerFavorite {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSettings {
  id: string;
  tax_rate: number;
  delivery_fee: number;
  business_hours: Record<
    string,
    { open: string; close: string; closed: boolean }
  >;
  theme?: string;
  swappable_default_items?: boolean;
  half_price_toppings?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAboutSection {
  id: string;
  type: "text" | "image" | "text_with_image";
  title?: string;
  content?: string;
  image_url?: string;
  image_alt_text?: string;
  image_position?: "left" | "right";
  links: { text: string; url: string; type: "text" | "image" }[];
  text_overlay?: {
    text: string;
    position: "top" | "center" | "bottom";
    style?: any;
  };
  columns: number;
  order_num: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Customizer System Types
export interface DatabaseCustomizerTemplate {
  id: string;
  sub_category_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomizerPanel {
  id: string;
  customizer_template_id: string;
  panel_type: "size" | "custom_list" | "topping";
  title: string;
  subtitle?: string;
  message?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomizerPanelItem {
  id: string;
  customizer_panel_id: string;
  item_type: "size" | "custom" | "topping";
  item_id?: string; // References category_size_id or topping_id
  custom_name?: string; // For custom items
  custom_price?: number; // For custom items
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomizerPanelItemConditional {
  id: string;
  customizer_panel_id: string;
  parent_panel_item_id: string; // Item from the previous panel
  child_panel_item_id: string; // Item in current panel to show/hide
  is_visible: boolean; // Whether to show the child item when parent is selected
  created_at: string;
  updated_at: string;
}
