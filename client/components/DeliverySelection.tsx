import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            ORDER DETAILS
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            How do you want your Pronto's today?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Method Selection */}
          <div className="space-y-4">
            {/* Carryout Option */}
            <Card
              className={`cursor-pointer transition-all border-2 ${
                selectedMethod === "carryout"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod("carryout")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3">
                  <Car className="h-6 w-6" />
                  <div>
                    <div className="text-lg font-bold">STORE PICKUP</div>
                    <div
                      className={`text-sm ${
                        selectedMethod === "carryout"
                          ? "text-blue-100"
                          : "text-gray-600"
                      }`}
                    >
                      Order will be waiting for you in the store.
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="text-center text-gray-500 font-medium">OR</div>

            {/* Delivery Option */}
            <Card
              className={`cursor-pointer transition-all border-2 ${
                selectedMethod === "delivery"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod("delivery")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      ORDER DELIVERY
                    </div>
                    <div className="text-sm text-gray-600">
                      • Traditional Delivery
                      <br />• Pronto's Hotspots*
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Store Information */}
          {selectedMethod === "carryout" && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <MapPin className="h-5 w-5" />
                  <span>STORE</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="font-semibold">914 Ashland Rd</div>
                  <div className="text-gray-600">Mansfield OH 44905</div>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    Change Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Address Form */}
          {selectedMethod === "delivery" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="addressType">Address Type</Label>
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

                <div>
                  <Label htmlFor="street" className="text-red-600">
                    * Street Address:
                  </Label>
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
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Unit #:</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-red-600">
                      * ZIP Code:
                    </Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-red-600">
                      * City:
                    </Label>
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
                </div>

                <div>
                  <Label htmlFor="state" className="text-red-600">
                    * State:
                  </Label>
                  <Select
                    value={deliveryAddress.state}
                    onValueChange={(value) =>
                      setDeliveryAddress({ ...deliveryAddress, state: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OH">OH</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                      <SelectItem value="WV">WV</SelectItem>
                      <SelectItem value="KY">KY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-500">
                  * Indicates required field.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!isFormValid()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 text-lg"
            >
              {selectedMethod === "delivery"
                ? "CONTINUE FOR DELIVERY"
                : "CONTINUE"}
            </Button>
          </div>

          {selectedMethod === "delivery" && (
            <div className="text-center">
              <Button variant="link" className="text-blue-600">
                Find Nearby Pronto's Hotspots*
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
