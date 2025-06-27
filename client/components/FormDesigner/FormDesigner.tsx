import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Toolbox from "./Toolbox";
import DesignSurface from "./DesignSurface";
import PropertiesPanel from "./PropertiesPanel";
import ResizablePanel from "./ResizablePanel";
import "./FormDesigner.css";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    vs: {
      background: "#f3f3f3",
      panel: "#ffffff",
      border: "#cccccc",
      toolbox: "#f6f6f6",
      selected: "#0078d4",
      text: "#000000",
      secondary: "#666666",
    },
  },
});

export interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const FormDesigner: React.FC = () => {
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentInstance | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const addComponent = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const newComponent: ComponentInstance = {
        id: `${type}_${Date.now()}`,
        type,
        props: getDefaultProps(type),
        position,
        size: { width: 200, height: 40 },
      };
      setComponents((prev) => [...prev, newComponent]);
      setSelectedComponent(newComponent);
    },
    [],
  );

  const updateComponent = useCallback(
    (id: string, updates: Partial<ComponentInstance>) => {
      setComponents((prev) =>
        prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)),
      );
      if (selectedComponent?.id === id) {
        setSelectedComponent((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [selectedComponent],
  );

  const deleteComponent = useCallback(
    (id: string) => {
      setComponents((prev) => prev.filter((comp) => comp.id !== id));
      if (selectedComponent?.id === id) {
        setSelectedComponent(null);
      }
    },
    [selectedComponent],
  );

  const selectComponent = useCallback((component: ComponentInstance | null) => {
    setSelectedComponent(component);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <div className="form-designer">
          <div className="designer-header">
            <h1>Form Designer</h1>
            <div className="header-actions">
              <button
                className="collapse-btn"
                onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                title={
                  leftPanelCollapsed ? "Expand Toolbox" : "Collapse Toolbox"
                }
              >
                ☰
              </button>
              <button
                className="collapse-btn"
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                title={
                  rightPanelCollapsed
                    ? "Expand Properties"
                    : "Collapse Properties"
                }
              >
                ⚙
              </button>
            </div>
          </div>

          <div className="designer-body">
            {!leftPanelCollapsed && (
              <ResizablePanel
                width={leftPanelWidth}
                onResize={setLeftPanelWidth}
                side="left"
                className="toolbox-panel"
              >
                <Toolbox onAddComponent={addComponent} />
              </ResizablePanel>
            )}

            <div className="design-surface-container">
              <DesignSurface
                components={components}
                selectedComponent={selectedComponent}
                onSelectComponent={selectComponent}
                onUpdateComponent={updateComponent}
                onDeleteComponent={deleteComponent}
                onAddComponent={addComponent}
              />
            </div>

            {!rightPanelCollapsed && (
              <ResizablePanel
                width={rightPanelWidth}
                onResize={setRightPanelWidth}
                side="right"
                className="properties-panel"
              >
                <PropertiesPanel
                  selectedComponent={selectedComponent}
                  onUpdateComponent={updateComponent}
                />
              </ResizablePanel>
            )}
          </div>
        </div>
      </DndProvider>
    </ChakraProvider>
  );
};

const getDefaultProps = (type: string): Record<string, any> => {
  switch (type) {
    case "Button":
      return { children: "Button", colorScheme: "blue", size: "md" };
    case "Input":
      return { placeholder: "Enter text...", size: "md" };
    case "Text":
      return { children: "Sample text", fontSize: "md" };
    case "Box":
      return { bg: "gray.100", p: 4 };
    case "Heading":
      return { children: "Heading", size: "md" };
    case "Select":
      return { placeholder: "Select option...", size: "md" };
    case "Checkbox":
      return { children: "Checkbox", defaultChecked: false };
    case "Switch":
      return { size: "md" };
    case "Slider":
      return { defaultValue: 50, min: 0, max: 100 };
    case "Textarea":
      return { placeholder: "Enter text...", size: "md", resize: "vertical" };
    default:
      return {};
  }
};

export default FormDesigner;
