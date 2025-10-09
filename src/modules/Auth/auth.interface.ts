
import { JwtPayload } from "jsonwebtoken";
import { IUser, ROLE } from "../users/user.interface";

// Login input
export interface ILoginInput {
    email: string;
    password: string;
}

// Login output
export interface ILoginOutput {
    accessToken: string;
    refreshToken: string;
    user: Omit<IUser, "password">;
}

// Refresh token input/output
export interface IRefreshTokenInput {
    refreshToken: string;
}

export interface IRefreshTokenOutput {
    accessToken: string;
}

// JWT payload for token creation
export interface IJwtPayload {
    userId: number;
    email: string;
    role: ROLE;
}

// Reset password input
export interface IResetPasswordInput {
    oldPassword: string;
    newPassword: string;
    decodedToken: JwtPayload;
}
