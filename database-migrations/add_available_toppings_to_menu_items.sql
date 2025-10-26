-- Add available_toppings column to menu_items table
-- This column stores an array of topping IDs that are available for each menu item
-- If null or empty, all toppings are considered available (backward compatibility)

ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS available_toppings TEXT[];

-- Add comment explaining the column
COMMENT ON COLUMN menu_items.available_toppings IS 
'Array of topping IDs that are available for this menu item. If null/empty, all toppings are available.';

-- No data migration needed - null values mean all toppings are available
-- This maintains backward compatibility with existing menu items
