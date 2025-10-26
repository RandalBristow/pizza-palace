-- Migration: Add menu_item_ids column to customizer_templates table
-- Description: Allows templates to be assigned to specific menu items within a sub-category
-- If menu_item_ids is NULL or empty, the template applies to all items in the sub-category
-- If menu_item_ids contains items, the template applies ONLY to those specific items
-- Date: 2025-10-15

-- Add the column (nullable array of UUIDs)
ALTER TABLE customizer_templates
ADD COLUMN IF NOT EXISTS menu_item_ids UUID[] DEFAULT NULL;

-- Add comment to document the column
COMMENT ON COLUMN customizer_templates.menu_item_ids IS 'Optional array of menu item IDs. If NULL/empty, template applies to all items in the sub-category. If specified, template applies only to those items. Lookup priority: item-specific template > sub-category default template.';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_customizer_templates_menu_item_ids ON customizer_templates USING GIN (menu_item_ids);

-- Example usage:
-- Template with no menu_item_ids → applies to all items in sub-category (default)
-- Template with specific menu_item_ids → applies only to those items (override)
