import { catchAsync } from "../../utils/catchAsync.js";
import httpStatus from "http-status"
import { NextFunction, Request, Response } from "express";
import { serviceServices } from "./service.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

const getAllServices = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const services = await serviceServices.getAllServices()
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Services retrieved successfully",
        data: services
    })
})


export const serviceController = {
    getAllServices
}