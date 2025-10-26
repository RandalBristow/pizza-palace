# Database Migrations

This folder contains SQL migration scripts for the Pizza Palace application.

## How to Apply Migrations

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of the migration file
4. Paste and execute the SQL

## Migration Files

### `add_show_add_to_cart_to_menu_items.sql`
**Date:** 2025-10-15  
**Purpose:** Adds a `show_add_to_cart` boolean column to the `menu_items` table.

This column controls whether the "Add to Cart" button is displayed on the menu page for items with customizers. This is useful for items like "Build Your Own Pizza" that have no default selections and must be customized before adding to cart.

**Default Value:** `true` (for backward compatibility)

**Usage:** 
- When editing a menu item in the admin panel, check/uncheck the "Show 'Add to Cart' button on menu page" checkbox
- When unchecked, only the "CUSTOMIZE" button will be shown on the menu page
- When checked (or default), both "CUSTOMIZE" and "ADD TO ORDER" buttons will be shown

---

## Important Notes

- Always backup your database before running migrations
- Test migrations in a development environment first
- Migrations should be run in order if there are dependencies
