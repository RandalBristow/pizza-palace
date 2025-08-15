-- Complete Database Update Script for Size-based Topping Pricing
-- This script updates the database schema to support size-based topping pricing
-- Run this script in your Supabase SQL editor

-- ====================================================================
-- STEP 1: Create the topping_size_prices table
-- ====================================================================

-- Create topping_size_prices table to store size-specific pricing for toppings
CREATE TABLE IF NOT EXISTS topping_size_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topping_id UUID NOT NULL REFERENCES toppings(id) ON DELETE CASCADE,
    category_size_id UUID NOT NULL REFERENCES category_sizes(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique combination of topping and category size
    UNIQUE(topping_id, category_size_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topping_size_prices_topping_id ON topping_size_prices(topping_id);
CREATE INDEX IF NOT EXISTS idx_topping_size_prices_category_size_id ON topping_size_prices(category_size_id);

-- ====================================================================
-- STEP 2: Add/Update triggers
-- ====================================================================

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger for topping_size_prices
DROP TRIGGER IF EXISTS update_topping_size_prices_updated_at ON topping_size_prices;
CREATE TRIGGER update_topping_size_prices_updated_at 
    BEFORE UPDATE ON topping_size_prices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- STEP 3: Update existing tables
-- ====================================================================

-- Update toppings table to make price column optional (for backward compatibility)
-- The old price column will be deprecated in favor of size-based pricing
ALTER TABLE toppings ALTER COLUMN price DROP NOT NULL;
ALTER TABLE toppings ALTER COLUMN price SET DEFAULT NULL;

-- Add comment to indicate the price column is deprecated
COMMENT ON COLUMN toppings.price IS 'Deprecated: Use topping_size_prices table for size-specific pricing';

-- ====================================================================
-- STEP 4: Data Migration (Optional)
-- ====================================================================

-- Migrate existing topping prices to size-based pricing
-- This creates default prices for all toppings across all category sizes
-- Only run this if you have existing toppings with prices and want to migrate them

INSERT INTO topping_size_prices (topping_id, category_size_id, price)
SELECT 
    t.id as topping_id,
    cs.id as category_size_id,
    COALESCE(t.price, 0.00) as price
FROM toppings t
CROSS JOIN category_sizes cs
JOIN categories c ON cs.category_id = c.id
WHERE t.price IS NOT NULL
  AND cs.is_active = true
  AND t.is_active = true
  AND c.is_active = true
  AND t.menu_item_category_id = c.id  -- Only match toppings to their correct menu category
ON CONFLICT (topping_id, category_size_id) DO NOTHING;

-- ====================================================================
-- STEP 5: Row Level Security (RLS) - Adjust as needed
-- ====================================================================

-- Enable RLS for the new table
ALTER TABLE topping_size_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for topping_size_prices table
-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read topping_size_prices" ON topping_size_prices
    FOR SELECT TO authenticated
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert topping_size_prices" ON topping_size_prices
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update topping_size_prices" ON topping_size_prices
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete topping_size_prices" ON topping_size_prices
    FOR DELETE TO authenticated
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to topping_size_prices" ON topping_size_prices
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ====================================================================
-- STEP 6: Grant permissions
-- ====================================================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON topping_size_prices TO authenticated;
GRANT ALL ON topping_size_prices TO service_role;

-- Grant usage on sequences (for UUID generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ====================================================================
-- VERIFICATION QUERIES
-- ====================================================================

-- Check that the table was created successfully
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'topping_size_prices' 
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'topping_size_prices';

-- Check triggers
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'topping_size_prices';

-- Check policies
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'topping_size_prices';

-- Sample query to see migrated data (if any)
SELECT 
    t.name as topping_name,
    c.name as category_name,
    cs.size_name,
    tsp.price
FROM topping_size_prices tsp
JOIN toppings t ON tsp.topping_id = t.id
JOIN category_sizes cs ON tsp.category_size_id = cs.id
JOIN categories c ON cs.category_id = c.id
ORDER BY c.name, cs.display_order, t.name
LIMIT 10;

-- ====================================================================
-- NOTES
-- ====================================================================

/*
This script implements the following changes:

1. Creates a new topping_size_prices table that links toppings to category sizes with specific prices
2. Adds proper indexes for performance
3. Sets up updated_at triggers
4. Makes the old price column in toppings table optional for backward compatibility
5. Migrates existing topping prices to the new size-based system
6. Sets up Row Level Security policies
7. Grants appropriate permissions

Key Benefits:
- Toppings can now have different prices based on the size of the menu item
- Backward compatibility is maintained
- Proper security policies are in place
- Performance is optimized with indexes

Migration Notes:
- The old 'price' column in toppings is kept for backward compatibility but deprecated
- Existing prices are automatically migrated to all available sizes for each topping
- You can manually adjust prices per size after migration

Usage in Application:
- Use the topping_size_prices table to get prices for specific topping/size combinations
- The old price column can be used as a fallback if no size-specific price is found
*/
