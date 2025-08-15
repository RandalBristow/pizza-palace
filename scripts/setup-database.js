#!/usr/bin/env node

/**
 * Database Setup Script for Supabase
 *
 * This script sets up the complete database schema for the pizza restaurant management system.
 * Run this with: node scripts/setup-database.js
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env file");
  console.log("Required variables:");
  console.log("- VITE_SUPABASE_URL");
  console.log("- VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🚀 Starting database setup...");
console.log(`📍 Supabase URL: ${supabaseUrl}`);

// SQL commands to execute
const sqlCommands = [
  // Enable UUID extension
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

  // Create updated_at function
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
   END;
   $$ language 'plpgsql';`,

  // Categories table
  `CREATE TABLE IF NOT EXISTS categories (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     is_active BOOLEAN DEFAULT true,
     order_num INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Menu sub-categories table
  `CREATE TABLE IF NOT EXISTS menu_sub_categories (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
     display_order INTEGER DEFAULT 1,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Category sizes table
  `CREATE TABLE IF NOT EXISTS category_sizes (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
     size_name VARCHAR(100) NOT NULL,
     display_order INTEGER DEFAULT 1,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Sub-category sizes junction table
  `CREATE TABLE IF NOT EXISTS sub_category_sizes (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     sub_category_id UUID REFERENCES menu_sub_categories(id) ON DELETE CASCADE,
     category_size_id UUID REFERENCES category_sizes(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(sub_category_id, category_size_id)
   );`,

  // Images table
  `CREATE TABLE IF NOT EXISTS images (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     storage_path TEXT NOT NULL,
     public_url TEXT,
     alt_text VARCHAR(255),
     file_size INTEGER,
     width INTEGER,
     height INTEGER,
     mime_type VARCHAR(100),
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Menu items table
  `CREATE TABLE IF NOT EXISTS menu_items (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     description TEXT,
     category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
     sub_category_id UUID REFERENCES menu_sub_categories(id) ON DELETE SET NULL,
     image_id UUID REFERENCES images(id) ON DELETE SET NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Menu item sizes table
  `CREATE TABLE IF NOT EXISTS menu_item_sizes (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
     category_size_id UUID REFERENCES category_sizes(id) ON DELETE CASCADE,
     price DECIMAL(10,2) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(menu_item_id, category_size_id)
   );`,

  // Topping categories table
  `CREATE TABLE IF NOT EXISTS topping_categories (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     menu_item_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
     order_num INTEGER DEFAULT 1,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Toppings table
  `CREATE TABLE IF NOT EXISTS toppings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     price DECIMAL(10,2) NOT NULL DEFAULT 0,
     category_id UUID REFERENCES topping_categories(id) ON DELETE CASCADE,
     menu_item_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Menu item size toppings table
  `CREATE TABLE IF NOT EXISTS menu_item_size_toppings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     menu_item_size_id UUID REFERENCES menu_item_sizes(id) ON DELETE CASCADE,
     topping_id UUID REFERENCES toppings(id) ON DELETE CASCADE,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(menu_item_size_id, topping_id)
   );`,

  // Specials table
  `CREATE TABLE IF NOT EXISTS specials (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     description TEXT,
     type VARCHAR(20) CHECK (type IN ('hourly', 'daily', 'weekly')),
     start_date DATE,
     end_date DATE,
     start_time TIME,
     end_time TIME,
     days_of_week INTEGER[],
     day_of_week INTEGER,
     menu_items TEXT[] DEFAULT '{}',
     discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'flat')),
     discount_value DECIMAL(10,2) DEFAULT 0,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Carousel images table
  `CREATE TABLE IF NOT EXISTS carousel_images (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     url TEXT,
     title VARCHAR(255),
     subtitle VARCHAR(255),
     image_id UUID REFERENCES images(id) ON DELETE SET NULL,
     is_active BOOLEAN DEFAULT true,
     order_num INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Customer favorites table
  `CREATE TABLE IF NOT EXISTS customer_favorites (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title VARCHAR(255) NOT NULL,
     description TEXT,
     icon VARCHAR(10),
     is_active BOOLEAN DEFAULT true,
     order_num INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // About sections table
  `CREATE TABLE IF NOT EXISTS about_sections (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     type VARCHAR(20) CHECK (type IN ('text', 'image', 'text_with_image')) NOT NULL,
     title VARCHAR(255),
     content TEXT,
     image_url TEXT,
     image_alt_text VARCHAR(255),
     image_position VARCHAR(10) CHECK (image_position IN ('left', 'right')) DEFAULT 'right',
     links JSONB DEFAULT '[]',
     text_overlay JSONB,
     columns INTEGER DEFAULT 1 CHECK (columns IN (1, 2, 3)),
     order_num INTEGER DEFAULT 1,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,

  // Settings table
  `CREATE TABLE IF NOT EXISTS settings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     tax_rate DECIMAL(5,2) DEFAULT 8.5,
     delivery_fee DECIMAL(10,2) DEFAULT 2.99,
     business_hours JSONB DEFAULT '{
       "monday": {"open": "09:00", "close": "22:00", "closed": false},
       "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
       "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
       "thursday": {"open": "09:00", "close": "22:00", "closed": false},
       "friday": {"open": "09:00", "close": "23:00", "closed": false},
       "saturday": {"open": "10:00", "close": "23:00", "closed": false},
       "sunday": {"open": "10:00", "close": "21:00", "closed": false}
     }',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,
];

// Indexes
const indexCommands = [
  `CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_num);`,
  `CREATE INDEX IF NOT EXISTS idx_menu_sub_categories_category ON menu_sub_categories(category_id);`,
  `CREATE INDEX IF NOT EXISTS idx_category_sizes_category ON category_sizes(category_id);`,
  `CREATE INDEX IF NOT EXISTS idx_sub_category_sizes_sub_category ON sub_category_sizes(sub_category_id);`,
  `CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);`,
  `CREATE INDEX IF NOT EXISTS idx_menu_item_sizes_item ON menu_item_sizes(menu_item_id);`,
  `CREATE INDEX IF NOT EXISTS idx_toppings_category ON toppings(category_id);`,
  `CREATE INDEX IF NOT EXISTS idx_topping_categories_menu_category ON topping_categories(menu_item_category_id);`,
];

// Triggers
const triggerCommands = [
  `CREATE TRIGGER IF NOT EXISTS update_categories_updated_at 
   BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`,
  `CREATE TRIGGER IF NOT EXISTS update_menu_items_updated_at 
   BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`,
  `CREATE TRIGGER IF NOT EXISTS update_toppings_updated_at 
   BEFORE UPDATE ON toppings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`,
];

// Sample data
const sampleDataCommands = [
  // Insert default settings
  `INSERT INTO settings (id, tax_rate, delivery_fee) 
   VALUES ('00000000-0000-0000-0000-000000000001', 8.5, 2.99)
   ON CONFLICT (id) DO NOTHING;`,

  // Sample categories
  `INSERT INTO categories (id, name, is_active, order_num) VALUES 
   ('11111111-1111-1111-1111-111111111111', 'Pizza', true, 1),
   ('22222222-2222-2222-2222-222222222222', 'Wings', true, 2),
   ('33333333-3333-3333-3333-333333333333', 'Appetizers', true, 3),
   ('44444444-4444-4444-4444-444444444444', 'Salads', true, 4),
   ('55555555-5555-5555-5555-555555555555', 'Beverages', true, 5)
   ON CONFLICT (id) DO NOTHING;`,

  // Sample sizes for Pizza
  `INSERT INTO category_sizes (id, category_id, size_name, display_order, is_active) VALUES 
   ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '7"', 1, true),
   ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '10"', 2, true),
   ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '12"', 3, true),
   ('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '14"', 4, true),
   ('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '16"', 5, true)
   ON CONFLICT (id) DO NOTHING;`,

  // Sample sizes for Wings
  `INSERT INTO category_sizes (id, category_id, size_name, display_order, is_active) VALUES 
   ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '2lbs', 1, true),
   ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '5lbs', 2, true),
   ('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '5-Piece', 3, true),
   ('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '8-Piece', 4, true)
   ON CONFLICT (id) DO NOTHING;`,
];

async function executeSQLCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`);
    const { data, error } = await supabase.rpc("exec_sql", {
      sql_query: command,
    });

    if (error) {
      // Try alternative method for table creation
      const { error: directError } = await supabase
        .from("_sql")
        .select("*")
        .limit(0);

      if (directError && directError.message.includes("does not exist")) {
        // This means we need to use a different approach
        throw new Error(
          `Cannot execute SQL directly. You may need to run the SQL manually in Supabase dashboard.`,
        );
      }
      throw error;
    }

    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log("\n📋 Creating tables...");

  let successCount = 0;
  const totalCommands =
    sqlCommands.length +
    indexCommands.length +
    triggerCommands.length +
    sampleDataCommands.length;

  // Execute table creation commands
  for (const command of sqlCommands) {
    const tableName =
      command.match(/CREATE TABLE.*?(\w+)/)?.[1] || "SQL command";
    const success = await executeSQLCommand(command, `Creating ${tableName}`);
    if (success) successCount++;
  }

  console.log("\n🔗 Creating indexes...");

  // Execute index commands
  for (const command of indexCommands) {
    const success = await executeSQLCommand(command, "Creating index");
    if (success) successCount++;
  }

  console.log("\n⚡ Creating triggers...");

  // Execute trigger commands
  for (const command of triggerCommands) {
    const success = await executeSQLCommand(command, "Creating trigger");
    if (success) successCount++;
  }

  console.log("\n📊 Inserting sample data...");

  // Execute sample data commands
  for (const command of sampleDataCommands) {
    const success = await executeSQLCommand(command, "Inserting sample data");
    if (success) successCount++;
  }

  console.log(`\n🎉 Database setup completed!`);
  console.log(`✅ ${successCount}/${totalCommands} operations successful`);

  if (successCount < totalCommands) {
    console.log("\n⚠️  Some operations failed. You may need to:");
    console.log("1. Check your Supabase permissions");
    console.log("2. Run the SQL script manually in Supabase dashboard");
    console.log("3. Use the service role key instead of anon key");
  }
}

setupDatabase().catch(console.error);
