import { RequestHandler } from "express";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  crust?: string;
  toppings?: Array<{
    id: string;
    name: string;
    price: number;
    placement: "left" | "right" | "whole";
  }>;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "card" | "cash";
  pickupTime: string;
  specialInstructions?: string;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: string;
  estimatedReadyTime: string;
}

// Mock orders database
let mockOrders: Order[] = [];

export const createOrder: RequestHandler = (req, res) => {
  try {
    const {
      customerInfo,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      pickupTime,
      specialInstructions,
    } = req.body;

    // Validate required fields
    if (!customerInfo || !items || !items.length || !total) {
      return res.status(400).json({
        success: false,
        message: "Missing required order information",
      });
    }

    // Calculate estimated ready time (15-25 minutes from now)
    const now = new Date();
    const estimatedMinutes = 15 + Math.floor(Math.random() * 10); // 15-25 minutes
    const estimatedReadyTime = new Date(
      now.getTime() + estimatedMinutes * 60000,
    );

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      customerInfo,
      items,
      subtotal: parseFloat(subtotal) || 0,
      tax: parseFloat(tax) || 0,
      discount: parseFloat(discount) || 0,
      total: parseFloat(total),
      paymentMethod,
      pickupTime,
      specialInstructions,
      status: "pending",
      createdAt: now.toISOString(),
      estimatedReadyTime: estimatedReadyTime.toISOString(),
    };

    mockOrders.push(newOrder);

    // Simulate payment processing for card payments
    if (paymentMethod === "card") {
      // In a real app, process payment here
      console.log("Processing card payment for order:", newOrder.id);
    }

    res.json({
      success: true,
      data: newOrder,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};

export const getOrder: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const order = mockOrders.find((order) => order.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
    });
  }
};

export const getOrders: RequestHandler = (req, res) => {
  try {
    const { status, customerEmail } = req.query;

    let filteredOrders = mockOrders;

    if (status && typeof status === "string") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status,
      );
    }

    if (customerEmail && typeof customerEmail === "string") {
      filteredOrders = filteredOrders.filter(
        (order) => order.customerInfo.email === customerEmail,
      );
    }

    // Sort by creation date (newest first)
    filteredOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.json({
      success: true,
      data: filteredOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

export const updateOrderStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const orderIndex = mockOrders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    mockOrders[orderIndex].status = status;

    res.json({
      success: true,
      data: mockOrders[orderIndex],
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};

// Admin endpoint to get all orders with additional details
export const getAllOrdersAdmin: RequestHandler = (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;

    let filteredOrders = mockOrders;

    if (status && typeof status === "string") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status,
      );
    }

    // Sort by creation date (newest first)
    filteredOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        total: filteredOrders.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredOrders.length / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};
