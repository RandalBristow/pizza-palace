-- Migration: Add show_add_to_cart column to menu_items table
-- Description: Adds a boolean column to control whether the Add to Cart button is shown on the menu page
-- Date: 2025-10-15

-- Add the column (defaults to true for backward compatibility)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS show_add_to_cart BOOLEAN DEFAULT true;

-- Add comment to document the column
COMMENT ON COLUMN menu_items.show_add_to_cart IS 'Controls whether the Add to Cart button is displayed on the menu page. Set to false for items that must be customized before adding to cart (e.g., Build Your Own items with no defaults).';

-- Update existing items to true (backward compatibility)
UPDATE menu_items
SET show_add_to_cart = true
WHERE show_add_to_cart IS NULL;
