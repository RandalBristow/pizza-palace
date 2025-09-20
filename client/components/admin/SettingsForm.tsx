import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ThemeDropdown } from '../page_components/ThemeDropdown';

interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

interface Settings {
  taxRate: number;
  deliveryFee: number;
  theme?: string; // Add theme field
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
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Restaurant Settings</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--card-foreground)' }}>Tax & Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="taxRate" style={{ color: 'var(--foreground)' }}>Tax Rate (%)</Label>
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
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Current rate: {settings.taxRate || 0}%
              </p>
            </div>
            <div>
              <Label htmlFor="deliveryFee" style={{ color: 'var(--foreground)' }}>Delivery Fee ($)</Label>
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
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Current fee: ${settings.deliveryFee || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--card-foreground)' }}>Business Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {Object.entries(settings.businessHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex w-full flex-row space-x-2 p-2 rounded text-sm"
                  style={{ border: `1px solid var(--border)`, backgroundColor: 'var(--card)' }}
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
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: hours.closed ? 'var(--input)' : 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}
                  />
                  <span className="w-12 font-medium capitalize text-xs" style={{ color: 'var(--foreground)' }}>
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
                        className="w-30 h-6 text-xs"
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
                      <span className="text-xs" style={{ color: 'var(--foreground)' }}>-</span>
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
                        className="w-30 h-6 text-xs"
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
                  ) : (
                    <span className="italic text-xs" style={{ color: 'var(--muted-foreground)' }}>Closed</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--card-foreground)' }}>Theme Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme" style={{ color: 'var(--foreground)' }}>Website Theme</Label>
              <ThemeDropdown 
                currentTheme={settings.theme || 'classic-pizza'}
                onThemeChange={(newTheme) => {
                  onSettingsChange({
                    ...settings,
                    theme: newTheme
                  });
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
