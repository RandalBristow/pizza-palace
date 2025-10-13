import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription } from "../ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Save } from "lucide-react";
import { Category } from "./MenuCategoriesForm";
import { MenuItem } from "./MenuItemsForm";
import AddButton from "../shared_components/AddButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import ActivationButton from "../shared_components/ActivationButton";

export interface Special {
  id: string;
  name: string;
  description: string;
  type: "hourly" | "daily" | "weekly";
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
  dayOfWeek?: number;
  menuItems: string[];
  discountType: "percentage" | "flat";
  discountValue: number;
  isActive: boolean;
}

interface SpecialFormProps {
  specials: Special[];
  categories: Category[];
  menuItems: MenuItem[];
  createSpecial: (special: any) => Promise<any>;
  updateSpecial: (id: string, updates: any) => Promise<any>;
  deleteSpecial: (id: string) => Promise<void>;
}

export default function SpecialForm({
  specials,
  categories,
  menuItems,
  createSpecial,
  updateSpecial,
  deleteSpecial
}: SpecialFormProps) {
  const [isAddingSpecial, setIsAddingSpecial] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<Special | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newSpecial, setNewSpecial] = useState<Partial<Special>>({
    name: "",
    description: "",
    type: "daily",
    startDate: "",
    endDate: "",
    menuItems: [],
    discountType: "percentage",
    discountValue: 0,
    isActive: true,
  });

  const handleAddSpecial = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await createSpecial(newSpecial);
      setIsAddingSpecial(false);
      resetForm();
    } catch (error) {
      let errorMessage = 'Failed to create special';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to create special: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to create special:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSpecial = (special: Special) => {
    setEditingSpecial(special);
    setNewSpecial({
      ...special,
      name: special.name || "",
      description: special.description || "",
      type: special.type || "daily",
      startDate: special.startDate || "",
      endDate: special.endDate || "",
      startTime: special.startTime || "",
      endTime: special.endTime || "",
      menuItems: special.menuItems || [],
      discountType: special.discountType || "percentage",
      discountValue: special.discountValue || 0,
      isActive: special.isActive ?? true,
    });
  };

  const handleUpdateSpecial = async () => {
    if (!editingSpecial) return;

    setError(null);
    setIsLoading(true);

    try {
      await updateSpecial(editingSpecial.id, newSpecial);
      setEditingSpecial(null);
      resetForm();
    } catch (error) {
      let errorMessage = 'Failed to update special';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Handle Supabase error objects
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to update special: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to update special:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSpecial = async (id: string) => {
    try {
      await deleteSpecial(id);
    } catch (error) {
      let errorMessage = 'Failed to delete special';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to delete special: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to delete special:', error);
    }
  };

  const toggleSpecialStatus = async (id: string) => {
    const special = specials.find(s => s.id === id);
    if (!special) return;

    try {
      await updateSpecial(id, { ...special, isActive: !special.isActive });
    } catch (error) {
      let errorMessage = 'Failed to toggle special status';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else {
          errorMessage = `Failed to toggle special status: ${JSON.stringify(error)}`;
        }
      }

      setError(errorMessage);
      console.error('Failed to toggle special status:', error);
    }
  };

  const resetForm = () => {
    setNewSpecial({
      name: "",
      description: "",
      type: "daily",
      startDate: "",
      endDate: "",
      menuItems: [],
      discountType: "percentage",
      discountValue: 0,
      isActive: true,
    });
    setError(null);
  };

  const renderSpecialForm = (isEdit: boolean = false) => (
    <div className="flex h-full relative">
      {/* Left Column - Basic Info */}
      <div className="w-1/2 pr-6 pl-6 py-6 space-y-4 overflow-y-auto max-h-full">
        <div className="mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
            {isEdit ? "Edit Special" : "Add New Special"}
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {isEdit
              ? "Update the special offer details and settings"
              : "Create a new special offer with menu items and discount settings"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="specialName" style={{ color: 'var(--foreground)' }}>Special Name</Label>
          <Input
            id="specialName"
            placeholder="e.g., Lunch Pizza Special"
            value={newSpecial.name}
            onChange={(e) =>
              setNewSpecial({ ...newSpecial, name: e.target.value })
            }
            style={{
              backgroundColor: 'var(--input)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div>
          <Label htmlFor="specialDescription" style={{ color: 'var(--foreground)' }}>Description</Label>
          <Textarea
            id="specialDescription"
            placeholder="Describe the special offer"
            rows={3}
            value={newSpecial.description}
            onChange={(e) =>
              setNewSpecial({
                ...newSpecial,
                description: e.target.value,
              })
            }
            style={{
              backgroundColor: 'var(--input)',
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div>
          <Label htmlFor="specialType" style={{ color: 'var(--foreground)' }}>Type</Label>
          <Select
            value={newSpecial.type}
            onValueChange={(value: any) =>
              setNewSpecial({ ...newSpecial, type: value })
            }
          >
            <SelectTrigger
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
              <SelectItem value="hourly" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>
                Hourly by Day (e.g., lunch specials)
              </SelectItem>
              <SelectItem value="daily" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>
                Daily (every day for a period)
              </SelectItem>
              <SelectItem value="weekly" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>
                Weekly (specific day each week)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional fields based on type */}
        {newSpecial.type === "hourly" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" style={{ color: 'var(--foreground)' }}>Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSpecial.startTime || ""}
                  onChange={(e) =>
                    setNewSpecial({
                      ...newSpecial,
                      startTime: e.target.value,
                    })
                  }
                  style={{
                    backgroundColor: 'var(--input)',
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <Label htmlFor="endTime" style={{ color: 'var(--foreground)' }}>End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSpecial.endTime || ""}
                  onChange={(e) =>
                    setNewSpecial({
                      ...newSpecial,
                      endTime: e.target.value,
                    })
                  }
                  style={{
                    backgroundColor: 'var(--input)',
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            <div>
              <Label style={{ color: 'var(--foreground)' }}>Days of Week</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, index) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${index}`}
                      checked={newSpecial.daysOfWeek?.includes(index) || false}
                      onCheckedChange={(checked) => {
                        const days = newSpecial.daysOfWeek || [];
                        if (checked) {
                          setNewSpecial({
                            ...newSpecial,
                            daysOfWeek: [...days, index],
                          });
                        } else {
                          setNewSpecial({
                            ...newSpecial,
                            daysOfWeek: days.filter((d) => d !== index),
                          });
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <Label htmlFor={`day-${index}`} className="text-sm" style={{ color: 'var(--foreground)', cursor: 'pointer' }}>
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {newSpecial.type === "weekly" && (
          <div>
            <Label style={{ color: 'var(--foreground)' }}>Day of Week</Label>
            <Select
              value={newSpecial.dayOfWeek?.toString()}
              onValueChange={(value) =>
                setNewSpecial({
                  ...newSpecial,
                  dayOfWeek: parseInt(value),
                })
              }
            >
              <SelectTrigger
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              >
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                <SelectItem value="0" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Sunday</SelectItem>
                <SelectItem value="1" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Monday</SelectItem>
                <SelectItem value="2" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Tuesday</SelectItem>
                <SelectItem value="3" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Wednesday</SelectItem>
                <SelectItem value="4" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Thursday</SelectItem>
                <SelectItem value="5" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Friday</SelectItem>
                <SelectItem value="6" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" style={{ color: 'var(--foreground)' }}>Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={newSpecial.startDate}
              onChange={(e) =>
                setNewSpecial({
                  ...newSpecial,
                  startDate: e.target.value,
                })
              }
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <Label htmlFor="endDate" style={{ color: 'var(--foreground)' }}>End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={newSpecial.endDate}
              onChange={(e) =>
                setNewSpecial({
                  ...newSpecial,
                  endDate: e.target.value,
                })
              }
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Menu Selection */}
      <div className="w-1/2 px-6 flex flex-col h-full pb-16 gap-1.5" style={{ borderLeft: '1px solid var(--border)' }}>
        <div className="mb-4 py-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>Menu Items</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Select which menu items this special applies to
          </p>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          {(() => {
            const activeCategories = categories.filter((c) => c.isActive);
            return (
              <Tabs
                defaultValue={activeCategories[0]?.id}
                className="w-full h-full"
              >
                <TabsList className="w-full justify-start">
                  {activeCategories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="text-sm"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {activeCategories.map((category) => {
                  const categoryMenuItems = menuItems.filter(
                    (item) => item.category === category.id && item.isActive,
                  );

                  return (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="mt-4"
                    >
                      <div className="max-h-80 overflow-y-auto border rounded-lg p-4 space-y-2">
                        {categoryMenuItems.length > 0 ? (
                          categoryMenuItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`special-item-${item.id}`}
                                checked={
                                  newSpecial.menuItems?.includes(item.id) ||
                                  false
                                }
                                onCheckedChange={(checked) => {
                                  const items = newSpecial.menuItems || [];
                                  if (checked) {
                                    setNewSpecial({
                                      ...newSpecial,
                                      menuItems: [...items, item.id],
                                    });
                                  } else {
                                    setNewSpecial({
                                      ...newSpecial,
                                      menuItems: items.filter(
                                        (i) => i !== item.id,
                                      ),
                                    });
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`special-item-${item.id}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                <div className="flex justify-between items-center">
                                  <span>{item.name}</span>
                                  <span className="text-gray-500 text-xs">
                                    {/* Remove price display since MenuItem doesn't have a price property */}
                                    {newSpecial.discountType === "percentage" &&
                                      newSpecial.discountValue > 0 && (
                                        <span className="ml-2 text-green-600">
                                          {newSpecial.discountValue}% off
                                        </span>
                                      )}
                                    {newSpecial.discountType === "flat" &&
                                      newSpecial.discountValue > 0 && (
                                        <span className="ml-2 text-green-600">
                                          ${newSpecial.discountValue.toFixed(2)}
                                        </span>
                                      )}
                                  </span>
                                </div>
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
                            No active menu items in {category.name}
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            );
          })()}
        </div>

        {/* Discount Section */}
        <div className="mt-2 py-2 pb-6" style={{ borderTop: '1px solid var(--border)' }}>
          <h4 className="text-md font-semibold mb-3" style={{ color: 'var(--card-foreground)' }}>
            Discount Settings
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType" style={{ color: 'var(--foreground)' }}>Discount Type</Label>
                <Select
                  value={newSpecial.discountType}
                  onValueChange={(value: any) =>
                    setNewSpecial({
                      ...newSpecial,
                      discountType: value,
                    })
                  }
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)' }}>
                    <SelectItem value="percentage" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Percentage Off</SelectItem>
                    <SelectItem value="flat" style={{ color: 'var(--popover-foreground)', cursor: 'pointer' }}>Flat Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discountValue" style={{ color: 'var(--foreground)' }}>
                  {newSpecial.discountType === "percentage"
                    ? "Percentage (%)"
                    : "Flat Price ($)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step={newSpecial.discountType === "percentage" ? "1" : "0.01"}
                  min="0"
                  max={
                    newSpecial.discountType === "percentage" ? "100" : undefined
                  }
                  placeholder={
                    newSpecial.discountType === "percentage"
                      ? "e.g., 20"
                      : "e.g., 9.99"
                  }
                  value={newSpecial.discountValue}
                  onChange={(e) =>
                    setNewSpecial({
                      ...newSpecial,
                      discountValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  style={{
                    backgroundColor: 'var(--input)',
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ minHeight: "60px" }}>
              {newSpecial.discountType === "percentage" &&
                newSpecial.discountValue > 0 && (
                  <div>
                    <Label style={{ color: 'var(--foreground)' }}>Preview Discount</Label>
                    <div className="p-2 border rounded text-sm" style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--border)', color: 'var(--card-foreground)' }}>
                      Example: $10.00 → $
                      {(10 * (1 - newSpecial.discountValue / 100)).toFixed(2)}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons fixed at bottom of entire dialog */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-end space-x-2 p-4 z-10" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingSpecial(null);
            } else {
              setIsAddingSpecial(false);
            }
            resetForm();
          }}
          disabled={isLoading}
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            color: 'var(--muted-foreground)',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = 'var(--accent)';
              target.style.transform = 'scale(1.02)';
            }
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
          onClick={isEdit ? handleUpdateSpecial : handleAddSpecial}
          disabled={isLoading}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderColor: 'var(--primary)',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
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
          <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
          {isLoading ? "Saving..." : (isEdit ? "Update Special" : "Save Special")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Specials</h2>
        <Dialog open={isAddingSpecial} onOpenChange={setIsAddingSpecial}>
          <DialogTrigger asChild>
          <AddButton label="Add Special" onClick={() => setIsAddingSpecial(true)} />
          </DialogTrigger>
          <DialogContent 
            className="max-w-7xl h-[95vh] max-h-[95vh] overflow-hidden p-0"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <DialogHeader className="sr-only">
              <DialogTitle style={{ color: 'var(--card-foreground)' }}>Add New Special</DialogTitle>
              <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
                Create a new hourly, daily, or weekly special offer with menu
                selection and discount options
              </DialogDescription>
            </DialogHeader>
            {renderSpecialForm(false)}
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        {specials.map((special) => (
          <Card key={special.id} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>{special.name}</h3>
                    <Badge variant="outline">
                      {special.type === "hourly"
                        ? "Hourly"
                        : special.type === "daily"
                          ? "Daily"
                          : "Weekly"}
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: special.isActive ? '#bbf7d0' : '#fecaca',
                        color: special.isActive ? '#14532d' : '#991b1b',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {special.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    {special.description}
                  </p>
                  <div className="text-xs space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                    <div>
                      {special.startDate} to {special.endDate}
                    </div>
                    {special.type === "hourly" &&
                      special.startTime &&
                      special.endTime && (
                        <div>
                          {special.startTime} - {special.endTime}
                          {special.daysOfWeek && (
                            <span className="ml-2">
                              (
                              {special.daysOfWeek
                                .map(
                                  (d) =>
                                    [
                                      "Sun",
                                      "Mon",
                                      "Tue",
                                      "Wed",
                                      "Thu",
                                      "Fri",
                                      "Sat",
                                    ][d],
                                )
                                .join(", ")}
                              )
                            </span>
                          )}
                        </div>
                      )}
                    {special.type === "weekly" &&
                      special.dayOfWeek !== undefined && (
                        <div>
                          {
                            [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ][special.dayOfWeek]
                          }
                        </div>
                      )}
                    <div>
                      {special.discountType === "percentage"
                        ? `${special.discountValue}% off`
                        : `$${special.discountValue} flat price`}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <ActivationButton
                    isActive={special.isActive}
                    onToggle={() => toggleSpecialStatus(special.id)}
                  />
                  <EditButton onClick={() => handleEditSpecial(special)} />
                  <DeleteButton
                    entityTitle="Special"
                    subjectName={special.name}
                    onConfirm={() => handleDeleteSpecial(special.id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Special Dialog */}
      <Dialog
        open={editingSpecial !== null}
        onOpenChange={(open) => !open && setEditingSpecial(null)}
      >
        <DialogContent className="max-w-7xl h-[95vh] max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle style={{ color: 'var(--card-foreground)' }}>Edit Special</DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
              Update the special offer details and settings
            </DialogDescription>
          </DialogHeader>
          {renderSpecialForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}