import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RequiredFieldLabel } from "../ui/required-field-label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Save, Ruler, Settings } from "lucide-react";

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

interface MenuCategorySizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categorySize?: CategorySize | null; // null for add, CategorySize for edit
  categories: Category[];
  subCategories: SubCategory[];
  categorySizeSubCategories: CategorySizeSubCategory[];
  onSave: (sizeData: any, selectedSubCategories: string[]) => Promise<void>;
}

export default function MenuCategorySizeDialog({
  isOpen,
  onClose,
  categorySize,
  categories,
  subCategories,
  categorySizeSubCategories,
  onSave,
}: MenuCategorySizeDialogProps) {
  const [formData, setFormData] = useState({
    categoryId: "",
    sizeName: "",
    displayOrder: 1,
    isActive: true,
  });
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  const isEdit = !!categorySize;

  useEffect(() => {
    if (categorySize) {
      setFormData({
        categoryId: categorySize.categoryId,
        sizeName: categorySize.sizeName,
        displayOrder: categorySize.displayOrder,
        isActive: categorySize.isActive,
      });

      // Load existing sub-category associations
      const linkedSubCategories = categorySizeSubCategories
        .filter((link) => link.categorySizeId === categorySize.id)
        .map((link) => link.subCategoryId);
      setSelectedSubCategories(linkedSubCategories);
    } else {
      setFormData({
        categoryId: "",
        sizeName: "",
        displayOrder: 1,
        isActive: true,
      });
      setSelectedSubCategories([]);
    }
  }, [categorySize, categorySizeSubCategories]);

  const handleSave = async () => {
    try {
      await onSave(formData, selectedSubCategories);
      onClose();
    } catch (error) {
      console.error("Failed to save category size:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      categoryId: "",
      sizeName: "",
      displayOrder: 1,
      isActive: true,
    });
    setSelectedSubCategories([]);
    onClose();
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
  const availableSubCategories = formData.categoryId
    ? subCategories
        .filter((sub) => sub.categoryId === formData.categoryId && sub.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl h-[calc(80vh)] flex flex-col p-0"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle style={{ color: 'var(--card-foreground)' }}>
            {isEdit ? "Edit Category Size" : "Add New Category Size"}
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
            {isEdit
              ? "Update the size details and sub-category assignments"
              : "Create a new size and assign it to sub-categories"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
          {/* Left Column - Size Details */}
          <div className="p-6 pl-8 border-r space-y-4" style={{ borderColor: 'var(--border)' }}>
            <div className="mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                {isEdit ? "Edit Category Size" : "Add New Category Size"}
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {isEdit
                  ? "Update size details and select sub-categories"
                  : "Create a new size and assign it to sub-categories"}
              </p>
            </div>

            {/* Category Selection */}
            <div>
            <RequiredFieldLabel
              htmlFor="category"
              style={{ color: "var(--foreground)" }}
            >
              Category
            </RequiredFieldLabel>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => {
                  setFormData({ ...formData, categoryId: value });
                  setSelectedSubCategories([]); // Reset sub-category selection
                }}
                required
              >
                <SelectTrigger
                  style={{
                    backgroundColor: 'var(--input)',
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = `0 0 0 2px var(--ring)`;
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = 'none';
                  }}
                >
                  <SelectValue 
                    placeholder="Select category..." 
                    style={{ color: 'var(--foreground)' }}
                  />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                  {categories
                    .filter((c) => c.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id} style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Name */}
            <div>
            <RequiredFieldLabel
              htmlFor="sizeName"
              style={{ color: "var(--foreground)" }}
            >
              Size Name
            </RequiredFieldLabel>
              <Input
                id="sizeName"
                placeholder="e.g., Large, 10-Piece, 12 inch"
                value={formData.sizeName}
                onChange={(e) =>
                  setFormData({ ...formData, sizeName: e.target.value })
                }
                required
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = `0 0 0 2px var(--ring)`;
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Display Order */}
            <div>
              <Label htmlFor="displayOrder" style={{ color: 'var(--foreground)' }}>
                Display Order
              </Label>
              <Input
                id="displayOrder"
                type="number"
                min="1"
                placeholder="Display order (e.g., 1)"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 1,
                  })
                }
                required
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted-foreground)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = `0 0 0 2px var(--ring)`;
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Right Column - Sub-Category Selection */}
          <div className="p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                Sub-Category Selection
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Select which sub-categories this size applies to
              </p>
            </div>

            {formData.categoryId ? (
              <div className="flex-1 overflow-hidden">
                {availableSubCategories.length > 0 ? (
                  <div className="rounded-lg p-4 h-full overflow-y-auto" style={{ border: '1px solid var(--border)' }}>
                    <Label className="text-sm font-medium mb-3 block" style={{ color: 'var(--foreground)' }}>
                      Available Sub-Categories ({selectedSubCategories.length}{" "}
                      selected)
                    </Label>
                    <div className="space-y-3">
                      {availableSubCategories.map((subCategory) => (
                        <div
                          key={subCategory.id}
                          className="flex items-center space-x-3 p-2 rounded"
                          style={{ 
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--card)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--accent)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                          }}
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
                            <div className="font-medium" style={{ color: 'var(--card-foreground)' }}>{subCategory.name}</div>
                            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                              Order: {subCategory.displayOrder}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full rounded-lg" style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                    <div className="text-center">
                      <Ruler className="h-12 w-12 mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                      <p>No sub-categories available</p>
                      <p className="text-sm">
                        Create sub-categories for this category first
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full" style={{ color: 'var(--muted-foreground)' }}>
                <div className="text-center">
                  <Settings className="h-12 w-12 mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                  <p>Select a category to view sub-categories</p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = 'var(--accent)';
                  target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = 'var(--card)';
                  target.style.transform = 'scale(1)';
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !formData.categoryId ||
                  !formData.sizeName ||
                  selectedSubCategories.length === 0
                }
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'translateY(-1px)';
                    target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
                {isEdit ? "Update Size" : "Save Size"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}