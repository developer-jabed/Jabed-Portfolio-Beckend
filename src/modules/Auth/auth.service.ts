import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/apperror";

import {
    IUser,
    ROLE,
    STATUS,
} from "../users/user.interface";

import { createUserTokens, createNewAccessTokenWithRefreshToken } from "../../utils/userToken";

// Helper to map Prisma Role to interface ROLE
const mapPrismaRoleToEnum = (role: "Admin" | "User"): ROLE => {
    return role === "Admin" ? ROLE.ADMIN : ROLE.USER;
};

// Login with email + password
export const AuthServices = {
    credentialsLogin: async (email: string, password: string) => {
        if (!email || !password) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email and password are required");
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
        if (!user.password) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "User has no password set");

        const isPasswordMatched = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatched) throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");

        // Map Prisma enums to your interface
        const userForToken: Partial<IUser> = {
            id: user.id,
            email: user.email,
            role: mapPrismaRoleToEnum(user.role),
        };

        const tokens = createUserTokens(userForToken);

        // Exclude password from response
        const { password: _pwd, ...userResponse } = user;

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userResponse,
        };
    },

    // Generate new access token
    getNewAccessToken: async (refreshToken: string) => {
        const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
        return { accessToken };
    },

    // Reset password
    resetPassword: async (userId: number, oldPassword: string, newPassword: string) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
        if (!user.password) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "User has no password set");

        const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isOldPasswordMatch) throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");

        const hashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    },
};
