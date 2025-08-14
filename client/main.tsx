import "./global.css";
import { createRoot } from "react-dom/client";

// Suppress ResizeObserver loop warning from Radix UI components
const resizeObserverError = (e: ErrorEvent) => {
  if (
    e.message ===
    "ResizeObserver loop completed with undelivered notifications."
  ) {
    e.stopImmediatePropagation();
    return false;
  }
  return true;
};

window.addEventListener("error", resizeObserverError);
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "./context/OrderContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Wings from "./pages/Wings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Specials from "./pages/Specials";
import NotFound from "./pages/NotFound";

const App = () => (
  <OrderProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/wings" element={<Wings />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/specials" element={<Specials />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </OrderProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
