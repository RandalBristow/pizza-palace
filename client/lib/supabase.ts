import { createClient } from "@supabase/supabase-js";

// Replace with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "your-supabase-url";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  CATEGORIES: "categories",
  MENU_ITEMS: "menu_items",
  TOPPINGS: "toppings",
  TOPPING_CATEGORIES: "topping_categories",
  SPECIALS: "specials",
  CAROUSEL_IMAGES: "carousel_images",
  CUSTOMER_FAVORITES: "customer_favorites",
  SETTINGS: "settings",
  ABOUT_SECTIONS: "about_sections",
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

export interface DatabaseMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  default_toppings: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTopping {
  id: string;
  name: string;
  price: number;
  category_id: string;
  menu_item_category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseToppingCategory {
  id: string;
  name: string;
  menu_item_category_id: string;
  order: number;
  is_active: boolean;
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

export interface DatabaseCarouselImage {
  id: string;
  url: string;
  title: string;
  subtitle: string;
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
  links: { text: string; url: string; type: "text" | "image" }[];
  text_overlay?: { text: string; position: "top" | "center" | "bottom"; style?: any };
  order_num: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
