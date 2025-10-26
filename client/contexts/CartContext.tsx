import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartTopping = {
  id?: string;
  name: string;
  price: number; // price contribution for display; can be 0 if included in base
  placement?: "left" | "right" | "whole";
  amount?: "normal" | "extra";
};

export type CartSelection = {
  panelTitle: string;
  itemName: string;
  price?: number;
};

export type CartItem = {
  id: string; // unique line item id
  menuItemId: string;
  name: string;
  price: number; // per-item base price (may include toppings, depending on caller)
  quantity: number;
  size?: string;
  crust?: string; // Legacy support
  toppings?: CartTopping[];
  customizations?: string; // Legacy support
  selections?: CartSelection[]; // Dynamic panel selections
  toppingCategoryName?: string; // For items without customizers, store the topping category name
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => string; // returns line id
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cartItems";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage", e);
    }
  }, [items]);

  const addItem: CartContextType["addItem"] = (itemInput) => {
    const lineId = itemInput.id || `${itemInput.menuItemId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newItem: CartItem = {
      id: lineId,
      menuItemId: itemInput.menuItemId,
      name: itemInput.name,
      price: itemInput.price,
      quantity: itemInput.quantity ?? 1,
      size: itemInput.size,
      crust: itemInput.crust,
      toppings: itemInput.toppings || [],
      customizations: itemInput.customizations,
      selections: itemInput.selections || [],
      toppingCategoryName: itemInput.toppingCategoryName,
    };
    
    setItems((prev) => [...prev, newItem]);
    return lineId;
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const updateQuantity = (id: string, quantity: number) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)));

  const clear = () => setItems([]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clear }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
