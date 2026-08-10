import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { categoryServices } from "./category.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status"

const getAllCategories = catchAsync(async(req: Request, res: Response, next:NextFunction)=>{
    const result = await categoryServices.getAllCategories()
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Categories retrieved successfully",
        data: result
    })
})

export const categoryController = {
    getAllCategories
};
