import React, { useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import { Rnd } from "react-rnd";
import {
  Button,
  Input,
  Text,
  Box,
  Heading,
  Select,
  Checkbox,
  Switch,
  Slider,
  Textarea,
  Alert,
  Progress,
  Spinner,
  Stack,
  Grid,
  Flex,
} from "@chakra-ui/react";
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

    switch (component.type) {
      case "Button":
        return <Button {...props} />;
      case "Input":
        return <Input {...props} />;
      case "Text":
        return <Text {...props} />;
      case "Box":
        return <Box {...props} />;
      case "Heading":
        return <Heading {...props} />;
      case "Select":
        return (
          <Select {...props}>
            <option value="">Select option...</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </Select>
        );
      case "Checkbox":
        return <Checkbox {...props} />;
      case "Switch":
        return <Switch {...props} />;
      case "Slider":
        return <Slider {...props} />;
      case "Textarea":
        return <Textarea {...props} />;
      case "Alert":
        return (
          <Alert {...props} status="info">
            Sample alert message
          </Alert>
        );
      case "Progress":
        return <Progress {...props} value={50} />;
      case "Spinner":
        return <Spinner {...props} />;
      case "Stack":
        return (
          <Stack {...props}>
            <Text fontSize="sm">Stack Item 1</Text>
            <Text fontSize="sm">Stack Item 2</Text>
          </Stack>
        );
      case "Grid":
        return (
          <Grid {...props} templateColumns="repeat(2, 1fr)" gap={2}>
            <Box bg="gray.100" p={2}>
              Grid Item 1
            </Box>
            <Box bg="gray.100" p={2}>
              Grid Item 2
            </Box>
          </Grid>
        );
      case "Flex":
        return (
          <Flex {...props}>
            <Box bg="gray.100" p={2} flex={1}>
              Flex Item 1
            </Box>
            <Box bg="gray.100" p={2} flex={1}>
              Flex Item 2
            </Box>
          </Flex>
        );
      default:
        return <Box {...props}>Unknown Component</Box>;
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
