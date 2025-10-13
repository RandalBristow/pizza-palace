import { useState } from "react";
import MenuCategorySizeDialog from "../dialog_components/MenuCategorySizeDialog";
import SingleItemCard from "../shared_components/SingleItemCard";
import ActivationButton from "../shared_components/ActivationButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import AddButton from "../shared_components/AddButton";

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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<CategorySize | null>(null);

  // Filter category sizes by category
  const filteredCategorySizes =
    selectedCategoryFilter === "all"
      ? categorySizes
      : categorySizes.filter(
          (size) => size.categoryId === selectedCategoryFilter,
        );

  // Get linked sub-categories for a size
  const getLinkedSubCategories = (sizeId: string) => {
    const linkedSubCategoryIds = categorySizeSubCategories
      .filter((link) => link.categorySizeId === sizeId)
      .map((link) => link.subCategoryId);

    return subCategories.filter((sub) => linkedSubCategoryIds.includes(sub.id));
  };

  // Handle saving (both add and edit)
  const handleSave = async (sizeData: any, selectedSubCategories: string[]) => {
    if (editingSize) {
      // Update existing size
      await updateCategorySize(editingSize.id, sizeData);

      // Update sub-category associations
      if (updateCategorySizeSubCategories) {
        await updateCategorySizeSubCategories(
          editingSize.id,
          selectedSubCategories,
        );
      }
    } else {
      // Create new size
      const newSize = await createCategorySize(sizeData);

      // Link the size to selected sub-categories
      if (updateCategorySizeSubCategories && newSize?.id) {
        await updateCategorySizeSubCategories(
          newSize.id,
          selectedSubCategories,
        );
      }
    }
    setEditingSize(null);
  };

  // Handle editing size
  const handleEditSize = (size: CategorySize) => {
    setEditingSize(size);
    setIsDialogOpen(true);
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

  return (
    <div className="space-y-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Category Sizes
            </h2>
            <p className="mt-1" style={{ color: "var(--muted-foreground)" }}>
              Manage sizes for categories and assign them to sub-categories.
              Each size can be used by multiple sub-categories within the same
              category.
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedCategoryFilter}
            onValueChange={setSelectedCategoryFilter}
          >
            <SelectTrigger
              className="w-48"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                const target = e.target as HTMLElement;
                target.style.boxShadow = "none";
              }}
            >
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: "var(--popover)",
                borderColor: "var(--border)",
              }}
            >
              <SelectItem
                value="all"
                style={{ color: "var(--popover-foreground)" }}
              >
                All Categories
              </SelectItem>
              {categories
                .filter((c) => c.isActive)
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    style={{ color: "var(--popover-foreground)" }}
                  >
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!hideAddButton && (
            <AddButton
              label="Add Size"
              onClick={() => setIsDialogOpen(true)}
              disabled={categories.length === 0}
            />
          )}
        </div>
      </div>

      {/* Category Sizes List */}
      {filteredCategorySizes.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: "var(--muted-foreground)" }}>No sizes yet.</p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Create sizes for your categories.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const categorySizesForCategory = filteredCategorySizes.filter(
              (size) => size.categoryId === category.id,
            );

            if (categorySizesForCategory.length === 0) return null;

            return (
              <div
                key={category.id}
                className="rounded-lg p-4"
                style={{ border: "1px solid var(--border)" }}
              >
                <h4
                  className="font-semibold text-lg mb-3 flex items-center"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {category.name}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categorySizesForCategory
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((size) => (
                      <SingleItemCard
                        title={size.sizeName}
                        displayOrder={size.displayOrder}
                        isActive={size.isActive}
                        rightActions={
                          <>
                            <ActivationButton
                              isActive={size.isActive}
                              onToggle={() => toggleSizeStatus(size.id)}
                              activeTooltip="Deactivate"
                              inactiveTooltip="Activate"
                            />
                            <EditButton label="Edit Size" onClick={() => handleEditSize(size)} />
                            <DeleteButton
                              entityTitle="Size"
                              subjectName={size.sizeName}
                              tooltipWhenAllowed="Delete Size"
                              tooltipWhenBlocked="Cannot Delete: Has Related Items"
                              onConfirm={() => handleDeleteSize(size.id)}
                            />
                          </>
                        }
                        subTitle={
                          <span>
                            <strong>Sub-Categories: </strong>
                            {getLinkedSubCategories(size.id).length > 0
                              ? getLinkedSubCategories(size.id).map((s) => s.name).join(", ")
                              : "None"}
                          </span>
                        }
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MenuCategorySizeDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingSize(null);
        }}
        categorySize={editingSize}
        categories={categories}
        subCategories={subCategories}
        categorySizeSubCategories={categorySizeSubCategories}
        onSave={handleSave}
      />
    </div>
  );
}
