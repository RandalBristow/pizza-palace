import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, Edit, Trash2, Save, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Category } from "./MenuCategoryForm";
import { MenuItem } from "./MenuItemForm";

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to create special';
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

    try {
      await updateSpecial(editingSpecial.id, newSpecial);
      setEditingSpecial(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update special:', error);
    }
  };

  const handleDeleteSpecial = async (id: string) => {
    try {
      await deleteSpecial(id);
    } catch (error) {
      console.error('Failed to delete special:', error);
    }
  };

  const toggleSpecialStatus = async (id: string) => {
    const special = specials.find(s => s.id === id);
    if (!special) return;

    try {
      await updateSpecial(id, { ...special, isActive: !special.isActive });
    } catch (error) {
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
  };

  const renderSpecialForm = (isEdit: boolean = false) => (
    <div className="flex h-full relative">
      {/* Left Column - Basic Info */}
      <div className="w-1/2 pr-6 pl-6 py-6 space-y-4 overflow-y-auto max-h-full">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Special" : "Add New Special"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "Update the special offer details and settings"
              : "Create a new special offer with menu items and discount settings"}
          </p>
        </div>
        <div>
          <Label htmlFor="specialName">Special Name</Label>
          <Input
            id="specialName"
            placeholder="e.g., Lunch Pizza Special"
            value={newSpecial.name}
            onChange={(e) =>
              setNewSpecial({ ...newSpecial, name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="specialDescription">Description</Label>
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
          />
        </div>
        <div>
          <Label htmlFor="specialType">Type</Label>
          <Select
            value={newSpecial.type}
            onValueChange={(value: any) =>
              setNewSpecial({ ...newSpecial, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">
                Hourly by Day (e.g., lunch specials)
              </SelectItem>
              <SelectItem value="daily">
                Daily (every day for a period)
              </SelectItem>
              <SelectItem value="weekly">
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
                <Label htmlFor="startTime">Start Time</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
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
                />
              </div>
            </div>
            <div>
              <Label>Days of Week</Label>
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
                    />
                    <Label htmlFor={`day-${index}`} className="text-sm">
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
            <Label>Day of Week</Label>
            <Select
              value={newSpecial.dayOfWeek?.toString()}
              onValueChange={(value) =>
                setNewSpecial({
                  ...newSpecial,
                  dayOfWeek: parseInt(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
                <SelectItem value="2">Tuesday</SelectItem>
                <SelectItem value="3">Wednesday</SelectItem>
                <SelectItem value="4">Thursday</SelectItem>
                <SelectItem value="5">Friday</SelectItem>
                <SelectItem value="6">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
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
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
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
            />
          </div>
        </div>
      </div>

      {/* Right Column - Menu Selection */}
      <div className="w-1/2 px-6 border-l flex flex-col h-full pb-16 gap-1.5">
        <div className="mb-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>
          <p className="text-sm text-gray-500">
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
                                    ${item.price.toFixed(2)}
                                    {newSpecial.discountType === "percentage" &&
                                      newSpecial.discountValue > 0 && (
                                        <span className="ml-2 text-green-600">
                                          → $
                                          {(
                                            item.price *
                                            (1 - newSpecial.discountValue / 100)
                                          ).toFixed(2)}
                                        </span>
                                      )}
                                    {newSpecial.discountType === "flat" &&
                                      newSpecial.discountValue > 0 && (
                                        <span className="ml-2 text-green-600">
                                          → $
                                          {newSpecial.discountValue.toFixed(2)}
                                        </span>
                                      )}
                                  </span>
                                </div>
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">
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
        <div className="mt-2 py-2 pb-6 border-t">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Discount Settings
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={newSpecial.discountType}
                  onValueChange={(value: any) =>
                    setNewSpecial({
                      ...newSpecial,
                      discountType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="flat">Flat Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discountValue">
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
                />
              </div>
            </div>

            <div style={{ minHeight: "60px" }}>
              {newSpecial.discountType === "percentage" &&
                newSpecial.discountValue > 0 && (
                  <div>
                    <Label>Preview Discount</Label>
                    <div className="p-2 bg-green-50 border rounded text-sm text-green-700">
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
      <div className="absolute bottom-0 left-0 right-0 flex justify-end space-x-2 p-4 border-t bg-gray-50 z-10">
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
        >
          Cancel
        </Button>
        <Button onClick={isEdit ? handleUpdateSpecial : handleAddSpecial}>
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? "Update Special" : "Save Special"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Specials</h2>
        <Dialog open={isAddingSpecial} onOpenChange={setIsAddingSpecial}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Special
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl h-[95vh] max-h-[95vh] overflow-hidden p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Add New Special</DialogTitle>
              <DialogDescription>
                Create a new hourly, daily, or weekly special offer with menu
                selection and discount options
              </DialogDescription>
            </DialogHeader>
            {renderSpecialForm(false)}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {specials.map((special) => (
          <Card key={special.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{special.name}</h3>
                    <Badge variant="outline">
                      {special.type === "hourly"
                        ? "Hourly"
                        : special.type === "daily"
                          ? "Daily"
                          : "Weekly"}
                    </Badge>
                    <Badge
                      className={
                        special.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {special.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {special.description}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSpecialStatus(special.id)}
                        >
                          {special.isActive ? (
                            <ThumbsUp className="h-4 w-4" />
                          ) : (
                            <ThumbsDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {special.isActive ? "Deactivate" : "Activate"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSpecial(special)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Special</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSpecial(special.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Special</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
            <DialogTitle>Edit Special</DialogTitle>
            <DialogDescription>
              Update the special offer details and settings
            </DialogDescription>
          </DialogHeader>
          {renderSpecialForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
