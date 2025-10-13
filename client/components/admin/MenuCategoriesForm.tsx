import { useState } from "react";
import MenuCategoryDialog from "../dialog_components/MenuCategoryDialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import SingleItemCard from "../shared_components/SingleItemCard";
import ActivationButton from "../shared_components/ActivationButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";

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
    <div className="space-y-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Menu Categories
            </h2>
            <p className="mt-1" style={{ color: "var(--muted-foreground)" }}>
              Manage main menu categories and their organization
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          {!hideAddButton && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderColor: "var(--primary)",
              }}
            >
              <Plus
                className="h-4 w-4 mr-2"
                style={{ color: "var(--primary-foreground)" }}
              />
              Add Category
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <SingleItemCard
            title={category.name}
            isActive={category.isActive}
            rightActions={
              <>
                <ActivationButton
                  isActive={category.isActive}
                  onToggle={() => toggleCategoryStatus(category.id)}
                  activeTooltip="Deactivate"
                  inactiveTooltip="Activate"
                />
                <EditButton
                  label="Edit Category"
                  onClick={() => handleEditCategory(category)}
                />
                <DeleteButton
                  entityTitle="Category"
                  subjectName={category.name}
                  canDelete={canDeleteCategory(category.id)}
                  tooltipWhenAllowed="Delete Category"
                  tooltipWhenBlocked="Cannot Delete: Has Related Items"
                  onConfirm={() => handleDeleteCategory(category.id)}
                />
              </>
            }
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
