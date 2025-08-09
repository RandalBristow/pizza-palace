// Data Migration Script for Supabase
// Run this script to populate your Supabase database with initial data

import { createClient } from '@supabase/supabase-js'
import {
  mockCategories,
  mockMenuItems,
  mockToppings,
  mockToppingCategories,
  mockSpecials,
} from './client/data/mockData'

// Supabase configuration
const supabaseUrl = 'https://rvmtbsakfxwgpspkofeg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bXRic2FrZnh3Z3BzcGtvZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTMzNTAsImV4cCI6MjA2NzA2OTM1MH0.6ou6KqHG96PZJlrTsoLc4E2riqqOzuJWHmgAulYukRU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function migrateData() {
  console.log('🚀 Starting data migration...')

  try {
    // 1. Migrate Categories
    console.log('📁 Migrating categories...')
    for (const category of mockCategories) {
      const { error } = await supabase
        .from('categories')
        .upsert({
          id: category.id,
          name: category.name,
          is_active: category.isActive,
          order_num: category.order,
        })
      
      if (error) {
        console.error(`❌ Error migrating category ${category.name}:`, error)
      } else {
        console.log(`✅ Migrated category: ${category.name}`)
      }
    }

    // 2. Migrate Topping Categories
    console.log('🏷️ Migrating topping categories...')
    for (const toppingCategory of mockToppingCategories) {
      const { error } = await supabase
        .from('topping_categories')
        .upsert({
          id: toppingCategory.id,
          name: toppingCategory.name,
          menu_item_category_id: toppingCategory.menuItemCategory,
          order_num: toppingCategory.order,
          is_active: toppingCategory.isActive,
        })
      
      if (error) {
        console.error(`❌ Error migrating topping category ${toppingCategory.name}:`, error)
      } else {
        console.log(`✅ Migrated topping category: ${toppingCategory.name}`)
      }
    }

    // 3. Migrate Toppings
    console.log('🧄 Migrating toppings...')
    for (const topping of mockToppings) {
      const { error } = await supabase
        .from('toppings')
        .upsert({
          id: topping.id,
          name: topping.name,
          price: topping.price,
          category_id: topping.category,
          menu_item_category_id: topping.menuItemCategory,
          is_active: topping.isActive,
        })
      
      if (error) {
        console.error(`❌ Error migrating topping ${topping.name}:`, error)
      } else {
        console.log(`✅ Migrated topping: ${topping.name}`)
      }
    }

    // 4. Migrate Menu Items
    console.log('🍕 Migrating menu items...')
    for (const menuItem of mockMenuItems) {
      const { error } = await supabase
        .from('menu_items')
        .upsert({
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category_id: menuItem.category,
          default_toppings: menuItem.defaultToppings || [],
          is_active: menuItem.isActive,
        })
      
      if (error) {
        console.error(`❌ Error migrating menu item ${menuItem.name}:`, error)
      } else {
        console.log(`✅ Migrated menu item: ${menuItem.name}`)
      }
    }

    // 5. Migrate Specials
    console.log('🎉 Migrating specials...')
    for (const special of mockSpecials) {
      const { error } = await supabase
        .from('specials')
        .upsert({
          id: special.id,
          name: special.name,
          description: special.description,
          type: special.type,
          start_date: special.startDate,
          end_date: special.endDate,
          start_time: special.startTime,
          end_time: special.endTime,
          days_of_week: special.daysOfWeek,
          day_of_week: special.dayOfWeek,
          menu_items: special.menuItems,
          discount_type: special.discountType,
          discount_value: special.discountValue,
          is_active: special.isActive,
        })
      
      if (error) {
        console.error(`❌ Error migrating special ${special.name}:`, error)
      } else {
        console.log(`✅ Migrated special: ${special.name}`)
      }
    }

    // 6. Migrate Default Carousel Images
    console.log('🖼️ Migrating carousel images...')
    const carouselImages = [
      {
        id: 'carousel-1',
        url: 'https://cdn.builder.io/api/v1/image/assets%2F8595ba96a391483e886f01139655b832%2F3eb3e3851578457ebc6357b42054ea36?format=webp&width=800',
        title: 'Fresh Pizza & Premium Coffee',
        subtitle: 'Made to Order',
        is_active: true,
        order_num: 1,
      },
    ]

    for (const image of carouselImages) {
      const { error } = await supabase
        .from('carousel_images')
        .upsert(image)
      
      if (error) {
        console.error(`❌ Error migrating carousel image ${image.title}:`, error)
      } else {
        console.log(`✅ Migrated carousel image: ${image.title}`)
      }
    }

    // 7. Migrate Default Customer Favorites
    console.log('⭐ Migrating customer favorites...')
    const customerFavorites = [
      {
        id: 'fav-1',
        title: 'Fresh Ingredients',
        description: 'We use only the finest, freshest ingredients in every pizza.',
        icon: '🍕',
        is_active: true,
        order_num: 1,
      },
      {
        id: 'fav-2',
        title: 'Fast Delivery',
        description: 'Hot, fresh pizza delivered to your door in 30 minutes or less.',
        icon: '🚚',
        is_active: true,
        order_num: 2,
      },
      {
        id: 'fav-3',
        title: 'Premium Coffee',
        description: 'Freshly brewed coffee made from premium beans.',
        icon: '☕',
        is_active: true,
        order_num: 3,
      },
    ]

    for (const favorite of customerFavorites) {
      const { error } = await supabase
        .from('customer_favorites')
        .upsert(favorite)
      
      if (error) {
        console.error(`❌ Error migrating customer favorite ${favorite.title}:`, error)
      } else {
        console.log(`✅ Migrated customer favorite: ${favorite.title}`)
      }
    }

    // 8. Migrate Default Settings
    console.log('⚙️ Migrating settings...')
    const defaultSettings = {
      id: '00000000-0000-0000-0000-000000000001',
      tax_rate: 8.25,
      delivery_fee: 2.99,
      business_hours: {
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '11:00', close: '23:00', closed: false },
        sunday: { open: '12:00', close: '21:00', closed: false },
      },
    }

    const { error: settingsError } = await supabase
      .from('settings')
      .upsert(defaultSettings)
    
    if (settingsError) {
      console.error('❌ Error migrating settings:', settingsError)
    } else {
      console.log('✅ Migrated settings')
    }

    console.log('')
    console.log('🎉 Data migration completed successfully!')
    console.log('')
    console.log('📊 Migration Summary:')
    console.log(`   📁 Categories: ${mockCategories.length}`)
    console.log(`   🏷️ Topping Categories: ${mockToppingCategories.length}`)
    console.log(`   🧄 Toppings: ${mockToppings.length}`)
    console.log(`   🍕 Menu Items: ${mockMenuItems.length}`)
    console.log(`   🎉 Specials: ${mockSpecials.length}`)
    console.log(`   🖼️ Carousel Images: 1`)
    console.log(`   ⭐ Customer Favorites: 3`)
    console.log(`   ⚙️ Settings: 1`)
    console.log('')
    console.log('Your Supabase database is now ready to use! 🚀')

  } catch (error) {
    console.error('💥 Migration failed:', error)
  }
}

// Run the migration
migrateData()
