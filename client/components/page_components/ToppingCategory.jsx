import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

function ToppingCategory({
  toppingCategory,
  toggleToppingCategoryStatus,
  handleEditToppingCategory,
  handleDeleteToppingCategory,
  canDeleteToppingCategory,
}) {
  return (
    <Card
      key={toppingCategory.id}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        border: "1px solid var(--border)",
      }}
    >
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3
                className="font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                {toppingCategory.name}
              </h3>
              <Badge
                className={
                  toppingCategory.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
                style={{
                  backgroundColor: toppingCategory.isActive ? "#bbf7d0" : "#fecaca",
                  color: toppingCategory.isActive ? "#14532d" : "#991b1b",
                  border: "1px solid var(--border)",
                }}
              >
                {toppingCategory.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleToppingCategoryStatus(toppingCategory.id)
                    }
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--muted-foreground)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "var(--accent)";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "var(--card)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    {toppingCategory.isActive ? (
                      <ThumbsUp
                        className="h-4 w-4"
                        style={{ color: "var(--muted-foreground)" }}
                      />
                    ) : (
                      <ThumbsDown
                        className="h-4 w-4"
                        style={{ color: "var(--muted-foreground)" }}
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  style={{
                    backgroundColor: "var(--popover)",
                    color: "var(--popover-foreground)",
                  }}
                >
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
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--muted-foreground)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "var(--accent)";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "var(--card)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    <Edit
                      className="h-4 w-4"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  style={{
                    backgroundColor: "var(--popover)",
                    color: "var(--popover-foreground)",
                  }}
                >
                  Edit Topping Category
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canDeleteToppingCategory(toppingCategory.id)}
                    onClick={() =>
                      handleDeleteToppingCategory(toppingCategory.id)
                    }
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--muted-foreground)",
                      opacity: !canDeleteToppingCategory(toppingCategory.id) ? 0.5 : 1,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (canDeleteToppingCategory(toppingCategory.id)) {
                        e.target.style.backgroundColor = "var(--accent)";
                        e.target.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "var(--card)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    <Trash2
                      className="h-4 w-4"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  style={{
                    backgroundColor: "var(--popover)",
                    color: "var(--popover-foreground)",
                  }}
                >
                  {canDeleteToppingCategory(toppingCategory.id)
                    ? "Delete Topping Category"
                    : "Cannot delete: Has related toppings"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ToppingCategory;
