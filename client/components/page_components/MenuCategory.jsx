// #region MenuCategory Documentation
/**
 * Author: Randy Bristow
 * Date: August 20, 2025
 * Time: 2:55 PM
 * 
 * MenuCategory Component
 * 
 * Displays a single menu category card with its name, status badge, and action buttons.
 * 
 * Props:
 * - category: {
 *     id: string,
 *     name: string,
 *     isActive: boolean
 *   }
 * - toggleCategoryStatus: function(categoryId: string): void
 *     Toggles the active/inactive status of the category.
 * - handleEditCategory: function(category: object): void
 *     Opens the edit form for the category.
 * - handleDeleteCategory: function(categoryId: string): void
 *     Deletes the category.
 * - canDeleteCategory: function(categoryId: string): boolean
 *     Returns true if the category can be deleted (no related items).
 * 
 * Usage:
 * <MenuCategory
 *   category={category}
 *   toggleCategoryStatus={toggleCategoryStatus}
 *   handleEditCategory={handleEditCategory}
 *   handleDeleteCategory={handleDeleteCategory}
 *   canDeleteCategory={canDeleteCategory}
 * />
 */
// #endregion

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip";

function MenuCategory({ category, toggleCategoryStatus, handleEditCategory, handleDeleteCategory, canDeleteCategory}) {
  return (
    <Card key={category.id}>
      <CardContent className="p-2">
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
  );
}

export default MenuCategory;
