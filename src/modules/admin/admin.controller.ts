import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminServices } from "./admin.service.js";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async(req: Request, res: Response)=>{
    const result = await adminServices.getAllUsers()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: result
    })
})

const updateUserStatus = catchAsync(async(req: Request, res: Response)=>{
    const { id } = req.params
    const { activeStatus } = req.body
    await adminServices.updateUserStatus(id as string, activeStatus)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: null
    })
})

const getAllBookings = catchAsync(async(req: Request, res: Response)=>{
    const result = await adminServices.getAllBookings()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Bookings retrieved successfully",
        data: result
    })
})

const getAllCategories = catchAsync(async(req: Request, res: Response)=>{
    const result = await adminServices.getAllCategories()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories retrieved successfully",
        data: result
    })
})

const addNewCategory = catchAsync(async(req: Request, res: Response)=>{
    const { name, description } = req.body
    const result = await adminServices.addNewCategory(name, description)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: result
    })
})

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    addNewCategory
}
