import { createContext, useContext, useState, ReactNode } from "react";

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

interface OrderContextType {
  deliveryDetails: DeliveryDetails | null;
  setDeliveryDetails: (details: DeliveryDetails | null) => void;
  hasDeliveryDetails: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [deliveryDetails, setDeliveryDetails] =
    useState<DeliveryDetails | null>(null);

  const hasDeliveryDetails = !!deliveryDetails;

  return (
    <OrderContext.Provider
      value={{
        deliveryDetails,
        setDeliveryDetails,
        hasDeliveryDetails,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
