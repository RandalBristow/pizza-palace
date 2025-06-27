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
    };

    switch (component.type) {
      case "Button":
        return (
          <button
            style={{
              ...style,
              backgroundColor:
                props.colorScheme === "blue" ? "#0078d4" : "#f0f0f0",
              color: props.colorScheme === "blue" ? "#fff" : "#333",
              cursor: "pointer",
            }}
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
          />
        );
      case "Text":
        return (
          <div
            style={{ ...style, border: "none", backgroundColor: "transparent" }}
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
            }}
          >
            Box Container
          </div>
        );
      case "Heading":
        return (
          <h2
            style={{
              ...style,
              border: "none",
              backgroundColor: "transparent",
              fontSize: props.size === "lg" ? "24px" : "18px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            {props.children || "Heading"}
          </h2>
        );
      case "Select":
        return (
          <select style={style}>
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
                cursor: "pointer",
              }}
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
            />
          </div>
        );
      case "Textarea":
        return (
          <textarea
            placeholder={props.placeholder || "Enter text..."}
            style={{ ...style, resize: "none", minHeight: "60px" }}
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
      enableResizing={isSelected}
      disableDragging={!isSelected}
      className={`component-instance ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div style={{ width: "100%", height: "100%", padding: "4px" }}>
        {renderComponent()}
      </div>
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
