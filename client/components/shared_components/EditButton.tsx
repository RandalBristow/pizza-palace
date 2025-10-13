import React from "react";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export type EditButtonProps = {
  label?: string;
  onClick: () => void | Promise<void>;
  className?: string;
};

export default function EditButton({ label = "Edit", onClick, className = "" }: EditButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={label}
            variant="outline"
            size="sm"
            onClick={onClick}
            className={`border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)] ${className}`}
          >
            <Edit className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          </Button>
        </TooltipTrigger>
        <TooltipContent style={{ backgroundColor: "var(--popover)", color: "var(--popover-foreground)" }}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
