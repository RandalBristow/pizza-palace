-- Migration to reverse the relationship between category sizes and sub-categories
-- Old model: Category Sizes belong to Categories, Sub-Categories choose which sizes apply
-- New model: Category Sizes belong to Sub-Categories, Sizes choose which sub-categories they apply to

-- Step 1: Drop existing foreign key constraints and junction table
DROP TABLE IF EXISTS sub_category_sizes CASCADE;

-- Step 2: Add new column to category_sizes table to relate to sub-categories instead of categories
ALTER TABLE category_sizes 
DROP CONSTRAINT IF EXISTS category_sizes_category_id_fkey,
DROP COLUMN category_id,
ADD COLUMN sub_category_id UUID;

-- Step 3: Add foreign key constraint to sub-categories
ALTER TABLE category_sizes 
ADD CONSTRAINT category_sizes_sub_category_id_fkey 
FOREIGN KEY (sub_category_id) 
REFERENCES menu_sub_categories(id) 
ON DELETE CASCADE;

-- Step 4: Create new junction table for many-to-many relationship
-- This allows a category size to be applied to multiple sub-categories
CREATE TABLE IF NOT EXISTS category_size_sub_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_size_id UUID NOT NULL REFERENCES category_sizes(id) ON DELETE CASCADE,
  sub_category_id UUID NOT NULL REFERENCES menu_sub_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_size_id, sub_category_id)
);

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_sizes_sub_category_id ON category_sizes(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_category_size_sub_categories_size_id ON category_size_sub_categories(category_size_id);
CREATE INDEX IF NOT EXISTS idx_category_size_sub_categories_sub_category_id ON category_size_sub_categories(sub_category_id);

-- Step 6: Enable RLS (Row Level Security) for the new junction table
ALTER TABLE category_size_sub_categories ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for the new junction table
CREATE POLICY "Allow all operations on category_size_sub_categories" ON category_size_sub_categories
FOR ALL USING (true) WITH CHECK (true);

-- Step 8: Update the category_sizes table RLS policy if needed
DROP POLICY IF EXISTS "Allow all operations on category_sizes" ON category_sizes;
CREATE POLICY "Allow all operations on category_sizes" ON category_sizes
FOR ALL USING (true) WITH CHECK (true);

-- Notes:
-- 1. This migration will delete all existing data in sub_category_sizes and category_sizes
-- 2. The user mentioned they will delete all records themselves, so data loss is expected
-- 3. The new model allows:
--    - Sub-categories to own category sizes (1:many)
--    - Category sizes to be assigned to multiple sub-categories (many:many via junction)
-- 4. UI changes needed:
--    - Sub-categories form: Only show parent category selection
--    - Category sizes form: Show category dropdown, sub-category dropdown, and sub-category checkboxes
