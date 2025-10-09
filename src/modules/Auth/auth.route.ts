import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

// ==========================
// 🔐 Login with credentials
// ==========================
router.post("/login", AuthControllers.credentialsLogin);

// ==========================
// ♻️ Refresh access token
// ==========================
router.post("/refresh-token", AuthControllers.getNewAccessToken);

// ==========================
// 🚪 Logout user
// ==========================
router.post("/logout", AuthControllers.logout);

// ==========================
// 🔑 Optional: Reset password
// ==========================
// router.post("/reset-password", AuthControllers.resetPassword);

export const AuthRoutes = router;
