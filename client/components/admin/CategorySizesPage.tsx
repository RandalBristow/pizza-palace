import { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, Save } from "lucide-react";
import CategorySizesForm from "./CategorySizesForm";
import { Category } from "./MenuCategoryForm";

interface CategorySizesPageProps {
  categories: Category[];
  categorySizes: any[];
  createCategorySize: (categorySize: any) => Promise<any>;
  updateCategorySize: (id: string, updates: any) => Promise<any>;
  deleteCategorySize: (id: string) => Promise<void>;
}

export default function CategorySizesPage({
  categories,
  categorySizes,
  createCategorySize,
  updateCategorySize,
  deleteCategorySize,
}: CategorySizesPageProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [newSize, setNewSize] = useState({
    categoryId: "",
    sizeName: "",
    displayOrder: 1,
    isActive: true,
  });

  // Filter sizes by category
  const filteredCategorySizes = selectedCategoryFilter === "all"
    ? categorySizes
    : categorySizes.filter(size => size.categoryId === selectedCategoryFilter);

  const handleAddSize = async () => {
    try {
      await createCategorySize(newSize);
      setIsAddingSize(false);
      setNewSize({
        categoryId: "",
        sizeName: "",
        displayOrder: 1,
        isActive: true,
      });
    } catch (error) {
      console.error("Failed to create category size:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Category Sizes</h2>
          <p className="text-gray-600 mt-1">
            Manage sizes for each menu category (e.g., Small, Medium, Large)
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

      <CategorySizesForm
        categories={categories}
        categorySizes={filteredCategorySizes}
        createCategorySize={createCategorySize}
        updateCategorySize={updateCategorySize}
        deleteCategorySize={deleteCategorySize}
        showTitle={false}
      />
    </div>
  );
}
