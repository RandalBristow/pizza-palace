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
  Folder,
  FolderOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
  subCategorySizes: any[]; // Junction table data
  createSubCategory: (subCategory: any) => Promise<any>;
  updateSubCategory: (id: string, updates: any) => Promise<any>;
  deleteSubCategory: (id: string) => Promise<void>;
  updateSubCategorySizes: (
    subCategoryId: string,
    sizeIds: string[],
  ) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function SubCategoryForm({
  categories,
  subCategories,
  categorySizes,
  subCategorySizes,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategorySizes,
  showTitle = true,
  hideAddButton = false,
}: SubCategoryFormProps) {
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    categoryId: "",
    displayOrder: 1,
    isActive: true,
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleAddSubCategory = async () => {
    try {
      const created = await createSubCategory(newSubCategory);
      if (selectedSizes.length > 0) {
        await updateSubCategorySizes(created.id, selectedSizes);
      }
      setIsAddingSubCategory(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create sub-category:", error);
    }
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setNewSubCategory({
      name: subCategory.name || "",
      categoryId: subCategory.categoryId || "",
      displayOrder: subCategory.displayOrder || 1,
      isActive: subCategory.isActive ?? true,
    });

    // Load existing sizes for this sub-category
    const existingSizes = subCategorySizes
      .filter((scs) => scs.subCategoryId === subCategory.id)
      .map((scs) => scs.categorySizeId);
    setSelectedSizes(existingSizes);
  };

  const handleUpdateSubCategory = async () => {
    if (!editingSubCategory) return;

    try {
      await updateSubCategory(editingSubCategory.id, newSubCategory);
      await updateSubCategorySizes(editingSubCategory.id, selectedSizes);
      setEditingSubCategory(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update sub-category:", error);
    }
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

  const resetForm = () => {
    setNewSubCategory({
      name: "",
      categoryId: "",
      displayOrder: 1,
      isActive: true,
    });
    setSelectedSizes([]);
  };

  const handleSizeToggle = (sizeId: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes((prev) => [...prev, sizeId]);
    } else {
      setSelectedSizes((prev) => prev.filter((id) => id !== sizeId));
    }
  };

  const getAvailableSizes = (categoryId: string) => {
    return categorySizes
      .filter((size) => size.categoryId === categoryId && size.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  const renderSubCategoryForm = (isEdit: boolean = false) => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="parentCategory">Parent Category</Label>
        <Select
          value={newSubCategory.categoryId}
          onValueChange={(value) => {
            setNewSubCategory({ ...newSubCategory, categoryId: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category..." />
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

      <div>
        <Label htmlFor="subCategoryName">Sub-Category Name</Label>
        <Input
          id="subCategoryName"
          placeholder="e.g., Build Your Own, Boneless Wings, Traditional Wings"
          value={newSubCategory.name}
          onChange={(e) =>
            setNewSubCategory({ ...newSubCategory, name: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="subDisplayOrder">Display Order</Label>
        <Input
          id="subDisplayOrder"
          type="number"
          placeholder="1"
          value={newSubCategory.displayOrder}
          onChange={(e) =>
            setNewSubCategory({
              ...newSubCategory,
              displayOrder: parseInt(e.target.value) || 1,
            })
          }
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Sizes for this sub-category will be managed in the Category Sizes section.
          Create the sub-category first, then go to Category Sizes to define which sizes apply to this sub-category.
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingSubCategory(null);
            } else {
              setIsAddingSubCategory(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={isEdit ? handleUpdateSubCategory : handleAddSubCategory}
          disabled={!newSubCategory.name || !newSubCategory.categoryId}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? "Update Sub-Category" : "Save Sub-Category"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {showTitle && <h3 className="text-lg font-medium">Sub-Categories</h3>}
        {!hideAddButton && (
          <Dialog
            open={isAddingSubCategory}
            onOpenChange={setIsAddingSubCategory}
          >
            <DialogTrigger asChild>
              <Button disabled={categories.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sub-Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Sub-Category</DialogTitle>
                <DialogDescription>
                  Create a new sub-category within a menu category and select
                  available sizes
                </DialogDescription>
              </DialogHeader>
              {renderSubCategoryForm(false)}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Sub-Categories List */}
      <div className="bg-white rounded-lg border p-6">
        {subCategories.length === 0 ? (
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
              const categorySubCategories = subCategories.filter(
                (sub) => sub.categoryId === category.id,
              );
              if (categorySubCategories.length === 0) return null;

              return (
                <div key={category.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySubCategories
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((subCategory) => {
                        const subCategorySizeIds = subCategorySizes
                          .filter((scs) => scs.subCategoryId === subCategory.id)
                          .map((scs) => scs.categorySizeId);
                        const subCategorySizeNames = categorySizes
                          .filter((size) =>
                            subCategorySizeIds.includes(size.id),
                          )
                          .map((size) => size.sizeName);

                        return (
                          <Card key={subCategory.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium">
                                  {subCategory.name}
                                </h5>
                                <Badge
                                  className={
                                    subCategory.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {subCategory.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                Order: {subCategory.displayOrder}
                              </p>
                              {subCategorySizeNames.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Sizes:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {subCategorySizeNames.map((sizeName) => (
                                      <Badge
                                        key={sizeName}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {sizeName}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            toggleSubCategoryStatus(
                                              subCategory.id,
                                            )
                                          }
                                        >
                                          {subCategory.isActive ? (
                                            <ThumbsUp className="h-4 w-4" />
                                          ) : (
                                            <ThumbsDown className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {subCategory.isActive
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
                                            handleEditSubCategory(subCategory)
                                          }
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Edit Sub-Category
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteSubCategory(
                                            subCategory.id,
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Delete Sub-Category
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Sub-Category Dialog */}
      <Dialog
        open={editingSubCategory !== null}
        onOpenChange={(open) => !open && setEditingSubCategory(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Sub-Category</DialogTitle>
            <DialogDescription>
              Update the sub-category details and available sizes
            </DialogDescription>
          </DialogHeader>
          {renderSubCategoryForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
