import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/index";


interface JwtPayload {
    userId ?: string,
    role ?: string,
    email? : string,
    [key:string] :any,
}

declare module 'express' {
    interface Request {
        user ? : JwtPayload;
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) : void => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Unauthorized: Token not found" });
            return;
        }


        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        const userInfo = {authUserUUID:decoded.authUserUUID , role:decoded.role,email:decoded.email };

        //Forward the user data in custom header
        req.headers['x-user-data'] = JSON.stringify(userInfo)

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(403).json({ message: "Invalid or expired token" });
        return
    }
};
