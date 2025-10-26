# Item-Specific Customizer Templates Implementation

## Overview
Implemented a flexible customizer template system that allows templates to be assigned to:
1. **Default**: All items in a sub-category (existing behavior)
2. **Specific**: Individual menu items within a sub-category (new feature)

## Architecture

### Template Assignment Priority
The system uses a **priority-based lookup**:
1. **First Priority**: Item-specific template (where `menu_item_ids` includes the item)
2. **Fallback**: Sub-category default template (where `menu_item_ids` is empty/null)

### Example Usage Scenarios

**Scenario 1: Default Template (Current Behavior)**
```
Template: "Standard Pizza Customizer"
├─ Sub-Category: "Specialty Pizzas"
├─ Menu Items: [empty]
└─ Result: ALL items in "Specialty Pizzas" use this template
```

**Scenario 2: Item-Specific Template**
```
Template: "Build Your Own Customizer"
├─ Sub-Category: "Specialty Pizzas"
├─ Menu Items: ["Build Your Own Pizza"]
└─ Result: ONLY "Build Your Own Pizza" uses this template
```

**Scenario 3: Mixed Templates**
```
Templates in "Pizzas" sub-category:
├─ "Simple Pizza" → Items: ["Margherita", "Cheese"]
├─ "Complex Pizza" → Items: ["Supreme", "Deluxe"]
└─ "Default Pizza" → Items: [empty] (fallback for all others)
```

## Changes Made

### 1. Database Schema
**File**: `database-migrations/add_menu_item_ids_to_customizer_templates.sql`

```sql
ALTER TABLE customizer_templates
ADD COLUMN IF NOT EXISTS menu_item_ids UUID[] DEFAULT NULL;
```

- Added `menu_item_ids` array column to `customizer_templates` table
- NULL or empty array = applies to all items in sub-category
- Contains item IDs = applies only to those specific items
- Added GIN index for performance

### 2. Type Definitions

**Updated Files**:
- `client/lib/supabase.ts` - Added `menu_item_ids?: string[]` to `DatabaseCustomizerTemplate`
- `client/hooks/useSupabase.ts` - Added `menuItemIds` to `transformCustomizerTemplate`

### 3. CRUD Operations

**File**: `client/hooks/useSupabase.ts`

**createCustomizerTemplate**:
```typescript
menu_item_ids: template.menuItemIds && template.menuItemIds.length > 0 
  ? template.menuItemIds 
  : null
```

**updateCustomizerTemplate**:
```typescript
menu_item_ids: template.menuItemIds && template.menuItemIds.length > 0 
  ? template.menuItemIds 
  : null
```

### 4. Admin UI

**File**: `client/components/admin/CustomizationEditorForm.tsx`

Added menu items multi-select:
- Appears when sub-category is selected
- Shows all active menu items in that sub-category
- Checkbox list for easy selection
- Helper text: "Leave empty to apply to all items in sub-category, or select specific items"
- Scrollable container (max-height: 200px)

**Props Added**:
- `menuItems: any[]` - List of all menu items

**State Updated**:
```typescript
const [templateForm, setTemplateForm] = useState({
  id: "",
  name: "",
  subCategoryId: "",
  menuItemIds: [] as string[], // NEW
  isActive: true,
});
```

**File**: `client/pages/Admin.tsx`
- Added `menuItems={menuItems}` prop to CustomizationEditorForm

### 5. Template Lookup Logic

**File**: `client/pages/Order.tsx`

Added helper function:
```typescript
const getTemplateForMenuItem = useCallback((menuItemId: string, subCategoryId: string) => {
  // First: Check for item-specific template
  const itemTemplate = customizerTemplates.find(
    (t) => t.isActive && 
    t.subCategoryId === subCategoryId && 
    t.menuItemIds && 
    t.menuItemIds.length > 0 && 
    t.menuItemIds.includes(menuItemId)
  );
  
  if (itemTemplate) return itemTemplate;
  
  // Fallback: Sub-category default template
  const subCategoryTemplate = customizerTemplates.find(
    (t) => t.isActive && 
    t.subCategoryId === subCategoryId && 
    (!t.menuItemIds || t.menuItemIds.length === 0)
  );
  
  return subCategoryTemplate;
}, [customizerTemplates]);
```

**Updated Locations**:
1. `useEffect` for initial selections (line ~332)
2. `customizerTemplate` variable for useDynamicCustomizer (line ~517)

**File**: `client/components/dialog_components/MenuItemDialog.tsx`

Updated `getCustomizerTemplate()` to prioritize item-specific templates when editing.

**File**: `client/pages/Menu.tsx`

Updated `hasCustomizer()` to check for both item-specific and default templates:
```typescript
const hasCustomizer = (item: MenuItem) => {
  // Check item-specific template first
  const hasItemTemplate = customizerTemplates.some(
    (t) => t.isActive && 
    t.subCategoryId === item.subCategoryId &&
    t.menuItemIds?.includes(item.id)
  );
  
  if (hasItemTemplate) return true;
  
  // Check default template
  return customizerTemplates.some(
    (t) => t.isActive && 
    t.subCategoryId === item.subCategoryId && 
    (!t.menuItemIds || t.menuItemIds.length === 0)
  );
};
```

## How to Use

### 1. Run Database Migration
```sql
-- In Supabase SQL Editor, run:
-- database-migrations/add_menu_item_ids_to_customizer_templates.sql
```

### 2. Create/Edit Templates

**Default Template (All Items)**:
1. Go to Admin → Customization Editor
2. Create new template or edit existing
3. Select sub-category
4. Leave "Menu Items" checkboxes empty
5. Save → Applies to ALL items in sub-category

**Item-Specific Template**:
1. Go to Admin → Customization Editor
2. Create new template or edit existing
3. Select sub-category
4. Check specific menu items you want
5. Save → Applies ONLY to selected items

### 3. Testing

**Test Scenario 1**: Default behavior unchanged
- Create template with no items selected
- Verify all items in sub-category show CUSTOMIZE button
- Verify customizer opens correctly

**Test Scenario 2**: Item-specific template
- Create template and select specific items
- Verify ONLY selected items show CUSTOMIZE button
- Verify correct template is used when customizing

**Test Scenario 3**: Mixed templates
- Create default template for sub-category
- Create item-specific template for one item
- Verify item uses specific template
- Verify other items use default template

## Benefits

✅ **Backward Compatible** - Existing templates work without changes
✅ **Flexible** - Can have sub-category defaults with item-specific overrides
✅ **No Duplication** - Share one template across many items, customize others
✅ **Clean UX** - Simple checkbox interface in admin
✅ **Performance** - GIN index for efficient array queries

## Technical Notes

- Empty `menu_item_ids` array is stored as `NULL` in database for clarity
- Helper functions use memoization (useCallback) for performance
- Priority system ensures correct template is always selected
- All template lookups updated consistently across codebase

## Files Modified

1. `database-migrations/add_menu_item_ids_to_customizer_templates.sql` - NEW
2. `ITEM_SPECIFIC_TEMPLATES_IMPLEMENTATION.md` - NEW (this file)
3. `client/lib/supabase.ts` - Updated interface
4. `client/hooks/useSupabase.ts` - Updated transform, create, update
5. `client/components/admin/CustomizationEditorForm.tsx` - Added UI
6. `client/pages/Admin.tsx` - Added prop
7. `client/pages/Order.tsx` - Added helper, updated lookups
8. `client/components/dialog_components/MenuItemDialog.tsx` - Updated lookup
9. `client/pages/Menu.tsx` - Updated hasCustomizer

## Migration Path

For existing systems:
1. Run SQL migration (adds column, defaults to NULL)
2. No code changes needed - backward compatible
3. All existing templates continue working (NULL = default behavior)
4. Start assigning items to templates as needed
