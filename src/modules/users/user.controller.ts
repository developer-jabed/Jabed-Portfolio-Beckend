import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/CatchAsynce";
import AppError from "../../errorHelpers/apperror";
import { prisma } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";
import { ROLE } from "./user.interface";

// Create user
const createUser = async (req: Request, res: Response) => {
    try {
        const result = await UserService.createUser(req.body);

        console.log("User created:", result);

        sendResponse(res, {
            success: true,
            statuscode: httpStatus.CREATED,
            message: "User created successfully",
            data: result,
        });
    } catch (error: any) {
        console.error("Error creating user:", error);

        sendResponse(res, {
            success: false,
            statuscode: httpStatus.BAD_REQUEST,
            message: "User creation failed",
            data: null,
        });
    }
};

// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();

    sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Users fetched successfully",
        data: users,
    });
});

// Get user by ID
const getUserById = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params.id);

    sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User fetched successfully",
        data: user,
    });
});

// Get my profile (for testing, you can pass userId from frontend)
const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload & { userId: number };
    const result = await UserService.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Your profile retrieved successfully",
        data: result,
    });
});




// Update my profile (for testing, userId comes from body)
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId, name, phone, password } = req.body;

    if (!userId) {
        sendResponse(res, {
            success: false,
            statuscode: httpStatus.BAD_REQUEST,
            message: "Missing userId in request body",
            data: null,
        });
        return;
    }

    const payload: any = { name, phone };
    if (password) payload.password = password;

    const updatedUser = await UserService.updateMyProfile(userId, payload);

    sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "Profile updated successfully",
        data: updatedUser,
    });
});

// Update any user (admin-like action for now)
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const payload = req.body;

    const updatedUser = await UserService.updateUser(userId, payload);

    sendResponse(res, {
        success: true,
        statuscode: httpStatus.OK,
        message: "User updated successfully",
        data: updatedUser,
    });
});

// Export controller
export const UserController = {
    createUser,
    getAllUsers,
    getUserById,
    getMe,
    updateMyProfile,
    updateUser,
};
