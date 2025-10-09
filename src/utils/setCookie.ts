import { Response, CookieOptions } from "express";
import { envVars } from "../config/env";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  const isProduction = envVars.NODE_ENV === "production";

  // Define allowed sameSite values explicitly
  type SameSiteType = "strict" | "lax" | "none";

  const sameSite: SameSiteType = isProduction ? "none" : "lax";

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite,
  };

  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, cookieOptions);
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, cookieOptions);
  }
};
export const clearAuthCookie = (res: Response) => {
  const isProduction = envVars.NODE_ENV === "production";

  type SameSiteType = "strict" | "lax" | "none";
  const sameSite: SameSiteType = isProduction ? "none" : "lax";

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: "/", // must match setAuthCookie
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};