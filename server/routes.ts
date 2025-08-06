import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { loginSchema, registerSchema, quickTradeSchema, updateUserSchema } from "@shared/schema";
import type { User } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthRequest extends Request {
  user?: User;
}

// Middleware to verify JWT token
const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      const { confirmPassword, ...userData } = validatedData;
      const user = await storage.createUser(userData);
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        user: userWithoutPassword,
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ 
        user: userWithoutPassword,
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res: Response) => {
    const { password, ...userWithoutPassword } = req.user!;
    res.json({ user: userWithoutPassword });
  });

  // User routes
  app.put("/api/user/profile", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const updatedUser = await storage.updateUser(req.user!.id, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Update failed" });
    }
  });

  app.get("/api/user/stats", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const stats = await storage.getUserStats(req.user!.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get stats" });
    }
  });

  // Trade routes
  app.get("/api/trades", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const trades = await storage.getTrades(req.user!.id);
      res.json(trades);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get trades" });
    }
  });

  app.post("/api/trades", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = quickTradeSchema.parse(req.body);
      
      const tradeData = {
        userId: req.user!.id,
        symbol: validatedData.symbol,
        type: validatedData.type,
        entryPrice: validatedData.entryPrice,
        exitPrice: validatedData.exitPrice || null,
        quantity: parseInt(validatedData.quantity),
        mood: validatedData.mood,
        notes: validatedData.notes || null,
        tags: validatedData.tags || [],
        screenshots: [],
        strategy: null,
        marketCondition: null,
        sessionType: null,
        entryTime: new Date(),
        exitTime: validatedData.exitPrice ? new Date() : null,
      };

      const trade = await storage.createTrade(tradeData);
      res.status(201).json(trade);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create trade" });
    }
  });

  app.get("/api/trades/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const trade = await storage.getTradeById(req.params.id);
      
      if (!trade || trade.userId !== req.user!.id) {
        return res.status(404).json({ message: "Trade not found" });
      }

      res.json(trade);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get trade" });
    }
  });

  app.put("/api/trades/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const trade = await storage.getTradeById(req.params.id);
      
      if (!trade || trade.userId !== req.user!.id) {
        return res.status(404).json({ message: "Trade not found" });
      }

      const updatedTrade = await storage.updateTrade(req.params.id, req.body);
      res.json(updatedTrade);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update trade" });
    }
  });

  app.delete("/api/trades/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const trade = await storage.getTradeById(req.params.id);
      
      if (!trade || trade.userId !== req.user!.id) {
        return res.status(404).json({ message: "Trade not found" });
      }

      const success = await storage.deleteTrade(req.params.id);
      if (success) {
        res.json({ message: "Trade deleted successfully" });
      } else {
        res.status(404).json({ message: "Trade not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete trade" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
