import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useOrder } from "../context/OrderContext";
import DeliverySelection from "./DeliverySelection";
import { ShoppingCart, ArrowLeft, Pizza, Coffee } from "lucide-react";

interface HeaderWithDeliveryProps {
  title?: string;
  showBackButton?: boolean;
  backTo?: string;
  cart?: any[];
}

export default function HeaderWithDelivery({
  title,
  showBackButton = false,
  backTo = "/",
  cart = [],
}: HeaderWithDeliveryProps) {
  const [showDeliverySelection, setShowDeliverySelection] = useState(false);
  const { deliveryDetails, setDeliveryDetails, hasDeliveryDetails } =
    useOrder();
  const location = useLocation();

  // Don't show delivery button on admin pages
  const isAdminPage = location.pathname.includes("/admin");

  const handleDeliveryConfirm = (details: any) => {
    setDeliveryDetails(details);
    setShowDeliverySelection(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Link
                  to={backTo}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <Pizza className="h-6 w-6 text-red-600" />
                <Coffee className="h-5 w-5 text-amber-700" />
                <span className="text-lg font-semibold">
                  {title || "Pronto Pizza Cafe"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Delivery Details Button - shown on all pages except admin */}
              {!isAdminPage && hasDeliveryDetails && (
                <Button
                  variant="outline"
                  onClick={() => setShowDeliverySelection(true)}
                  className="text-sm flex flex-col items-center h-auto py-2 px-3"
                >
                  <span className="font-semibold">
                    {deliveryDetails?.method === "carryout"
                      ? "CARRYOUT FROM"
                      : "DELIVERY TO"}
                  </span>
                  <span className="text-xs text-gray-600">
                    {deliveryDetails?.method === "carryout"
                      ? "914 Ashland Rd"
                      : `${deliveryDetails?.address?.city || ""}, ${deliveryDetails?.address?.state || ""}`}
                  </span>
                </Button>
              )}

              {/* Cart Button */}
              {cart.length >= 0 && (
                <Button variant="outline" className="relative" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cart.length}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Delivery Selection Modal */}
      <DeliverySelection
        isOpen={showDeliverySelection}
        onClose={() => setShowDeliverySelection(false)}
        onConfirm={handleDeliveryConfirm}
        currentDetails={deliveryDetails || undefined}
      />
    </>
  );
}
