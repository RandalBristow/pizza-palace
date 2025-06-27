import React, { useState } from "react";
import { useDrag } from "react-dnd";

interface ToolboxProps {
  onAddComponent: (type: string, position: { x: number; y: number }) => void;
}

interface ComponentCategory {
  name: string;
  components: ComponentDefinition[];
}

interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
}

const componentCategories: ComponentCategory[] = [
  {
    name: "Form Controls",
    components: [
      { type: "Input", name: "Input", icon: "📝" },
      { type: "Textarea", name: "Textarea", icon: "📄" },
      { type: "Select", name: "Select", icon: "📋" },
      { type: "Checkbox", name: "Checkbox", icon: "☑" },
      { type: "Switch", name: "Switch", icon: "🔘" },
      { type: "Slider", name: "Slider", icon: "🎚" },
      { type: "Button", name: "Button", icon: "🔳" },
    ],
  },
  {
    name: "Layout",
    components: [
      { type: "Box", name: "Box", icon: "⬜" },
      { type: "Stack", name: "Stack", icon: "📚" },
      { type: "Grid", name: "Grid", icon: "⚏" },
      { type: "Flex", name: "Flex", icon: "↔" },
    ],
  },
  {
    name: "Typography",
    components: [
      { type: "Text", name: "Text", icon: "T" },
      { type: "Heading", name: "Heading", icon: "H" },
    ],
  },
  {
    name: "Feedback",
    components: [
      { type: "Alert", name: "Alert", icon: "⚠" },
      { type: "Toast", name: "Toast", icon: "🔔" },
      { type: "Progress", name: "Progress", icon: "📊" },
      { type: "Spinner", name: "Spinner", icon: "⏳" },
    ],
  },
];

const DraggableComponent: React.FC<{
  component: ComponentDefinition;
  onAddComponent: (type: string, position: { x: number; y: number }) => void;
}> = ({ component, onAddComponent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { type: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="component-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onDoubleClick={() => onAddComponent(component.type, { x: 100, y: 100 })}
    >
      <div className="component-icon">{component.icon}</div>
      <span>{component.name}</span>
    </div>
  );
};

const CategorySection: React.FC<{
  category: ComponentCategory;
  onAddComponent: (type: string, position: { x: number; y: number }) => void;
}> = ({ category, onAddComponent }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="toolbox-category">
      <div
        className={`category-header ${collapsed ? "collapsed" : ""}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`category-arrow ${collapsed ? "collapsed" : ""}`}>
          ▼
        </span>
        {category.name}
      </div>
      {!collapsed && (
        <div className="category-content">
          {category.components.map((component) => (
            <DraggableComponent
              key={component.type}
              component={component}
              onAddComponent={onAddComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Toolbox: React.FC<ToolboxProps> = ({ onAddComponent }) => {
  return (
    <div className="toolbox">
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
          Toolbox
        </h3>
      </div>
      {componentCategories.map((category) => (
        <CategorySection
          key={category.name}
          category={category}
          onAddComponent={onAddComponent}
        />
      ))}
    </div>
  );
};

export default Toolbox;
