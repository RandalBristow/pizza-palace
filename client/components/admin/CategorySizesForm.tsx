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

interface CategorySizesFormProps {
  categories: Category[];
  categorySizes: CategorySize[];
  createCategorySize: (categorySize: any) => Promise<any>;
  updateCategorySize: (id: string, updates: any) => Promise<any>;
  deleteCategorySize: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function CategorySizesForm({
  categories,
  categorySizes,
  createCategorySize,
  updateCategorySize,
  deleteCategorySize,
  showTitle = true,
  hideAddButton = false,
}: CategorySizesFormProps) {
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [editingSize, setEditingSize] = useState<CategorySize | null>(null);
  const [newSize, setNewSize] = useState({
    categoryId: "",
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
      categoryId: size.categoryId || "",
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

  const resetForm = () => {
    setNewSize({
      categoryId: "",
      sizeName: "",
      displayOrder: 1,
      isActive: true,
    });
  };

  const renderSizeForm = (isEdit: boolean = false) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sizeCategory">Category</Label>
        <Select
          value={newSize.categoryId}
          onValueChange={(value) =>
            setNewSize({ ...newSize, categoryId: value })
          }
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
        <Label htmlFor="sizeName">Size Name</Label>
        <Input
          id="sizeName"
          placeholder='e.g., 12", Large, 5-Piece'
          value={newSize.sizeName}
          onChange={(e) => setNewSize({ ...newSize, sizeName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="sizeDisplayOrder">Display Order</Label>
        <Input
          id="sizeDisplayOrder"
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
          disabled={!newSize.sizeName || !newSize.categoryId}
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
              <Button disabled={categories.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Size</DialogTitle>
                <DialogDescription>
                  Create a new size for a category (e.g., pizza sizes, wing
                  portions)
                </DialogDescription>
              </DialogHeader>
              {renderSizeForm(false)}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Sizes List */}
      <div className="bg-white rounded-lg border p-6">
        {categorySizes.length === 0 ? (
          <div className="text-center py-8">
            <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sizes defined yet.</p>
            <p className="text-sm text-gray-400">
              Add sizes for your menu categories.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const categorySizeList = categorySizes
                .filter((size) => size.categoryId === category.id)
                .sort((a, b) => a.displayOrder - b.displayOrder);

              if (categorySizeList.length === 0) return null;

              return (
                <div key={category.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-purple-600" />
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categorySizeList.map((size) => (
                      <Card key={size.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{size.sizeName}</h5>
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
                                      onClick={() => toggleSizeStatus(size.id)}
                                    >
                                      {size.isActive ? (
                                        <ThumbsUp className="h-4 w-4" />
                                      ) : (
                                        <ThumbsDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {size.isActive ? "Deactivate" : "Activate"}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Size</DialogTitle>
            <DialogDescription>Update the size details</DialogDescription>
          </DialogHeader>
          {renderSizeForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
