import { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus } from "lucide-react";
import SubCategoryForm from "./SubCategoryForm";
import { Category } from "./MenuCategoryForm";

interface SubCategoriesPageProps {
  categories: Category[];
  subCategories: any[];
  categorySizes: any[];
  subCategorySizes: any[];
  createSubCategory: (subCategory: any) => Promise<any>;
  updateSubCategory: (id: string, updates: any) => Promise<any>;
  deleteSubCategory: (id: string) => Promise<void>;
  updateSubCategorySizes: (subCategoryId: string, sizeIds: string[]) => Promise<void>;
}

export default function SubCategoriesPage({
  categories,
  subCategories,
  categorySizes,
  subCategorySizes,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategorySizes,
}: SubCategoriesPageProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Filter sub-categories by category
  const filteredSubCategories = selectedCategoryFilter === "all" 
    ? subCategories 
    : subCategories.filter(subCat => subCat.categoryId === selectedCategoryFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Sub-Categories</h2>
          <p className="text-gray-600 mt-1">
            Manage sub-categories within menu categories (e.g., Boneless Wings, Traditional Wings)
          </p>
        </div>
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
        </div>
      </div>

      <SubCategoryForm
        categories={categories}
        subCategories={filteredSubCategories}
        categorySizes={categorySizes}
        subCategorySizes={subCategorySizes}
        createSubCategory={createSubCategory}
        updateSubCategory={updateSubCategory}
        deleteSubCategory={deleteSubCategory}
        updateSubCategorySizes={updateSubCategorySizes}
        showTitle={false}
      />
    </div>
  );
}
