import { RequestHandler } from "express";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
  };
  token?: string;
}

// Mock user database
const mockUsers = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@prontos.com",
    password: "admin123", // In real app, this would be hashed
    isAdmin: true,
    phone: "419-589-7777",
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    isAdmin: false,
    phone: "419-555-0123",
  },
];

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as AuthResponse);
    }

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // In a real app, generate a JWT token here
    const token = `mock_token_${user.id}_${Date.now()}`;

    const response: AuthResponse = {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { firstName, lastName, email, phone, password }: RegisterRequest =
      req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      } as AuthResponse);
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      } as AuthResponse);
    }

    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      firstName,
      lastName,
      email,
      password, // In real app, hash this password
      isAdmin: false,
      phone,
    };

    mockUsers.push(newUser);

    // Generate token
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    const response: AuthResponse = {
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      token,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};
