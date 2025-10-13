import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import ActivationBadge from "./ActivationBadge";

export type SingleItemCardProps = {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  displayOrder?: number | string;
  isActive?: boolean;
  rightActions?: React.ReactNode; // e.g., buttons
  className?: string;
  contentClassName?: string;
};

export default function SingleItemCard({
  title,
  subTitle,
  displayOrder,
  isActive,
  rightActions,
  className = "",
  contentClassName = "p-2",
}: SingleItemCardProps) {
  return (
    <Card
      className={className}
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <CardContent className={contentClassName}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {displayOrder !== undefined && (
              <Badge
                className="h-5 min-w-5 rounded-full font-mono tabular-nums"
                style={{
                  backgroundColor: "var(--accent)",
                  borderColor: "var(--border)",
                  color: "var(--accent-foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {displayOrder}
              </Badge>
            )}
            <div className="flex flex-col">
              <h3
                className="font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                {title}
              </h3>
            </div>
            <ActivationBadge isActive={isActive} />
          </div>
          <div className="flex justify-end items-center gap-2">
            {rightActions}
          </div>
        </div>
        {subTitle && (
          <span
            className="text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            {subTitle}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
