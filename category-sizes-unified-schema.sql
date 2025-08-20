-- ============================================================
-- UNIFIED CATEGORY SIZES SCHEMA UPDATE
-- This migration supports the new unified category sizes form
-- where sizes are created for categories and linked to multiple sub-categories
-- ============================================================

-- The existing schema is already appropriate for our needs:
-- 1. category_sizes table links sizes to categories
-- 2. sub_category_sizes junction table links sizes to sub-categories
-- 3. This allows one size to be linked to multiple sub-categories

-- We just need to rename the junction table for clarity
-- from 'sub_category_sizes' to 'category_size_sub_categories'

-- Step 1: Create the new junction table with clearer naming
CREATE TABLE IF NOT EXISTS category_size_sub_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_size_id UUID NOT NULL REFERENCES category_sizes(id) ON DELETE CASCADE,
  sub_category_id UUID NOT NULL REFERENCES menu_sub_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_size_id, sub_category_id)
);

-- Step 2: Copy data from old table to new table (if old table exists)
INSERT INTO category_size_sub_categories (category_size_id, sub_category_id, created_at)
SELECT category_size_id, sub_category_id, created_at
FROM sub_category_sizes
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sub_category_sizes')
ON CONFLICT (category_size_id, sub_category_id) DO NOTHING;

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_category_size_sub_categories_size_id 
ON category_size_sub_categories(category_size_id);

CREATE INDEX IF NOT EXISTS idx_category_size_sub_categories_sub_category_id 
ON category_size_sub_categories(sub_category_id);

-- Step 4: Drop the old table (uncomment if you want to clean up)
-- DROP TABLE IF EXISTS sub_category_sizes CASCADE;

-- ============================================================
-- UPDATE SAMPLE DATA TO TEST THE NEW STRUCTURE
-- ============================================================

-- Clear existing data for testing
DELETE FROM category_size_sub_categories;
DELETE FROM menu_item_sizes;
DELETE FROM category_sizes WHERE category_id IN (
  SELECT id FROM categories WHERE name IN ('Pizza', 'Wings', 'Beverages')
);

-- Re-insert category sizes with the new unified approach
INSERT INTO category_sizes (id, category_id, size_name, display_order, is_active) VALUES 
-- Pizza sizes
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '7"', 1, true),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '10"', 2, true),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '12"', 3, true),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '14"', 4, true),
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '16"', 5, true),

-- Wing sizes
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '2lbs', 1, true),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '5lbs', 2, true),
('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '5-Piece', 3, true),
('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '8-Piece', 4, true),

-- Beverage sizes
('c1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Small', 1, true),
('c2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Medium', 2, true),
('c3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Large', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Link pizza sizes to both pizza sub-categories (they can use all sizes)
INSERT INTO category_size_sub_categories (category_size_id, sub_category_id) VALUES 
-- All pizza sizes work for both specialty and build-your-own
('a1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111'), -- 7" -> Specialty
('a1111111-1111-1111-1111-111111111111', 's2222222-2222-2222-2222-222222222222'), -- 7" -> Build Your Own
('a2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111'), -- 10" -> Specialty
('a2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222'), -- 10" -> Build Your Own
('a3333333-3333-3333-3333-333333333333', 's1111111-1111-1111-1111-111111111111'), -- 12" -> Specialty
('a3333333-3333-3333-3333-333333333333', 's2222222-2222-2222-2222-222222222222'), -- 12" -> Build Your Own
('a4444444-4444-4444-4444-444444444444', 's1111111-1111-1111-1111-111111111111'), -- 14" -> Specialty
('a4444444-4444-4444-4444-444444444444', 's2222222-2222-2222-2222-222222222222'), -- 14" -> Build Your Own
('a5555555-5555-5555-5555-555555555555', 's1111111-1111-1111-1111-111111111111'), -- 16" -> Specialty
('a5555555-5555-5555-5555-555555555555', 's2222222-2222-2222-2222-222222222222'), -- 16" -> Build Your Own

-- Wing sizes - different sizes for different sub-categories
('b1111111-1111-1111-1111-111111111111', 's3333333-3333-3333-3333-333333333333'), -- 2lbs -> Boneless
('b2222222-2222-2222-2222-222222222222', 's3333333-3333-3333-3333-333333333333'), -- 5lbs -> Boneless
('b3333333-3333-3333-3333-333333333333', 's4444444-4444-4444-4444-444444444444'), -- 5-Piece -> Traditional
('b4444444-4444-4444-4444-444444444444', 's4444444-4444-4444-4444-444444444444')  -- 8-Piece -> Traditional
ON CONFLICT (category_size_id, sub_category_id) DO NOTHING;

-- Restore menu item pricing (size-based)
INSERT INTO menu_item_sizes (menu_item_id, category_size_id, price) VALUES 
-- Pepperoni Pizza pricing (all sizes)
('m1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 8.99),  -- 7"
('m1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 12.99), -- 10"
('m1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 15.99), -- 12"
('m1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 18.99), -- 14"
('m1111111-1111-1111-1111-111111111111', 'a5555555-5555-5555-5555-555555555555', 21.99), -- 16"

-- Supreme Pizza pricing (all sizes)
('m2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 10.99), -- 7"
('m2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 14.99), -- 10"
('m2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 17.99), -- 12"
('m2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 20.99), -- 14"
('m2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', 23.99), -- 16"

-- Buffalo Wings pricing (Traditional - by pieces)
('m3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 7.99),  -- 5-Piece
('m3333333-3333-3333-3333-333333333333', 'b4444444-4444-4444-4444-444444444444', 12.99), -- 8-Piece

-- BBQ Boneless Wings pricing (by weight)
('m4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 14.99), -- 2lbs
('m4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 32.99)  -- 5lbs
ON CONFLICT (menu_item_id, category_size_id) DO NOTHING;

-- ============================================================
-- NOTES ON THE NEW UNIFIED APPROACH
-- ============================================================

-- Benefits of this approach:
-- 1. Single form to create a size and assign it to multiple sub-categories
-- 2. Sizes are defined at the category level but applied at sub-category level
-- 3. Flexible linking - one size can work for multiple sub-categories
-- 4. Clear separation between size definition and sub-category assignment

-- Example usage:
-- 1. Create "Large" size for "Pizza" category
-- 2. In the same form, check which pizza sub-categories can use "Large"
-- 3. The system creates the size and links it to selected sub-categories
-- 4. Menu items in those sub-categories can then use the "Large" size for pricing

-- Schema summary:
-- - categories: Main menu categories (Pizza, Wings, etc.)
-- - menu_sub_categories: Sub-categories within main categories
-- - category_sizes: Sizes defined for categories (12", Large, 5-Piece, etc.)
-- - category_size_sub_categories: Links sizes to specific sub-categories
-- - menu_items: Individual menu items
-- - menu_item_sizes: Size-based pricing for menu items
