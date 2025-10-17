import { Request, Response, NextFunction } from "express";
import { BlogService } from "./blog.service";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";


// Create blog
const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number((req.user as JwtPayload).userId);
        console.log("User ID:", userId);
        console.log("Request Body:", req.body);

        const blog = await BlogService.createBlog(req.body, userId);
        console.log("Created Blog:", blog);

        sendResponse(res, {
            success: true,
            statuscode: httpStatus.CREATED,
            message: "Blog created successfully",
            data: blog,
        });
    } catch (err) {
        console.error("Error creating blog:", err);
        next(err);
    }
};


// Update blog
const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number((req.user as JwtPayload).userId);
        const blogId = Number(req.params.id);

        const blog = await BlogService.updateBlog(blogId, req.body, userId);

        sendResponse(res, {
            success: true,
            statuscode: httpStatus.OK,
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (err) {
        next(err);
    }
};

// Delete blog
const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number((req.user as JwtPayload).userId); // Logged-in user ID
        const blogId = Number(req.params.id); // Blog ID from route

        await BlogService.deleteBlog(blogId, userId);

        sendResponse(res, {
            success: true,
            statuscode: httpStatus.OK,
            message: "Blog deleted successfully",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

// Get all blogs
const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await BlogService.getAllBlogs();

        sendResponse(res, {
            success: true,
            statuscode: httpStatus.OK,
            message: "Blogs fetched successfully",
            data: blogs,
        });
    } catch (err) {
        next(err);
    }
};

// Get blog by ID
const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = Number(req.params.id);
        const blog = await BlogService.getBlogById(blogId);

        sendResponse(res, {
            success: true,
            statuscode: httpStatus.OK,
            message: "Blog fetched successfully",
            data: blog,
        });
    } catch (err) {
        next(err);
    }
};

// Get blogs for logged-in user
const getMyBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number((req.user as JwtPayload).userId);
        const blogs = await BlogService.getBlogsByUser(userId);

        sendResponse(res, {
            success: true,
            statuscode: httpStatus.OK,
            message: "Your blogs fetched successfully",
            data: blogs,
        });
    } catch (err) {
        next(err);
    }
};


export const BlogController = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById,
    getMyBlogs,
};
