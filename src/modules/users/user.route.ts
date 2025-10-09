import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { ROLE } from "./user.interface";

const router = Router();

// ✅ Create user
router.post("/create-user", UserController.createUser);

// ✅ Get all users
router.get("/all", UserController.getAllUsers);

// ✅ Get user by ID


// ✅ Get my profile (for now, you’ll send userId in req.body since JWT is off)
router.get("/me", checkAuth(ROLE.USER, ROLE.ADMIN), UserController.getMe);
router.get("/:id", UserController.getUserById);
// ✅ Update my profile (userId sent in body for now)
router.patch("/update-user/:id",  checkAuth(...Object.values(ROLE)), UserController.updateUser);
router.patch("/update-profile",  checkAuth(...Object.values(ROLE)), UserController.updateMyProfile);


export { router as UserRoutes };
