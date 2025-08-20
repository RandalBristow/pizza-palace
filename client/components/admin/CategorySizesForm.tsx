import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  ThumbsUp,
  ThumbsDown,
  Ruler,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CategorySizeSubCategory {
  id: string;
  categorySizeId: string;
  subCategoryId: string;
}

interface CategorySizesFormProps {
  categories: Category[];
  subCategories: SubCategory[];
  categorySizes: CategorySize[];
  categorySizeSubCategories?: CategorySizeSubCategory[];
  createCategorySize: (categorySize: any) => Promise<any>;
  updateCategorySize: (id: string, updates: any) => Promise<any>;
  deleteCategorySize: (id: string) => Promise<void>;
  updateCategorySizeSubCategories?: (
    sizeId: string,
    subCategoryIds: string[],
  ) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function CategorySizesForm({
  categories,
  subCategories,
  categorySizes,
  categorySizeSubCategories = [],
  createCategorySize,
  updateCategorySize,
  deleteCategorySize,
  updateCategorySizeSubCategories,
  showTitle = true,
  hideAddButton = false,
}: CategorySizesFormProps) {
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [editingSize, setEditingSize] = useState<CategorySize | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sizeName, setSizeName] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );

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

  // Handle editing size
  const handleEditSize = (size: CategorySize) => {
    setEditingSize(size);
    setSelectedCategoryId(size.categoryId);
    setSizeName(size.sizeName);
    setDisplayOrder(size.displayOrder);

    // Load existing sub-category associations
    const linkedSubCategories = categorySizeSubCategories
      .filter((link) => link.categorySizeId === size.id)
      .map((link) => link.subCategoryId);
    setSelectedSubCategories(linkedSubCategories);
  };

  // Handle updating size
  const handleUpdateSize = async () => {
    if (
      !editingSize ||
      !selectedCategoryId ||
      !sizeName ||
      selectedSubCategories.length === 0
    ) {
      return;
    }

    try {
      await updateCategorySize(editingSize.id, {
        categoryId: selectedCategoryId,
        sizeName,
        displayOrder,
        isActive: editingSize.isActive,
      });

      // Update sub-category associations
      if (updateCategorySizeSubCategories) {
        await updateCategorySizeSubCategories(
          editingSize.id,
          selectedSubCategories,
        );
      }

      setEditingSize(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update category size:", error);
    }
  };

  // Handle deleting size
  const handleDeleteSize = async (id: string) => {
    try {
      await deleteCategorySize(id);
    } catch (error) {
      console.error("Failed to delete category size:", error);
    }
  };

  // Toggle size status
  const toggleSizeStatus = async (id: string) => {
    const size = categorySizes.find((s) => s.id === id);
    if (!size) return;

    try {
      await updateCategorySize(id, { ...size, isActive: !size.isActive });
    } catch (error) {
      console.error("Failed to toggle size status:", error);
    }
  };

  // Handle sub-category selection
  const handleSubCategoryToggle = (subCategoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubCategories((prev) => [...prev, subCategoryId]);
    } else {
      setSelectedSubCategories((prev) =>
        prev.filter((id) => id !== subCategoryId),
      );
    }
  };

  // Get sub-categories for selected category
  const availableSubCategories = selectedCategoryId
    ? subCategories
        .filter((sub) => sub.categoryId === selectedCategoryId && sub.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  // Get linked sub-categories for a size
  const getLinkedSubCategories = (sizeId: string) => {
    return categorySizeSubCategories
      .filter((link) => link.categorySizeId === sizeId)
      .map((link) => {
        const subCategory = subCategories.find(
          (sub) => sub.id === link.subCategoryId,
        );
        return subCategory?.name || "Unknown";
      })
      .join(", ");
  };

  // Render the unified form
  const renderSizeForm = (isEdit: boolean = false) => (
    <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
      {/* Left Column - Size Details */}
      <div className="p-6 pl-8 border-r border-gray-200 space-y-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Category Size" : "Add New Category Size"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "Update size details and select sub-categories"
              : "Create a new size and assign it to sub-categories"}
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
            placeholder="e.g., Large, 10-Piece, 12 inch"
            value={sizeName}
            onChange={(e) => setSizeName(e.target.value)}
            required
          />
        </div>

        {/* Display Order */}
        <div>
          <Label htmlFor="displayOrder" className="text-red-600">
            * Display Order
          </Label>
          <Input
            id="displayOrder"
            type="number"
            min="1"
            placeholder="1"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
            required
          />
        </div>
      </div>

      {/* Right Column - Sub-Category Selection */}
      <div className="p-6 flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Sub-Category Selection
          </h2>
          <p className="text-sm text-gray-500">
            Select which sub-categories this size applies to
          </p>
        </div>

        {selectedCategoryId ? (
          <div className="flex-1 overflow-hidden">
            {availableSubCategories.length > 0 ? (
              <div className="border rounded-lg p-4 h-full overflow-y-auto">
                <Label className="text-sm font-medium mb-3 block">
                  Available Sub-Categories ({selectedSubCategories.length}{" "}
                  selected)
                </Label>
                <div className="space-y-3">
                  {availableSubCategories.map((subCategory) => (
                    <div
                      key={subCategory.id}
                      className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`subcategory-${subCategory.id}`}
                        checked={selectedSubCategories.includes(subCategory.id)}
                        onCheckedChange={(checked) =>
                          handleSubCategoryToggle(
                            subCategory.id,
                            checked as boolean,
                          )
                        }
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
              if (isEdit) {
                setEditingSize(null);
              } else {
                setIsAddingSize(false);
              }
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={isEdit ? handleUpdateSize : handleAddSize}
            disabled={
              !selectedCategoryId ||
              !sizeName ||
              selectedSubCategories.length === 0
            }
          >
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? "Update Size" : "Save Size"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {showTitle && <h3 className="text-lg font-medium">Category Sizes</h3>}
        {!hideAddButton && (
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
              {renderSizeForm(false)}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Category Sizes List */}
      <div className="bg-white rounded-lg border p-6">
        {categorySizes.length === 0 ? (
          <div className="text-center py-8">
            <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sizes yet.</p>
            <p className="text-sm text-gray-400">
              Create sizes for your categories.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const categorySizesForCategory = categorySizes.filter(
                (size) => size.categoryId === category.id,
              );

              if (categorySizesForCategory.length === 0) return null;

              return (
                <div key={category.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                    {category.name}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySizesForCategory
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((size) => (
                        <Card key={size.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="font-medium">{size.sizeName}</h6>
                              <Badge
                                className={
                                  size.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {size.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              Order: {size.displayOrder}
                            </p>
                            <div className="text-xs text-gray-600 mb-3">
                              <strong>Sub-categories:</strong>{" "}
                              {getLinkedSubCategories(size.id) || "None"}
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          toggleSizeStatus(size.id)
                                        }
                                      >
                                        {size.isActive ? (
                                          <ThumbsUp className="h-4 w-4" />
                                        ) : (
                                          <ThumbsDown className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {size.isActive
                                        ? "Deactivate"
                                        : "Activate"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditSize(size)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Size</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteSize(size.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Size</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Size Dialog */}
      <Dialog
        open={editingSize !== null}
        onOpenChange={(open) => !open && setEditingSize(null)}
      >
        <DialogContent className="max-w-6xl h-[calc(80vh)] flex flex-col p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Category Size</DialogTitle>
            <DialogDescription>
              Update the size details and sub-category assignments
            </DialogDescription>
          </DialogHeader>
          {renderSizeForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
