import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useOrder } from "../contexts/OrderContext";
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
  const displayBreadcrumbs =
    breadcrumbs.length > 0 ? breadcrumbs : [{ label: "Home" }];

  return (
    <>
      <header className="sticky top-0 z-[9999] shadow-sm" style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
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
              <nav className="flex items-center space-x-1 text-sm min-h-[20px]" style={{ color: 'var(--muted-foreground)' }}>
                {displayBreadcrumbs.length === 1 &&
                displayBreadcrumbs[0].label === "Home" ? (
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Home</span>
                ) : (
                  <>
                    <Link 
                      to="/" 
                      className="hover:underline transition-colors hover:text-[var(--primary)]"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Home
                    </Link>
                    {displayBreadcrumbs.map((crumb, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <ChevronRight className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                        {crumb.href ? (
                          <Link 
                            to={crumb.href} 
                            className="hover:underline transition-colors hover:text-[var(--primary)]"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                            {crumb.label}
                          </span>
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
                  className="font-medium transition-colors hover:text-[var(--primary)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  Menu
                </Link>
                <Link
                  to="/specials"
                  className="font-medium transition-colors hover:text-[var(--primary)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  Specials
                </Link>
                <Link
                  to="/about"
                  className="font-medium text-sm transition-colors hover:text-[var(--primary)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  About
                </Link>
                <Link
                  to="/admin"
                  className="font-medium text-sm transition-colors hover:text-[var(--primary)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  Admin
                </Link>
                <Link
                  to="/login"
                  className="font-medium transition-colors hover:text-[var(--primary)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  Sign In
                </Link>
              </div>

              {/* Delivery Details Button - Taller version with 2 lines */}
              {!isAdminPage && hasDeliveryDetails && (
                <Button
                  variant="outline"
                  onClick={() => setShowDeliverySelection(true)}
                  className="text-sm flex flex-col items-center h-auto py-2 px-3"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    border: '2px solid var(--border)',
                    color: 'var(--foreground)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.backgroundColor = 'var(--accent)';
                    target.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.backgroundColor = 'var(--card)';
                    target.style.borderColor = 'var(--border)';
                  }}
                >
                  <div className="flex items-center space-x-1">
                    {deliveryDetails?.method === "carryout" ? (
                      <Store className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                    ) : (
                      <MapPin className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                    )}
                    <span className="font-semibold text-xs" style={{ color: 'var(--foreground)' }}>
                      {deliveryDetails?.method === "carryout"
                        ? "CARRYOUT FROM"
                        : "DELIVERY TO"}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {deliveryDetails?.method === "carryout"
                      ? "914 Ashland Rd"
                      : `${deliveryDetails?.address?.city || ""}, ${deliveryDetails?.address?.state || ""}`}
                  </span>
                </Button>
              )}

              {/* Large Cart Icon - Domino's style, not a button */}
              <Link 
                to="/cart" 
                className="relative"
                style={{ transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => {
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    (icon as SVGSVGElement).style.color = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    (icon as SVGSVGElement).style.color = 'var(--foreground)';
                  }
                }}
              >
                <div className="relative">
                  <ShoppingCart className="h-8 w-8 transition-colors" style={{ color: 'var(--foreground)' }} />
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      borderColor: 'var(--primary)'
                    }}
                  >
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
