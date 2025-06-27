export interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  category: string;
  defaultProps: Record<string, any>;
  editableProps: PropertyDefinition[];
}

export interface PropertyDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "select" | "color";
  label: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
}

export interface DragItem {
  type: string;
  componentType: string;
}

export interface DropResult {
  position: { x: number; y: number };
}

export interface PanelState {
  width: number;
  collapsed: boolean;
}

export interface DesignerState {
  components: ComponentInstance[];
  selectedComponent: ComponentInstance | null;
  leftPanel: PanelState;
  rightPanel: PanelState;
  zoom: number;
  gridVisible: boolean;
  snapToGrid: boolean;
}
