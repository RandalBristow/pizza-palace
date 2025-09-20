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
    <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
      <CardContent className="p-4 flex flex-col h-full">
        {menuItemImage ? (
          <img
            src={menuItemImage.url}
            alt={menuItemImage.altText || menuItem.name}
            className="w-full h-32 object-cover rounded mb-3"
          />
        ) : (
          <div className="w-full h-32 rounded mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
            <Pizza className="h-12 w-12" style={{ color: 'var(--muted-foreground)' }} />
          </div>
        )}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>{menuItem.name}</h3>
            <p className="text-sm line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
              {menuItem.description}
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
              {getMenuItemPrice(menuItem)}
            </p>
          </div>
          <Badge
            className={
              menuItem.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
            style={{
              backgroundColor: menuItem.isActive ? '#bbf7d0' : '#fecaca',
              color: menuItem.isActive ? '#14532d' : '#991b1b',
              border: '1px solid var(--border)'
            }}
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
                    {menuItem.isActive ? (
                      <ThumbsUp className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    ) : (
                      <ThumbsDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
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
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Edit Menu Item</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMenuItem(menuItem.id)}
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
                <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Delete Menu Item</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuItem;
