import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useOrder } from "../context/OrderContext";
import DeliverySelection from "./DeliverySelection";
import { ShoppingCart, MapPin, Store, ChevronRight } from "lucide-react";

interface HeaderWithDeliveryProps {
  cart?: any[];
  breadcrumbs?: { label: string; href?: string }[];
}

export default function HeaderWithDelivery({
  cart = [],
  breadcrumbs = [],
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
            {/* Logo and Breadcrumbs */}
            <div className="flex flex-col space-y-2">
              <Link to="/" className="flex items-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F8595ba96a391483e886f01139655b832%2F21553f5832104c39886abceeebfd9cb6?format=webp&width=800"
                  alt="Pronto Pizza"
                  className="h-10 w-auto"
                />
              </Link>
              {breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-1 text-sm text-gray-500">
                  <Link to="/" className="hover:text-gray-700">
                    Home
                  </Link>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <ChevronRight className="h-3 w-3" />
                      {crumb.href ? (
                        <Link to={crumb.href} className="hover:text-gray-700">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {crumb.label}
                        </span>
                      )}
                    </div>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Delivery Details Button - Domino's style */}
              {!isAdminPage && hasDeliveryDetails && (
                <Button
                  variant="outline"
                  onClick={() => setShowDeliverySelection(true)}
                  className="text-sm h-10 px-3 border-2 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    {deliveryDetails?.method === "carryout" ? (
                      <Store className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-xs leading-tight">
                        {deliveryDetails?.method === "carryout"
                          ? "CARRYOUT"
                          : "DELIVERY"}
                      </div>
                      <div className="text-xs text-gray-600 leading-tight">
                        {deliveryDetails?.method === "carryout"
                          ? "914 Ashland Rd"
                          : `${deliveryDetails?.address?.city || ""}, ${deliveryDetails?.address?.state || ""}`}
                      </div>
                    </div>
                  </div>
                </Button>
              )}

              {/* Cart Button - Domino's style */}
              <Button
                variant="outline"
                className="relative h-10 px-3 border-2 hover:bg-gray-50"
                asChild
              >
                <Link to="/cart">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                          {cart.length}
                        </Badge>
                      )}
                    </div>
                    <span className="font-medium">Cart</span>
                  </div>
                </Link>
              </Button>
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
