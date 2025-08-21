import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function MenuCategorySize({ size, toggleSizeStatus, handleEditSize, handleDeleteSize, getLinkedSubCategories}) {
  return (
    <Card key={size.id}>
      <CardContent className="p-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Badge className="h-5 min-w-5 rounded-full font-mono tabular-nums bg-white border border-gray-900 text-gray-900">
              {size.displayOrder}
            </Badge>
            <h6 className="font-medium">{size.sizeName}</h6>
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
        </div>
        <div className="text-xs text-gray-600 mb-1">
          <strong>Sub-categories:</strong>{" "}
          {getLinkedSubCategories(size.id) || "None"}
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuCategorySize;
