-- Database migration to add image_id columns for menu items and carousel images
-- Run this in your Supabase SQL Editor

-- Add image_id column to menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES images(id) ON DELETE SET NULL;

-- Add image_id column to carousel_images table  
ALTER TABLE carousel_images 
ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES images(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_image_id ON menu_items(image_id);
CREATE INDEX IF NOT EXISTS idx_carousel_images_image_id ON carousel_images(image_id);

-- Update existing carousel images to use image_id instead of url (optional)
-- You can run this after uploading your carousel images to the images table
-- UPDATE carousel_images SET image_id = (SELECT id FROM images WHERE public_url = carousel_images.url LIMIT 1) WHERE image_id IS NULL;

-- Note: After running this migration, you'll need to:
-- 1. Update your menu items to associate them with images from the images table
-- 2. Update your carousel images to use image_id instead of url
-- 3. The url column in carousel_images can be kept for backward compatibility or removed later
