import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  crust?: string;
  toppings?: Array<{
    name: string;
    price: number;
    placement: string;
  }>;
  customizations?: string;
}

const mockCartItems: CartItem[] = [
  {
    id: "cart1",
    name: "Margherita Pizza",
    price: 15.99,
    quantity: 1,
    size: '12"',
    crust: "Regular",
    toppings: [
      { name: "Extra Mozzarella", price: 2.0, placement: "whole" },
      { name: "Basil", price: 1.5, placement: "whole" },
    ],
  },
  {
    id: "cart2",
    name: "House Blend Coffee",
    price: 2.99,
    quantity: 2,
  },
  {
    id: "cart3",
    name: "Supreme Pizza",
    price: 21.99,
    quantity: 1,
    size: '14"',
    crust: "Thin",
    toppings: [
      { name: "Pepperoni", price: 2.0, placement: "left" },
      { name: "Sausage", price: 2.5, placement: "right" },
      { name: "Mushrooms", price: 1.5, placement: "whole" },
    ],
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setItemToDelete(id);
      setDeleteConfirmOpen(true);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setCartItems(cartItems.filter((item) => item.id !== itemToDelete));
      setItemToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateItemTotal = (item: CartItem) => {
    const toppingsTotal = item.toppings
      ? item.toppings.reduce((sum, topping) => sum + topping.price, 0)
      : 0;
    return (item.price + toppingsTotal) * item.quantity;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateDiscount = () => {
    if (appliedPromo) {
      return calculateSubtotal() * (appliedPromo.discount / 100);
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "pizza20") {
      setAppliedPromo({ code: "PIZZA20", discount: 20 });
      setPromoCode("");
    } else if (promoCode.toLowerCase() === "welcome10") {
      setAppliedPromo({ code: "WELCOME10", discount: 10 });
      setPromoCode("");
    } else {
      alert("Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderWithDelivery
          cart={cartItems}
          breadcrumbs={[
            { label: "Menu", href: "/menu" },
            { label: "Shopping Cart" },
          ]}
        />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items from our menu to get started!
            </p>
            <Button asChild size="lg">
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery
        cart={cartItems}
        breadcrumbs={[
          { label: "Menu", href: "/menu" },
          { label: "Shopping Cart" },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      {item.size && (
                        <p className="text-sm text-gray-600">
                          {item.size} {item.crust} Crust
                        </p>
                      )}
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">
                            Toppings:
                          </p>
                          <ul className="text-sm text-gray-600">
                            {item.toppings.map((topping, index) => (
                              <li key={index}>
                                {topping.name} ({topping.placement})
                                {topping.price > 0 &&
                                  ` +$${topping.price.toFixed(2)}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-lg">
                        ${calculateItemTotal(item).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        $
                        {(
                          item.price +
                          (item.toppings?.reduce(
                            (sum, t) => sum + t.price,
                            0,
                          ) || 0)
                        ).toFixed(2)}{" "}
                        each
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div>
                  <h4 className="font-medium mb-2">Promo Code</h4>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                      <span className="text-sm font-medium text-green-800">
                        {appliedPromo.code} Applied (-{appliedPromo.discount}%)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                        className="text-green-600 hover:text-green-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyPromoCode}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.discount}%):</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Link>
                </Button>

                {/* Additional Info */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Carry-out only (no delivery)</p>
                  <p>• Estimated prep time: 15-20 minutes</p>
                  <p>• Call (419) 589-7777 for questions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item from Cart</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from your cart? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
