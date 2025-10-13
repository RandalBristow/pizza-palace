import { useState } from "react";
import MenuSubCategoryDialog from "../dialog_components/MenuSubCategoryDialog";
import ActivationButton from "../shared_components/ActivationButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import SingleItemCard from "../shared_components/SingleItemCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Folder } from "lucide-react";
import AddButton from "../shared_components/AddButton";

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface SubCategoryFormProps {
  categories: Category[];
  subCategories: SubCategory[];
  createSubCategory: (subCategory: any) => Promise<any>;
  updateSubCategory: (id: string, updates: any) => Promise<any>;
  deleteSubCategory: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function SubCategoryForm({
  categories,
  subCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  showTitle = true,
  hideAddButton = false,
}: SubCategoryFormProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  // Filter sub-categories by category
  const filteredSubCategories = selectedCategoryFilter === "all"
    ? subCategories
    : subCategories.filter(subCat => subCat.categoryId === selectedCategoryFilter);

  const handleSave = async (subCategoryData: any) => {
    if (editingSubCategory) {
      await updateSubCategory(editingSubCategory.id, subCategoryData);
    } else {
      await createSubCategory(subCategoryData);
    }
    setEditingSubCategory(null);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setIsDialogOpen(true);
  };

  const handleDeleteSubCategory = async (id: string) => {
    try {
      await deleteSubCategory(id);
    } catch (error) {
      console.error("Failed to delete sub-category:", error);
    }
  };

  const toggleSubCategoryStatus = async (id: string) => {
    const subCategory = subCategories.find((sub) => sub.id === id);
    if (!subCategory) return;

    try {
      await updateSubCategory(id, {
        ...subCategory,
        isActive: !subCategory.isActive,
      });
    } catch (error) {
      console.error("Failed to toggle sub-category status:", error);
    }
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Sub-Categories</h2>
            <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Manage sub-categories within menu categories (e.g., Boneless Wings, Traditional Wings)
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedCategoryFilter}
            onValueChange={setSelectedCategoryFilter}
          >
            <SelectTrigger 
              className="w-48"
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = 'none';
              }}
            >
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
              <SelectItem value="all" style={{ color: 'var(--popover-foreground)' }}>All Categories</SelectItem>
              {categories
                .filter((c) => c.isActive)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id} style={{ color: 'var(--popover-foreground)' }}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!hideAddButton && (
            <AddButton
              label="Add Sub-Category"
              onClick={() => setIsDialogOpen(true)}
              disabled={categories.length === 0}
            />
          )}
        </div>
      </div>

      {/* Sub-Categories List */}
        {filteredSubCategories.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
            <p style={{ color: 'var(--muted-foreground)' }}>No sub-categories yet.</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Create sub-categories to organize your menu items.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const categorySubCategories = filteredSubCategories.filter(
                (sub) => sub.categoryId === category.id,
              );
              if (categorySubCategories.length === 0) return null;

              return (
                <div key={category.id} className="rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold text-lg mb-3 flex items-center" style={{ color: 'var(--card-foreground)' }}>
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categorySubCategories
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((subCategory) => {
                        return (
                          <SingleItemCard
                            title={subCategory.name}
                            displayOrder={subCategory.displayOrder}
                            isActive={subCategory.isActive}
                            rightActions={
                              <>
                                <ActivationButton
                                  isActive={subCategory.isActive}
                                  onToggle={() => toggleSubCategoryStatus(subCategory.id)}
                                  activeTooltip="Deactivate"
                                  inactiveTooltip="Activate"
                                />
                                <EditButton
                                  label="Edit Sub-Category"
                                  onClick={() => handleEditSubCategory(subCategory)}
                                />
                                <DeleteButton
                                  entityTitle="Sub-Category"
                                  subjectName={subCategory.name}
                                  tooltipWhenAllowed="Delete Sub-Category"
                                  tooltipWhenBlocked="Cannot Delete: Has Related Items"
                                  onConfirm={() => handleDeleteSubCategory(subCategory.id)}
                                />
                              </>
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}


      <MenuSubCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingSubCategory(null);
        }}
        subCategory={editingSubCategory}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  );
}
