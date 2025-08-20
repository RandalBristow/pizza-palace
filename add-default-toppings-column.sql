-- Add default_toppings column to menu_items table
-- This script adds support for storing default toppings per menu item

-- Add the default_toppings column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'menu_items' 
        AND column_name = 'default_toppings'
    ) THEN
        ALTER TABLE menu_items 
        ADD COLUMN default_toppings TEXT[] DEFAULT '{}';
        
        -- Add comment to explain the column
        COMMENT ON COLUMN menu_items.default_toppings IS 'Array of topping IDs that are default for this menu item';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'menu_items' 
AND column_name = 'default_toppings';
