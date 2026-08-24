import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { jwtUtils } from "../utils/jwt.js";
import config from "../config/index.js";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";



declare global{
    namespace Express{
        interface Request{
            user?:{
                id: string;
                name: string;
                email: string;
                role: Role;
                technicianId?: string;
            }
        }
    }
}


export const auth = (...requiredRoles: Role[]) =>{
    return catchAsync(async(req: Request, res: Response,next: NextFunction)=>{
        const token = req.cookies.accessToken ? req.cookies.accessToken 
        
        : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

        if(!token){
            throw new Error("You're not logged in. Please login")
        }
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

       if(!verifiedToken.success){
        throw new Error(verifiedToken.error)
    }

    const {email, id, name, role} = verifiedToken.data as JwtPayload
    const user = await prisma.user.findUnique({
        where:{
            id
        },
        include: { technicianProfile: role === Role.TECHNICIAN }
    });


     if(requiredRoles.length && !requiredRoles.includes(role)){
        throw new Error("Forbidden. You don't have permission here")
    }



    if(!user){
        throw new Error("User not found. Please login again")
    }

    if(user?.activeStatus === "BLOCKED"){
        throw new Error("Your account has been blocked. Please contact support.")
    }





    req.user = {
        email: user.email, name: user.name, id: user.id, role: user.role,
        technicianId: user.technicianProfile?.id
    }

    next();
    })

}