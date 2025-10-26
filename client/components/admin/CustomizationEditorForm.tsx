import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import AddButton from "../shared_components/AddButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import ToppingSelector from "../ToppingSelector";
import { Plus, ChevronDown, ChevronRight, Save, X, AlertCircle, Sliders, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface CustomizationEditorFormProps {
  subCategories: any[];
  categorySizes: any[];
  toppings: any[];
  toppingCategories: any[];
  categories: any[];
  customizerTemplates: any[];
  customizerPanels: any[];
  customizerPanelItems: any[];
  customizerPanelItemConditionals: any[];
  createCustomizerTemplate: (template: any) => Promise<any>;
  updateCustomizerTemplate: (id: string, template: any) => Promise<void>;
  deleteCustomizerTemplate: (id: string) => Promise<void>;
  createCustomizerPanel: (panel: any) => Promise<any>;
  updateCustomizerPanel: (id: string, panel: any) => Promise<void>;
  deleteCustomizerPanel: (id: string) => Promise<void>;
  createCustomizerPanelItem: (item: any) => Promise<any>;
  updateCustomizerPanelItem: (id: string, item: any) => Promise<void>;
  deleteCustomizerPanelItem: (id: string) => Promise<void>;
  createCustomizerPanelItemConditional: (conditional: any) => Promise<any>;
  updateCustomizerPanelItemConditional: (id: string, conditional: any) => Promise<void>;
  deleteCustomizerPanelItemConditional: (id: string) => Promise<void>;
}

export default function CustomizationEditorForm({
  subCategories,
  categorySizes,
  toppings,
  toppingCategories,
  categories,
  customizerTemplates,
  customizerPanels,
  customizerPanelItems,
  customizerPanelItemConditionals,
  createCustomizerTemplate,
  updateCustomizerTemplate,
  deleteCustomizerTemplate,
  createCustomizerPanel,
  updateCustomizerPanel,
  deleteCustomizerPanel,
  createCustomizerPanelItem,
  updateCustomizerPanelItem,
  deleteCustomizerPanelItem,
  createCustomizerPanelItemConditional,
  updateCustomizerPanelItemConditional,
  deleteCustomizerPanelItemConditional,
}: CustomizationEditorFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isPanelDialogOpen, setIsPanelDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isItemVisibilityDialogOpen, setIsItemVisibilityDialogOpen] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set());
  
  // Template form
  const [templateForm, setTemplateForm] = useState({
    id: "",
    name: "",
    subCategoryId: "",
    isActive: true,
  });

  // Panel form
  const [panelForm, setPanelForm] = useState({
    id: "",
    panelType: "custom_list" as "size" | "custom_list" | "topping",
    title: "",
    subtitle: "",
    message: "",
    displayOrder: 1,
    isActive: true,
    showPlacementControls: true,
  });

  // Item form
  const [itemForm, setItemForm] = useState({
    id: "",
    selectedPanelId: "",
    itemType: "custom" as "size" | "custom" | "topping",
    itemId: "",
    customName: "",
    customPrice: 0,
    displayOrder: 1,
    isActive: true,
  });

  // Item visibility form
  const [itemVisibilityForm, setItemVisibilityForm] = useState({
    itemId: "",
    itemName: "",
    panelId: "",
    parentPanelId: "",
    selectedParentItemIds: new Set<string>(),
  });
  const currentPanels = customizerPanels
    .filter((p) => p.customizerTemplateId === selectedTemplate)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const getPanelItems = (panelId: string) => {
    return customizerPanelItems
      .filter((i) => i.customizerPanelId === panelId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  const handleCreateTemplate = () => {
    setTemplateForm({
      id: "",
      name: "",
      subCategoryId: "",
      isActive: true,
    });
    setIsTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template: any) => {
    setTemplateForm({
      id: template.id,
      name: template.name,
      subCategoryId: template.subCategoryId,
      isActive: template.isActive,
    });
    setIsTemplateDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (templateForm.id) {
      await updateCustomizerTemplate(templateForm.id, {
        name: templateForm.name,
        subCategoryId: templateForm.subCategoryId,
        isActive: templateForm.isActive,
      });
    } else {
      const newTemplate = await createCustomizerTemplate({
        name: templateForm.name,
        subCategoryId: templateForm.subCategoryId,
        isActive: templateForm.isActive,
      });
      setSelectedTemplate(newTemplate.id);
    }
    setIsTemplateDialogOpen(false);
  };

  const handleCreatePanel = () => {
    if (!selectedTemplate) return;
    setPanelForm({
      id: "",
      panelType: "custom_list",
      title: "",
      subtitle: "",
      message: "",
      displayOrder: currentPanels.length + 1,
      isActive: true,
      showPlacementControls: true,
    });
    setIsPanelDialogOpen(true);
  };

  const handleEditPanel = (panel: any) => {
    setPanelForm({
      id: panel.id,
      panelType: panel.panelType,
      title: panel.title,
      subtitle: panel.subtitle || "",
      message: panel.message || "",
      displayOrder: panel.displayOrder,
      isActive: panel.isActive,
      showPlacementControls: panel.showPlacementControls ?? true,
    });
    setIsPanelDialogOpen(true);
  };

  const handleSavePanel = async () => {
    if (panelForm.id) {
      await updateCustomizerPanel(panelForm.id, {
        customizerTemplateId: selectedTemplate,
        panelType: panelForm.panelType,
        title: panelForm.title,
        subtitle: panelForm.subtitle,
        message: panelForm.message,
        displayOrder: panelForm.displayOrder,
        isActive: panelForm.isActive,
        showPlacementControls: panelForm.showPlacementControls,
      });
    } else {
      await createCustomizerPanel({
        customizerTemplateId: selectedTemplate,
        panelType: panelForm.panelType,
        title: panelForm.title,
        subtitle: panelForm.subtitle,
        message: panelForm.message,
        displayOrder: panelForm.displayOrder,
        isActive: panelForm.isActive,
        showPlacementControls: panelForm.showPlacementControls,
      });
    }
    setIsPanelDialogOpen(false);
  };

  const handleCreateItem = (panelId: string) => {
    const panel = customizerPanels.find((p) => p.id === panelId);
    const items = getPanelItems(panelId);
    
    setItemForm({
      id: "",
      selectedPanelId: panelId,
      itemType: panel?.panelType === "topping" ? "topping" : panel?.panelType === "size" ? "size" : "custom",
      itemId: "",
      customName: "",
      customPrice: 0,
      displayOrder: items.length + 1,
      isActive: true,
    });
    setIsItemDialogOpen(true);
  };

  const handleEditItem = (item: any) => {
    setItemForm({
      id: item.id,
      selectedPanelId: item.customizerPanelId,
      itemType: item.itemType,
      itemId: item.itemId || "",
      customName: item.customName || "",
      customPrice: item.customPrice || 0,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setIsItemDialogOpen(true);
  };

  const handleSaveItem = async () => {
    const itemData = {
      customizerPanelId: itemForm.selectedPanelId,
      itemType: itemForm.itemType,
      itemId: itemForm.itemType !== "custom" ? itemForm.itemId : null,
      customName: itemForm.itemType === "custom" ? itemForm.customName : null,
      customPrice: itemForm.itemType === "custom" ? itemForm.customPrice : null,
      displayOrder: itemForm.displayOrder,
      isActive: itemForm.isActive,
    };

    if (itemForm.id) {
      await updateCustomizerPanelItem(itemForm.id, itemData);
    } else {
      await createCustomizerPanelItem(itemData);
    }
    setIsItemDialogOpen(false);
  };

  const handleManageItemVisibility = (item: any, panelIndex: number) => {
    const currentPanel = currentPanels[panelIndex];
    const previousPanel = currentPanels[panelIndex - 1];
    const previousPanelItems = getPanelItems(previousPanel.id);
    
    // Get existing conditionals for this item
    const existingConditionals = customizerPanelItemConditionals.filter(
      c => c.childPanelItemId === item.id
    );
    
    // Create set of parent items where this item is hidden (is_visible=false)
    const hiddenParentIds = new Set(
      existingConditionals
        .filter(c => !c.isVisible)
        .map(c => c.parentPanelItemId)
    );
    
    // All parent items should be checked by default, unless explicitly hidden
    const selectedIds = new Set(
      previousPanelItems
        .map(p => p.id)
        .filter(id => !hiddenParentIds.has(id))
    );
    
    setItemVisibilityForm({
      itemId: item.id,
      itemName: getItemDisplayName(item),
      panelId: currentPanel.id,
      parentPanelId: previousPanel.id,
      selectedParentItemIds: selectedIds,
    });
    setIsItemVisibilityDialogOpen(true);
  };

  const handleSaveItemVisibility = async () => {
    const previousPanel = currentPanels.find(p => p.id === itemVisibilityForm.parentPanelId);
    if (!previousPanel) return;
    
    const allParentItems = getPanelItems(previousPanel.id);
    const selectedIds = itemVisibilityForm.selectedParentItemIds;
    
    // Delete all existing conditionals for this item
    const existingConditionals = customizerPanelItemConditionals.filter(
      c => c.childPanelItemId === itemVisibilityForm.itemId
    );
    
    for (const conditional of existingConditionals) {
      await deleteCustomizerPanelItemConditional(conditional.id);
    }
    
    // If all items are selected, don't create any conditionals (default behavior)
    if (selectedIds.size === allParentItems.length) {
      setIsItemVisibilityDialogOpen(false);
      return;
    }
    
    // Create is_visible=false conditionals for unchecked items
    for (const parentItem of allParentItems) {
      if (!selectedIds.has(parentItem.id)) {
        await createCustomizerPanelItemConditional({
          customizerPanelId: itemVisibilityForm.panelId,
          parentPanelItemId: parentItem.id,
          childPanelItemId: itemVisibilityForm.itemId,
          isVisible: false,
        });
      }
    }
    
    setIsItemVisibilityDialogOpen(false);
  };

  const getVisibilityBadge = (item: any, panelIndex: number) => {
    if (panelIndex === 0) return null; // First panel has no conditionals
    
    const currentPanel = currentPanels[panelIndex];
    if (currentPanel.panelType === "topping") return null; // Topping panels always visible
    
    const previousPanel = currentPanels[panelIndex - 1];
    const previousPanelItems = getPanelItems(previousPanel.id);
    
    const existingConditionals = customizerPanelItemConditionals.filter(
      c => c.childPanelItemId === item.id
    );
    
    // Count how many parent items this is visible for
    const hiddenCount = existingConditionals.filter(c => !c.isVisible).length;
    const visibleCount = previousPanelItems.length - hiddenCount;
    
    if (visibleCount === previousPanelItems.length) {
      return null; // Visible for all, no need for badge
    }
    
    return `${visibleCount}/${previousPanelItems.length}`;
  };

  const togglePanelExpanded = (panelId: string) => {
    const newExpanded = new Set(expandedPanels);
    if (newExpanded.has(panelId)) {
      newExpanded.delete(panelId);
    } else {
      newExpanded.add(panelId);
    }
    setExpandedPanels(newExpanded);
  };

  const getItemDisplayName = (item: any) => {
    if (item.itemType === "custom") {
      return item.customName;
    } else if (item.itemType === "size") {
      const size = categorySizes.find((s) => s.id === item.itemId);
      return size?.sizeName || "Unknown Size";
    } else if (item.itemType === "topping") {
      const topping = toppings.find((t) => t.id === item.itemId);
      return topping?.name || "Unknown Topping";
    }
    return "Unknown Item";
  };

  const getPanelTypeLabel = (type: string) => {
    switch (type) {
      case "size":
        return "Size Panel (Auto-populated from sizes)";
      case "custom_list":
        return "Custom List Panel";
      case "topping":
        return "Topping Panel";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Customization Editor
        </h2>
        <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
          Define customization panels for menu item sub-categories. Create panels with conditional visibility based on previous selections.
        </p>
      </div>

      {/* Template Selection */}
      <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--card-foreground)' }}>Select Customizer Template</CardTitle>
          <CardDescription style={{ color: 'var(--muted-foreground)' }}>Choose a sub-category to customize or create a new template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedTemplate || ""} onValueChange={setSelectedTemplate}>
                <SelectTrigger
                  style={{
                    backgroundColor: 'var(--input)',
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = `0 0 0 2px var(--ring)`;
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.boxShadow = 'none';
                  }}
                >
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                  {customizerTemplates.map((template) => {
                    const subCat = subCategories.find((s) => s.id === template.subCategoryId);
                    return (
                      <SelectItem key={template.id} value={template.id} style={{ color: 'var(--popover-foreground)' }}>
                        {template.name} ({subCat?.name || "Unknown"})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <AddButton 
              label="New Template" 
              onClick={handleCreateTemplate} 
            />
            {selectedTemplate && (() => {
              const currentTemplate = customizerTemplates.find(t => t.id === selectedTemplate);
              return currentTemplate ? (
                <EditButton 
                  label="Edit Template" 
                  onClick={() => handleEditTemplate(currentTemplate)} 
                />
              ) : null;
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Panels */}
      {selectedTemplate && (
        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle style={{ color: 'var(--card-foreground)' }}>Customization Panels</CardTitle>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>Define the customization flow for this sub-category</CardDescription>
              </div>
              <AddButton 
                label="Add Panel" 
                onClick={handleCreatePanel} 
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPanels.length === 0 ? (
              <div className="text-center py-8" style={{ color: "var(--muted-foreground)" }}>
                <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                <p>No panels defined. Click "Add Panel" to get started.</p>
              </div>
            ) : (
              currentPanels.map((panel, index) => {
                const panelItems = getPanelItems(panel.id);
                const isExpanded = expandedPanels.has(panel.id);
                const previousPanel = index > 0 ? currentPanels[index - 1] : null;
                const previousPanelItems = previousPanel ? getPanelItems(previousPanel.id) : [];

                return (
                  <Card key={panel.id} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '2px solid var(--border)' }}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => togglePanelExpanded(panel.id)}
                            className="p-1 rounded"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--foreground)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--accent)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className="font-semibold" style={{ color: 'var(--card-foreground)' }}>
                              Panel {index + 1}: {panel.title}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                              {getPanelTypeLabel(panel.panelType)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <EditButton 
                            label="Edit Panel" 
                            onClick={() => handleEditPanel(panel)} 
                          />
                          <DeleteButton
                            entityTitle="Panel"
                            subjectName={panel.title}
                            onConfirm={() => deleteCustomizerPanel(panel.id)}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="space-y-4 pt-0">
                        {panel.subtitle && (
                          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            <strong>Subtitle:</strong> {panel.subtitle}
                          </p>
                        )}
                        {panel.message && (
                          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            <strong>Message:</strong> {panel.message}
                          </p>
                        )}

                        {/* Panel Items or Topping Preview */}
                        {panel.panelType === "topping" ? (
                          <div>
                            <h4 className="font-medium mb-3" style={{ color: "var(--foreground)" }}>-- Topping Selection Preview --</h4>
                            {(() => {
                              const template = customizerTemplates.find(t => t.id === selectedTemplate);
                              const subCategory = subCategories.find(s => s.id === template?.subCategoryId);
                              const menuCategoryId = subCategory?.categoryId;
                              
                              if (!menuCategoryId) {
                                return (
                                  <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                                    Unable to load topping preview (no menu category found)
                                  </p>
                                );
                              }
                              
                              return (
                                <ToppingSelector
                                  toppings={toppings}
                                  toppingCategories={toppingCategories}
                                  menuCategoryId={menuCategoryId}
                                  selectedToppings={[]}
                                  readonly={false}
                                  title={panel.title}
                                  description={panel.subtitle || "Choose toppings and specify placement"}
                                  showPlacementControls={panel.showPlacementControls ?? true}
                                />
                              );
                            })()}
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium" style={{ color: 'var(--card-foreground)' }}>Panel Items</h4>
                              <Button 
                                size="sm" 
                                onClick={() => handleCreateItem(panel.id)}
                                className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                                style={{
                                  backgroundColor: 'var(--primary)',
                                  color: 'var(--primary-foreground)',
                                  borderColor: 'var(--primary)'
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Item
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {panelItems.length === 0 ? (
                                <p className="text-sm italic" style={{ color: 'var(--muted-foreground)' }}>No items defined</p>
                              ) : (
                                panelItems.map((item) => {
                                  const visibilityBadge = getVisibilityBadge(item, index);
                                  return (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-center p-3 rounded"
                                      style={{
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--card)'
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <p className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                                              {getItemDisplayName(item)}
                                            </p>
                                            {visibilityBadge && (
                                              <span 
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                                style={{ 
                                                  backgroundColor: 'var(--accent)', 
                                                  color: 'var(--accent-foreground)',
                                                  border: '1px solid var(--border)'
                                                }}
                                                title={`Visible for ${visibilityBadge} parent selections`}
                                              >
                                                <Eye className="h-3 w-3 mr-1" />
                                                {visibilityBadge}
                                              </span>
                                            )}
                                          </div>
                                          {item.customPrice > 0 && (
                                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                              Price: ${item.customPrice.toFixed(2)}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        {index > 0 && panel.panelType !== "topping" && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleManageItemVisibility(item, index)}
                                            className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)]"
                                            title="Manage visibility rules"
                                          >
                                            <Sliders className="h-4 w-4" />
                                          </Button>
                                        )}
                                        <EditButton
                                          label="Edit Item"
                                          onClick={() => handleEditItem(item)}
                                        />
                                        <DeleteButton
                                          entityTitle="Panel Item"
                                          subjectName={getItemDisplayName(item)}
                                          onConfirm={() => deleteCustomizerPanelItem(item.id)}
                                        />
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--card-foreground)' }}>{templateForm.id ? "Edit" : "Create"} Customizer Template</DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
              Define a customizer for a specific sub-category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Template Name</Label>
              <Input
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                placeholder="e.g., Pizza Customizer"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Sub-Category</Label>
              <Select
                value={templateForm.subCategoryId}
                onValueChange={(value) =>
                  setTemplateForm({ ...templateForm, subCategoryId: value })
                }
              >
                <SelectTrigger
                  style={{
                    backgroundColor: 'var(--input)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                  {subCategories.map((subCat) => (
                    <SelectItem key={subCat.id} value={subCat.id} style={{ color: 'var(--popover-foreground)' }}>
                      {subCat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={templateForm.isActive}
                onCheckedChange={(checked) =>
                  setTemplateForm({ ...templateForm, isActive: !!checked })
                }
              />
              <Label htmlFor="isActive" style={{ color: 'var(--foreground)' }}>Active</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsTemplateDialogOpen(false)}
                className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTemplate}
                className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)'
                }}
              >
                <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Panel Dialog */}
      <Dialog open={isPanelDialogOpen} onOpenChange={setIsPanelDialogOpen}>
        <DialogContent style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--card-foreground)' }}>{panelForm.id ? "Edit" : "Create"} Panel</DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)' }}>Define a customization panel</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Panel Type</Label>
              <RadioGroup
                value={panelForm.panelType}
                onValueChange={(value: any) => setPanelForm({ ...panelForm, panelType: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="size" 
                    id="type-size"
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)'
                    }}
                  />
                  <Label htmlFor="type-size" style={{ color: 'var(--foreground)' }}>Size Panel (shows sub-category sizes)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="custom_list" 
                    id="type-custom"
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)'
                    }}
                  />
                  <Label htmlFor="type-custom" style={{ color: 'var(--foreground)' }}>Custom List (user-defined items)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="topping" 
                    id="type-topping"
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)'
                    }}
                  />
                  <Label htmlFor="type-topping" style={{ color: 'var(--foreground)' }}>Topping Panel (shows toppings)</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Title</Label>
              <Input
                value={panelForm.title}
                onChange={(e) => setPanelForm({ ...panelForm, title: e.target.value })}
                placeholder="e.g., Choose Size"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Subtitle (optional)</Label>
              <Input
                value={panelForm.subtitle}
                onChange={(e) => setPanelForm({ ...panelForm, subtitle: e.target.value })}
                placeholder="e.g., Select your preferred size"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Message (optional)</Label>
              <Textarea
                value={panelForm.message}
                onChange={(e) => setPanelForm({ ...panelForm, message: e.target.value })}
                placeholder="e.g., Gluten-free crust only available in 10 inch"
                rows={3}
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            {panelForm.panelType === 'topping' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={panelForm.showPlacementControls}
                    onCheckedChange={(checked) =>
                      setPanelForm({ ...panelForm, showPlacementControls: !!checked })
                    }
                  />
                  <Label style={{ color: 'var(--foreground)' }}>Show topping placement buttons</Label>
                </div>
              </div>
            )}
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Display Order</Label>
              <Input
                type="number"
                min="1"
                value={panelForm.displayOrder}
                onChange={(e) =>
                  setPanelForm({ ...panelForm, displayOrder: parseInt(e.target.value) || 1 })
                }
                placeholder="1"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={panelForm.isActive}
                onCheckedChange={(checked) =>
                  setPanelForm({ ...panelForm, isActive: !!checked })
                }
              />
              <Label style={{ color: 'var(--foreground)' }}>Active</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsPanelDialogOpen(false)}
                className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSavePanel}
                className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)'
                }}
              >
                <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--card-foreground)' }}>{itemForm.id ? "Edit" : "Create"} Panel Item</DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)' }}>Add an item to the panel</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {itemForm.itemType === "custom" ? (
              <>
                <div>
                  <Label style={{ color: 'var(--foreground)' }}>Item Name</Label>
                  <Input
                    value={itemForm.customName}
                    onChange={(e) => setItemForm({ ...itemForm, customName: e.target.value })}
                    placeholder="e.g., Thin Crust"
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </div>
                <div>
                  <Label style={{ color: 'var(--foreground)' }}>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={itemForm.customPrice}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, customPrice: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </div>
              </>
            ) : itemForm.itemType === "size" ? (
              <div>
                <Label style={{ color: 'var(--foreground)' }}>Select Size</Label>
                <Select
                  value={itemForm.itemId}
                  onValueChange={(value) => setItemForm({ ...itemForm, itemId: value })}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    {(() => {
                      // Filter sizes by the template's category
                      const template = customizerTemplates.find(t => t.id === selectedTemplate);
                      const subCategory = subCategories.find(s => s.id === template?.subCategoryId);
                      const categoryId = subCategory?.categoryId;
                      
                      const filteredSizes = categoryId 
                        ? categorySizes.filter(size => size.categoryId === categoryId).sort((a, b) => a.displayOrder - b.displayOrder)
                        : categorySizes.sort((a, b) => a.displayOrder - b.displayOrder);
                      
                      if (filteredSizes.length === 0) {
                        return (
                          <div className="p-2 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
                            No sizes available for this category
                          </div>
                        );
                      }
                      
                      return filteredSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id} style={{ color: 'var(--popover-foreground)' }}>
                          {size.sizeName}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label style={{ color: 'var(--foreground)' }}>Select Topping</Label>
                <Select
                  value={itemForm.itemId}
                  onValueChange={(value) => setItemForm({ ...itemForm, itemId: value })}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <SelectValue placeholder="Select topping" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    {toppings.map((topping) => (
                      <SelectItem key={topping.id} value={topping.id} style={{ color: 'var(--popover-foreground)' }}>
                        {topping.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Display Order</Label>
              <Input
                type="number"
                min="1"
                value={itemForm.displayOrder}
                onChange={(e) =>
                  setItemForm({ ...itemForm, displayOrder: parseInt(e.target.value) || 1 })
                }
                placeholder="1"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={itemForm.isActive}
                onCheckedChange={(checked) =>
                  setItemForm({ ...itemForm, isActive: !!checked })
                }
              />
              <Label style={{ color: 'var(--foreground)' }}>Active</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsItemDialogOpen(false)}
                className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveItem}
                className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)'
                }}
              >
                <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Visibility Dialog */}
      <Dialog open={isItemVisibilityDialogOpen} onOpenChange={setIsItemVisibilityDialogOpen}>
        <DialogContent style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--card-foreground)' }}>
              Manage Visibility: {itemVisibilityForm.itemName}
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
              Select which parent items should show this item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {itemVisibilityForm.parentPanelId && (() => {
              const parentPanelItems = getPanelItems(itemVisibilityForm.parentPanelId);
              const allSelected = itemVisibilityForm.selectedParentItemIds.size === parentPanelItems.length;
              const someSelected = itemVisibilityForm.selectedParentItemIds.size > 0 && !allSelected;
              
              return (
                <>
                  {/* Select/Deselect All */}
                  <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Select all
                          setItemVisibilityForm({
                            ...itemVisibilityForm,
                            selectedParentItemIds: new Set(parentPanelItems.map(p => p.id))
                          });
                        } else {
                          // Deselect all
                          setItemVisibilityForm({
                            ...itemVisibilityForm,
                            selectedParentItemIds: new Set()
                          });
                        }
                      }}
                      className={someSelected ? "data-[state=checked]:bg-primary" : ""}
                    />
                    <Label 
                      style={{ color: 'var(--foreground)', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => {
                        if (allSelected) {
                          setItemVisibilityForm({
                            ...itemVisibilityForm,
                            selectedParentItemIds: new Set()
                          });
                        } else {
                          setItemVisibilityForm({
                            ...itemVisibilityForm,
                            selectedParentItemIds: new Set(parentPanelItems.map(p => p.id))
                          });
                        }
                      }}
                    >
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </Label>
                  </div>

                  {/* Individual parent items */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {parentPanelItems.map((parentItem) => {
                      const isChecked = itemVisibilityForm.selectedParentItemIds.has(parentItem.id);
                      return (
                        <div 
                          key={parentItem.id} 
                          className="flex items-center gap-3 p-2 rounded hover:bg-[var(--accent)] transition-colors"
                          onClick={() => {
                            const newSelected = new Set(itemVisibilityForm.selectedParentItemIds);
                            if (isChecked) {
                              newSelected.delete(parentItem.id);
                            } else {
                              newSelected.add(parentItem.id);
                            }
                            setItemVisibilityForm({
                              ...itemVisibilityForm,
                              selectedParentItemIds: newSelected
                            });
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(itemVisibilityForm.selectedParentItemIds);
                              if (checked) {
                                newSelected.add(parentItem.id);
                              } else {
                                newSelected.delete(parentItem.id);
                              }
                              setItemVisibilityForm({
                                ...itemVisibilityForm,
                                selectedParentItemIds: newSelected
                              });
                            }}
                          />
                          <Label 
                            style={{ color: 'var(--foreground)', cursor: 'pointer', flex: 1 }}
                          >
                            Show <strong>{itemVisibilityForm.itemName}</strong> when <strong>{getItemDisplayName(parentItem)}</strong> is selected
                          </Label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Info message */}
                  {itemVisibilityForm.selectedParentItemIds.size === 0 && (
                    <div 
                      className="p-3 rounded flex items-start gap-2"
                      style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <p className="text-sm">
                        No items selected. This item will be <strong>visible for all</strong> parent selections by default.
                      </p>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <Button 
                variant="outline" 
                onClick={() => setIsItemVisibilityDialogOpen(false)}
                className="border bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] transition-colors duration-200 hover:bg-[var(--accent)]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveItemVisibility}
                className="transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)'
                }}
              >
                <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
                Save Rules
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
