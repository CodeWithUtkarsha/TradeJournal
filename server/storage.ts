import { type User, type InsertUser, type UpdateUser, type Trade, type InsertTrade } from "../shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUser): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | undefined>;
  
  // Trade methods
  getTrades(userId: string): Promise<Trade[]>;
  getTradeById(id: string): Promise<Trade | undefined>;
  createTrade(trade: InsertTrade & { userId: string }): Promise<Trade>;
  updateTrade(id: string, updates: Partial<Trade>): Promise<Trade | undefined>;
  deleteTrade(id: string): Promise<boolean>;
  
  // Analytics methods
  getUserStats(userId: string): Promise<{
    totalPnL: number;
    winRate: number;
    avgTrade: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    avgWin: number;
    avgLoss: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private trades: Map<string, Trade>;

  constructor() {
    this.users = new Map();
    this.trades = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const now = new Date();
    
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      profilePhoto: null,
      preferredBroker: insertUser.preferredBroker || null,
      experience: insertUser.experience || null,
      bio: insertUser.bio || null,
      defaultRisk: "2.00",
      riskRewardRatio: "1:2",
      currency: "USD",
      emailNotifications: true,
      aiInsights: true,
      weeklyReports: false,
      pushNotifications: true,
      twoFactorEnabled: false,
      subscription: "Free",
      createdAt: now,
      updatedAt: now,
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }

  async getTrades(userId: string): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter(trade => trade.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getTradeById(id: string): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async createTrade(trade: InsertTrade & { userId: string }): Promise<Trade> {
    const id = randomUUID();
    const now = new Date();
    
    // Calculate P&L and return percentage
    let pnl = "0";
    let returnPercent = "0";
    let riskReward = null;

    if (trade.exitPrice) {
      const entry = parseFloat(trade.entryPrice);
      const exit = parseFloat(trade.exitPrice);
      const qty = trade.quantity;

      if (trade.type === "Long") {
        pnl = ((exit - entry) * qty).toFixed(2);
        returnPercent = (((exit - entry) / entry) * 100).toFixed(2);
      } else {
        pnl = ((entry - exit) * qty).toFixed(2);
        returnPercent = (((entry - exit) / entry) * 100).toFixed(2);
      }

      // Simple risk reward calculation (assuming 1% risk)
      const riskAmount = entry * 0.01;
      const rewardAmount = Math.abs(parseFloat(pnl) / qty);
      riskReward = `1:${(rewardAmount / riskAmount).toFixed(1)}`;
    }

    const newTrade: Trade = {
      ...trade,
      id,
      pnl,
      returnPercent,
      riskReward,
      exitPrice: trade.exitPrice || null,
      screenshots: trade.screenshots || [],
      tags: trade.tags || [],
      notes: trade.notes || null,
      strategy: trade.strategy || null,
      marketCondition: trade.marketCondition || null,
      sessionType: trade.sessionType || null,
      mood: trade.mood || null,
      entryTime: trade.entryTime || now,
      exitTime: trade.exitTime || null,
      createdAt: now,
      updatedAt: now,
    };

    this.trades.set(id, newTrade);
    return newTrade;
  }

  async updateTrade(id: string, updates: Partial<Trade>): Promise<Trade | undefined> {
    const trade = this.trades.get(id);
    if (!trade) return undefined;

    const updatedTrade: Trade = {
      ...trade,
      ...updates,
      updatedAt: new Date(),
    };

    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  async deleteTrade(id: string): Promise<boolean> {
    return this.trades.delete(id);
  }

  async getUserStats(userId: string): Promise<{
    totalPnL: number;
    winRate: number;
    avgTrade: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    avgWin: number;
    avgLoss: number;
  }> {
    const trades = await this.getTrades(userId);
    const completedTrades = trades.filter(t => t.exitPrice && t.pnl);

    if (completedTrades.length === 0) {
      return {
        totalPnL: 0,
        winRate: 0,
        avgTrade: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgWin: 0,
        avgLoss: 0,
      };
    }

    const totalPnL = completedTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl!), 0);
    const winningTrades = completedTrades.filter(t => parseFloat(t.pnl!) > 0);
    const losingTrades = completedTrades.filter(t => parseFloat(t.pnl!) < 0);
    
    const winRate = (winningTrades.length / completedTrades.length) * 100;
    const avgTrade = totalPnL / completedTrades.length;
    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl!), 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? 
      Math.abs(losingTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl!), 0) / losingTrades.length) : 0;

    return {
      totalPnL,
      winRate,
      avgTrade,
      totalTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWin,
      avgLoss,
    };
  }
}

export const storage = new MemStorage();
