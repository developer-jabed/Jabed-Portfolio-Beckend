import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { prisma } from "../config/db";
import { verifyToken } from "../utils/jwt";
import AppError from "../errorHelpers/apperror";
import { IUser, ROLE, STATUS } from "../modules/users/user.interface";

// Extend Express.Request type
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload & { userId: number; role: ROLE };
    }
  }
}

export const checkAuth =
  (...authRoles: ROLE[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token
      const accessTokenHeader = req.headers.authorization;
      const accessToken =
        accessTokenHeader?.split(" ")[1] || req.cookies.accessToken;

        console.log(accessToken)

      if (!accessToken) {
        throw new AppError(httpStatus.FORBIDDEN, "No token received");
      }

      // Verify JWT
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload & { userId: string | number; role: ROLE };

      // ✅ Convert userId to number
      const userId =
        typeof verifiedToken.userId === "string"
          ? parseInt(verifiedToken.userId, 10)
          : verifiedToken.userId;

      if (isNaN(userId)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID format");
      }

      // Fetch user from DB
      const prismaUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!prismaUser) throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");

      // Map Prisma enums to your TypeScript enums
      const user: IUser = {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        password: prismaUser.password,
        role: prismaUser.role as ROLE,
        picture: prismaUser.picture,
        phone: prismaUser.phone,
        status: prismaUser.status as STATUS,
        isVerified: prismaUser.isVerified,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
      };
    
      if ([STATUS.BLOCKED, STATUS.INACTIVE].includes(user.status)) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.status}`);
      }
      if (!authRoles.includes(user.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to view this route");
      }

      // ✅ Assign correct type to req.user
      req.user = {
        ...verifiedToken,
        userId, // now always a number
        role: user.role,
      };

      next();
    } catch (error) {
      console.error("JWT error:", error);
      next(error);
    }
  };
