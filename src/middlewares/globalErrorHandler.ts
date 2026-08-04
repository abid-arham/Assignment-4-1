import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client"
import { ZodError } from "zod"

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR
    let message = err.message || "Internal Server Error"
    let errorDetails: any = undefined

    if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST
        message = "Validation failed"
        errorDetails = err.errors
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST
        message = "Invalid field type or missing fields"
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST
            message = "Duplicate entry"
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST
            message = "Foreign key constraint failed"
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND
            message = "Record not found"
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError && err.errorCode === "P1000") {
        statusCode = httpStatus.UNAUTHORIZED
        message = "Database authentication failed"
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails
    })
}