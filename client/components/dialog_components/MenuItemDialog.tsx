import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RequiredFieldLabel } from "../ui/required-field-label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ActivationButton from "../shared_components/ActivationButton";
import ImageSelector from "../ui/image-selector";
import { Category } from "../admin/MenuCategoriesForm";
import { useCustomizerTemplates, useCustomizerPanels, useCustomizerPanelItems } from "../../hooks/useSupabase";
import { MenuItem, ToppingCategory, Topping, CategorySize } from "../../../shared/api";

// Types imported from shared/api.ts

interface MenuItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem?: MenuItem | null;
  categories: Category[];
  subCategories?: any[];
  toppingCategories: ToppingCategory[];
  toppings: Topping[];
  categorySizes?: CategorySize[];
  subCategorySizes?: any[];
  menuItemSizes?: any[];
  images?: any[];
  onSave: (menuItemData: any, sizePrices: any, defaultToppings: Record<string, { amount: "normal" | "extra" }>, defaultListSelections?: Record<string, string>, availableToppings?: string[]) => Promise<void>;
  getToppingPriceForSize?: (toppingId: string, sizeId: string) => number;
}

export default function MenuItemDialog({
  isOpen,
  onClose,
  menuItem,
  categories,
  subCategories = [],
  toppingCategories,
  toppings,
  categorySizes = [],
  subCategorySizes = [],
  menuItemSizes = [],
  images = [],
  onSave,
  getToppingPriceForSize,
}: MenuItemDialogProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    category: "",
    subCategoryId: undefined,
    imageId: undefined,
    isActive: true,
  });
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);
  const [sizePrices, setSizePrices] = useState<{ [key: string]: number }>({});
  const [priceInputValues, setPriceInputValues] = useState<{ [key: string]: string }>({});
  const [originalSizePrices, setOriginalSizePrices] = useState<{ [key: string]: number }>({});
  const [itemToppings, setItemToppings] = useState<{ [key: string]: boolean }>({});
  const [defaultToppings, setDefaultToppings] = useState<{ [key: string]: { amount: "normal" | "extra" } }>({});
  const [defaultListSelections, setDefaultListSelections] = useState<Record<string, string>>({});

  // Fetch customizer data
  const { customizerTemplates, loading: templatesLoading } = useCustomizerTemplates();
  const { customizerPanels, loading: panelsLoading } = useCustomizerPanels();
  const { customizerPanelItems, loading: itemsLoading } = useCustomizerPanelItems();

  const isEdit = !!menuItem;

  useEffect(() => {
    if (menuItem) {
      setFormData({
        ...menuItem,
        name: menuItem.name || "",
        description: menuItem.description || "",
        category: menuItem.category || "",
        subCategoryId: menuItem.subCategoryId,
        imageId: menuItem.imageId,
        isActive: menuItem.isActive ?? true,
      });

      setSelectedImageId(menuItem.imageId);

      // Load existing prices for this menu item
      const itemSizes = menuItemSizes.filter(
        (ms) => ms.menu_item_id === menuItem.id,
      );
      const prices: { [key: string]: number } = {};
      const inputVals: { [key: string]: string } = {};
      itemSizes.forEach((itemSize) => {
        prices[itemSize.category_size_id] = itemSize.price;
        inputVals[itemSize.category_size_id] = itemSize.price.toFixed(2);
      });
      setSizePrices(prices);
      setPriceInputValues(inputVals);
      setOriginalSizePrices(prices); // Store original prices for restoration

      // No need to set selected size anymore - toppings are menu-item level

      // Load default toppings (support both old array format and new object format)
      if (menuItem.defaultToppings) {
        const defaultToppingsMap: { [key: string]: { amount: "normal" | "extra" } } = {};
        
        if (Array.isArray(menuItem.defaultToppings)) {
          // Old format: array of topping IDs (assume "normal" amount)
          menuItem.defaultToppings.forEach((toppingId: string) => {
            defaultToppingsMap[toppingId] = { amount: "normal" };
          });
        } else if (typeof menuItem.defaultToppings === 'object') {
          // New format: object with amount info
          Object.keys(menuItem.defaultToppings).forEach((toppingId) => {
            const value = (menuItem.defaultToppings as any)[toppingId];
            if (value && typeof value === 'object' && value.amount) {
              defaultToppingsMap[toppingId] = { amount: value.amount };
            } else {
              // Fallback for any other format
              defaultToppingsMap[toppingId] = { amount: "normal" };
            }
          });
        }
        
        setDefaultToppings(defaultToppingsMap);
      }

      // Load default list selections
      if (menuItem.defaultListSelections) {
        setDefaultListSelections(menuItem.defaultListSelections);
      }

      // Load available toppings for this menu item
      if (menuItem.availableToppings && Array.isArray(menuItem.availableToppings) && menuItem.availableToppings.length > 0) {
        // Get all toppings for this category
        const allCategoryToppings = toppings.filter(t => t.menuItemCategory === menuItem.category);
        const availableToppingsMap: { [key: string]: boolean } = {};
        
        // Mark toppings NOT in availableToppings as disabled (false)
        allCategoryToppings.forEach((topping) => {
          if (!menuItem.availableToppings!.includes(topping.id)) {
            availableToppingsMap[topping.id] = false;
          }
          // Don't set true for available ones - undefined means available
        });
        
        setItemToppings(availableToppingsMap);
        console.log('Loaded itemToppings:', availableToppingsMap);
      } else {
        // If no availableToppings defined, all toppings are available by default
        setItemToppings({});
      }
    } else {
      resetForm();
    }
  }, [menuItem, menuItemSizes, toppings]);

  // Clear default list selections when subcategory changes
  useEffect(() => {
    if (!menuItem) {
      setDefaultListSelections({});
    }
  }, [formData.subCategoryId, menuItem]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      subCategoryId: undefined,
      imageId: undefined,
      isActive: true,
    });
    setSelectedImageId(undefined);
    setSizePrices({});
    setPriceInputValues({});
    setOriginalSizePrices({});
    setItemToppings({});
    setDefaultToppings({});
    setDefaultListSelections({});
  };

  // Helper function to get customizer template for the item
  // Returns the assigned template if one is selected
  const getCustomizerTemplate = () => {
    if (!formData.customizerTemplateId) return null;
    
    return customizerTemplates.find(
      (template) => template.id === formData.customizerTemplateId && template.isActive
    );
  };

  // Helper function to get list panels for the current template
  const getListPanels = () => {
    try {
      const template = getCustomizerTemplate();
      if (!template) return [];
      
      const allPanels = customizerPanels.filter(
        (panel) => panel && panel.customizerTemplateId === template.id
      );
      const listPanels = allPanels.filter(
        (panel) => panel && panel.panelType === 'custom_list'
      );
      const activePanels = listPanels.filter(
        (panel) => panel && panel.isActive
      );
      
      return activePanels.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (error) {
      console.error('Error in getListPanels:', error);
      return [];
    }
  };

  // Helper function to get panel items for a specific panel
  const getPanelItems = (panelId: string) => {
    try {
      return customizerPanelItems.filter(
        (item) => item && item.customizerPanelId === panelId && item.isActive
      ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (error) {
      console.error('Error in getPanelItems:', error);
      return [];
    }
  };

  const getAvailableSizes = (categoryId: string, subCategoryId?: string) => {
    if (!subCategoryId) {
      return [];
    }

    const subCategorySizeIds = subCategorySizes
      .filter((scs) => scs.subCategoryId === subCategoryId)
      .map((scs) => scs.categorySizeId);

    const availableSizes = categorySizes
      .filter(
        (size) =>
          size.categoryId === categoryId &&
          size.isActive &&
          subCategorySizeIds.includes(size.id),
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return availableSizes;
  };

  const handleSizePriceChange = (sizeId: string, value: string) => {
    // Allow only numbers and one decimal point while typing
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (cleanValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    // Update the raw input value (what user sees)
    setPriceInputValues((prev) => ({
      ...prev,
      [sizeId]: cleanValue,
    }));
  };

  const handlePriceBlur = (sizeId: string) => {
    // Format and save the price when user leaves the field
    const rawValue = priceInputValues[sizeId] || '0';
    const price = parseFloat(rawValue) || 0;
    
    setSizePrices((prev) => ({
      ...prev,
      [sizeId]: price,
    }));
    
    // Format the display value
    setPriceInputValues((prev) => ({
      ...prev,
      [sizeId]: price.toFixed(2),
    }));
  };

  const handleToppingToggle = (toppingId: string, isActive: boolean) => {
    setItemToppings((prev) => ({
      ...prev,
      [toppingId]: isActive,
    }));

    // If disabling a topping, also remove it from defaults
    if (!isActive && defaultToppings[toppingId]) {
      setDefaultToppings((prev) => {
        const updated = { ...prev };
        delete updated[toppingId];
        return updated;
      });
    }
  };

  const handleDefaultToppingToggle = (
    toppingId: string,
    isDefault: boolean,
  ) => {
    console.log('handleDefaultToppingToggle called:', { toppingId, isDefault });
    if (!isDefault) {
      setDefaultToppings((prev) => {
        const updated = { ...prev };
        delete updated[toppingId];
        console.log('Removing topping, updated state:', updated);
        return updated;
      });
    } else {
      setDefaultToppings((prev) => {
        const newState = {
          ...prev,
          [toppingId]: { amount: prev[toppingId]?.amount || "normal" },
        };
        console.log('Adding topping, updated state:', newState);
        return newState;
      });
    }
  };

  const handleDefaultToppingAmountToggle = (
    toppingId: string,
    amount: "normal" | "extra"
  ) => {
    setDefaultToppings((prev) => ({
      ...prev,
      [toppingId]: { amount },
    }));
  };

  const handleSave = async () => {
    try {
      console.log('=== handleSave START ===');
      console.log('defaultToppings state at save time:', defaultToppings);
      console.log('Object.keys(defaultToppings):', Object.keys(defaultToppings));
      console.log('formData at save time:', formData);
      
      // Convert defaultToppings object to format for backend
      const defaultToppingsData = Object.keys(defaultToppings).reduce((acc, toppingId) => {
        console.log('Processing topping in reduce:', toppingId, defaultToppings[toppingId]);
        acc[toppingId] = defaultToppings[toppingId];
        return acc;
      }, {} as Record<string, { amount: "normal" | "extra" }>);
      console.log('defaultToppingsData after reduce:', defaultToppingsData);

      // Convert itemToppings to array of available topping IDs
      // Include all toppings for this category EXCEPT the ones explicitly disabled
      const categoryToppings = toppings?.filter(
        (t) => t.menuItemCategory === formData.category
      ) || [];
      const availableToppingsArray = categoryToppings
        .filter((t) => itemToppings[t.id] !== false) // Include if not explicitly disabled
        .map((t) => t.id);

      console.log('=== SAVING MENU ITEM ===');
      console.log('Category:', formData.category);
      console.log('ItemToppings state:', itemToppings);
      console.log('CategoryToppings found:', categoryToppings.length);
      console.log('AvailableToppings array:', availableToppingsArray);
      console.log('DefaultToppings with amounts:', defaultToppingsData);
      console.log('DefaultListSelections:', defaultListSelections);
      await onSave(
        {
          ...formData,
          imageId: selectedImageId,
        },
        sizePrices,
        defaultToppingsData,
        defaultListSelections,
        availableToppingsArray
      );

      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to save menu item:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl h-[calc(68vh+100px)] flex flex-col p-0"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle style={{ color: 'var(--card-foreground)' }}>
            {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
            {isEdit
              ? "Update menu item details and size-based pricing"
              : "Create a new menu item with size-based pricing"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-0 flex-1 overflow-hidden">
          {/* Left Column - Item Details with Tabs */}
          <div className="p-6 pl-8 flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {isEdit
                  ? "Update menu item details and size-based pricing"
                  : "Create a new menu item with size-based pricing"}
              </p>
            </div>

            <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="defaults">Defaults</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Category and Sub-Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <RequiredFieldLabel
                  htmlFor="category"
                  style={{ color: "var(--foreground)" }}
                >
                  Category
                </RequiredFieldLabel>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      category: value,
                      subCategoryId: undefined,
                    });
                    setSizePrices({});
                    setItemToppings({});
                  }}
                  required
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
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
                    <SelectValue placeholder="Select category" style={{ color: 'var(--muted-foreground)' }} />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    {categories
                      .filter((c) => c.isActive)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id} style={{ color: 'var(--popover-foreground)' }}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <RequiredFieldLabel
                  htmlFor="subCategory"
                  style={{ color: "var(--foreground)" }}
                >
                  Sub-Category
                </RequiredFieldLabel>
                <Select
                  value={formData.subCategoryId || ""}
                  onValueChange={(value) => {
                    const newSubCategoryId = value || undefined;
                    setFormData({
                      ...formData,
                      subCategoryId: newSubCategoryId,
                    });
                    
                    // If returning to original subcategory, restore original prices
                    if (menuItem && newSubCategoryId === menuItem.subCategoryId) {
                      setSizePrices(originalSizePrices);
                    } else {
                      setSizePrices({});
                    }
                  }}
                  disabled={!formData.category}
                  required
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
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
                    <SelectValue placeholder="Select sub-category" style={{ color: 'var(--muted-foreground)' }} />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    {subCategories
                      .filter(
                        (sub) =>
                          sub.categoryId === formData.category && sub.isActive,
                      )
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((subCategory) => (
                        <SelectItem key={subCategory.id} value={subCategory.id} style={{ color: 'var(--popover-foreground)' }}>
                          {subCategory.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Name and Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <RequiredFieldLabel
                  htmlFor="name"
                  style={{ color: "var(--foreground)" }}
                >
                  Name
                </RequiredFieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Item name"
                  required
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
                />
              </div>

              <div>
                <RequiredFieldLabel
                  htmlFor="image"
                  style={{ color: "var(--foreground)" }}
                >
                  Image
                </RequiredFieldLabel>
                <ImageSelector
                  images={images}
                  selectedImageId={selectedImageId}
                  onImageSelect={(imageId, imageUrl) => {
                    setSelectedImageId(imageId);
                    setFormData({ ...formData, image: imageUrl || "" });
                  }}
                  placeholder="Select an image (optional)..."
                  label=""
                  required={false}
                  showPreview={false}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <RequiredFieldLabel
                htmlFor="description"
                style={{ color: "var(--foreground)" }}
              >
                Description
              </RequiredFieldLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                placeholder="Item description"
                rows={3}
                required
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
              />
            </div>
              </TabsContent>

              {/* Defaults Tab */}
              <TabsContent value="defaults" className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Customizer Template Selection */}
            {formData.subCategoryId && !templatesLoading && (() => {
              const availableTemplates = customizerTemplates.filter(
                (t) => t.subCategoryId === formData.subCategoryId && t.isActive
              );
              
              if (availableTemplates.length === 0) return null;
              
              return (
                <div>
                  <Label htmlFor="customizerTemplate" style={{ color: "var(--foreground)" }}>
                    Customizer Template (Optional)
                  </Label>
                  <Select
                    value={formData.customizerTemplateId || "none"}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        customizerTemplateId: value === "none" ? undefined : value,
                      });
                      // Reset default list selections when template changes
                      setDefaultListSelections({});
                    }}
                  >
                    <SelectTrigger
                      style={{
                        backgroundColor: 'var(--input)',
                        borderColor: 'var(--border)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        outline: 'none'
                      }}
                    >
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                      <SelectItem value="none" style={{ color: 'var(--popover-foreground)' }}>
                        None (no customizer)
                      </SelectItem>
                      {availableTemplates.map((template) => (
                        <SelectItem 
                          key={template.id} 
                          value={template.id}
                          style={{ color: 'var(--popover-foreground)' }}
                        >
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Select a customizer template for this menu item
                  </p>
                </div>
              );
            })()}

            {/* Default List Selections */}
            {formData.subCategoryId && !templatesLoading && !panelsLoading && !itemsLoading && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getListPanels().map((panel) => {
                    const panelItems = getPanelItems(panel.id);
                    const panelTitle = panel.title || panel.name || 'Unnamed Panel';
                    return (
                      <div key={panel.id}>
                        <RequiredFieldLabel className="text-sm" style={{ color: "var(--foreground)" }}>
                          {panelTitle}
                        </RequiredFieldLabel>
                        <Select 
                          value={defaultListSelections[panel.id] || "none"}
                          onValueChange={(value) => {
                            setDefaultListSelections(prev => ({
                              ...prev,
                              [panel.id]: value === "none" ? "" : value
                            }));
                          }}
                        >
                          <SelectTrigger
                            style={{
                              backgroundColor: 'var(--input)',
                              borderColor: 'var(--border)',
                              border: '1px solid var(--border)',
                              color: 'var(--foreground)',
                              outline: 'none'
                            }}
                          >
                            <SelectValue placeholder={`Select ${panelTitle.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                            <SelectItem value="none" style={{ color: 'var(--popover-foreground)' }}>
                              None (no default)
                            </SelectItem>
                            {panelItems.map((item) => (
                              <SelectItem 
                                key={item.id} 
                                value={item.id}
                                style={{ color: 'var(--popover-foreground)' }}
                              >
                                {item.name || item.customName || 'Unnamed Item'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Show Add to Cart Button - Only shown when customizer exists */}
            {formData.subCategoryId && getCustomizerTemplate() && (
              <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--accent)' }}>
                <Checkbox
                  id="showAddToCart"
                  checked={formData.showAddToCart ?? true}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      showAddToCart: checked as boolean,
                    })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="showAddToCart"
                    className="text-sm font-medium leading-none cursor-pointer"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Show 'Add to Cart' button on menu page
                  </label>
                  <p className="text-xs leading-snug" style={{ color: 'var(--muted-foreground)' }}>
                    Uncheck this if the item must be customized before adding to cart (e.g., Build Your Own items with no defaults)
                  </p>
                </div>
              </div>
            )}
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Size-based Pricing */}
            {formData.category && formData.subCategoryId && (
              <div>
                <RequiredFieldLabel
                  htmlFor="description"
                  style={{ color: "var(--foreground)" }}
                >
                  Size-based Pricing
                </RequiredFieldLabel>
                <div className="mt-1 rounded-lg py-1 px-4" style={{ border: '1px solid var(--border)' }}>
                  {getAvailableSizes(
                    formData.category,
                    formData.subCategoryId,
                  ).length === 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        No sizes defined for this sub-category. Please configure
                        sizes for the sub-category first.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                      {getAvailableSizes(
                        formData.category,
                        formData.subCategoryId,
                      ).map((size) => (
                        <div key={size.id} className="flex items-center justify-between">
                          <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                            {size.sizeName}:
                          </Label>
                          <div className="relative w-32">
                            <span 
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                              style={{ color: 'var(--muted-foreground)' }}
                            >
                              $
                            </span>
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="0.00"
                              value={priceInputValues[size.id] || ""}
                              onChange={(e) =>
                                handleSizePriceChange(size.id, e.target.value)
                              }
                              className="h-9 pl-6 pr-3 text-sm text-right"
                              required
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
                                handlePriceBlur(size.id);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.category && !formData.subCategoryId && (
              <div className="rounded-lg p-3" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--accent)' }}>
                <p className="text-sm" style={{ color: 'var(--card-foreground)' }}>
                  Please select a sub-category to configure size-based pricing.
                </p>
              </div>
            )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Toppings */}
          <div className="p-6 flex flex-col h-full">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Topping Management</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Enable/disable toppings for this menu item. Check boxes to set default
                toppings.
              </p>
            </div>

            {/* Toppings Tabs */}
            <div className="flex-1 overflow-hidden">
              {formData.category ? (
                (() => {
                  // In admin dialog, show all topping categories (don't hide based on enabled toppings)
                  const availableCategories = toppingCategories.filter(
                    (tc) => tc.isActive && tc.menuItemCategory === formData.category
                  );
                  return (
                    <Tabs
                      defaultValue={availableCategories[0]?.id}
                      className="w-full h-full overflow-hidden border rounded"
                      style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                      key={formData.category}
                    >
                      <TabsList className="w-full justify-start rounded-none">
                        {availableCategories.map((toppingCategory) => (
                          <TabsTrigger
                            key={toppingCategory.id}
                            value={toppingCategory.id}
                            className="text-xs"
                          >
                            {toppingCategory.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      <div className="mt-3 flex-1 overflow-y-auto">
                        {availableCategories.map((toppingCategory) => (
                          <TabsContent
                            key={toppingCategory.id}
                            value={toppingCategory.id}
                            className="mt-0 space-y-2"
                          >
                            <div className="space-y-1">
                              {toppings
                                .filter(
                                  (t) =>
                                    t.category === toppingCategory.id,
                                )
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((topping) => {
                                  // Check if topping is globally active
                                  const isGloballyActive = topping.isActive;
                                  // Check if topping is enabled for this menu item (default to true if not explicitly disabled)
                                  const isEnabledForItem = itemToppings[topping.id] !== false;
                                  // Only enabled if both globally active AND enabled for this item
                                  const isActive = isGloballyActive && isEnabledForItem;
                                  const isDefault = !!defaultToppings[topping.id];
                                  // Get average price across all sizes for display
                                  const firstSize = getAvailableSizes(formData.category, formData.subCategoryId)[0];
                                  const toppingPrice = getToppingPriceForSize && firstSize
                                    ? getToppingPriceForSize(topping.id, firstSize.id)
                                    : topping.price || 0;

                                  return (
                                    <div
                                      key={topping.id}
                                      className="flex items-center justify-between mx-1 py-1 px-2 border rounded text-xs"
                                      style={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--foreground)'
                                      }}
                                    >
                                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        <Checkbox
                                          id={`default-${topping.id}`}
                                          checked={isDefault && isActive}
                                          disabled={!isActive}
                                          onCheckedChange={(checked) =>
                                            handleDefaultToppingToggle(
                                              topping.id,
                                              !!checked,
                                            )
                                          }
                                          className="w-4 h-4"
                                        />
                                        <div className="flex flex-col flex-1 min-w-0">
                                          <span className="font-medium truncate">
                                            {topping.name}
                                          </span>
                                          <span style={{ color: 'var(--muted-foreground)' }}>
                                            +${toppingPrice.toFixed(2)}
                                          </span>
                                        </div>
                                        {!isGloballyActive && (
                                          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                            Globally Inactive
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* Amount buttons - only show when topping is default */}
                                      {isDefault && (
                                        <div className="flex gap-1 mr-2">
                                          <button
                                            type="button"
                                            onClick={() => handleDefaultToppingAmountToggle(topping.id, "normal")}
                                            className="px-2 py-1 text-xs rounded transition-colors"
                                            style={{
                                              backgroundColor: defaultToppings[topping.id]?.amount === "normal" ? 'var(--primary)' : 'var(--muted)',
                                              color: defaultToppings[topping.id]?.amount === "normal" ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                                              border: '1px solid var(--border)'
                                            }}
                                          >
                                            Normal
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDefaultToppingAmountToggle(topping.id, "extra")}
                                            className="px-2 py-1 text-xs rounded transition-colors"
                                            style={{
                                              backgroundColor: defaultToppings[topping.id]?.amount === "extra" ? 'var(--primary)' : 'var(--muted)',
                                              color: defaultToppings[topping.id]?.amount === "extra" ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                                              border: '1px solid var(--border)'
                                            }}
                                          >
                                            Extra
                                          </button>
                                        </div>
                                      )}
                                      
                                      <ActivationButton
                                        isActive={isEnabledForItem}
                                        onToggle={() =>
                                          handleToppingToggle(
                                            topping.id,
                                            !isEnabledForItem,
                                          )
                                        }
                                        activeTooltip="Disable for this item"
                                        inactiveTooltip="Enable for this item"
                                      />
                                    </div>
                                  );
                                })}
                            </div>
                          </TabsContent>
                        ))}
                      </div>
                    </Tabs>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg border-[var(--border)] text-[var(--muted-foreground)]">
                  <div className="text-center">
                    <p>Select category and sub-category to manage toppings</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-2 pt-4 border-t border-[var(--border)]">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = 'var(--accent)';
                  target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = 'var(--card)';
                  target.style.transform = 'scale(1)';
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !formData.name ||
                  !formData.description ||
                  !formData.category ||
                  !formData.subCategoryId ||
                  getAvailableSizes(formData.category, formData.subCategoryId)
                    .length === 0 ||
                  getAvailableSizes(
                    formData.category,
                    formData.subCategoryId,
                  ).some((size) => !sizePrices[size.id] || sizePrices[size.id] <= 0)
                }
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)',
                  cursor: (!formData.name || !formData.description || !formData.category || !formData.subCategoryId || getAvailableSizes(formData.category, formData.subCategoryId).length === 0 || getAvailableSizes(formData.category, formData.subCategoryId).some((size) => !sizePrices[size.id] || sizePrices[size.id] <= 0)) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'translateY(-1px)';
                    target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                {isEdit ? "Update Menu Item" : "Save Menu Item"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
