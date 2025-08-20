import { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CategorySizesForm from "./CategorySizesForm";
import { Category } from "./MenuCategoryForm";

interface CategorySizesPageProps {
  categories: Category[];
  subCategories: any[];
  categorySizes: any[];
  categorySizeSubCategories?: any[];
  createCategorySize: (categorySize: any) => Promise<any>;
  updateCategorySize: (id: string, updates: any) => Promise<any>;
  deleteCategorySize: (id: string) => Promise<void>;
  updateCategorySizeSubCategories?: (
    sizeId: string,
    subCategoryIds: string[],
  ) => Promise<void>;
}

export default function CategorySizesPage({
  categories,
  subCategories,
  categorySizes,
  categorySizeSubCategories = [],
  createCategorySize,
  updateCategorySize,
  deleteCategorySize,
  updateCategorySizeSubCategories,
}: CategorySizesPageProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Filter sizes by category
  const filteredCategorySizes =
    selectedCategoryFilter === "all"
      ? categorySizes
      : categorySizes.filter(
          (size) => size.categoryId === selectedCategoryFilter,
        );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Category Sizes</h2>
          <p className="text-gray-600 mt-1">
            Manage sizes for categories and assign them to sub-categories. Each size can be used by multiple sub-categories within the same category.
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
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CategorySizesForm
        categories={categories}
        subCategories={subCategories}
        categorySizes={filteredCategorySizes}
        categorySizeSubCategories={categorySizeSubCategories}
        createCategorySize={createCategorySize}
        updateCategorySize={updateCategorySize}
        deleteCategorySize={deleteCategorySize}
        updateCategorySizeSubCategories={updateCategorySizeSubCategories}
        showTitle={false}
        hideAddButton={false}
      />
    </div>
  );
}
