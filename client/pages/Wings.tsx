import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import DeliverySelection from "../components/DeliverySelection";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Minus } from "lucide-react";

interface WingsOrder {
  size: string;
  sauce: string;
  quantity: number;
  dippingSauces: { [key: string]: number };
  basePrice: number;
}

interface DippingSauce {
  id: string;
  name: string;
  price: number;
}

const wingSizes = [
  { size: "1/2 Pound", price: 8.99 },
  { size: "1 Pound", price: 14.99 },
  { size: "1 1/2 Pound", price: 19.99 },
  { size: "2 Pound", price: 24.99 },
  { size: "3 Pound", price: 34.99 },
];

const wingSauces = [
  { id: "hot", name: "Hot", price: 0 },
  { id: "garlic-parmesan", name: "Garlic Parmesan", price: 0 },
  { id: "bbq", name: "BBQ", price: 0 },
  { id: "spicy-bbq", name: "Spicy BBQ", price: 0 },
  { id: "ranch", name: "Ranch", price: 0 },
  { id: "caribbean-jerk", name: "Caribbean Jerk", price: 0 },
  { id: "plain", name: "Plain", price: 0 },
];

const dippingSauces: DippingSauce[] = [
  { id: "side-ranch", name: "Side Ranch", price: 0.75 },
  { id: "side-blue-cheese", name: "Side Blue Cheese", price: 0.75 },
  { id: "side-buffalo", name: "Side Buffalo", price: 0.75 },
  { id: "side-bbq", name: "Side BBQ", price: 0.75 },
  { id: "side-spicy-bbq", name: "Side Spicy BBQ", price: 0.75 },
  { id: "side-garlic-parmesan", name: "Side Garlic Parmesan", price: 0.75 },
  { id: "side-caribbean-jerk", name: "Side Caribbean Jerk", price: 0.75 },
];

export default function Wings() {
  const navigate = useNavigate();
  const { hasDeliveryDetails, deliveryDetails, setDeliveryDetails } =
    useOrder();
  const [searchParams] = useSearchParams();

  const [wingsOrder, setWingsOrder] = useState<WingsOrder>({
    size: "",
    sauce: "",
    quantity: 1,
    dippingSauces: {},
    basePrice: 0,
  });
  const [cart, setCart] = useState<any[]>([]);
  const [showDeliverySelection, setShowDeliverySelection] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: () => void;
    type: string;
  } | null>(null);

  useEffect(() => {
    // Show delivery selection modal if delivery details are not set
    if (!hasDeliveryDetails) {
      setShowDeliverySelection(true);
    }

    // Get item details from URL params if available
    const itemId = searchParams.get("item");
    const size = searchParams.get("size");

    if (size) {
      const sizeInfo = wingSizes.find((s) => s.size === size);
      if (sizeInfo) {
        setWingsOrder((prev) => ({
          ...prev,
          size: size,
          basePrice: sizeInfo.price,
        }));
      }
    }
  }, [hasDeliveryDetails, searchParams]);

  const handleSizeChange = (size: string) => {
    const sizeInfo = wingSizes.find((s) => s.size === size);
    setWingsOrder((prev) => ({
      ...prev,
      size: size,
      basePrice: sizeInfo?.price || 0,
    }));
  };

  const handleSauceChange = (sauce: string) => {
    setWingsOrder((prev) => ({
      ...prev,
      sauce: sauce,
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setWingsOrder((prev) => ({
        ...prev,
        quantity: newQuantity,
      }));
    }
  };

  const handleDippingSauceChange = (sauceId: string, quantity: number) => {
    setWingsOrder((prev) => ({
      ...prev,
      dippingSauces: {
        ...prev.dippingSauces,
        [sauceId]: Math.max(0, quantity),
      },
    }));
  };

  const calculateTotal = () => {
    let total = wingsOrder.basePrice * wingsOrder.quantity;

    // Add dipping sauce costs
    Object.entries(wingsOrder.dippingSauces).forEach(([sauceId, quantity]) => {
      const sauce = dippingSauces.find((s) => s.id === sauceId);
      if (sauce && quantity > 0) {
        total += sauce.price * quantity * wingsOrder.quantity;
      }
    });

    return total;
  };

  const addToCart = () => {
    if (!hasDeliveryDetails) {
      setPendingAction({
        action: () => {
          const cartItem = {
            id: `wings-${Date.now()}`,
            name: `${wingsOrder.size} Wings - ${wingSauces.find((s) => s.id === wingsOrder.sauce)?.name}`,
            price: calculateTotal(),
            quantity: wingsOrder.quantity,
            customizations: {
              size: wingsOrder.size,
              sauce: wingsOrder.sauce,
              dippingSauces: wingsOrder.dippingSauces,
            },
          };
          setCart((prev) => [...prev, cartItem]);
        },
        type: "addToCart",
      });
      setShowDeliverySelection(true);
      return;
    }

    const cartItem = {
      id: `wings-${Date.now()}`,
      name: `${wingsOrder.size} Wings - ${wingSauces.find((s) => s.id === wingsOrder.sauce)?.name}`,
      price: calculateTotal(),
      quantity: wingsOrder.quantity,
      customizations: {
        size: wingsOrder.size,
        sauce: wingsOrder.sauce,
        dippingSauces: wingsOrder.dippingSauces,
      },
    };
    setCart((prev) => [...prev, cartItem]);
  };

  const handleDeliveryConfirm = (details: any) => {
    setDeliveryDetails(details);
    setShowDeliverySelection(false);
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery
        cart={cart}
        breadcrumbs={[
          { label: "Menu", href: "/menu" },
          { label: "Customize Your Wings" },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customize Your Wings
          </h1>
          <p className="text-gray-600 mt-1">Fresh wings, made to order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customization Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Choose Size with Quantity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Choose Size
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="quantity" className="text-sm font-medium">
                      Qty:
                    </Label>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleQuantityChange(wingsOrder.quantity - 1)
                        }
                        disabled={wingsOrder.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {wingsOrder.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleQuantityChange(wingsOrder.quantity + 1)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={wingsOrder.size}
                  onValueChange={handleSizeChange}
                >
                  <div className="space-y-3">
                    {wingSizes.map((size) => (
                      <div
                        key={size.size}
                        className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50"
                      >
                        <RadioGroupItem value={size.size} id={size.size} />
                        <Label
                          htmlFor={size.size}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex justify-between">
                            <span>{size.size}</span>
                            <span className="font-semibold">
                              ${size.price.toFixed(2)}
                            </span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Choose Sauce */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Sauce</CardTitle>
                <CardDescription>Select your wing sauce</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={wingsOrder.sauce}
                  onValueChange={handleSauceChange}
                >
                  <div className="space-y-3">
                    {wingSauces.map((sauce) => (
                      <div
                        key={sauce.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={sauce.id} id={sauce.id} />
                        <Label
                          htmlFor={sauce.id}
                          className="flex-1 cursor-pointer"
                        >
                          {sauce.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Extra Dipping Sauce */}
            <Card>
              <CardHeader>
                <CardTitle>Extra Dipping Sauce</CardTitle>
                <CardDescription>Add extra dipping sauces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dippingSauces.map((sauce) => (
                    <div
                      key={sauce.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{sauce.name}</span>
                          <span className="text-sm text-gray-500">
                            +${sauce.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDippingSauceChange(
                              sauce.id,
                              (wingsOrder.dippingSauces[sauce.id] || 0) - 1,
                            )
                          }
                          disabled={!wingsOrder.dippingSauces[sauce.id]}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {wingsOrder.dippingSauces[sauce.id] || 0}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDippingSauceChange(
                              sauce.id,
                              (wingsOrder.dippingSauces[sauce.id] || 0) + 1,
                            )
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Size */}
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-semibold">
                    {wingsOrder.size || "Not selected"}
                  </span>
                </div>

                {/* Sauce */}
                <div className="flex justify-between">
                  <span>Sauce:</span>
                  <span className="font-semibold">
                    {wingsOrder.sauce
                      ? wingSauces.find((s) => s.id === wingsOrder.sauce)
                          ?.name || "Not selected"
                      : "Not selected"}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-semibold">{wingsOrder.quantity}</span>
                </div>

                {/* Dipping Sauces */}
                {Object.entries(wingsOrder.dippingSauces).map(
                  ([sauceId, quantity]) => {
                    const sauce = dippingSauces.find((s) => s.id === sauceId);
                    if (!sauce || quantity === 0) return null;
                    return (
                      <div
                        key={sauceId}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {sauce.name} x{quantity * wingsOrder.quantity}
                        </span>
                        <span>
                          +$
                          {(
                            sauce.price *
                            quantity *
                            wingsOrder.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    );
                  },
                )}

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full"
                  disabled={!wingsOrder.size || !wingsOrder.sauce}
                  onClick={addToCart}
                >
                  Add to Cart
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/menu">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delivery Selection Modal */}
      <DeliverySelection
        isOpen={showDeliverySelection}
        onClose={() => {
          setShowDeliverySelection(false);
          setPendingAction(null);
        }}
        onConfirm={handleDeliveryConfirm}
        currentDetails={deliveryDetails}
      />
    </div>
  );
}
