import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RequiredFieldLabel } from "./ui/required-field-label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin, Car, Truck, X } from "lucide-react";

interface DeliveryDetails {
  method: "carryout" | "delivery";
  address?: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
    addressType: string;
  };
  store?: {
    id: string;
    name: string;
    address: string;
  };
}

interface DeliverySelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: DeliveryDetails) => void;
  currentDetails?: DeliveryDetails;
}

export default function DeliverySelection({
  isOpen,
  onClose,
  onConfirm,
  currentDetails,
}: DeliverySelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<"carryout" | "delivery">(
    currentDetails?.method || "carryout",
  );
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: currentDetails?.address?.street || "",
    unit: currentDetails?.address?.unit || "",
    city: currentDetails?.address?.city || "Mansfield",
    state: currentDetails?.address?.state || "OH",
    zipCode: currentDetails?.address?.zipCode || "44905",
    addressType: currentDetails?.address?.addressType || "House",
  });

  const defaultStore = {
    id: "store_1",
    name: "Pronto Pizza Cafe",
    address: "914 Ashland Rd, Mansfield, OH 44905",
  };

  const handleContinue = () => {
    const details: DeliveryDetails = {
      method: selectedMethod,
      ...(selectedMethod === "delivery"
        ? { address: deliveryAddress }
        : { store: defaultStore }),
    };
    onConfirm(details);
  };

  const isFormValid = () => {
    if (selectedMethod === "carryout") return true;
    return (
      deliveryAddress.street &&
      deliveryAddress.city &&
      deliveryAddress.state &&
      deliveryAddress.zipCode
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[var(--card-foreground)]">
            ORDER DETAILS
          </DialogTitle>
          <DialogDescription className="text-[var(--muted-foreground)]">
            How do you want your Pronto's today?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Method Selection */}
          <div className="space-y-4">
            {/* Carryout Option */}
            <Card
              className={`cursor-pointer transition-all border-2 ${selectedMethod === 'carryout' ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--primary)]'}`}
              onClick={() => setSelectedMethod("carryout")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3">
                  <Car className="h-6 w-6 text-[var(--primary)]" />
                  <div>
                    <div className="text-lg font-bold text-[var(--card-foreground)]">STORE PICKUP</div>
                    <div className={`text-sm text-[var(--muted-foreground)]`}>
                      • Order will be waiting for you in the store.
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="text-center text-[var(--muted-foreground)] font-medium">OR</div>

            {/* Delivery Option */}
            <Card
              className={`cursor-pointer transition-all border-2 ${selectedMethod === 'delivery' ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--primary)]'}`}
              onClick={() => setSelectedMethod("delivery")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-[var(--primary)]" />
                  <div>
                    <div className="text-lg font-bold text-[var(--card-foreground)]">
                      ORDER DELIVERY
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      • Traditional Delivery
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Store Information */}
          {selectedMethod === "carryout" && (
            <Card className="bg-[var(--muted)]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[var(--card-foreground)]">
                  <MapPin className="h-5 w-5" />
                  <span>STORE</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--card-foreground)]">914 Ashland Rd</div>
                  <div className="text-[var(--muted-foreground)]">Mansfield OH 44905</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Address Form */}
          {selectedMethod === "delivery" && (
            <Card className="border-[var(--border)]">
              <CardHeader>
                <CardTitle className="text-[var(--card-foreground)]">
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <RequiredFieldLabel htmlFor="addressType" className="text-[var(--card-foreground)]">
                      Address Type
                    </RequiredFieldLabel>
                  <Select
                    value={deliveryAddress.addressType}
                    onValueChange={(value) =>
                      setDeliveryAddress({
                        ...deliveryAddress,
                        addressType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-[60%_auto] gap-4">
                  <div>
                    <RequiredFieldLabel htmlFor="street" className="text-[var(--card-foreground)]">
                      Street Address
                    </RequiredFieldLabel>
                    <Input
                      id="street"
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          street: e.target.value,
                        })
                      }
                      placeholder="Enter street address"
                      required
                      className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit" className="text-[var(--card-foreground)]">
                      Address Unit
                    </Label>
                    <Input
                      id="unit"
                      value={deliveryAddress.unit}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          unit: e.target.value,
                        })
                      }
                      placeholder="Apt, Suite, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[60%_auto] gap-4">
                  <div>
                    <RequiredFieldLabel htmlFor="city" className="text-[var(--card-foreground)]">
                      City
                    </RequiredFieldLabel>
                    <Input
                      id="city"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          city: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <RequiredFieldLabel htmlFor="zipCode" className="text-[var(--card-foreground)]">
                      ZIP Code
                    </RequiredFieldLabel>
                    <Input
                      id="zipCode"
                      value={deliveryAddress.zipCode}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          zipCode: e.target.value,
                        })
                      }
                      placeholder="44905"
                      required
                      className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!isFormValid()}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] border border-[var(--primary)] transition-colors duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50 font-bold py-3 px-8 text-lg"
            >
              {selectedMethod === "delivery"
                ? "CONTINUE FOR DELIVERY"
                : "CONTINUE"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
