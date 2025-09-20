import { useState } from "react";
import MenuCategory from "../page_components/MenuCategory";
import MenuCategoryDialog from "../dialog_components/MenuCategoryDialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  displayOrder: number;
  isActive: boolean;
}

interface MenuCategoryFormProps {
  categories: Category[];
  subCategories?: SubCategory[];
  menuItems?: any[];
  toppingCategories?: any[];
  categorySizes: CategorySize[];
  subCategorySizes: any[];
  createCategory: (category: any) => Promise<any>;
  updateCategory: (id: string, updates: any) => Promise<any>;
  deleteCategory: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export interface CategorySize {
  id: string;
  categoryId: string;
  sizeName: string;
  displayOrder: number;
  isActive: boolean;
}

export default function MenuCategoryForm({
  categories,
  subCategories = [],
  menuItems = [],
  toppingCategories = [],
  categorySizes,
  createCategory,
  updateCategory,
  deleteCategory,
  showTitle = true,
  hideAddButton = false,
}: MenuCategoryFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSave = async (categoryData: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData);
    } else {
      await createCategory(categoryData);
    }
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    try {
      await updateCategory(id, { ...category, isActive: !category.isActive });
    } catch (error) {
      console.error("Failed to toggle category status:", error);
    }
  };

  const canDeleteCategory = (categoryId: string) => {
    const hasMenuItems = menuItems.some((item) => item.category === categoryId);
    const hasSubCategories = subCategories.some(
      (sub) => sub.categoryId === categoryId,
    );
    const hasToppingCategories = toppingCategories.some(
      (tc) => tc.menuItemCategory === categoryId,
    );
    const hasSizes = categorySizes.some(
      (size) => size.categoryId === categoryId,
    );
    return (
      !hasMenuItems && !hasSubCategories && !hasToppingCategories && !hasSizes
    );
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Menu Categories</h2>
            <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Manage main menu categories and their organization
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          {!hideAddButton && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
              Add Category
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((category) => (
          <MenuCategory
            key={category.id}
            category={category}
            toggleCategoryStatus={toggleCategoryStatus}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
            canDeleteCategory={canDeleteCategory}
          />
        ))}
      </div>

      <MenuCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSave}
      />
    </div>
  );
}
