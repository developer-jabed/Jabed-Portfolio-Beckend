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
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1", router);
// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use(globalErrorHandler);


// 404 Handler
app.use(notFound);

export default app;
