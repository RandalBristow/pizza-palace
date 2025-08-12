-- Supabase Database Schema for Restaurant Admin System
-- Run these SQL commands in your Supabase SQL editor

-- Enable Row Level Security
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  default_toppings TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topping categories table
CREATE TABLE topping_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  menu_item_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  order_num INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Toppings table
CREATE TABLE toppings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES topping_categories(id) ON DELETE CASCADE,
  menu_item_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Specials table
CREATE TABLE specials (
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
);

-- Carousel images table
CREATE TABLE carousel_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer favorites table
CREATE TABLE customer_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (single row configuration)
CREATE TABLE settings (
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
);

-- Images table for centralized image management
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  file_size INTEGER, -- Size in bytes
  width INTEGER,
  height INTEGER,
  mime_type VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About page sections table
CREATE TABLE about_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) CHECK (type IN ('text', 'image', 'text_with_image')) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  image_url TEXT,
  image_alt_text VARCHAR(255),
  image_position VARCHAR(10) CHECK (image_position IN ('left', 'right')) DEFAULT 'right', -- For text_with_image sections
  links JSONB DEFAULT '[]', -- Array of {text, url, type: 'text'|'image'}
  text_overlay JSONB, -- {text, position: 'top'|'center'|'bottom', style}
  columns INTEGER DEFAULT 1 CHECK (columns IN (1, 2, 3)), -- Column span (1-3)
  order_num INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_toppings_category ON toppings(category_id);
CREATE INDEX idx_toppings_menu_category ON toppings(menu_item_category_id);
CREATE INDEX idx_topping_categories_menu_category ON topping_categories(menu_item_category_id);
CREATE INDEX idx_about_sections_order ON about_sections(order_num);
CREATE INDEX idx_images_name ON images(name);
CREATE INDEX idx_images_active ON images(is_active);
CREATE INDEX idx_categories_order ON categories(order_num);
CREATE INDEX idx_carousel_order ON carousel_images(order_num);
CREATE INDEX idx_favorites_order ON customer_favorites(order_num);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_toppings_updated_at BEFORE UPDATE ON toppings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_topping_categories_updated_at BEFORE UPDATE ON topping_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_specials_updated_at BEFORE UPDATE ON specials FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_carousel_images_updated_at BEFORE UPDATE ON carousel_images FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_customer_favorites_updated_at BEFORE UPDATE ON customer_favorites FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default settings row
INSERT INTO settings (id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) - Enable if needed
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE topping_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE specials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customer_favorites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your authentication needs)
-- CREATE POLICY "Allow all operations for authenticated users" ON categories FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON menu_items FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON toppings FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON topping_categories FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON specials FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON carousel_images FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON customer_favorites FOR ALL USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON settings FOR ALL USING (true);
