import { Router } from "express";
import { MessageController } from "./message.controller";


const router = Router();

// 📩 Send a new message
router.post("/create", MessageController.createMessage);

// 📜 Get all messages (for admin dashboard)
router.get("/get", MessageController.getAllMessages);

// 🔍 Get single message by ID

export const MessageRoute = router;
