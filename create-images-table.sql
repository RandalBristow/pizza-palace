-- SQL script to create the images table and update about_sections
-- Copy and paste this into your Supabase SQL Editor and run it

-- Create the images table
CREATE TABLE IF NOT EXISTS images (
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

-- Add image_position column to about_sections if it doesn't exist
ALTER TABLE about_sections 
ADD COLUMN IF NOT EXISTS image_position VARCHAR(10) CHECK (image_position IN ('left', 'right')) DEFAULT 'right';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_images_name ON images(name);
CREATE INDEX IF NOT EXISTS idx_images_active ON images(is_active);

-- Insert some sample images (optional)
INSERT INTO images (name, url, alt_text, is_active) VALUES
('Pizza Kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'Professional kitchen with chefs preparing pizza', true),
('Fresh Pizza', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800', 'Fresh baked pizza with toppings', true),
('Coffee Beans', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', 'Premium coffee beans', true),
('Restaurant Interior', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Cozy restaurant dining area', true),
('Pizza Dough', 'https://images.unsplash.com/photo-1571407971773-95b6c98bc1e2?w=800', 'Fresh pizza dough being prepared', true)
ON CONFLICT (id) DO NOTHING;
