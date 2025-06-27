import React, { useState, useCallback, useRef } from "react";

interface ResizablePanelProps {
  width: number;
  onResize: (width: number) => void;
  side: "left" | "right";
  className?: string;
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  width,
  onResize,
  side,
  className = "",
  children,
  minWidth = 150,
  maxWidth = 600,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = width;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startXRef.current;
        const newWidth =
          side === "left"
            ? startWidthRef.current + deltaX
            : startWidthRef.current - deltaX;

        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        onResize(clampedWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width, onResize, side, minWidth, maxWidth],
  );

  return (
    <div
      className={`resizable-panel ${className}`}
      style={{
        width: `${width}px`,
        flexShrink: 0,
        position: "relative",
      }}
    >
      {children}
      <div
        className={`resize-handle ${side}`}
        onMouseDown={handleMouseDown}
        style={{
          cursor: "col-resize",
          backgroundColor: isResizing ? "#0078d4" : "transparent",
        }}
      />
    </div>
  );
};

export default ResizablePanel;
