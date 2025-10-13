import React, { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import ActivationBadge from "./ActivationBadge";

type SectionCardProps = {
  title: string;
  icon?: ReactNode;
  order: number;
  columns: number;
  isActive: boolean;
  content?: string;
  imageUrl?: string;
  linksCount?: number;
  rightActions?: ReactNode;
};

export default function SectionCard({
  title,
  icon,
  order,
  columns,
  isActive,
  content,
  imageUrl,
  linksCount = 0,
  rightActions,
}: SectionCardProps) {
  return (
    <Card
      className="h-full"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        border: "1px solid var(--border)",
      }}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {icon && <span style={{ color: "var(--primary)" }}>{icon}</span>}
              <h3 className="font-semibold" style={{ color: "var(--muted-foreground)" }}>
                {title}
              </h3>
              <span
                className="h-5 min-w-5 rounded-full px-2 text-xs font-mono tabular-nums inline-flex items-center"
                style={{
                  backgroundColor: "var(--accent)",
                  borderColor: "var(--border)",
                  color: "var(--accent-foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                Order: {order}
              </span>
              <span
                className="h-5 min-w-5 rounded-full px-2 text-xs font-mono tabular-nums inline-flex items-center"
                style={{
                  backgroundColor: "var(--accent)",
                  borderColor: "var(--border)",
                  color: "var(--accent-foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {columns} Column{columns !== 1 ? "s" : ""}
              </span>
              <ActivationBadge isActive={isActive} />
            </div>
            {content && (
              <p className="text-sm mb-2 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                {content}
              </p>
            )}
            {imageUrl && (
              <div className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
                <span className="opacity-80">Image:</span>{" "}
                <span className="break-all max-w-full inline-block">{imageUrl}</span>
              </div>
            )}
            {linksCount > 0 && (
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Links: {linksCount}
              </div>
            )}
          </div>
        </div>
        {rightActions && (
          <div className="mt-auto pt-2 flex justify-end items-center gap-2">{rightActions}</div>
        )}
      </CardContent>
    </Card>
  );
}

