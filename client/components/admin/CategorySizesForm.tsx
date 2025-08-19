import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
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
  subCategoryId: string; // Changed: now belongs to sub-category
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

interface CategorySizesFormProps {
  categories: Category[];
  subCategories: SubCategory[];
  categorySizes: CategorySize[];
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
  createCategorySize,
  updateCategorySize,
  deleteCategorySize,
  updateCategorySizeSubCategories,
  showTitle = true,
  hideAddButton = false,
}: CategorySizesFormProps) {
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [editingSize, setEditingSize] = useState<CategorySize | null>(null);
  const [managingSize, setManagingSize] = useState<CategorySize | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );
  const [newSize, setNewSize] = useState({
    subCategoryId: "",
    sizeName: "",
    displayOrder: 1,
    isActive: true,
  });

  const handleAddSize = async () => {
    try {
      await createCategorySize(newSize);
      setIsAddingSize(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create category size:", error);
    }
  };

  const handleEditSize = (size: CategorySize) => {
    setEditingSize(size);
    setNewSize({
      subCategoryId: size.subCategoryId || "",
      sizeName: size.sizeName || "",
      displayOrder: size.displayOrder || 1,
      isActive: size.isActive ?? true,
    });
  };

  const handleUpdateSize = async () => {
    if (!editingSize) return;

    try {
      await updateCategorySize(editingSize.id, newSize);
      setEditingSize(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update category size:", error);
    }
  };

  const handleDeleteSize = async (id: string) => {
    try {
      await deleteCategorySize(id);
    } catch (error) {
      console.error("Failed to delete category size:", error);
    }
  };

  const toggleSizeStatus = async (id: string) => {
    const size = categorySizes.find((s) => s.id === id);
    if (!size) return;

    try {
      await updateCategorySize(id, { ...size, isActive: !size.isActive });
    } catch (error) {
      console.error("Failed to toggle size status:", error);
    }
  };

  const handleManageSubCategories = (size: CategorySize) => {
    setManagingSize(size);
    const parentSubCategory = subCategories.find(
      (sub) => sub.id === size.subCategoryId,
    );
    if (parentSubCategory) {
      setSelectedCategory(parentSubCategory.categoryId);
      setSelectedSubCategory(size.subCategoryId);
      // Initialize with the owning sub-category selected
      setSelectedSubCategories([size.subCategoryId]);
    }
  };

  const handleUpdateSizeSubCategories = async () => {
    if (!managingSize || !updateCategorySizeSubCategories) return;

    try {
      await updateCategorySizeSubCategories(
        managingSize.id,
        selectedSubCategories,
      );
      setManagingSize(null);
      resetManageForm();
    } catch (error) {
      console.error("Failed to update size sub-categories:", error);
    }
  };

  const resetForm = () => {
    setNewSize({
      subCategoryId: "",
      sizeName: "",
      displayOrder: 1,
      isActive: true,
    });
  };

  const resetManageForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSubCategories([]);
  };

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
  const availableSubCategories = selectedCategory
    ? subCategories.filter(
        (sub) => sub.categoryId === selectedCategory && sub.isActive,
      )
    : [];

  const renderSizeForm = (isEdit: boolean = false) => (
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
            <SelectValue placeholder="Select sub-category..." />
          </SelectTrigger>
          <SelectContent>
            {subCategories
              .filter((sub) => sub.isActive)
              .map((subCategory) => {
                const parentCategory = categories.find(
                  (c) => c.id === subCategory.categoryId,
                );
                return (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
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
          onChange={(e) => setNewSize({ ...newSize, sizeName: e.target.value })}
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

      <div className="flex justify-end space-x-2">
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
          disabled={!newSize.subCategoryId || !newSize.sizeName}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? "Update Size" : "Save Size"}
        </Button>
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
              <Button disabled={subCategories.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Size</DialogTitle>
                <DialogDescription>
                  Create a new size for a sub-category
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
              Create sizes for your sub-categories.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              // Get sub-categories for this category
              const categorySubCategories = subCategories.filter(
                (sub) => sub.categoryId === category.id,
              );

              // Get sizes for all sub-categories in this category
              const categorySizesForCategory = categorySizes.filter((size) =>
                categorySubCategories.some(
                  (sub) => sub.id === size.subCategoryId,
                ),
              );

              if (categorySizesForCategory.length === 0) return null;

              return (
                <div key={category.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                    {category.name}
                  </h4>

                  {categorySubCategories.map((subCategory) => {
                    const sizesForSubCategory = categorySizes.filter(
                      (size) => size.subCategoryId === subCategory.id,
                    );

                    if (sizesForSubCategory.length === 0) return null;

                    return (
                      <div key={subCategory.id} className="mb-4 ml-4">
                        <h5 className="font-medium text-md mb-2 text-gray-700">
                          {subCategory.name}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {sizesForSubCategory
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .map((size) => (
                              <Card key={size.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h6 className="font-medium">
                                      {size.sizeName}
                                    </h6>
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
                                  <p className="text-sm text-gray-500 mb-3">
                                    Order: {size.displayOrder}
                                  </p>
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
                                              onClick={() =>
                                                handleEditSize(size)
                                              }
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Edit Size
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      {updateCategorySizeSubCategories && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleManageSubCategories(
                                                    size,
                                                  )
                                                }
                                              >
                                                <Settings className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Manage Sub-Categories
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handleDeleteSize(size.id)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Delete Size
                                        </TooltipContent>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Size</DialogTitle>
            <DialogDescription>Update the size details</DialogDescription>
          </DialogHeader>
          {renderSizeForm(true)}
        </DialogContent>
      </Dialog>

      {/* Manage Sub-Categories Dialog */}
      <Dialog
        open={managingSize !== null}
        onOpenChange={(open) => !open && setManagingSize(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Manage Sub-Categories for "{managingSize?.sizeName}"
            </DialogTitle>
            <DialogDescription>
              Select which sub-categories this size should be available for
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categorySelect">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedSubCategory("");
                  setSelectedSubCategories([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
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

            {selectedCategory && availableSubCategories.length > 0 && (
              <div>
                <Label>Available Sub-Categories</Label>
                <div className="mt-2 space-y-2 border rounded-lg p-4 max-h-64 overflow-y-auto">
                  {availableSubCategories.map((subCategory) => (
                    <div
                      key={subCategory.id}
                      className="flex items-center space-x-2"
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
                        className="text-sm"
                      >
                        {subCategory.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setManagingSize(null);
                  resetManageForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSizeSubCategories}
                disabled={selectedSubCategories.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Update Sub-Categories
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
