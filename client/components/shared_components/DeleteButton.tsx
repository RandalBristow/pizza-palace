import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export type DeleteButtonProps = {
  entityTitle: string;
  subjectName?: string;
  onConfirm: () => void | Promise<void>;
  canDelete?: boolean;
  tooltipWhenAllowed?: string;
  tooltipWhenBlocked?: string;
  className?: string;
};

export default function DeleteButton({
  entityTitle,
  subjectName,
  onConfirm,
  canDelete = true,
  tooltipWhenAllowed = "Delete",
  tooltipWhenBlocked = "Cannot delete",
  className = "",
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const label = canDelete ? tooltipWhenAllowed : tooltipWhenBlocked;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={label}
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              disabled={!canDelete}
              className={`border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)] ${className}`}
            >
              <Trash2 className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            </Button>
          </TooltipTrigger>
          <TooltipContent style={{ backgroundColor: "var(--popover)", color: "var(--popover-foreground)" }}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          style={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            color: "var(--popover-foreground)",
            animation: "none",
            transition: "none",
          }}
          className="border data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0"
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "var(--popover-foreground)" }}>
              {`Delete ${entityTitle}`}
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "var(--muted-foreground)" }}>
              {`Are you sure you want to delete "${subjectName || entityTitle.toLowerCase()}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 focus-visible:ring-offset-[var(--card)]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="transition-colors duration-200 hover:opacity-90"
              style={{
                backgroundColor: "var(--destructive)",
                color: "var(--destructive-foreground)",
                borderColor: "var(--destructive)",
              }}
              onClick={async () => {
                await onConfirm();
                setOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
