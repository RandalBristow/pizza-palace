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

function MenuCategory({ category, toggleCategoryStatus, handleEditCategory, handleDeleteCategory, canDeleteCategory }) {
  return (
    <Card key={category.id} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>{category.name}</h3>
            <Badge
              className={
                category.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
              style={{
                backgroundColor: category.isActive ? '#bbf7d0' : '#fecaca',
                color: category.isActive ? '#14532d' : '#991b1b',
                border: '1px solid var(--border)'
              }}
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
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target;
                      target.style.backgroundColor = 'var(--accent)';
                      target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target;
                      target.style.backgroundColor = 'var(--card)';
                      target.style.transform = 'scale(1)';
                    }}
                  >
                    {category.isActive ? (
                      <ThumbsUp className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    ) : (
                      <ThumbsDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
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
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target;
                      target.style.backgroundColor = 'var(--accent)';
                      target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target;
                      target.style.backgroundColor = 'var(--card)';
                      target.style.transform = 'scale(1)';
                    }}
                  >
                    <Edit className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Edit Category</TooltipContent>
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
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                      opacity: !canDeleteCategory(category.id) ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (canDeleteCategory(category.id)) {
                        const target = e.target;
                        target.style.backgroundColor = 'var(--accent)';
                        target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target;
                      target.style.backgroundColor = 'var(--card)';
                      target.style.transform = 'scale(1)';
                    }}
                  >
                    <Trash2 className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
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
