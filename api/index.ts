import express from "express";
import { registerRoutes } from "../server/routes";

// This creates a serverless-compatible handler for Vercel
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes without awaiting; handler can be synchronous here
registerRoutes(app);

export default app;