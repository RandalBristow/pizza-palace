import { useState, useEffect } from "react";
import { supabase, TABLES } from "../lib/supabase";
import type {
  DatabaseCategory,
  DatabaseMenuItem,
  DatabaseTopping,
  DatabaseToppingCategory,
  DatabaseSpecial,
  DatabaseCarouselImage,
  DatabaseCustomerFavorite,
  DatabaseSettings,
  DatabaseAboutSection,
  DatabaseImage,
} from "../lib/supabase";

// Transform database objects to frontend format
export const transformCategory = (dbCategory: DatabaseCategory) => ({
  id: dbCategory.id,
  name: dbCategory.name,
  isActive: dbCategory.is_active,
  order: dbCategory.order_num,
});

export const transformMenuItem = (dbMenuItem: DatabaseMenuItem) => ({
  id: dbMenuItem.id,
  name: dbMenuItem.name,
  description: dbMenuItem.description,
  price: dbMenuItem.price,
  category: dbMenuItem.category_id,
  defaultToppings: dbMenuItem.default_toppings,
  isActive: dbMenuItem.is_active,
});

export const transformTopping = (dbTopping: DatabaseTopping) => ({
  id: dbTopping.id,
  name: dbTopping.name,
  price: dbTopping.price,
  category: dbTopping.category_id,
  menuItemCategory: dbTopping.menu_item_category_id,
  isActive: dbTopping.is_active,
});

export const transformToppingCategory = (
  dbToppingCategory: DatabaseToppingCategory,
) => ({
  id: dbToppingCategory.id,
  name: dbToppingCategory.name,
  menuItemCategory: dbToppingCategory.menu_item_category_id,
  order: dbToppingCategory.order,
  isActive: dbToppingCategory.is_active,
});

export const transformSpecial = (dbSpecial: DatabaseSpecial) => ({
  id: dbSpecial.id,
  name: dbSpecial.name,
  description: dbSpecial.description,
  type: dbSpecial.type,
  startDate: dbSpecial.start_date,
  endDate: dbSpecial.end_date,
  startTime: dbSpecial.start_time,
  endTime: dbSpecial.end_time,
  daysOfWeek: dbSpecial.days_of_week,
  dayOfWeek: dbSpecial.day_of_week,
  menuItems: dbSpecial.menu_items,
  discountType: dbSpecial.discount_type,
  discountValue: dbSpecial.discount_value,
  isActive: dbSpecial.is_active,
});

export const transformCarouselImage = (
  dbCarouselImage: DatabaseCarouselImage,
) => ({
  id: dbCarouselImage.id,
  url: dbCarouselImage.url,
  title: dbCarouselImage.title,
  subtitle: dbCarouselImage.subtitle,
  isActive: dbCarouselImage.is_active,
  order: dbCarouselImage.order_num,
});

export const transformCustomerFavorite = (
  dbCustomerFavorite: DatabaseCustomerFavorite,
) => ({
  id: dbCustomerFavorite.id,
  title: dbCustomerFavorite.title,
  description: dbCustomerFavorite.description,
  icon: dbCustomerFavorite.icon,
  isActive: dbCustomerFavorite.is_active,
  order: dbCustomerFavorite.order_num,
});

export const transformSettings = (dbSettings: DatabaseSettings) => ({
  taxRate: dbSettings.tax_rate,
  deliveryFee: dbSettings.delivery_fee,
  businessHours: dbSettings.business_hours,
});

export const transformImage = (dbImage: DatabaseImage) => ({
  id: dbImage.id,
  name: dbImage.name,
  storagePath: dbImage.storage_path,
  url: dbImage.public_url,
  altText: dbImage.alt_text,
  fileSize: dbImage.file_size,
  width: dbImage.width,
  height: dbImage.height,
  mimeType: dbImage.mime_type,
  isActive: dbImage.is_active,
});

export const transformAboutSection = (dbAboutSection: DatabaseAboutSection) => ({
  id: dbAboutSection.id,
  type: dbAboutSection.type,
  title: dbAboutSection.title,
  content: dbAboutSection.content,
  imageUrl: dbAboutSection.image_url,
  imageAltText: dbAboutSection.image_alt_text,
  imagePosition: dbAboutSection.image_position,
  links: dbAboutSection.links,
  textOverlay: dbAboutSection.text_overlay,
  columns: dbAboutSection.columns,
  order: dbAboutSection.order_num,
  isActive: dbAboutSection.is_active,
});

// Custom hooks for each data type
export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .select("*")
        .order("order_num", { ascending: true });

      if (error) throw error;

      setCategories(data ? data.map(transformCategory) : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .insert({
          name: category.name,
          is_active: category.isActive,
          order_num: category.order,
        })
        .select()
        .single();

      if (error) throw error;

      const newCategory = transformCategory(data);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category",
      );
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .update({
          name: updates.name,
          is_active: updates.isActive,
          order_num: updates.order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedCategory = transformCategory(data);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat)),
      );
      return updatedCategory;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category",
      );
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.CATEGORIES)
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category",
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.MENU_ITEMS)
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setMenuItems(data ? data.map(transformMenuItem) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items')
    } finally {
      setLoading(false)
    }
  }

  const createMenuItem = async (menuItem: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.MENU_ITEMS)
        .insert({
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category_id: menuItem.category,
          default_toppings: menuItem.defaultToppings,
          is_active: menuItem.isActive,
        })
        .select()
        .single()

      if (error) throw error

      const newMenuItem = transformMenuItem(data)
      setMenuItems(prev => [...prev, newMenuItem])
      return newMenuItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create menu item')
      throw err
    }
  }

  const updateMenuItem = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.MENU_ITEMS)
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          category_id: updates.category,
          default_toppings: updates.defaultToppings,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedMenuItem = transformMenuItem(data)
      setMenuItems(prev => prev.map(item => item.id === id ? updatedMenuItem : item))
      return updatedMenuItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item')
      throw err
    }
  }

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.MENU_ITEMS)
        .delete()
        .eq('id', id)

      if (error) throw error

      setMenuItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item')
      throw err
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  return {
    menuItems,
    loading,
    error,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refetch: fetchMenuItems,
  }
}

export const useToppings = () => {
  const [toppings, setToppings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchToppings = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TOPPINGS)
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setToppings(data ? data.map(transformTopping) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch toppings')
    } finally {
      setLoading(false)
    }
  }

  const createTopping = async (topping: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TOPPINGS)
        .insert({
          name: topping.name,
          price: topping.price,
          category_id: topping.category,
          menu_item_category_id: topping.menuItemCategory,
          is_active: topping.isActive,
        })
        .select()
        .single()

      if (error) throw error

      const newTopping = transformTopping(data)
      setToppings(prev => [...prev, newTopping])
      return newTopping
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topping')
      throw err
    }
  }

  const updateTopping = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TOPPINGS)
        .update({
          name: updates.name,
          price: updates.price,
          category_id: updates.category,
          menu_item_category_id: updates.menuItemCategory,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedTopping = transformTopping(data)
      setToppings(prev => prev.map(topping => topping.id === id ? updatedTopping : topping))
      return updatedTopping
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update topping')
      throw err
    }
  }

  const deleteTopping = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.TOPPINGS)
        .delete()
        .eq('id', id)

      if (error) throw error

      setToppings(prev => prev.filter(topping => topping.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete topping')
      throw err
    }
  }

  useEffect(() => {
    fetchToppings()
  }, [])

  return {
    toppings,
    loading,
    error,
    createTopping,
    updateTopping,
    deleteTopping,
    refetch: fetchToppings,
  }
}

export const useToppingCategories = () => {
  const [toppingCategories, setToppingCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchToppingCategories = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TOPPING_CATEGORIES)
        .select('*')
        .order('order_num', { ascending: true })

      if (error) throw error

      setToppingCategories(data ? data.map(transformToppingCategory) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topping categories')
    } finally {
      setLoading(false)
    }
  }

  const createToppingCategory = async (toppingCategory: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TOPPING_CATEGORIES)
        .insert({
          name: toppingCategory.name,
          menu_item_category_id: toppingCategory.menuItemCategory,
          order_num: toppingCategory.order,
          is_active: toppingCategory.isActive,
        })
        .select()
        .single()

      if (error) throw error

      const newToppingCategory = transformToppingCategory(data)
      setToppingCategories(prev => [...prev, newToppingCategory])
      return newToppingCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topping category')
      throw err
    }
  }

  const updateToppingCategory = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TOPPING_CATEGORIES)
        .update({
          name: updates.name,
          menu_item_category_id: updates.menuItemCategory,
          order_num: updates.order,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedToppingCategory = transformToppingCategory(data)
      setToppingCategories(prev => prev.map(tc => tc.id === id ? updatedToppingCategory : tc))
      return updatedToppingCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update topping category')
      throw err
    }
  }

  const deleteToppingCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.TOPPING_CATEGORIES)
        .delete()
        .eq('id', id)

      if (error) throw error

      setToppingCategories(prev => prev.filter(tc => tc.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete topping category')
      throw err
    }
  }

  useEffect(() => {
    fetchToppingCategories()
  }, [])

  return {
    toppingCategories,
    loading,
    error,
    createToppingCategory,
    updateToppingCategory,
    deleteToppingCategory,
    refetch: fetchToppingCategories,
  }
}

export const useSpecials = () => {
  const [specials, setSpecials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpecials = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SPECIALS)
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setSpecials(data ? data.map(transformSpecial) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch specials')
    } finally {
      setLoading(false)
    }
  }

  const createSpecial = async (special: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SPECIALS)
        .insert({
          name: special.name,
          description: special.description,
          type: special.type,
          start_date: special.startDate,
          end_date: special.endDate,
          start_time: special.startTime || null,
          end_time: special.endTime || null,
          days_of_week: special.daysOfWeek,
          day_of_week: special.dayOfWeek,
          menu_items: special.menuItems,
          discount_type: special.discountType,
          discount_value: special.discountValue,
          is_active: special.isActive,
        })
        .select()
        .single()

      if (error) throw error

      const newSpecial = transformSpecial(data)
      setSpecials(prev => [...prev, newSpecial])
      return newSpecial
    } catch (err) {
      let errorMessage = 'Failed to create special';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to create special: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  const updateSpecial = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SPECIALS)
        .update({
          name: updates.name,
          description: updates.description,
          type: updates.type,
          start_date: updates.startDate,
          end_date: updates.endDate,
          start_time: updates.startTime || null,
          end_time: updates.endTime || null,
          days_of_week: updates.daysOfWeek,
          day_of_week: updates.dayOfWeek,
          menu_items: updates.menuItems,
          discount_type: updates.discountType,
          discount_value: updates.discountValue,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedSpecial = transformSpecial(data)
      setSpecials(prev => prev.map(special => special.id === id ? updatedSpecial : special))
      return updatedSpecial
    } catch (err) {
      let errorMessage = 'Failed to update special';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to update special: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  const deleteSpecial = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.SPECIALS)
        .delete()
        .eq('id', id)

      if (error) throw error

      setSpecials(prev => prev.filter(special => special.id !== id))
    } catch (err) {
      let errorMessage = 'Failed to delete special';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to delete special: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchSpecials()
  }, [])

  return {
    specials,
    loading,
    error,
    createSpecial,
    updateSpecial,
    deleteSpecial,
    refetch: fetchSpecials,
  }
}

export const useCarouselImages = () => {
  const [carouselImages, setCarouselImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCarouselImages = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CAROUSEL_IMAGES)
        .select('*')
        .order('order_num', { ascending: true })

      if (error) throw error

      setCarouselImages(data ? data.map(transformCarouselImage) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch carousel images')
    } finally {
      setLoading(false)
    }
  }

  const createCarouselImage = async (carouselImage: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CAROUSEL_IMAGES)
        .insert({
          url: carouselImage.url,
          title: carouselImage.title,
          subtitle: carouselImage.subtitle,
          order_num: carouselImage.order,
          is_active: carouselImage.isActive,
        })
        .select()
        .single()

      if (error) throw error

      const newCarouselImage = transformCarouselImage(data)
      setCarouselImages(prev => [...prev, newCarouselImage])
      return newCarouselImage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create carousel image')
      throw err
    }
  }

  const updateCarouselImage = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CAROUSEL_IMAGES)
        .update({
          url: updates.url,
          title: updates.title,
          subtitle: updates.subtitle,
          order_num: updates.order,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedCarouselImage = transformCarouselImage(data)
      setCarouselImages(prev => prev.map(img => img.id === id ? updatedCarouselImage : img))
      return updatedCarouselImage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update carousel image')
      throw err
    }
  }

  const deleteCarouselImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.CAROUSEL_IMAGES)
        .delete()
        .eq('id', id)

      if (error) throw error

      setCarouselImages(prev => prev.filter(img => img.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete carousel image')
      throw err
    }
  }

  useEffect(() => {
    fetchCarouselImages()
  }, [])

  return {
    carouselImages,
    loading,
    error,
    createCarouselImage,
    updateCarouselImage,
    deleteCarouselImage,
    refetch: fetchCarouselImages,
  }
}

export const useCustomerFavorites = () => {
  const [customerFavorites, setCustomerFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomerFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CUSTOMER_FAVORITES)
        .select('*')
        .order('order_num', { ascending: true })

      if (error) throw error

      setCustomerFavorites(data ? data.map(transformCustomerFavorite) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer favorites')
    } finally {
      setLoading(false)
    }
  }

  const createCustomerFavorite = async (customerFavorite: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CUSTOMER_FAVORITES)
        .insert({
          title: customerFavorite.title,
          description: customerFavorite.description,
          icon: customerFavorite.icon,
          order_num: customerFavorite.order,
          is_active: customerFavorite.isActive,
        })
        .select()
        .single()

      if (error) throw error

      const newCustomerFavorite = transformCustomerFavorite(data)
      setCustomerFavorites(prev => [...prev, newCustomerFavorite])
      return newCustomerFavorite
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer favorite')
      throw err
    }
  }

  const updateCustomerFavorite = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CUSTOMER_FAVORITES)
        .update({
          title: updates.title,
          description: updates.description,
          icon: updates.icon,
          order_num: updates.order,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedCustomerFavorite = transformCustomerFavorite(data)
      setCustomerFavorites(prev => prev.map(fav => fav.id === id ? updatedCustomerFavorite : fav))
      return updatedCustomerFavorite
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer favorite')
      throw err
    }
  }

  const deleteCustomerFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.CUSTOMER_FAVORITES)
        .delete()
        .eq('id', id)

      if (error) throw error

      setCustomerFavorites(prev => prev.filter(fav => fav.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer favorite')
      throw err
    }
  }

  useEffect(() => {
    fetchCustomerFavorites()
  }, [])

  return {
    customerFavorites,
    loading,
    error,
    createCustomerFavorite,
    updateCustomerFavorite,
    deleteCustomerFavorite,
    refetch: fetchCustomerFavorites,
  }
}

export const useSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SETTINGS)
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        // Not found error
        throw error;
      }

      if (data) {
        setSettings(transformSettings(data));
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          tax_rate: 8.5,
          delivery_fee: 2.99,
          business_hours: {
            monday: { open: "09:00", close: "22:00", closed: false },
            tuesday: { open: "09:00", close: "22:00", closed: false },
            wednesday: { open: "09:00", close: "22:00", closed: false },
            thursday: { open: "09:00", close: "22:00", closed: false },
            friday: { open: "09:00", close: "23:00", closed: false },
            saturday: { open: "10:00", close: "23:00", closed: false },
            sunday: { open: "10:00", close: "21:00", closed: false },
          },
        };

        const { data: newData, error: createError } = await supabase
          .from(TABLES.SETTINGS)
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) throw createError;

        setSettings(transformSettings(newData));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SETTINGS)
        .upsert({
          id: "1", // Single settings row
          tax_rate: updates.taxRate,
          delivery_fee: updates.deliveryFee,
          business_hours: updates.businessHours,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const updatedSettings = transformSettings(data);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings",
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings,
  };
};

export const useAboutSections = () => {
  const [aboutSections, setAboutSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAboutSections = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ABOUT_SECTIONS)
        .select('*')
        .order('order_num', { ascending: true })

      if (error) throw error

      setAboutSections(data ? data.map(transformAboutSection) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch about sections')
    } finally {
      setLoading(false)
    }
  }

  const createAboutSection = async (aboutSection: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ABOUT_SECTIONS)
        .insert({
          type: aboutSection.type,
          title: aboutSection.title,
          content: aboutSection.content,
          image_url: aboutSection.imageUrl,
          image_alt_text: aboutSection.imageAltText,
          image_position: aboutSection.imagePosition,
          links: aboutSection.links,
          text_overlay: aboutSection.textOverlay,
          columns: aboutSection.columns,
          order_num: aboutSection.order,
          is_active: aboutSection.isActive,
        })
        .select()
        .single()

      if (error) throw error

      const newAboutSection = transformAboutSection(data)
      setAboutSections(prev => [...prev, newAboutSection])
      return newAboutSection
    } catch (err) {
      let errorMessage = 'Failed to create about section';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to create about section: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  const updateAboutSection = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ABOUT_SECTIONS)
        .update({
          type: updates.type,
          title: updates.title,
          content: updates.content,
          image_url: updates.imageUrl,
          image_alt_text: updates.imageAltText,
          image_position: updates.imagePosition,
          links: updates.links,
          text_overlay: updates.textOverlay,
          columns: updates.columns,
          order_num: updates.order,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedAboutSection = transformAboutSection(data)
      setAboutSections(prev => prev.map(section => section.id === id ? updatedAboutSection : section))
      return updatedAboutSection
    } catch (err) {
      let errorMessage = 'Failed to update about section';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to update about section: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  const deleteAboutSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.ABOUT_SECTIONS)
        .delete()
        .eq('id', id)

      if (error) throw error

      setAboutSections(prev => prev.filter(section => section.id !== id))
    } catch (err) {
      let errorMessage = 'Failed to delete about section';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to delete about section: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchAboutSections()
  }, [])

  return {
    aboutSections,
    loading,
    error,
    createAboutSection,
    updateAboutSection,
    deleteAboutSection,
    refetch: fetchAboutSections,
  }
};

export const useImages = () => {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.IMAGES)
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setImages(data ? data.map(transformImage) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images')
    } finally {
      setLoading(false)
    }
  }

  const uploadImageFile = async (file: File, name: string) => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `images/${fileName}`

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      // Insert image metadata
      const { data, error } = await supabase
        .from(TABLES.IMAGES)
        .insert({
          name: name,
          storage_path: filePath,
          public_url: urlData.publicUrl,
          alt_text: name,
          file_size: file.size,
          mime_type: file.type,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      const newImage = transformImage(data)
      setImages(prev => [...prev, newImage])
      return newImage
    } catch (err) {
      let errorMessage = 'Failed to upload image';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to upload image: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  const createImageFromUrl = async (imageUrl: string, name: string, altText?: string) => {
    try {
      // For URL-based images, we still store the URL as both storage_path and public_url
      const { data, error } = await supabase
        .from(TABLES.IMAGES)
        .insert({
          name: name,
          storage_path: imageUrl, // For external URLs, we store the URL itself
          public_url: imageUrl,
          alt_text: altText || name,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      const newImage = transformImage(data)
      setImages(prev => [...prev, newImage])
      return newImage
    } catch (err) {
      let errorMessage = 'Failed to create image from URL';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to create image from URL: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  const updateImage = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.IMAGES)
        .update({
          name: updates.name,
          url: updates.url,
          alt_text: updates.altText,
          file_size: updates.fileSize,
          width: updates.width,
          height: updates.height,
          mime_type: updates.mimeType,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedImage = transformImage(data)
      setImages(prev => prev.map(img => img.id === id ? updatedImage : img))
      return updatedImage
    } catch (err) {
      let errorMessage = 'Failed to update image';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to update image: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.IMAGES)
        .delete()
        .eq('id', id)

      if (error) throw error

      setImages(prev => prev.filter(img => img.id !== id))
    } catch (err) {
      let errorMessage = 'Failed to delete image';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else {
          errorMessage = `Failed to delete image: ${JSON.stringify(err)}`;
        }
      }

      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  return {
    images,
    loading,
    error,
    createImage,
    updateImage,
    deleteImage,
    refetch: fetchImages,
  }
};
