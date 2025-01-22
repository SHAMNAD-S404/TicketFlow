import { Request,Response,NextFunction } from "express";

export const authorizeRole = (allowedRoles : string[]) => {
    try {
        return (req:Request,res:Response,next:NextFunction) => {
            const userRole = (req as any).user?.role;

            if(!userRole || !allowedRoles.includes(userRole)) {
                return res.status(403).json({message : "You do not have permission to access this resource"})
            }
            next();
        }
    } catch (error) {
        return {message:"failed to validate the userRole"}
    }
}