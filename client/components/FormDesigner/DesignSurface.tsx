import React, { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import { Rnd } from "react-rnd";
import { ComponentInstance } from "./FormDesigner";

interface DesignSurfaceProps {
  components: ComponentInstance[];
  selectedComponent: ComponentInstance | null;
  onSelectComponent: (component: ComponentInstance | null) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
  onDeleteComponent: (id: string) => void;
  onAddComponent: (type: string, position: { x: number; y: number }) => void;
}

const ComponentRenderer: React.FC<{
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ComponentInstance>) => void;
  onDelete: () => void;
}> = ({ component, isSelected, onSelect, onUpdate, onDelete }) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" && isSelected) {
        e.preventDefault();
        onDelete();
      }
    },
    [isSelected, onDelete],
  );

  // Get resize constraints based on component type
  const getResizeConstraints = () => {
    switch (component.type) {
      case "Checkbox":
      case "Switch":
        return {
          minWidth: 120,
          maxWidth: 300,
          minHeight: 24,
          maxHeight: 40,
        };
      case "Button":
        return {
          minWidth: 60,
          maxWidth: 400,
          minHeight: 32,
          maxHeight: 60,
        };
      case "Input":
        return {
          minWidth: 100,
          maxWidth: 600,
          minHeight: 32,
          maxHeight: 48,
        };
      case "Select":
        return {
          minWidth: 120,
          maxWidth: 400,
          minHeight: 32,
          maxHeight: 48,
        };
      case "Text":
      case "Heading":
        return {
          minWidth: 50,
          maxWidth: 800,
          minHeight: 20,
          maxHeight: 200,
        };
      case "Slider":
        return {
          minWidth: 100,
          maxWidth: 600,
          minHeight: 24,
          maxHeight: 48,
        };
      case "Progress":
        return {
          minWidth: 100,
          maxWidth: 600,
          minHeight: 8,
          maxHeight: 24,
        };
      case "Spinner":
        return {
          minWidth: 24,
          maxWidth: 80,
          minHeight: 24,
          maxHeight: 80,
        };
      default:
        return {
          minWidth: 50,
          maxWidth: 1000,
          minHeight: 30,
          maxHeight: 800,
        };
    }
  };

  const renderComponent = () => {
    const props = { ...component.props };
    const style: React.CSSProperties = {
      width: "100%",
      height: "100%",
      padding: "4px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      fontSize: "14px",
      fontFamily: '"Segoe UI", sans-serif',
      pointerEvents: "none", // Make components non-interactive
      userSelect: "none", // Prevent text selection
    };

    switch (component.type) {
      case "Button":
        return (
          <button
            style={{
              ...style,
              backgroundColor: getButtonColor(props.colorScheme, props.variant),
              color: getButtonTextColor(props.colorScheme, props.variant),
              cursor: "default",
              fontSize:
                props.size === "sm"
                  ? "12px"
                  : props.size === "lg"
                    ? "16px"
                    : "14px",
              padding:
                props.size === "sm"
                  ? "4px 8px"
                  : props.size === "lg"
                    ? "8px 16px"
                    : "6px 12px",
              opacity: props.isDisabled ? 0.6 : 1,
            }}
            disabled
            tabIndex={-1}
          >
            {props.children || "Button"}
          </button>
        );
      case "Input":
        return (
          <input
            type="text"
            placeholder={props.placeholder || "Enter text..."}
            style={style}
            readOnly
            tabIndex={-1}
          />
        );
      case "Text":
        return (
          <div
            style={{
              ...style,
              border: "none",
              backgroundColor: "transparent",
              fontSize: getFontSize(props.fontSize),
              fontWeight: props.fontWeight || "normal",
              color: props.color || "#333",
            }}
          >
            {props.children || "Sample text"}
          </div>
        );
      case "Box":
        return (
          <div
            style={{
              ...style,
              backgroundColor: props.bg || "#f0f0f0",
              padding: props.p ? `${props.p * 4}px` : "16px",
              borderRadius: props.borderRadius
                ? `${props.borderRadius}px`
                : "4px",
              borderWidth: props.borderWidth ? `${props.borderWidth}px` : "1px",
            }}
          >
            Box Container
          </div>
        );
      case "Heading":
        const HeadingTag = props.as || "h2";
        return (
          <HeadingTag
            style={{
              ...style,
              border: "none",
              backgroundColor: "transparent",
              fontSize:
                getFontSize(props.fontSize) ||
                (props.size === "lg" ? "24px" : "18px"),
              fontWeight: props.fontWeight || "600",
              color: props.color || "#333",
              margin: 0,
            }}
          >
            {props.children || "Heading"}
          </HeadingTag>
        );
      case "Select":
        return (
          <select style={style} disabled tabIndex={-1}>
            <option value="">Select option...</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        );
      case "Checkbox":
        return (
          <label style={{ ...style, display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              defaultChecked={props.defaultChecked}
              style={{ marginRight: "8px" }}
              disabled
              tabIndex={-1}
            />
            {props.children || "Checkbox"}
          </label>
        );
      case "Switch":
        return (
          <label style={{ ...style, display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              style={{
                marginRight: "8px",
                width: "40px",
                height: "20px",
                appearance: "none",
                backgroundColor: "#ccc",
                borderRadius: "10px",
                position: "relative",
                cursor: "default",
              }}
              disabled
              tabIndex={-1}
            />
            Switch
          </label>
        );
      case "Slider":
        return (
          <div style={style}>
            <input
              type="range"
              min={props.min || 0}
              max={props.max || 100}
              defaultValue={props.defaultValue || 50}
              style={{ width: "100%" }}
              disabled
              tabIndex={-1}
            />
          </div>
        );
      case "Textarea":
        return (
          <textarea
            placeholder={props.placeholder || "Enter text..."}
            style={{ ...style, resize: "none", minHeight: "60px" }}
            readOnly
            tabIndex={-1}
          />
        );
      case "Alert":
        return (
          <div
            style={{
              ...style,
              backgroundColor: "#e3f2fd",
              borderColor: "#2196f3",
              color: "#1976d2",
            }}
          >
            ℹ Sample alert message
          </div>
        );
      case "Progress":
        return (
          <div style={style}>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "50%",
                  height: "100%",
                  backgroundColor: "#0078d4",
                }}
              />
            </div>
          </div>
        );
      case "Spinner":
        return (
          <div
            style={{
              ...style,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="spinner" />
          </div>
        );
      case "Stack":
        return (
          <div
            style={{
              ...style,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ padding: "4px", backgroundColor: "#f0f0f0" }}>
              Stack Item 1
            </div>
            <div style={{ padding: "4px", backgroundColor: "#f0f0f0" }}>
              Stack Item 2
            </div>
          </div>
        );
      case "Grid":
        return (
          <div
            style={{
              ...style,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <div style={{ padding: "8px", backgroundColor: "#f0f0f0" }}>
              Grid Item 1
            </div>
            <div style={{ padding: "8px", backgroundColor: "#f0f0f0" }}>
              Grid Item 2
            </div>
          </div>
        );
      case "Flex":
        return (
          <div style={{ ...style, display: "flex", gap: "8px" }}>
            <div
              style={{ padding: "8px", backgroundColor: "#f0f0f0", flex: 1 }}
            >
              Flex Item 1
            </div>
            <div
              style={{ padding: "8px", backgroundColor: "#f0f0f0", flex: 1 }}
            >
              Flex Item 2
            </div>
          </div>
        );
      default:
        return <div style={style}>Unknown Component: {component.type}</div>;
    }
  };

  const constraints = getResizeConstraints();

  return (
    <Rnd
      size={{ width: component.size.width, height: component.size.height }}
      position={{ x: component.position.x, y: component.position.y }}
      onDragStop={(e, d) => {
        onUpdate({
          position: { x: d.x, y: d.y },
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          size: {
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          },
          position,
        });
      }}
      bounds="parent"
      enableResizing={
        isSelected
          ? {
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }
          : false
      }
      disableDragging={!isSelected}
      minWidth={constraints.minWidth}
      maxWidth={constraints.maxWidth}
      minHeight={constraints.minHeight}
      maxHeight={constraints.maxHeight}
      className={`component-instance ${isSelected ? "selected" : ""}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        cursor: isSelected ? "move" : "pointer",
      }}
      resizeHandleStyles={{
        top: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          top: "-7px",
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
        right: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          right: "-7px",
          top: "50%",
          transform: "translateY(-50%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
        bottom: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          bottom: "-7px",
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
        left: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          left: "-7px",
          top: "50%",
          transform: "translateY(-50%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
        topRight: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          top: "-7px",
          right: "-7px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
        bottomRight: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          bottom: "-7px",
          right: "-7px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
        bottomLeft: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          bottom: "-7px",
          left: "-7px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
        topLeft: {
          width: "10px",
          height: "10px",
          backgroundColor: "#0078d4",
          border: "2px solid #ffffff",
          borderRadius: "2px",
          top: "-7px",
          left: "-7px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
      }}
    >
      {/* Component content - non-interactive */}
      <div style={{ width: "100%", height: "100%", padding: "4px" }}>
        {renderComponent()}
      </div>

      {/* Selection overlay with thin dashed border - 1px margin from component */}
      <div
        style={{
          position: "absolute",
          top: isSelected ? -2 : 0,
          left: isSelected ? -2 : 0,
          right: isSelected ? -2 : 0,
          bottom: isSelected ? -2 : 0,
          backgroundColor: "transparent",
          border: isSelected ? "1px dashed #0078d4" : "none",
          cursor: isSelected ? "move" : "pointer",
          zIndex: 10,
          pointerEvents: "all",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "rgba(0, 120, 212, 0.05)";
            e.currentTarget.style.border = "1px dashed rgba(0, 120, 212, 0.3)";
            e.currentTarget.style.top = "-2px";
            e.currentTarget.style.left = "-2px";
            e.currentTarget.style.right = "-2px";
            e.currentTarget.style.bottom = "-2px";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.border = "none";
            e.currentTarget.style.top = "0px";
            e.currentTarget.style.left = "0px";
            e.currentTarget.style.right = "0px";
            e.currentTarget.style.bottom = "0px";
          }
        }}
      />
    </Rnd>
  );
};

const DesignSurface: React.FC<DesignSurfaceProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onAddComponent,
}) => {
  const [dragPreview, setDragPreview] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const [{ isOver }, drop] = useDrop({
    accept: "component",
    drop: (item: { type: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = document
        .querySelector(".design-surface")
        ?.getBoundingClientRect();

      if (offset && containerRect) {
        const x = offset.x - containerRect.left;
        const y = offset.y - containerRect.top;
        onAddComponent(item.type, { x, y });
      }
      setDragPreview({ x: 0, y: 0, visible: false });
    },
    hover: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = document
        .querySelector(".design-surface")
        ?.getBoundingClientRect();

      if (offset && containerRect) {
        const x = offset.x - containerRect.left;
        const y = offset.y - containerRect.top;
        setDragPreview({ x, y, visible: true });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleSurfaceClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onSelectComponent(null);
      }
    },
    [onSelectComponent],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" && selectedComponent) {
        e.preventDefault();
        onDeleteComponent(selectedComponent.id);
      }
    },
    [selectedComponent, onDeleteComponent],
  );

  return (
    <div
      ref={drop}
      className={`design-surface ${isOver ? "drag-over" : ""}`}
      onClick={handleSurfaceClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isSelected={selectedComponent?.id === component.id}
          onSelect={() => onSelectComponent(component)}
          onUpdate={(updates) => onUpdateComponent(component.id, updates)}
          onDelete={() => onDeleteComponent(component.id)}
        />
      ))}

      {dragPreview.visible && (
        <div
          className="drag-preview"
          style={{
            left: dragPreview.x - 100,
            top: dragPreview.y - 20,
            width: 200,
            height: 40,
          }}
        />
      )}

      {components.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#999",
            fontSize: "14px",
            pointerEvents: "none",
          }}
        >
          <div>Drag components from the toolbox to start designing</div>
          <div style={{ fontSize: "12px", marginTop: "8px" }}>
            Or double-click a component in the toolbox
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignSurface;
