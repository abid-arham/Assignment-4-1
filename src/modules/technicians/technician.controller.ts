import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { technicianService } from "./technician.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
const getAllTechnicians = catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
    const result = await technicianService.getAllTechnicians()
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Technicians retrieved successfully",
        data: result
    })
})

export const technicianController =  {
    getAllTechnicians
};
