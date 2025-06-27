import React, { useState } from "react";
import { ComponentInstance } from "./FormDesigner";

interface PropertiesPanelProps {
  selectedComponent: ComponentInstance | null;
  onUpdateComponent: (id: string, updates: Partial<ComponentInstance>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    layout: true,
    properties: true,
    border: false,
  });

  if (!selectedComponent) {
    return (
      <div className="properties-panel-content">
        <div
          style={{
            padding: "8px 0",
            borderBottom: "1px solid #e0e0e0",
            marginBottom: "8px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 600,
              color: "#333",
            }}
          >
            Properties
          </h3>
        </div>
        <div className="no-selection">
          Select a component to edit its properties
        </div>
      </div>
    );
  }

  const updateProp = (propName: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [propName]: value,
      },
    });
  };

  const updateBorderProp = (borderProp: string, value: any) => {
    const currentBorder = selectedComponent.props.border || {};
    updateProp("border", {
      ...currentBorder,
      [borderProp]: value,
    });
  };

  const updatePosition = (axis: "x" | "y", value: number) => {
    onUpdateComponent(selectedComponent.id, {
      position: {
        ...selectedComponent.position,
        [axis]: value,
      },
    });
  };

  const updateSize = (dimension: "width" | "height", value: number) => {
    onUpdateComponent(selectedComponent.id, {
      size: {
        ...selectedComponent.size,
        [dimension]: value,
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderPropertyInput = (
    propName: string,
    propValue: any,
    propType: string = "text",
  ) => {
    if (propType === "boolean") {
      return (
        <label
          style={{ display: "flex", alignItems: "center", fontSize: "11px" }}
        >
          <input
            type="checkbox"
            className="property-checkbox"
            checked={propValue || false}
            onChange={(e) => updateProp(propName, e.target.checked)}
          />
          {propName}
        </label>
      );
    }

    if (propType === "select") {
      const options = getSelectOptions(selectedComponent.type, propName);
      return (
        <select
          className="property-select"
          value={propValue || ""}
          onChange={(e) => updateProp(propName, e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (propType === "number") {
      return (
        <input
          type="number"
          className="property-input"
          value={propValue || 0}
          onChange={(e) => updateProp(propName, parseInt(e.target.value) || 0)}
        />
      );
    }

    if (propType === "color") {
      return (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <input
            type="color"
            value={propValue || "#000000"}
            onChange={(e) => updateProp(propName, e.target.value)}
            style={{
              width: "30px",
              height: "20px",
              border: "none",
              borderRadius: "2px",
            }}
          />
          <input
            type="text"
            className="property-input"
            value={propValue || ""}
            onChange={(e) => updateProp(propName, e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        className="property-input"
        value={propValue || ""}
        onChange={(e) => updateProp(propName, e.target.value)}
      />
    );
  };

  const renderBorderInput = (
    borderProp: string,
    propValue: any,
    propType: string = "text",
  ) => {
    if (propType === "boolean") {
      return (
        <label
          style={{ display: "flex", alignItems: "center", fontSize: "11px" }}
        >
          <input
            type="checkbox"
            className="property-checkbox"
            checked={propValue || false}
            onChange={(e) => updateBorderProp(borderProp, e.target.checked)}
          />
          {borderProp}
        </label>
      );
    }

    if (propType === "select") {
      const options = getBorderSelectOptions(borderProp);
      return (
        <select
          className="property-select"
          value={propValue || ""}
          onChange={(e) => updateBorderProp(borderProp, e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (propType === "number") {
      return (
        <input
          type="number"
          className="property-input"
          value={propValue || 0}
          onChange={(e) =>
            updateBorderProp(borderProp, parseInt(e.target.value) || 0)
          }
        />
      );
    }

    if (propType === "color") {
      return (
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <input
            type="color"
            value={propValue || "#000000"}
            onChange={(e) => updateBorderProp(borderProp, e.target.value)}
            style={{
              width: "30px",
              height: "20px",
              border: "none",
              borderRadius: "2px",
            }}
          />
          <input
            type="text"
            className="property-input"
            value={propValue || ""}
            onChange={(e) => updateBorderProp(borderProp, e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        className="property-input"
        value={propValue || ""}
        onChange={(e) => updateBorderProp(borderProp, e.target.value)}
      />
    );
  };

  const getComponentProperties = () => {
    const baseProps = ["children", "size", "placeholder"];
    const typeSpecificProps: Record<string, string[]> = {
      Button: ["colorScheme", "variant", "isDisabled", "isLoading"],
      Input: ["type", "variant", "isDisabled", "isReadOnly"],
      Text: ["fontSize", "fontWeight", "color"],
      Box: ["bg", "p", "borderRadius", "borderWidth"],
      Heading: ["as", "fontSize", "fontWeight", "color"],
      Select: ["variant", "isDisabled"],
      Checkbox: ["colorScheme", "isDisabled", "isChecked"],
      Switch: ["colorScheme", "isDisabled", "isChecked"],
      Slider: ["min", "max", "step", "defaultValue"],
      Textarea: ["resize", "variant", "isDisabled"],
    };

    return [...baseProps, ...(typeSpecificProps[selectedComponent.type] || [])];
  };

  const getPropertyType = (propName: string): string => {
    const booleanProps = ["isDisabled", "isReadOnly", "isLoading", "isChecked"];
    const numberProps = [
      "min",
      "max",
      "step",
      "defaultValue",
      "p",
      "borderWidth",
      "borderRadius",
    ];
    const selectProps = [
      "colorScheme",
      "variant",
      "size",
      "fontSize",
      "fontWeight",
      "as",
      "resize",
    ];
    const colorProps = ["color", "bg"];

    if (booleanProps.includes(propName)) return "boolean";
    if (numberProps.includes(propName)) return "number";
    if (selectProps.includes(propName)) return "select";
    if (colorProps.includes(propName)) return "color";
    return "text";
  };

  const getBorderPropertyType = (propName: string): string => {
    if (propName === "enabled") return "boolean";
    if (propName === "width" || propName === "radius") return "number";
    if (propName === "style") return "select";
    if (propName === "color") return "color";
    return "text";
  };

  const currentBorder = selectedComponent.props.border || {};

  return (
    <div className="properties-panel-content">
      <div
        style={{
          padding: "8px 0",
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "8px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 600,
            color: "#333",
          }}
        >
          Properties
        </h3>
        <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
          {selectedComponent.type} ({selectedComponent.id})
        </div>
      </div>

      {/* Layout Section */}
      <div className="property-group">
        <div
          className="property-group-title expandable"
          onClick={() => toggleSection("layout")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              marginRight: "4px",
              transform: expandedSections.layout
                ? "rotate(90deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▶
          </span>
          Layout
        </div>

        {expandedSections.layout && (
          <>
            <div className="property-item">
              <label className="property-label">X Position</label>
              <input
                type="number"
                className="property-input"
                value={selectedComponent.position.x}
                onChange={(e) =>
                  updatePosition("x", parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div className="property-item">
              <label className="property-label">Y Position</label>
              <input
                type="number"
                className="property-input"
                value={selectedComponent.position.y}
                onChange={(e) =>
                  updatePosition("y", parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div className="property-item">
              <label className="property-label">Width</label>
              <input
                type="number"
                className="property-input"
                value={selectedComponent.size.width}
                onChange={(e) =>
                  updateSize("width", parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div className="property-item">
              <label className="property-label">Height</label>
              <input
                type="number"
                className="property-input"
                value={selectedComponent.size.height}
                onChange={(e) =>
                  updateSize("height", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </>
        )}
      </div>

      {/* Border Section */}
      <div className="property-group">
        <div
          className="property-group-title expandable"
          onClick={() => toggleSection("border")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              marginRight: "4px",
              transform: expandedSections.border
                ? "rotate(90deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▶
          </span>
          Border
        </div>

        {expandedSections.border && (
          <>
            <div className="property-item">
              <label className="property-label">Enabled</label>
              {renderBorderInput("enabled", currentBorder.enabled, "boolean")}
            </div>

            {currentBorder.enabled && (
              <>
                <div className="property-item">
                  <label className="property-label">Width</label>
                  {renderBorderInput("width", currentBorder.width, "number")}
                </div>

                <div className="property-item">
                  <label className="property-label">Style</label>
                  {renderBorderInput("style", currentBorder.style, "select")}
                </div>

                <div className="property-item">
                  <label className="property-label">Color</label>
                  {renderBorderInput("color", currentBorder.color, "color")}
                </div>

                <div className="property-item">
                  <label className="property-label">Radius</label>
                  {renderBorderInput("radius", currentBorder.radius, "number")}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Component Properties Section */}
      <div className="property-group">
        <div
          className="property-group-title expandable"
          onClick={() => toggleSection("properties")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              marginRight: "4px",
              transform: expandedSections.properties
                ? "rotate(90deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▶
          </span>
          Component Properties
        </div>

        {expandedSections.properties && (
          <>
            {getComponentProperties().map((propName) => {
              const propValue = selectedComponent.props[propName];
              const propType = getPropertyType(propName);

              if (propType === "boolean") {
                return (
                  <div key={propName} className="property-item">
                    {renderPropertyInput(propName, propValue, propType)}
                  </div>
                );
              }

              return (
                <div key={propName} className="property-item">
                  <label className="property-label">{propName}</label>
                  {renderPropertyInput(propName, propValue, propType)}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

const getSelectOptions = (componentType: string, propName: string) => {
  const optionsMap: Record<
    string,
    Record<string, Array<{ value: string; label: string }>>
  > = {
    Button: {
      colorScheme: [
        { value: "gray", label: "Gray" },
        { value: "red", label: "Red" },
        { value: "orange", label: "Orange" },
        { value: "yellow", label: "Yellow" },
        { value: "green", label: "Green" },
        { value: "teal", label: "Teal" },
        { value: "blue", label: "Blue" },
        { value: "cyan", label: "Cyan" },
        { value: "purple", label: "Purple" },
        { value: "pink", label: "Pink" },
      ],
      variant: [
        { value: "solid", label: "Solid" },
        { value: "outline", label: "Outline" },
        { value: "ghost", label: "Ghost" },
        { value: "link", label: "Link" },
      ],
      size: [
        { value: "xs", label: "Extra Small" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
    },
    common: {
      size: [
        { value: "xs", label: "Extra Small" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
      fontSize: [
        { value: "xs", label: "Extra Small" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra Large" },
        { value: "2xl", label: "2X Large" },
      ],
      fontWeight: [
        { value: "normal", label: "Normal" },
        { value: "medium", label: "Medium" },
        { value: "semibold", label: "Semibold" },
        { value: "bold", label: "Bold" },
      ],
    },
  };

  // Check component-specific options first
  if (optionsMap[componentType]?.[propName]) {
    return optionsMap[componentType][propName];
  }

  // Fall back to common options
  if (optionsMap.common[propName]) {
    return optionsMap.common[propName];
  }

  // Default empty options
  return [{ value: "", label: "Select..." }];
};

const getBorderSelectOptions = (propName: string) => {
  const borderOptionsMap: Record<
    string,
    Array<{ value: string; label: string }>
  > = {
    style: [
      { value: "solid", label: "Solid" },
      { value: "dashed", label: "Dashed" },
      { value: "dotted", label: "Dotted" },
      { value: "double", label: "Double" },
      { value: "groove", label: "Groove" },
      { value: "ridge", label: "Ridge" },
      { value: "inset", label: "Inset" },
      { value: "outset", label: "Outset" },
    ],
  };

  return borderOptionsMap[propName] || [{ value: "", label: "Select..." }];
};

export default PropertiesPanel;
