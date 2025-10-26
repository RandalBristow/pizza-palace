-- Migration: Refactor customizer templates to use template_id on menu items
-- Description: Instead of templates having menu_item_ids arrays, menu items reference a template
-- This provides cleaner assignment and better UX
-- Date: 2025-10-15

-- Step 1: Add customizer_template_id to menu_items
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS customizer_template_id UUID REFERENCES customizer_templates(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_customizer_template_id 
ON menu_items(customizer_template_id);

-- Add comment
COMMENT ON COLUMN menu_items.customizer_template_id IS 'Optional reference to a specific customizer template. If NULL, uses default template for sub-category.';

-- Step 2: Remove menu_item_ids from customizer_templates (no longer needed)
-- First drop the index
DROP INDEX IF EXISTS idx_customizer_templates_menu_item_ids;

-- Then drop the column
ALTER TABLE customizer_templates
DROP COLUMN IF EXISTS menu_item_ids;

-- Migration complete!
-- Templates are now simpler - just tied to sub-category
-- Menu items directly reference their specific template (required when customizer exists)
-- No defaults - explicit selection required
