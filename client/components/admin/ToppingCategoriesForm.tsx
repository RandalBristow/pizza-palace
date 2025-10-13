import { useState } from "react";
import { Button } from "../ui/button";
import ActivationButton from "../shared_components/ActivationButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import SingleItemCard from "../shared_components/SingleItemCard";
import ToppingCategoryDialog from "../dialog_components/ToppingCategoryDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import { Plus } from "lucide-react";
import { Category } from "./MenuCategoriesForm";

export interface ToppingCategory {
  id: string;
  name: string;
  menuItemCategory: string;
  order: number;
  isActive: boolean;
}

interface ToppingCategoryFormProps {
  toppingCategories: ToppingCategory[];
  categories: Category[];
  toppings?: any[];
  selectedToppingCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  createToppingCategory: (toppingCategory: any) => Promise<any>;
  updateToppingCategory: (id: string, updates: any) => Promise<any>;
  deleteToppingCategory: (id: string) => Promise<void>;
  showTitle?: boolean;
  hideAddButton?: boolean;
}

export default function ToppingCategoryForm({
  toppingCategories,
  categories,
  toppings = [],
  selectedToppingCategory,
  onSelectedCategoryChange,
  createToppingCategory,
  updateToppingCategory,
  deleteToppingCategory,
  showTitle = true,
  hideAddButton = false,
}: ToppingCategoryFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingToppingCategory, setEditingToppingCategory] =
    useState<ToppingCategory | null>(null);

  const handleSave = async (toppingCategoryData: any) => {
    if (editingToppingCategory) {
      await updateToppingCategory(
        editingToppingCategory.id,
        toppingCategoryData,
      );
    } else {
      await createToppingCategory(toppingCategoryData);
    }
    setEditingToppingCategory(null);
  };

  const handleEditToppingCategory = (toppingCategory: ToppingCategory) => {
    setEditingToppingCategory(toppingCategory);
    setIsDialogOpen(true);
  };

  const canDeleteToppingCategory = (toppingCategoryId: string) => {
    const hasToppings = toppings.some(
      (topping) => topping.category === toppingCategoryId,
    );
    return !hasToppings;
  };

  const handleDeleteToppingCategory = async (id: string) => {
    if (!canDeleteToppingCategory(id)) {
      alert(
        "Cannot delete topping category: It has related topping items. Please remove them first.",
      );
      return;
    }
    try {
      await deleteToppingCategory(id);
    } catch (error) {
      console.error("Failed to delete topping category:", error);
    }
  };

  const toggleToppingCategoryStatus = async (id: string) => {
    const toppingCategory = toppingCategories.find((cat) => cat.id === id);
    if (!toppingCategory) return;

    try {
      await updateToppingCategory(id, {
        ...toppingCategory,
        isActive: !toppingCategory.isActive,
      });
    } catch (error) {
      console.error("Failed to toggle topping category status:", error);
    }
  };

  const filteredToppingCategories =
    selectedToppingCategory === "all"
      ? toppingCategories
      : toppingCategories.filter(
          (cat) => cat.menuItemCategory === selectedToppingCategory,
        );

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        {showTitle && (
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Topping Categories</h2>
            <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Organize toppings into categories for better menu management
            </p>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Select
            value={selectedToppingCategory}
            onValueChange={onSelectedCategoryChange}
          >
            <SelectTrigger 
              className="w-48"
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
            >
              <SelectValue placeholder="Filter by menu category" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
              <SelectItem value="all" style={{ color: 'var(--popover-foreground)' }}>All Menu Categories</SelectItem>
              {categories
                .filter((c) => c.isActive)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id} style={{ color: 'var(--popover-foreground)' }}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!hideAddButton && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
              Add Topping Category
            </Button>
          )}
        </div>
      </div>

      {filteredToppingCategories.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: 'var(--muted-foreground)' }}>No topping categories yet.</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Create topping categories to organize your toppings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryToppingCategories = filteredToppingCategories.filter(
              (tc) => tc.menuItemCategory === category.id,
            );
            if (categoryToppingCategories.length === 0) return null;

            return (
              <div key={category.id} className="rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
                <h4 className="font-semibold text-lg mb-3 flex items-center" style={{ color: 'var(--card-foreground)' }}>
                  {category.name}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categoryToppingCategories
                    .sort((a, b) => a.order - b.order)
                    .map((toppingCategory) => (
                      <SingleItemCard
                        key={toppingCategory.id}
                        title={toppingCategory.name}
                        displayOrder={toppingCategory.order}
                        isActive={toppingCategory.isActive}
                        rightActions={
                          <>
                            <ActivationButton
                              isActive={toppingCategory.isActive}
                              onToggle={() => toggleToppingCategoryStatus(toppingCategory.id)}
                              activeTooltip="Deactivate"
                              inactiveTooltip="Activate"
                            />
                            <EditButton
                              label="Edit Category"
                              onClick={() => handleEditToppingCategory(toppingCategory)}
                            />
                            <DeleteButton
                              entityTitle="Topping Category"
                              subjectName={toppingCategory.name}
                              canDelete={canDeleteToppingCategory(toppingCategory.id)}
                              tooltipWhenAllowed="Delete Category"
                              tooltipWhenBlocked="Cannot Delete: Has Related Items"
                              onConfirm={() => handleDeleteToppingCategory(toppingCategory.id)}
                            />
                          </>
                        }
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ToppingCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingToppingCategory(null);
        }}
        toppingCategory={editingToppingCategory}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  );
}
