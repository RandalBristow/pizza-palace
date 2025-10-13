import React, { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import ActivationBadge from "./ActivationBadge";

export type PriceListItem = {
  label: string;
  value: string | number;
};

export type PriceListCardProps = {
  title: string;
  statusBadge?: ReactNode;
  isActive?: boolean;
  priceList?: PriceListItem[];
  rightActions?: ReactNode;
  className?: string;
};

export default function PriceListCard({
  title,
  statusBadge,
  isActive,
  priceList = [],
  rightActions,
  className = "",
}: PriceListCardProps) {
  return (
    <Card
      className={className}
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", border: "1px solid var(--border)" }}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-start items-start gap-2 mb-2">
          <h6 className="font-medium" style={{ color: "var(--muted-foreground)" }}>
            {title}
          </h6>
          <ActivationBadge isActive={isActive} />
        </div>

        {priceList.length > 0 && (
          <div className="mb-3">
            <p className="text-xs mt-1 mb-2" style={{ color: "var(--muted-foreground)" }}>
              Size Prices:
            </p>
            <div className="space-y-1">
              {priceList.map((p) => (
                <div
                  key={String(p.label)}
                  className="flex justify-between text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <span>{p.label}:</span>
                  <span>{typeof p.value === "number" ? `$${p.value.toFixed(2)}` : p.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {rightActions && (
          <div className="flex justify-end items-center mt-auto">
            <div className="flex gap-2 p-0 pt-2">{rightActions}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

