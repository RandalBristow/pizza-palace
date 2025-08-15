import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
// Removed hook imports - data will be passed as props
import SubCategoryForm from "./SubCategoryForm";
import CategorySizesForm from "./CategorySizesForm";

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

interface MenuCategoryFormProps {
  categories: Category[];
  subCategories?: SubCategory[];
  menuItems?: any[];
  toppingCategories?: any[];
  categorySizes: CategorySize[];
  subCategorySizes: any[];
  createCategory: (category: any) => Promise<any>;
  updateCategory: (id: string, updates: any) => Promise<any>;
  deleteCategory: (id: string) => Promise<void>;
  createSubCategory?: (subCategory: any) => Promise<any>;
  updateSubCategory?: (id: string, updates: any) => Promise<any>;
  deleteSubCategory?: (id: string) => Promise<void>;
  createCategorySize: (categorySize: any) => Promise<any>;
  updateCategorySize: (id: string, updates: any) => Promise<any>;
  deleteCategorySize: (id: string) => Promise<void>;
  updateSubCategorySizes: (
    subCategoryId: string,
    sizeIds: string[],
  ) => Promise<void>;
}

export default function MenuCategoryForm({
  categories,
  subCategories = [],
  menuItems = [],
  toppingCategories = [],
  categorySizes,
  subCategorySizes,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createCategorySize,
  updateCategorySize,
  deleteCategorySize,
  updateSubCategorySizes,
}: MenuCategoryFormProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    isActive: true,
    order: 1,
  });

  const handleAddCategory = async () => {
    try {
      await createCategory(newCategory);
      setIsAddingCategory(false);
      setNewCategory({ name: "", isActive: true, order: 1 });
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name || "",
      isActive: category.isActive ?? true,
      order: category.order || 1,
    });
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory.id, newCategory);
      setEditingCategory(null);
      setNewCategory({ name: "", isActive: true, order: 1 });
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const canDeleteCategory = (categoryId: string) => {
    const hasMenuItems = menuItems.some((item) => item.category === categoryId);
    const hasToppingCategories = toppingCategories.some(
      (tc) => tc.menuItemCategory === categoryId,
    );
    return !hasMenuItems && !hasToppingCategories;
  };

  const handleDeleteCategory = async (id: string) => {
    if (!canDeleteCategory(id)) {
      alert(
        "Cannot delete category: It has related menu items or topping categories. Please remove them first.",
      );
      return;
    }

    try {
      await deleteCategory(id);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    try {
      await updateCategory(id, { ...category, isActive: !category.isActive });
    } catch (error) {
      console.error("Failed to toggle category status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Menu Categories
        </h2>
      </div>

      <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Menu Categories</h3>
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new menu category
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Appetizers"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryOrder">Display Order</Label>
                    <Input
                      id="categoryOrder"
                      type="number"
                      placeholder="1"
                      value={newCategory.order}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          order: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategory({ name: "", isActive: true, order: 1 });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddCategory}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Category
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge
                        className={
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCategoryStatus(category.id)}
                            >
                              {category.isActive ? (
                                <ThumbsUp className="h-4 w-4" />
                              ) : (
                                <ThumbsDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {category.isActive ? "Deactivate" : "Activate"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Category</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!canDeleteCategory(category.id)}
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {canDeleteCategory(category.id)
                              ? "Delete Category"
                              : "Cannot delete: Has related items"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Category Dialog */}
          <Dialog
            open={editingCategory !== null}
            onOpenChange={(open) => !open && setEditingCategory(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editCategoryName">Category Name</Label>
                  <Input
                    id="editCategoryName"
                    placeholder="e.g., Appetizers"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editCategoryOrder">Display Order</Label>
                  <Input
                    id="editCategoryOrder"
                    type="number"
                    placeholder="1"
                    value={newCategory.order}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategory({ name: "", isActive: true, order: 1 });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCategory}>
                    <Save className="h-4 w-4 mr-2" />
                    Update Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
      </div>
    </div>
  );
}
