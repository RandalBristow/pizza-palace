import { useState, useEffect } from 'react'
import { supabase, TABLES } from '../lib/supabase'
import type {
  DatabaseCategory,
  DatabaseMenuItem,
  DatabaseTopping,
  DatabaseToppingCategory,
  DatabaseSpecial,
  DatabaseCarouselImage,
  DatabaseCustomerFavorite,
  DatabaseSettings,
} from '../lib/supabase'

// Transform database objects to frontend format
export const transformCategory = (dbCategory: DatabaseCategory) => ({
  id: dbCategory.id,
  name: dbCategory.name,
  isActive: dbCategory.is_active,
  order: dbCategory.order,
})

export const transformMenuItem = (dbMenuItem: DatabaseMenuItem) => ({
  id: dbMenuItem.id,
  name: dbMenuItem.name,
  description: dbMenuItem.description,
  price: dbMenuItem.price,
  category: dbMenuItem.category_id,
  defaultToppings: dbMenuItem.default_toppings,
  isActive: dbMenuItem.is_active,
})

export const transformTopping = (dbTopping: DatabaseTopping) => ({
  id: dbTopping.id,
  name: dbTopping.name,
  price: dbTopping.price,
  category: dbTopping.category_id,
  menuItemCategory: dbTopping.menu_item_category_id,
  isActive: dbTopping.is_active,
})

export const transformToppingCategory = (dbToppingCategory: DatabaseToppingCategory) => ({
  id: dbToppingCategory.id,
  name: dbToppingCategory.name,
  menuItemCategory: dbToppingCategory.menu_item_category_id,
  order: dbToppingCategory.order,
  isActive: dbToppingCategory.is_active,
})

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
})

export const transformCarouselImage = (dbCarouselImage: DatabaseCarouselImage) => ({
  id: dbCarouselImage.id,
  url: dbCarouselImage.url,
  title: dbCarouselImage.title,
  subtitle: dbCarouselImage.subtitle,
  isActive: dbCarouselImage.is_active,
  order: dbCarouselImage.order,
})

export const transformCustomerFavorite = (dbCustomerFavorite: DatabaseCustomerFavorite) => ({
  id: dbCustomerFavorite.id,
  title: dbCustomerFavorite.title,
  description: dbCustomerFavorite.description,
  icon: dbCustomerFavorite.icon,
  isActive: dbCustomerFavorite.is_active,
  order: dbCustomerFavorite.order,
})

export const transformSettings = (dbSettings: DatabaseSettings) => ({
  taxRate: dbSettings.tax_rate,
  deliveryFee: dbSettings.delivery_fee,
  businessHours: dbSettings.business_hours,
})

// Custom hooks for each data type
export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .order('order', { ascending: true })

      if (error) throw error
      
      setCategories(data ? data.map(transformCategory) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (category: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .insert({
          name: category.name,
          is_active: category.isActive,
          order: category.order,
        })
        .select()
        .single()

      if (error) throw error
      
      const newCategory = transformCategory(data)
      setCategories(prev => [...prev, newCategory])
      return newCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
      throw err
    }
  }

  const updateCategory = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .update({
          name: updates.name,
          is_active: updates.isActive,
          order: updates.order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      const updatedCategory = transformCategory(data)
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat))
      return updatedCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.CATEGORIES)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}

// Similar hooks would be created for other data types
export const useMenuItems = () => {
  // Implementation similar to useCategories
  // This would be expanded for full functionality
  return {
    menuItems: [],
    loading: true,
    error: null,
    createMenuItem: async () => {},
    updateMenuItem: async () => {},
    deleteMenuItem: async () => {},
    refetch: async () => {},
  }
}

export const useSettings = () => {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SETTINGS)
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error
      }
      
      if (data) {
        setSettings(transformSettings(data))
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
        }

        const { data: newData, error: createError } = await supabase
          .from(TABLES.SETTINGS)
          .insert(defaultSettings)
          .select()
          .single()

        if (createError) throw createError
        
        setSettings(transformSettings(newData))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: any) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SETTINGS)
        .upsert({
          id: '1', // Single settings row
          tax_rate: updates.taxRate,
          delivery_fee: updates.deliveryFee,
          business_hours: updates.businessHours,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      
      const updatedSettings = transformSettings(data)
      setSettings(updatedSettings)
      return updatedSettings
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      throw err
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings,
  }
}
