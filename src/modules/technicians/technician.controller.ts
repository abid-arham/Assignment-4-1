import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { technicianService } from "./technician.service.js";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
const getAllTechnicians = catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
    const result = await technicianService.getAllTechnicians()
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Technicians retrieved successfully",
        data: result
    })
})


const getTechnicianById = catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
    const technicianId = req.params.id
    const result = await technicianService.getTechnicianById(technicianId as string)
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Technician retrieved successfully",
        data: result
    })

})



const updateTechnicianProfile = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const payload = req.body
    const technicianId = req.user?.technicianId
    const result = await technicianService.updateTechnicianProfile(technicianId as string, payload);
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Technician profile updated successfully",
        data: result
    })
})
const updateTechnicianAvailability = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const payload = req.body
    const technicianId = req.user?.technicianId
    const result = await technicianService.updateTechnicianAvailability(technicianId as string, payload)
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Technician availability updated successfully",
        data: result
    })

})
const getTechnicianBookings = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const technicianId = req.user?.technicianId
    const result = await technicianService.getTechnicianBookings(technicianId as string)
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Technician bookings retrieved successfully",
        data: result
    })
})
const updateBookingStatus = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const bookingId = req.params.id

    const {status} = req.body

    const result = await technicianService.updateBookingStatus(bookingId as string, status)
    sendResponse(res, {
        success: true,
        statusCode:httpStatus.OK,
        message:"Booking status updated successfully",
        data: result
    })
})








export const technicianController =  {
    getAllTechnicians, getTechnicianById,
    updateTechnicianProfile,
    updateTechnicianAvailability,
    getTechnicianBookings,
    updateBookingStatus,
};
