import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function MenuSubCategory({ subCategory, toggleSubCategoryStatus, handleEditSubCategory, handleDeleteSubCategory}) {
  return (
    <Card key={subCategory.id}>
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge className="h-5 min-w-5 rounded-full font-mono tabular-nums bg-white border border-gray-900 text-gray-900">
              {subCategory.displayOrder}
            </Badge>
            <h5 className="font-medium">{subCategory.name}</h5>
            <Badge
              className={
                subCategory.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
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
                    >
                      {subCategory.isActive ? (
                        <ThumbsUp className="h-4 w-4" />
                      ) : (
                        <ThumbsDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Sub-Category</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSubCategory(subCategory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Sub-Category</TooltipContent>
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
