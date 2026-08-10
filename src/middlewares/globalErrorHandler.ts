import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

export const globalErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    let statusCode: number = 500
    let message = err.message || "Internal Server Error"
    let errorDetails: any = undefined

    if (err instanceof ZodError) {
        statusCode = 400
        message = "Validation failed"
        errorDetails = err.errors
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400
        message = err.message 
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 400
            message = "Duplicate entry"
        } else if (err.code === "P2003") {
            statusCode = 400
            message = "Foreign key constraint failed"
        } else if (err.code === "P2025") {
            statusCode = 404
            message = "Record not found"
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError && err.errorCode === "P1000") {
        statusCode = 401
        message = "Database authentication failed"
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails
    })
}