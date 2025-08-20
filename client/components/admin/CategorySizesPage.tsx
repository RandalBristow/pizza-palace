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
  subCategories: any[];
  categorySizes: any[];
  createCategorySize: (categorySize: any) => Promise<any>;
  updateCategorySize: (id: string, updates: any) => Promise<any>;
  deleteCategorySize: (id: string) => Promise<void>;
  // New function to manage size-to-subcategory relationships
  updateCategorySizeSubCategories?: (
    sizeId: string,
    subCategoryIds: string[],
  ) => Promise<void>;
}

export default function CategorySizesPage({
  categories,
  subCategories,
  categorySizes,
  createCategorySize,
  updateCategorySize,
  deleteCategorySize,
  updateCategorySizeSubCategories,
}: CategorySizesPageProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] =
    useState("all");
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [newSize, setNewSize] = useState({
    subCategoryId: "",
    sizeName: "",
    displayOrder: 1,
    isActive: true,
  });

  // Filter sizes by sub-category (new model: sizes belong to sub-categories)
  const filteredCategorySizes =
    selectedSubCategoryFilter === "all"
      ? categorySizes
      : categorySizes.filter(
          (size) => size.subCategoryId === selectedSubCategoryFilter,
        );

  // Get sub-categories for selected category
  const filteredSubCategories =
    selectedCategoryFilter === "all"
      ? subCategories
      : subCategories.filter(
          (sub) => sub.categoryId === selectedCategoryFilter,
        );

  const handleAddSize = async () => {
    try {
      await createCategorySize(newSize);
      setIsAddingSize(false);
      setNewSize({
        subCategoryId: "",
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
            Manage sizes for sub-categories. Sizes now belong to sub-categories
            and can be assigned to multiple sub-categories.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedCategoryFilter}
            onValueChange={(value) => {
              setSelectedCategoryFilter(value);
              setSelectedSubCategoryFilter("all"); // Reset sub-category when category changes
            }}
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
          <Select
            value={selectedSubCategoryFilter}
            onValueChange={setSelectedSubCategoryFilter}
            disabled={selectedCategoryFilter === "all"}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by sub-category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sub-Categories</SelectItem>
              {filteredSubCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog
            debugName="AddCategorySize"
            open={isAddingSize}
            onOpenChange={setIsAddingSize}
          >
            <DialogTrigger asChild>
              <Button disabled={categories.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Size</DialogTitle>
                <DialogDescription>
                  Create a new size for a sub-category. The size will belong to
                  the selected sub-category.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subCategory">Sub-Category</Label>
                  <Select
                    value={newSize.subCategoryId}
                    onValueChange={(value) =>
                      setNewSize({ ...newSize, subCategoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories
                        .filter((sub) => sub.isActive)
                        .map((subCategory) => {
                          const parentCategory = categories.find(
                            (c) => c.id === subCategory.categoryId,
                          );
                          return (
                            <SelectItem
                              key={subCategory.id}
                              value={subCategory.id}
                            >
                              {parentCategory?.name} → {subCategory.name}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sizeName">Size Name</Label>
                  <Input
                    id="sizeName"
                    placeholder="e.g., Large, 10-Piece, 12 inch"
                    value={newSize.sizeName}
                    onChange={(e) =>
                      setNewSize({ ...newSize, sizeName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    placeholder="1"
                    value={newSize.displayOrder}
                    onChange={(e) =>
                      setNewSize({
                        ...newSize,
                        displayOrder: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> After creating the size, you can
                    assign it to multiple sub-categories using the Category
                    Sizes management section below.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingSize(false);
                      setNewSize({
                        subCategoryId: "",
                        sizeName: "",
                        displayOrder: 1,
                        isActive: true,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSize}
                    disabled={!newSize.subCategoryId || !newSize.sizeName}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Size
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CategorySizesForm
        categories={categories}
        subCategories={subCategories}
        categorySizes={filteredCategorySizes}
        createCategorySize={createCategorySize}
        updateCategorySize={updateCategorySize}
        deleteCategorySize={deleteCategorySize}
        updateCategorySizeSubCategories={updateCategorySizeSubCategories}
        showTitle={false}
        hideAddButton={true}
      />
    </div>
  );
}
