import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export type AddButtonProps = {
  label?: string;
  onClick: () => void | Promise<void>;
  className?: string;
  disabled?: boolean;
};

export default function AddButton({ label = "Add", onClick, className = "", disabled = false }: AddButtonProps) {
  return (
    <Button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`transition-all duration-200 hover:-translate-y-px hover:shadow-md disabled:opacity-50 ${className}`}
      style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        borderColor: 'var(--primary)'
      }}
    >
      <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
      {label}
    </Button>
  );
}
