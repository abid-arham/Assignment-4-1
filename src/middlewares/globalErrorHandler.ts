import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client"
export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction)=>{
    let statusCode;
    let errorMessage = err.message || "Internal Server Error"
    let errorName = err.name || "Internal Server Error"
    if(err instanceof Prisma.PrismaClientValidationError){
        const statusCode = httpStatus["400_NAME"]
        const errorMessage = "You have provided incorrect field type or missing fields"
    }
    else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === "P2002"){
            statusCode = httpStatus.BAD_REQUEST,
            errorMessage = "Duplicate key error"
        }
        else if(err.code === "P2003"){
            statusCode = httpStatus.BAD_REQUEST,
            errorMessage = "Foreign key constraint failed"
        
        }
    }
    else if(err instanceof Prisma.PrismaClientInitializationError){
           if(err.errorCode === "P1000"){
            statusCode = httpStatus.UNAUTHORIZED
            errorMessage = "Authentication failed against database server. Please check your credentials"
           }
    }
    else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        errorMessage = "Internal Server Error"
    }
    
    
    
    
    
    
    
    
    
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
        
    })
}