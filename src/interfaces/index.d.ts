import { JwtPayload } from "jsonwebtoken";
import { ROLE } from "../modules/users/user.interface";

declare global {
  namespace Express {
    interface Request {
      // Extend JWT payload with your userId and role
      user: JwtPayload & {
        userId: number;
        role: ROLE;
      };
    }
  }
}
