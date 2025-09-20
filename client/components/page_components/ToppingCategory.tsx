import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";

export interface ToppingCategory {
  id: string;
  name: string;
  menuItemCategory: string;
  order: number;
  isActive: boolean;
}

interface ToppingCategoryProps {
  toppingCategory: ToppingCategory;
  toggleToppingCategoryStatus: (id: string) => Promise<void>;
  handleEditToppingCategory: (toppingCategory: ToppingCategory) => void;
  handleDeleteToppingCategory: (id: string) => Promise<void>;
  canDeleteToppingCategory: (id: string) => boolean;
}

export default function ToppingCategory({
  toppingCategory,
  toggleToppingCategoryStatus,
  handleEditToppingCategory,
  handleDeleteToppingCategory,
  canDeleteToppingCategory,
}: ToppingCategoryProps) {
  return (
    <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h6 className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{toppingCategory.name}</h6>
          <Badge
            style={{
              backgroundColor: toppingCategory.isActive ? '#bbf7d0' : '#fecaca',
              color: toppingCategory.isActive ? '#14532d' : '#991b1b',
              border: '1px solid var(--border)'
            }}
          >
            {toppingCategory.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
          <p><strong style={{ color: 'var(--muted-foreground)' }}>Order:</strong> {toppingCategory.order}</p>
        </div>

        <div className="flex justify-end items-center mt-auto">
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleToppingCategoryStatus(toppingCategory.id)}
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)'
                    }}
                  >
                    {toppingCategory.isActive ? (
                      <ThumbsUp className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    ) : (
                      <ThumbsDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
                  {toppingCategory.isActive ? "Deactivate" : "Activate"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditToppingCategory(toppingCategory)}
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)'
                    }}
                  >
                    <Edit className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
                  Edit Category
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteToppingCategory(toppingCategory.id)}
                    disabled={!canDeleteToppingCategory(toppingCategory.id)}
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                      opacity: !canDeleteToppingCategory(toppingCategory.id) ? 0.5 : 1
                    }}
                  >
                    <Trash2 className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
                  Delete Category
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}