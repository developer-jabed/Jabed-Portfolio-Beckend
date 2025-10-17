import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { router } from "./routes/router";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import notFound from "./middleware/NotFound";

const app = express();

// Middleware
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// ✅ CORS setup (only once)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,               // allow cookies
  })
);

// Routes
app.use("/api/v1", router);

// Default route
app.get("/", (_req, res) => {
  res.send("API is running");
});

// Error handling
app.use(globalErrorHandler);

// 404 handler
app.use(notFound);

export default app;
