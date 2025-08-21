import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
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
import { Plus, Save, Settings, Ruler } from "lucide-react";
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
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sizeName, setSizeName] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  // Reset form
  const resetForm = () => {
    setSelectedCategoryId("");
    setSizeName("");
    setDisplayOrder(1);
    setSelectedSubCategories([]);
  };

  // Handle adding new size
  const handleAddSize = async () => {
    if (
      !selectedCategoryId ||
      !sizeName ||
      selectedSubCategories.length === 0
    ) {
      return;
    }

    try {
      const newSize = await createCategorySize({
        categoryId: selectedCategoryId,
        sizeName,
        displayOrder,
        isActive: true,
      });

      // Link the size to selected sub-categories
      if (updateCategorySizeSubCategories && newSize?.id) {
        await updateCategorySizeSubCategories(
          newSize.id,
          selectedSubCategories,
        );
      }

      setIsAddingSize(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create category size:", error);
    }
  };

  // Get sub-categories for selected category
  const availableSubCategories = selectedCategoryId
    ? subCategories.filter((sub: any) => sub.categoryId === selectedCategoryId)
    : [];

  // Render the unified form
  const renderSizeForm = () => (
    <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
      {/* Left Column - Size Details */}
      <div className="p-6 pl-8 border-r border-gray-200 space-y-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Category Size
          </h2>
          <p className="text-sm text-gray-500">
            Create a new size and assign it to sub-categories
          </p>
        </div>

        {/* Category Selection */}
        <div>
          <Label htmlFor="category" className="text-red-600">
            * Category
          </Label>
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => {
              setSelectedCategoryId(value);
              setSelectedSubCategories([]); // Reset sub-category selection
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
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

        {/* Size Name */}
        <div>
          <Label htmlFor="sizeName" className="text-red-600">
            * Size Name
          </Label>
          <Input
            id="sizeName"
            value={sizeName}
            onChange={(e) => setSizeName(e.target.value)}
            placeholder="e.g., Small, Medium, Large"
            required
          />
        </div>

        {/* Display Order */}
        <div>
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
            placeholder="1"
            min="1"
          />
        </div>
      </div>

      {/* Right Column - Sub-Category Selection */}
      <div className="p-6 pr-8 space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Sub-Categories
          </h3>
          <p className="text-sm text-gray-500">
            Select which sub-categories this size applies to
          </p>
        </div>

        {selectedCategoryId ? (
          <div className="space-y-4">
            {availableSubCategories.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                <div className="text-sm font-medium text-gray-700">
                  Available Sub-Categories:
                </div>
                <div className="space-y-2">
                  {availableSubCategories.map((subCategory: any) => (
                    <div
                      key={subCategory.id}
                      className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`subcategory-${subCategory.id}`}
                        checked={selectedSubCategories.includes(subCategory.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSubCategories([
                              ...selectedSubCategories,
                              subCategory.id,
                            ]);
                          } else {
                            setSelectedSubCategories(
                              selectedSubCategories.filter(
                                (id) => id !== subCategory.id,
                              ),
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`subcategory-${subCategory.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{subCategory.name}</div>
                        <div className="text-sm text-gray-500">
                          Order: {subCategory.displayOrder}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 border rounded-lg">
                <div className="text-center">
                  <Ruler className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No sub-categories available</p>
                  <p className="text-sm">
                    Create sub-categories for this category first
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Select a category to view sub-categories</p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setIsAddingSize(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSize}
            disabled={
              !selectedCategoryId ||
              !sizeName ||
              selectedSubCategories.length === 0
            }
          >
            <Save className="h-4 w-4 mr-2" />
            Save Size
          </Button>
        </div>
      </div>
    </div>
  );

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
            Manage sizes for categories and assign them to sub-categories. Each
            size can be used by multiple sub-categories within the same
            category.
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
          <Dialog open={isAddingSize} onOpenChange={setIsAddingSize}>
            <DialogTrigger asChild>
              <Button disabled={categories.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl h-[calc(80vh)] flex flex-col p-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Category Size</DialogTitle>
                <DialogDescription>
                  Create a new size and assign it to sub-categories
                </DialogDescription>
              </DialogHeader>
              {renderSizeForm()}
            </DialogContent>
          </Dialog>
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
        hideAddButton={true}
      />
    </div>
  );
}
