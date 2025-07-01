import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import {
  ArrowLeft,
  CreditCard,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
} from "lucide-react";

interface CheckoutData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pickupTime: string;
  paymentMethod: "card" | "cash";
  cardInfo: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  specialInstructions: string;
  agreedToTerms: boolean;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customerInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    pickupTime: "asap",
    paymentMethod: "card",
    cardInfo: {
      number: "",
      expiry: "",
      cvv: "",
      name: "",
    },
    specialInstructions: "",
    agreedToTerms: false,
  });

  // Mock order data
  const orderTotal = 45.87;
  const estimatedTime = "15-20 minutes";

  const handleInputChange = (
    section: keyof CheckoutData,
    field: string,
    value: string | boolean,
  ) => {
    setCheckoutData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleSubmitOrder = async () => {
    if (!checkoutData.agreedToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Implement actual order submission
      console.log("Submitting order:", checkoutData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success page or show success message
      navigate("/order-success");
    } catch (error) {
      console.error("Order submission error:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = ["As soon as possible"];
    const now = new Date();
    const startTime = new Date(now.getTime() + 20 * 60000); // 20 minutes from now

    for (let i = 0; i < 8; i++) {
      const slotTime = new Date(startTime.getTime() + i * 15 * 60000); // 15-minute intervals
      const timeString = slotTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(timeString);
    }

    return slots;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Cart
            </Link>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-red-600" />
              <span className="text-lg font-semibold">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  We'll use this information to contact you about your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={checkoutData.customerInfo.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          "customerInfo",
                          "firstName",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={checkoutData.customerInfo.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          "customerInfo",
                          "lastName",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={checkoutData.customerInfo.email}
                    onChange={(e) =>
                      handleInputChange("customerInfo", "email", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={checkoutData.customerInfo.phone}
                    onChange={(e) =>
                      handleInputChange("customerInfo", "phone", e.target.value)
                    }
                    placeholder="(419) 555-0123"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pickup Time */}
            <Card>
              <CardHeader>
                <CardTitle>Pickup Time</CardTitle>
                <CardDescription>
                  When would you like to pick up your order?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={checkoutData.pickupTime}
                  onValueChange={(value) =>
                    setCheckoutData((prev) => ({
                      ...prev,
                      pickupTime: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeSlots().map((slot, index) => (
                      <SelectItem
                        key={index}
                        value={index === 0 ? "asap" : slot}
                      >
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Estimated preparation time: {estimatedTime}
                </p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose how you'd like to pay for your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={checkoutData.paymentMethod}
                  onValueChange={(value: "card" | "cash") =>
                    setCheckoutData((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Pay with Cash at Pickup</Label>
                  </div>
                </RadioGroup>

                {checkoutData.paymentMethod === "card" && (
                  <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium">Card Information</h4>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={checkoutData.cardInfo.name}
                        onChange={(e) =>
                          handleInputChange("cardInfo", "name", e.target.value)
                        }
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={checkoutData.cardInfo.number}
                        onChange={(e) =>
                          handleInputChange(
                            "cardInfo",
                            "number",
                            e.target.value,
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={checkoutData.cardInfo.expiry}
                          onChange={(e) =>
                            handleInputChange(
                              "cardInfo",
                              "expiry",
                              e.target.value,
                            )
                          }
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={checkoutData.cardInfo.cvv}
                          onChange={(e) =>
                            handleInputChange("cardInfo", "cvv", e.target.value)
                          }
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
                <CardDescription>
                  Any special requests or notes for your order?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={checkoutData.specialInstructions}
                  onChange={(e) =>
                    setCheckoutData((prev) => ({
                      ...prev,
                      specialInstructions: e.target.value,
                    }))
                  }
                  placeholder="Any special cooking instructions, allergy notes, etc."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={checkoutData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setCheckoutData((prev) => ({
                        ...prev,
                        agreedToTerms: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    I agree to the{" "}
                    <Link to="/terms" className="text-red-600 hover:underline">
                      terms and conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-red-600 hover:underline"
                    >
                      privacy policy
                    </Link>
                    . I understand this is a carry-out only order.
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Store Information */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Pickup Location
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      914 Ashland Rd, Mansfield, OH 44905
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      (419) 589-7777
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Open until 10:00 PM
                    </p>
                  </div>
                </div>

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$42.47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>$3.40</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Pickup Time Display */}
                <div className="p-3 bg-gray-50 border rounded">
                  <p className="text-sm font-medium">
                    Pickup Time:{" "}
                    {checkoutData.pickupTime === "asap"
                      ? "As soon as possible"
                      : checkoutData.pickupTime}
                  </p>
                  <p className="text-xs text-gray-600">
                    Estimated ready in {estimatedTime}
                  </p>
                </div>

                {/* Submit Order Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={isProcessing || !checkoutData.agreedToTerms}
                >
                  {isProcessing ? (
                    "Processing Order..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Place Order - ${orderTotal.toFixed(2)}
                    </>
                  )}
                </Button>

                {checkoutData.paymentMethod === "cash" && (
                  <p className="text-xs text-gray-600 text-center">
                    Payment will be collected at pickup
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
