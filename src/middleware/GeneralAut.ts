import type { Request , Response , NextFunction } from "express";
import jwt , {type JwtPayload} from "jsonwebtoken"
import prisma from "../db/prisma.js";

export interface AuthRequest extends Request{
    user?: {
        id: string
    }
}

export const GeneralAuth = async(req:AuthRequest , res:Response , next:NextFunction)=>{
    try{
        const token = req.cookies?.token;
        if(!token){
            res.status(401).json({
                error: "Unauthorized - Invalid token format"
            })
        }
        const secret = process.env.JWT_SECRET
        if(!secret){
            console.error("JWT secret is not defined in environment variables.");
            return res.status(500).json({ error: "Internal Server Error" });
        }
        const decoded = jwt.verify(token , secret) as JwtPayload
        if (!decoded || !decoded.userID) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
          }

          const user = await prisma.user.findUnique({
            where: { id: decoded.userID },
          });
      
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
      req.user = {id: user.id} 
      next()

    }
    catch(error:any){
        console.error("Error in verifyToken middleware:", error.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}