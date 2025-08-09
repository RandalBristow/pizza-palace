import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

interface Settings {
  taxRate: number;
  deliveryFee: number;
  businessHours: {
    [key: string]: BusinessHours;
  };
}

interface SettingsFormProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export default function SettingsForm({
  settings,
  onSettingsChange,
}: SettingsFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Restaurant Settings</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax & Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={settings.taxRate || 0}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    taxRate: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Current rate: {settings.taxRate || 0}%
              </p>
            </div>
            <div>
              <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
              <Input
                id="deliveryFee"
                type="number"
                step="0.01"
                min="0"
                value={settings.deliveryFee || 0}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    deliveryFee: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Current fee: ${settings.deliveryFee || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {Object.entries(settings.businessHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex w-full flex-row space-x-2 p-2 border rounded text-sm"
                >
                  <Checkbox
                    checked={!hours.closed}
                    onCheckedChange={(checked) => {
                      onSettingsChange({
                        ...settings,
                        businessHours: {
                          ...settings.businessHours,
                          [day]: { ...hours, closed: !checked },
                        },
                      });
                    }}
                  />
                  <span className="w-12 font-medium capitalize text-xs">
                    {day.slice(0, 3)}
                  </span>
                  {!hours.closed ? (
                    <div className="flex items-center space-x-1">
                      <Input
                        type="time"
                        value={hours.open || "09:00"}
                        onChange={(e) => {
                          onSettingsChange({
                            ...settings,
                            businessHours: {
                              ...settings.businessHours,
                              [day]: { ...hours, open: e.target.value },
                            },
                          });
                        }}
                        className="w-20 h-6 text-xs"
                      />
                      <span className="text-xs">-</span>
                      <Input
                        type="time"
                        value={hours.close || "17:00"}
                        onChange={(e) => {
                          onSettingsChange({
                            ...settings,
                            businessHours: {
                              ...settings.businessHours,
                              [day]: { ...hours, close: e.target.value },
                            },
                          });
                        }}
                        className="w-20 h-6 text-xs"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 italic text-xs">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
