import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export type ActionButtonProps = {
  isActive: boolean;
  onToggle: () => void | Promise<void>;
  activeTooltip?: string; // shown when active (action is deactivate)
  inactiveTooltip?: string; // shown when inactive (action is activate)
  className?: string;
};

export default function ActionButton({
  isActive,
  onToggle,
  activeTooltip = "Deactivate",
  inactiveTooltip = "Activate",
  className = "",
}: ActionButtonProps) {
  const label = isActive ? activeTooltip : inactiveTooltip;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={label}
            variant="outline"
            size="sm"
            onClick={onToggle}
            className={`border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)] ${className}`}
          >
            {isActive ? (
              <ThumbsUp className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            ) : (
              <ThumbsDown className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent style={{ backgroundColor: "var(--popover)", color: "var(--popover-foreground)" }}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
