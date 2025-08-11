-- SQL script to create the about_sections table in Supabase
-- Copy and paste this into your Supabase SQL Editor and run it

-- Create the about_sections table
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) CHECK (type IN ('text', 'image', 'text_with_image')) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  image_url TEXT,
  image_alt_text VARCHAR(255),
  links JSONB DEFAULT '[]', -- Array of {text, url, type: 'text'|'image'}
  text_overlay JSONB, -- {text, position: 'top'|'center'|'bottom', style}
  columns INTEGER DEFAULT 1 CHECK (columns IN (1, 2, 3)), -- Column span (1-3)
  order_num INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_about_sections_order ON about_sections(order_num);

-- Create some sample data (optional)
INSERT INTO about_sections (type, title, content, columns, order_num, is_active) VALUES
('text', 'Welcome to Our Restaurant', 'We are a family-owned restaurant serving fresh pizza and premium coffee since 1995. Our commitment to quality ingredients and excellent service has made us a favorite in the community.', 3, 1, true),
('text_with_image', 'Our Story', 'Founded by the Rossi family, we started as a small neighborhood pizzeria with a simple mission: serve the best pizza and coffee in town. Today, we continue that tradition with the same recipes and passion.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800', 2, 2, true),
('image', 'Our Kitchen', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'Professional kitchen with chefs at work', '[]', '{"text": "Fresh Made Daily", "position": "bottom"}', 1, 3, true);
