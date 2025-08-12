-- SQL script to set up Supabase Storage and RLS policies for the image management system
-- Run this in your Supabase SQL Editor

-- 1. First, create the storage bucket for images (if it doesn't exist)
-- Note: You may need to create this manually in the Supabase Storage section
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
-- ON CONFLICT (id) DO NOTHING;

-- 2. Create the images table with proper RLS
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  storage_path TEXT, -- Path in Supabase storage bucket (optional for URL-based images)
  public_url TEXT NOT NULL, -- Public URL (either from storage or external)
  alt_text VARCHAR(255),
  file_size INTEGER, -- Size in bytes
  width INTEGER,
  height INTEGER,
  mime_type VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on the images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for the images table
-- Allow everyone to read active images
CREATE POLICY "Public read access for active images" ON images
FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert images
CREATE POLICY "Authenticated users can insert images" ON images
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images" ON images
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON images
FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Storage policies for the images bucket
-- Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Users can update uploads" ON storage.objects 
FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Users can delete uploads" ON storage.objects 
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- 6. Add image_position column to about_sections if it doesn't exist
ALTER TABLE about_sections 
ADD COLUMN IF NOT EXISTS image_position VARCHAR(10) CHECK (image_position IN ('left', 'right')) DEFAULT 'right';

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_images_name ON images(name);
CREATE INDEX IF NOT EXISTS idx_images_active ON images(is_active);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at);

-- 8. Insert some sample images (optional)
INSERT INTO images (name, public_url, alt_text, is_active) VALUES
('Pizza Kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'Professional kitchen with chefs preparing pizza', true),
('Fresh Pizza', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800', 'Fresh baked pizza with toppings', true),
('Coffee Beans', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', 'Premium coffee beans', true),
('Restaurant Interior', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Cozy restaurant dining area', true),
('Pizza Dough', 'https://images.unsplash.com/photo-1571407971773-95b6c98bc1e2?w=800', 'Fresh pizza dough being prepared', true)
ON CONFLICT (id) DO NOTHING;

-- Instructions:
-- 1. Run this script in your Supabase SQL Editor
-- 2. Go to Storage > Buckets in Supabase Dashboard
-- 3. Create a bucket named "images" if it doesn't exist
-- 4. Make the bucket public by toggling the "Public bucket" option
-- 5. Test the image upload functionality in your application
