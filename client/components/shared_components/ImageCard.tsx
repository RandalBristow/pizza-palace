import React from "react";
import { Card, CardContent } from "../ui/card";
import ActivationBadge from "./ActivationBadge";

export type ImageCardProps = {
  imageUrl?: string;
  alt?: string;
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  pricing?: React.ReactNode;
  isActive?: boolean;
  rightActions?: React.ReactNode;
  thumbClassName?: string; // e.g., w-32 h-32
  onImageError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  className?: string;
  contentClassName?: string;
};

export default function ImageCard({
  imageUrl,
  alt,
  title,
  subTitle,
  pricing,
  isActive,
  rightActions,
  thumbClassName = "w-32 h-32",
  onImageError,
  className = "overflow-hidden",
  contentClassName = "p-0",
}: ImageCardProps) {
  const rowJustify = pricing ? "justify-between" : "justify-end";
  return (
    <Card
      className={className}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        border: "1px solid var(--border)",
      }}
    >
      <CardContent className={contentClassName}>
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={alt || "image"}
              className={`${thumbClassName} object-cover w-full`}
              onError={onImageError}
            />
          ) : (
            <div
              className={`${thumbClassName} w-full`}
              style={{ backgroundColor: "var(--muted)" }}
            />
          )}
          <div className="absolute top-2 right-2" />
        </div>

        <div className="p-3">
          <div className="flex items-center justify-start gap-2 mb-2">
            <h3
              className="font-semibold mb-0 truncate"
              style={{ color: "var(--muted-foreground)" }}
              title={typeof title === "string" ? title : undefined}
            >
              {title}
            </h3>
            {typeof isActive === "boolean" && (
              <ActivationBadge isActive={isActive} />
            )}
          </div>

          {subTitle && (
            <p
              className="text-xs mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {subTitle}
            </p>
          )}

          <div className={`flex items-center ${rowJustify} gap-2`}>
            {pricing && (
              <p
                className="text-xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {pricing}
              </p>
            )}

            {rightActions && (
              <div className="flex justify-end items-center gap-2">
                {rightActions}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
