import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/db";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/apperror";
import { generateToken, verifyToken } from "./jwt";
import { IUser, ROLE, STATUS } from "../modules/users/user.interface";
import { Status } from "@prisma/client"; // Prisma enums

// Helper to map Prisma Role to interface ROLE
const mapPrismaRoleToEnum = (role: "Admin" | "User"): ROLE => {
    return role === "Admin" ? ROLE.ADMIN : ROLE.USER;
};

const mapPrismaStatusToEnum = (status: Status): STATUS => {
    switch (status) {
        case Status.ACTIVE:
            return STATUS.ACTIVE;
        case Status.INACTIVE:
            return STATUS.INACTIVE;
        case Status.BLOCKED:
            return STATUS.BLOCKED;
    }
};

// Create access + refresh tokens for a user
export const createUserTokens = (user: Partial<IUser>) => {
    if (!user.id || !user.email || !user.role) {
        throw new AppError(httpStatus.BAD_REQUEST, "Missing user information for token creation");
    }

    const jwtPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: mapPrismaRoleToEnum(user.role as any),
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES_IN
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRES_IN
    );

    return { accessToken, refreshToken };
};

// Create a new access token from a valid refresh token
export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVars.JWT_REFRESH_SECRET
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
        where: { email: verifiedRefreshToken.email },
    });

    if (!user) throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");

    const status = mapPrismaStatusToEnum(user.status);
    if ([STATUS.BLOCKED, STATUS.INACTIVE].includes(status)) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${status}`);
    }

    const jwtPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: mapPrismaRoleToEnum(user.role as any),
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES_IN
    );

    return accessToken;
};
