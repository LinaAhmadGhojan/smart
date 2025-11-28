import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import authRoutes from "./routes/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
