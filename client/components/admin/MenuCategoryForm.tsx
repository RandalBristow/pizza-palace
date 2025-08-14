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
import { Plus, Edit, Trash2, Save, ThumbsUp, ThumbsDown, Folder, FolderOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCategories } from "../../hooks/useSupabase";

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
  createCategory: (category: any) => Promise<any>;
  updateCategory: (id: string, updates: any) => Promise<any>;
  deleteCategory: (id: string) => Promise<void>;
  createSubCategory?: (subCategory: any) => Promise<any>;
  updateSubCategory?: (id: string, updates: any) => Promise<any>;
  deleteSubCategory?: (id: string) => Promise<void>;
}

export default function MenuCategoryForm({
  categories,
  subCategories = [],
  menuItems = [],
  toppingCategories = [],
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
}: MenuCategoryFormProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    isActive: true,
    order: 1,
  });

  // Sub-category states
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>("");
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    categoryId: "",
    displayOrder: 1,
    isActive: true,
  });

  const handleAddCategory = async () => {
    try {
      await createCategory(newCategory);
      setIsAddingCategory(false);
      setNewCategory({ name: "", isActive: true, order: 1 });
    } catch (error) {
      console.error('Failed to create category:', error);
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
      console.error('Failed to update category:', error);
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
      console.error('Failed to delete category:', error);
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (!category) return;

    try {
      await updateCategory(id, { ...category, isActive: !category.isActive });
    } catch (error) {
      console.error('Failed to toggle category status:', error);
    }
  };

  // Sub-category handlers
  const handleAddSubCategory = async () => {
    if (!createSubCategory) return;

    try {
      await createSubCategory(newSubCategory);
      setIsAddingSubCategory(false);
      setNewSubCategory({ name: "", categoryId: "", displayOrder: 1, isActive: true });
    } catch (error) {
      console.error('Failed to create sub-category:', error);
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
  };

  const handleUpdateSubCategory = async () => {
    if (!editingSubCategory || !updateSubCategory) return;

    try {
      await updateSubCategory(editingSubCategory.id, newSubCategory);
      setEditingSubCategory(null);
      setNewSubCategory({ name: "", categoryId: "", displayOrder: 1, isActive: true });
    } catch (error) {
      console.error('Failed to update sub-category:', error);
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (!deleteSubCategory) return;

    try {
      await deleteSubCategory(id);
    } catch (error) {
      console.error('Failed to delete sub-category:', error);
    }
  };

  const toggleSubCategoryStatus = async (id: string) => {
    if (!updateSubCategory) return;

    const subCategory = subCategories.find(sub => sub.id === id);
    if (!subCategory) return;

    try {
      await updateSubCategory(id, { ...subCategory, isActive: !subCategory.isActive });
    } catch (error) {
      console.error('Failed to toggle sub-category status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Menu Categories & Sub-Categories</h2>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Sub-Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
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
              <DialogDescription>Create a new menu category</DialogDescription>
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
            <DialogDescription>Update the category details</DialogDescription>
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
        </TabsContent>

        <TabsContent value="subcategories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sub-Categories</h3>
            <Dialog open={isAddingSubCategory} onOpenChange={setIsAddingSubCategory}>
              <DialogTrigger asChild>
                <Button disabled={categories.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub-Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Sub-Category</DialogTitle>
                  <DialogDescription>Create a new sub-category within a menu category</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="parentCategory">Parent Category</Label>
                    <select
                      id="parentCategory"
                      className="w-full border rounded px-3 py-2"
                      value={newSubCategory.categoryId}
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, categoryId: e.target.value })}
                    >
                      <option value="">Select a category...</option>
                      {categories.filter(c => c.isActive).map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="subCategoryName">Sub-Category Name</Label>
                    <Input
                      id="subCategoryName"
                      placeholder="e.g., Build Your Own"
                      value={newSubCategory.name}
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subDisplayOrder">Display Order</Label>
                    <Input
                      id="subDisplayOrder"
                      type="number"
                      placeholder="1"
                      value={newSubCategory.displayOrder}
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, displayOrder: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsAddingSubCategory(false);
                      setNewSubCategory({ name: "", categoryId: "", displayOrder: 1, isActive: true });
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSubCategory} disabled={!newSubCategory.name || !newSubCategory.categoryId}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Sub-Category
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Sub-Categories List */}
          <div className="bg-white rounded-lg border p-6">
            {subCategories.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sub-categories yet.</p>
                <p className="text-sm text-gray-400">Create sub-categories to organize your menu items.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map(category => {
                  const categorySubCategories = subCategories.filter(sub => sub.categoryId === category.id);
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
                          .map(subCategory => (
                            <Card key={subCategory.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium">{subCategory.name}</h5>
                                  <Badge className={subCategory.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {subCategory.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">Order: {subCategory.displayOrder}</p>
                                <div className="flex justify-between items-center">
                                  <div className="flex space-x-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="sm" onClick={() => toggleSubCategoryStatus(subCategory.id)}>
                                            {subCategory.isActive ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{subCategory.isActive ? "Deactivate" : "Activate"}</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="sm" onClick={() => handleEditSubCategory(subCategory)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit Sub-Category</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => handleDeleteSubCategory(subCategory.id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Delete Sub-Category</TooltipContent>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
