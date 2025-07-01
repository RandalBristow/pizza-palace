import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import route handlers
import { handleLogin, handleRegister } from "./routes/auth.js";
import {
  getMenuItems,
  getCategories,
  getToppings,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "./routes/menu.js";
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
  getAllOrdersAdmin,
} from "./routes/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (req, res) => {
    res.json({
      message: "Pronto Pizza API is running!",
      timestamp: new Date().toISOString(),
    });
  });

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);

  // Menu routes
  app.get("/api/menu/items", getMenuItems);
  app.get("/api/menu/categories", getCategories);
  app.get("/api/menu/toppings", getToppings);

  // Admin menu management routes
  app.post("/api/admin/menu/items", createMenuItem);
  app.put("/api/admin/menu/items/:id", updateMenuItem);
  app.delete("/api/admin/menu/items/:id", deleteMenuItem);

  // Order routes
  app.post("/api/orders", createOrder);
  app.get("/api/orders/:id", getOrder);
  app.get("/api/orders", getOrders);
  app.put("/api/orders/:id/status", updateOrderStatus);

  // Admin order management
  app.get("/api/admin/orders", getAllOrdersAdmin);

  // Special offers endpoint (could be expanded)
  app.get("/api/specials", (req, res) => {
    const mockSpecials = [
      {
        id: "s1",
        name: "Pizza Monday",
        description: "20% off all pizzas every Monday!",
        type: "weekly",
        dayOfWeek: 1,
        discount: 20,
        isActive: true,
      },
      {
        id: "s2",
        name: "Coffee & Pizza Combo",
        description: "Buy any large pizza and get a premium coffee for $1.99",
        type: "daily",
        specialPrice: 1.99,
        isActive: true,
      },
    ];

    res.json({
      success: true,
      data: mockSpecials,
    });
  });

  // Store information endpoint
  app.get("/api/store-info", (req, res) => {
    res.json({
      success: true,
      data: {
        name: "Pronto Pizza Cafe",
        address: {
          street: "914 Ashland Rd",
          city: "Mansfield",
          state: "OH",
          zip: "44905",
        },
        phone: "(419) 589-7777",
        website: "https://getprontos.com",
        hours: {
          monday: { open: "11:00", close: "22:00" },
          tuesday: { open: "11:00", close: "22:00" },
          wednesday: { open: "11:00", close: "22:00" },
          thursday: { open: "11:00", close: "22:00" },
          friday: { open: "11:00", close: "22:00" },
          saturday: { open: "11:00", close: "23:00" },
          sunday: { open: "12:00", close: "21:00" },
        },
        services: ["carry-out"],
        features: [
          "online-ordering",
          "gluten-free-options",
          "vegetarian-options",
        ],
      },
    });
  });

  // Contact/feedback endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, phone, message } = req.body;

    // In a real app, you'd save this to a database or send an email
    console.log("Contact form submission:", { name, email, phone, message });

    res.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });
  });

  // Order tracking endpoint for customers
  app.get("/api/track/:orderId", (req, res) => {
    const { orderId } = req.params;

    // This would typically check the database for the order
    res.json({
      success: true,
      data: {
        orderId,
        status: "preparing",
        estimatedReady: new Date(Date.now() + 15 * 60000).toISOString(),
        currentStep: 2,
        steps: [
          { name: "Order Received", completed: true },
          { name: "Preparing", completed: false, current: true },
          { name: "Ready for Pickup", completed: false },
          { name: "Completed", completed: false },
        ],
      },
    });
  });

  // Serve static files from the client build
  if (process.env.NODE_ENV === "production") {
    const spaPath = path.join(__dirname, "../spa");
    app.use(express.static(spaPath));

    // Handle React Router routes
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        res.status(404).json({ error: "API endpoint not found" });
      } else {
        res.sendFile(path.join(spaPath, "index.html"));
      }
    });
  }

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Server error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    },
  );

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`🍕 Pronto Pizza Cafe server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Website available at http://localhost:${PORT}`);
  });
}
