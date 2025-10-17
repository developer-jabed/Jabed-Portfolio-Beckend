import express from "express";
import { ProjectController } from "./project.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { ROLE } from "../users/user.interface";


const router = express.Router();

// ✅ Create Project (Logged-in user)
router.post("/create-project", checkAuth(ROLE.USER, ROLE.ADMIN), ProjectController.createProject);

// ✅ Get All Projects
router.get("/all-project", ProjectController.getAllProjects);

// ✅ Get Project by ID
router.get("/:id", ProjectController.getProjectById);

// ✅ Update Project (Owner/Admin)
router.patch("/update/:id", checkAuth(ROLE.USER, ROLE.ADMIN), ProjectController.updateProject);

// ✅ Delete Project (Owner/Admin)
router.delete("/delete/:id", checkAuth(ROLE.USER, ROLE.ADMIN), ProjectController.deleteProject);

export const ProjectRoutes = router;
