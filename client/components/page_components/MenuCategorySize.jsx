import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function MenuCategorySize({ size, toggleSizeStatus, handleEditSize, handleDeleteSize, getLinkedSubCategories}) {
  return (
    <Card key={size.id} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
      <CardContent className="p-2">
        <div className="flex justify-between items-start">
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
              {size.displayOrder}
            </Badge>
            <h6 className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{size.sizeName}</h6>
            <Badge
              className={
                size.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
              style={{
                backgroundColor: size.isActive ? '#bbf7d0' : '#fecaca',
                color: size.isActive ? '#14532d' : '#991b1b',
                border: '1px solid var(--border)'
              }}
            >
              {size.isActive ? "Active" : "Inactive"}
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
                      onClick={() => toggleSizeStatus(size.id)}
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
                      {size.isActive ? (
                        <ThumbsUp className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                      ) : (
                        <ThumbsDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
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
                  <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Edit Size</TooltipContent>
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
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Delete Size</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
          <strong>Sub-Categories:</strong>{" "}
          {getLinkedSubCategories(size.id).length > 0 
            ? getLinkedSubCategories(size.id).map(sub => sub.name).join(", ")
            : "None"}
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuCategorySize;
