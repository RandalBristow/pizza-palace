import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function MenuSubCategory({ subCategory, toggleSubCategoryStatus, handleEditSubCategory, handleDeleteSubCategory}) {
  return (
    <Card key={subCategory.id} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge 
              className="h-5 min-w-5 rounded-full font-mono tabular-nums"
              style={{
                backgroundColor: 'var(--accent)',
                borderColor: 'var(--border)',
                color: 'var(--accent-foreground)',
                border: '1px solid var(--border)'
              }}
            >
              {subCategory.displayOrder}
            </Badge>
            <h5 className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{subCategory.name}</h5>
            <Badge
              className={
                subCategory.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
              style={{
                backgroundColor: subCategory.isActive ? '#bbf7d0' : '#fecaca',
                color: subCategory.isActive ? '#14532d' : '#991b1b',
                border: '1px solid var(--border)'
              }}
            >
              {subCategory.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSubCategoryStatus(subCategory.id)}
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
                        target.style.cursor = 'pointer';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target;
                        target.style.backgroundColor = 'var(--card)';
                        target.style.transform = 'scale(1)';
                      }}
                    >
                      {subCategory.isActive ? (
                        <ThumbsUp className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                      ) : (
                        <ThumbsDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
                    {subCategory.isActive ? "Deactivate" : "Activate"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSubCategory(subCategory)}
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
                        target.style.cursor = 'pointer';
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
                  <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Edit Sub-Category</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSubCategory(subCategory.id)}
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
                        target.style.cursor = 'pointer';
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
                  <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Delete Sub-Category</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuSubCategory;
