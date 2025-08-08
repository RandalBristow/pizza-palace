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

  // Always show breadcrumbs, default to "Home" if none provided
  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : [{ label: "Home" }];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Breadcrumbs - Always shown */}
            <div className="flex flex-col space-y-2">
              <Link to="/" className="flex items-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F8595ba96a391483e886f01139655b832%2F21553f5832104c39886abceeebfd9cb6?format=webp&width=800"
                  alt="Pronto Pizza"
                  className="h-10 w-auto"
                />
              </Link>
              <nav className="flex items-center space-x-1 text-sm text-gray-500 min-h-[20px]">
                {displayBreadcrumbs.length === 1 && displayBreadcrumbs[0].label === "Home" ? (
                  <span className="text-gray-900 font-medium">Home</span>
                ) : (
                  <>
                    <Link to="/" className="hover:text-gray-700">Home</Link>
                    {displayBreadcrumbs.map((crumb, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <ChevronRight className="h-3 w-3" />
                        {crumb.href ? (
                          <Link to={crumb.href} className="hover:text-gray-700">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-gray-900 font-medium">{crumb.label}</span>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/menu"
                  className="text-gray-700 hover:text-red-600 font-medium"
                >
                  Menu
                </Link>
                <Link
                  to="/specials"
                  className="text-gray-700 hover:text-red-600 font-medium"
                >
                  Specials
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-red-600 font-medium"
                >
                  About
                </Link>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-red-600 font-medium text-sm"
                >
                  Admin
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-600 font-medium"
                >
                  Sign In
                </Link>
              </div>

              {/* Delivery Details Button - Taller version with 2 lines */}
              {!isAdminPage && hasDeliveryDetails && (
                <Button
                  variant="outline"
                  onClick={() => setShowDeliverySelection(true)}
                  className="text-sm flex flex-col items-center h-auto py-2 px-3 border-2 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-1">
                    {deliveryDetails?.method === "carryout" ? (
                      <Store className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    <span className="font-semibold text-xs">
                      {deliveryDetails?.method === "carryout" ? "CARRYOUT FROM" : "DELIVERY TO"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {deliveryDetails?.method === "carryout"
                      ? "914 Ashland Rd"
                      : `${deliveryDetails?.address?.city || ""}, ${deliveryDetails?.address?.state || ""}`}
                  </span>
                </Button>
              )}

              {/* Large Cart Icon - Domino's style, not a button */}
              <Link to="/cart" className="relative">
                <div className="relative">
                  <ShoppingCart className="h-8 w-8 text-gray-700 hover:text-gray-900 transition-colors" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
                    {cart.length}
                  </Badge>
                </div>
              </Link>
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
