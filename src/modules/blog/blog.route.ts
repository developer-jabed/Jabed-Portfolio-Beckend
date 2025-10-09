import { Router } from "express";
import { BlogController } from "./blog.controller";
import { ROLE } from "../users/user.interface";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post("/create", checkAuth(ROLE.ADMIN, ROLE.USER), BlogController.createBlog);
router.patch("/update/:id", checkAuth(ROLE.ADMIN, ROLE.USER), BlogController.updateBlog);
router.delete("/delete/:id", checkAuth(ROLE.ADMIN, ROLE.USER), BlogController.deleteBlog);

router.get("/all-blogs", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);
export const blogRoute = router;
