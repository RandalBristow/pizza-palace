import { Badge } from "../ui/badge";

export type ActivationBadgeProps = {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
};

export default function ActivationBadge({
  isActive,
  activeText = "Active",
  inactiveText = "Inactive",
  className = "",
}: ActivationBadgeProps) {
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: isActive
          ? "var(--badge-active-bg)"
          : "var(--badge-inactive-bg)",
        color: isActive
          ? "var(--badge-active-fg)"
          : "var(--badge-inactive-fg)",
        border: "1px solid var(--border)",
      }}
    >
      {isActive ? activeText : inactiveText}
    </Badge>
  );
}

