-- Size-based topping pricing schema updates
-- This script adds support for toppings to have different prices based on category sizes

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

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_topping_size_prices_topping_id ON topping_size_prices(topping_id);
CREATE INDEX IF NOT EXISTS idx_topping_size_prices_category_size_id ON topping_size_prices(category_size_id);

-- Add updated_at trigger for topping_size_prices
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_topping_size_prices_updated_at 
    BEFORE UPDATE ON topping_size_prices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update toppings table to remove the single price column (will be migrated to size-based pricing)
-- Note: We'll keep the price column for backward compatibility but mark it as optional
ALTER TABLE toppings ALTER COLUMN price DROP NOT NULL;
ALTER TABLE toppings ALTER COLUMN price SET DEFAULT NULL;

-- Add comment to indicate the price column is deprecated
COMMENT ON COLUMN toppings.price IS 'Deprecated: Use topping_size_prices table for size-specific pricing';

-- Sample data migration (optional - only run if you have existing toppings)
-- This will create default size prices based on existing topping prices
-- Uncomment the following if you want to migrate existing data:

/*
INSERT INTO topping_size_prices (topping_id, category_size_id, price)
SELECT 
    t.id as topping_id,
    cs.id as category_size_id,
    COALESCE(t.price, 0.00) as price
FROM toppings t
CROSS JOIN category_sizes cs
WHERE t.price IS NOT NULL
  AND cs.is_active = true
  AND t.is_active = true
ON CONFLICT (topping_id, category_size_id) DO NOTHING;
*/

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE topping_size_prices ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL ON topping_size_prices TO authenticated;
-- GRANT ALL ON topping_size_prices TO service_role;
