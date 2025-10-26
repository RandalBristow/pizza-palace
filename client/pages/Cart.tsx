import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useCart, CartItem } from "../contexts/CartContext";
import { Input } from "../components/ui/input";
import { Plus, Minus, ShoppingCart, CreditCard, Edit } from "lucide-react";

// Cart items now come from CartContext

// Get restaurant settings for tax rate
const getRestaurantSettings = () => {
  try {
    const stored = localStorage.getItem("restaurantSettings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }

  return { taxRate: 8.25 }; // Default tax rate
};

export default function Cart() {
  const { items: cartItems, updateQuantity: updateCartQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [taxRate, setTaxRate] = useState(getRestaurantSettings().taxRate);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Listen for settings updates
  useEffect(() => {
    const handleStorageChange = () => {
      setTaxRate(getRestaurantSettings().taxRate);
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setItemToDelete(id);
      setDeleteConfirmOpen(true);
    } else {
      updateCartQuantity(id, newQuantity);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
      setItemToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleEditItem = (item: CartItem) => {
    // Navigate to the order customization page with the item's details
    const editUrl = `/order?item=${item.menuItemId}&size=${item.size || ''}&edit=${item.id}`;
    navigate(editUrl);
  };

  const canEditItem = (item: CartItem) => {
    // Only show edit button for items that went through a customizer
    // Items with selections definitely have a customizer
    if (item.selections && item.selections.length > 0) return true;
    
    // Otherwise, no edit button (simple items like wings without customizer)
    return false;
  };

  const calculateItemTotal = (item: CartItem) => {
    // Calculate from displayed rounded prices to match what customer sees
    let displayedSubtotal = 0;
    
    // Add base price
    displayedSubtotal += parseFloat(item.price.toFixed(2));
    
    // Add selection prices
    if (item.selections && item.selections.length > 0) {
      item.selections.forEach((selection) => {
        if (selection.price && selection.price > 0) {
          displayedSubtotal += parseFloat(selection.price.toFixed(2));
        }
      });
    }
    
    // Add topping prices
    if (item.toppings && item.toppings.length > 0) {
      item.toppings.forEach((topping) => {
        if (topping.price > 0) {
          displayedSubtotal += parseFloat(topping.price.toFixed(2));
        }
      });
    }
    
    return displayedSubtotal * item.quantity;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <HeaderWithDelivery
          breadcrumbs={[
            { label: "Menu", href: "/menu" },
            { label: "Shopping Cart" },
          ]}
        />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="h-20 w-20 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Your cart is empty
            </h2>
            <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
              Add some delicious items from our menu to get started!
            </p>
            <Button 
              asChild 
              size="lg"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <HeaderWithDelivery
        breadcrumbs={[
          { label: "Menu", href: "/menu" },
          { label: "Shopping Cart" },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              // Determine if this item has a customizer breakdown
              const hasCustomizerBreakdown = (item.selections && item.selections.length > 0) || (item.toppings && item.toppings.length > 0);
              
              return (
                <Card key={item.id} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-0" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
                        
                        {/* Show price breakdown for items with customizers */}
                        {hasCustomizerBreakdown ? (
                          (() => {
                            // Calculate subtotal from displayed rounded prices
                            let displayedSubtotal = 0;
                            
                            // Add base price
                            if (item.size) {
                              displayedSubtotal += parseFloat(item.price.toFixed(2));
                            }
                            
                            // Add selection prices
                            if (item.selections && item.selections.length > 0) {
                              item.selections.forEach((selection) => {
                                if (selection.price && selection.price > 0) {
                                  displayedSubtotal += parseFloat(selection.price.toFixed(2));
                                }
                              });
                            }
                            
                            // Add topping prices
                            if (item.toppings && item.toppings.length > 0) {
                              item.toppings.forEach((topping) => {
                                if (topping.price > 0) {
                                  displayedSubtotal += parseFloat(topping.price.toFixed(2));
                                }
                              });
                            }
                            
                            return (
                              <div className="space-y-0 mb-4">
                                {/* Size display without price breakdown initially */}
                                {item.size && (
                                  <div className="flex justify-between text-sm">
                                    <span style={{ color: 'var(--muted-foreground)' }}>{item.size}</span>
                                    <span style={{ color: 'var(--foreground)' }}>${item.price.toFixed(2)}</span>
                                  </div>
                                )}
                                
                                {/* Selections (Crust, Sauce, etc.) with prices */}
                                {item.selections && item.selections.length > 0 && (
                                  <>
                                    {item.selections.map((selection, index) => {
                                      const hasPrice = !!(selection.price && selection.price > 0);
                                      return (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span style={{ color: 'var(--muted-foreground)' }}>
                                            {selection.panelTitle}: {selection.itemName}
                                          </span>
                                          {hasPrice && (
                                            <span style={{ color: 'var(--foreground)' }}>
                                              ${selection.price.toFixed(2)}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                                
                                {/* Toppings with individual prices */}
                                {item.toppings && item.toppings.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                                      {item.toppingCategoryName || 'Toppings'}:
                                    </p>
                                    <div className="space-y-0">
                                      {item.toppings.map((topping, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span style={{ color: 'var(--muted-foreground)' }}>
                                            {topping.name}
                                            {topping.placement && topping.placement !== 'whole' && ` (${topping.placement})`}
                                            {topping.amount === "extra" && " - Extra"}
                                          </span>
                                          <span style={{ color: 'var(--foreground)' }}>
                                            {topping.price > 0 ? `+$${topping.price.toFixed(2)}` : 'Included'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Subtotal for this line item (price × quantity) */}
                                <div className="flex justify-end font-semibold text-md pt-2 space-x-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                                  <span style={{ color: 'var(--foreground)' }}>Subtotal:</span>
                                  <span style={{ color: 'var(--foreground)' }}>${(displayedSubtotal * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          /* Simple items without customizers */
                          <>
                            {item.size && (
                              <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{item.size}</p>
                            )}
                          </>
                        )}
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              style={{
                                color: 'var(--primary)',
                                borderColor: 'var(--primary)',
                                backgroundColor: 'var(--card)'
                              }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium" style={{ color: 'var(--foreground)' }}>{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              style={{
                                color: 'var(--primary)',
                                borderColor: 'var(--primary)',
                                backgroundColor: 'var(--card)'
                              }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            {canEditItem(item) && (
                              <Button
                                variant="outline"
                                size="sm"
                                style={{
                                  color: 'var(--primary)',
                                  borderColor: 'var(--primary)',
                                  backgroundColor: 'var(--card)'
                                }}
                                onClick={() => handleEditItem(item)}
                                className="ml-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--card-foreground)' }}>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>Promo Code</h4>
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
                        style={{
                          color: '#059669'
                        }}
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
                        style={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Button 
                        variant="outline" 
                        onClick={applyPromoCode}
                        style={{
                          color: 'var(--primary)',
                          borderColor: 'var(--primary)',
                          backgroundColor: 'var(--card)'
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex justify-between" style={{ color: 'var(--foreground)' }}>
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.discount}%):</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ color: 'var(--foreground)' }}>
                    <span>Tax ({taxRate}%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full" 
                  size="lg" 
                  asChild
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  <Link to="/checkout">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Link>
                </Button>

                {/* Additional Info */}
                <div className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
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
        <AlertDialogContent style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'var(--foreground)' }}>Remove Item from Cart</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--muted-foreground)' }}>
              Are you sure you want to remove this item from your cart? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={cancelDelete}
              style={{
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              style={{
                backgroundColor: 'var(--destructive)',
                color: 'white'
              }}
            >
              Remove Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
