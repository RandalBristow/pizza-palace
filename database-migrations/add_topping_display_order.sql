-- Migration: Add display_order to toppings table
-- Description: Allow users to control the order toppings appear
-- Date: 2025-10-15

-- Add display_order column to toppings
ALTER TABLE toppings
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add index for sorting performance
CREATE INDEX IF NOT EXISTS idx_toppings_display_order
ON toppings(category_id, display_order);

-- Add comment
COMMENT ON COLUMN toppings.display_order IS 'Controls the display order of toppings within their category. Lower numbers appear first.';

-- Set default values based on current ordering (alphabetical by name)
-- This ensures existing toppings get sequential numbers
WITH ranked_toppings AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY name) as row_num
  FROM toppings
)
UPDATE toppings t
SET display_order = rt.row_num
FROM ranked_toppings rt
WHERE t.id = rt.id AND t.display_order = 0;

-- Migration complete!
