import "./global.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

// Import comprehensive ResizeObserver error fix
import "./utils/resizeObserverFix";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { OrderProvider } from "./context/OrderContext";
import Footer from "./components/Footer";
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

// Layout component that conditionally renders footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <>
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
};

// Export App component for HMR compatibility
export const App = () => (
  <OrderProvider>
    <BrowserRouter>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  </OrderProvider>
);

// Create root only once and store in a module variable
const container = document.getElementById("root")!;
let root = createRoot(container);

// Initial render
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Handle hot module replacement properly
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // Re-render with the new App component
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
}
