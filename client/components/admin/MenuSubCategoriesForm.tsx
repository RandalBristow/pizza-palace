import { useState } from "react";
import MenuSubCategory from "../page_components/MenuSubCategory";
import MenuSubCategoryDialog from "../dialog_components/MenuSubCategoryDialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Folder,
  FolderOpen,
} from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CategorySize {
  id: string;
  categoryId: string;
  sizeName: string;
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
  categorySizes: CategorySize[];
  subCategorySizes: any[];
  createSubCategory: (subCategory: any) => Promise<any>;
  updateSubCategory: (id: string, updates: any) => Promise<any>;
  deleteSubCategory: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function SubCategoryForm({
  categories,
  subCategories,
  categorySizes,
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold">Sub-Categories</h2>
            <p className="text-gray-600 mt-1">
              Manage sub-categories within menu categories (e.g., Boneless Wings, Traditional Wings)
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedCategoryFilter}
            onValueChange={setSelectedCategoryFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories
                .filter((c) => c.isActive)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!hideAddButton && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              disabled={categories.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Category
            </Button>
          )}
        </div>
      </div>

      {/* Sub-Categories List */}
      <div className="bg-white rounded-lg border p-6">
        {filteredSubCategories.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sub-categories yet.</p>
            <p className="text-sm text-gray-400">
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
                <div key={category.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categorySubCategories
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((subCategory) => {
                        return (
                          <MenuSubCategory
                            key={subCategory.id}
                            subCategory={subCategory}
                            toggleSubCategoryStatus={toggleSubCategoryStatus}
                            handleEditSubCategory={handleEditSubCategory}
                            handleDeleteSubCategory={handleDeleteSubCategory}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
