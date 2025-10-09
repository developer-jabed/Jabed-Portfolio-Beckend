import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/apperror";
import httpStatus from "http-status-codes";


// Helper to generate slug from title
const generateSlug = (title: string) => {
    return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

// Create a new blog
const createBlog = async (payload: any, authorId: number) => {
    const { title, content, excerpt, coverImage, published } = payload;
    console.log(payload)

    if (!title || !content) {
        console.log("Payload console:",payload)
        throw new AppError(httpStatus.BAD_REQUEST, "Missing required blog fields");
    }

    const slug = generateSlug(title);

    const blog = await prisma.blog.create({
        data: {
            title,
            content,
            excerpt,
            coverImage,
            published: published ?? true,
            slug,
            authorId,
        },
    });

    return blog;
};

// Update a blog by ID
const updateBlog = async (blogId: number, payload: any, authorId: number) => {
    const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!existingBlog) {
        throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
    }

    if (existingBlog.authorId !== authorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You cannot edit this blog");
    }

    const { title, content, excerpt, coverImage, published } = payload;
    const slug = title ? generateSlug(title) : existingBlog.slug;

    const updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: {
            title: title ?? existingBlog.title,
            content: content ?? existingBlog.content,
            excerpt: excerpt ?? existingBlog.excerpt,
            coverImage: coverImage ?? existingBlog.coverImage,
            published: published ?? existingBlog.published,
            slug,
        },
    });

    return updatedBlog;
};

// Delete a blog by ID
const deleteBlog = async (blogId: number, authorId: number) => {
    const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!existingBlog) {
        throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
    }

    if (existingBlog.authorId !== authorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You cannot delete this blog");
    }

    await prisma.blog.delete({ where: { id: blogId } });
    return true;
};

// Get all blogs
const getAllBlogs = async () => {
    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, email: true } } },
    });
    return blogs;
};

// Get blog by ID
const getBlogById = async (id: number) => {
    const blog = await prisma.blog.findUnique({
        where: { id },
        include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!blog) throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
    return blog;
};

export const BlogService = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById,
};
