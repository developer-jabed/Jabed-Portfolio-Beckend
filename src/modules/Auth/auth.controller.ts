import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utility/sendResponse";
import { setAuthCookie, clearAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/apperror";

// ==========================
// Auth Controllers
// ==========================
export const AuthControllers = {
    credentialsLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const loginData = await AuthServices.credentialsLogin(email, password);

            setAuthCookie(res, loginData);

            sendResponse(res, {
                success: true,
                statuscode: httpStatus.OK,
                message: "User logged in successfully",
                data: loginData,
            });
        } catch (err) {
            next(err);
        }
    },

    getNewAccessToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received");

            const { accessToken } = await AuthServices.getNewAccessToken(refreshToken);
            setAuthCookie(res, { accessToken, refreshToken });

            sendResponse(res, {
                success: true,
                statuscode: httpStatus.OK,
                message: "New Access Token Retrieved Successfully",
                data: { accessToken },
            });
        } catch (err) {
            next(err);
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            clearAuthCookie(res);
            sendResponse(res, {
                success: true,
                statuscode: httpStatus.OK,
                message: "User Logged Out Successfully",
                data: null,
            });
        } catch (err) {
            next(err);
        }
    },

    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number((req.user as any).userId); // from middleware
            const { oldPassword, newPassword } = req.body;

            await AuthServices.resetPassword(userId, oldPassword, newPassword);

            sendResponse(res, {
                success: true,
                statuscode: httpStatus.OK,
                message: "Password changed successfully",
                data: null,
            });
        } catch (err) {
            next(err);
        }
    },
};
