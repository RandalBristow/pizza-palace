import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown, Pizza } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

function MenuItem({ menuItem, menuItemImage, getMenuItemPrice, toggleMenuItemStatus, handleEditMenuItem, handleDeleteMenuItem }) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col h-full">
        {menuItemImage ? (
          <img
            src={menuItemImage.url}
            alt={menuItemImage.altText || menuItem.name}
            className="w-full h-32 object-cover rounded mb-3"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
            <Pizza className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{menuItem.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {menuItem.description}
            </p>
            <p className="text-lg font-bold text-green-600">
              {getMenuItemPrice(menuItem)}
            </p>
          </div>
          <Badge
            className={
              menuItem.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {menuItem.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex justify-end items-center mt-auto">
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMenuItemStatus(menuItem.id)}
                  >
                    {menuItem.isActive ? (
                      <ThumbsUp className="h-4 w-4" />
                    ) : (
                      <ThumbsDown className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {menuItem.isActive ? "Deactivate" : "Activate"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditMenuItem(menuItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Menu Item</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMenuItem(menuItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Menu Item</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuItem;
