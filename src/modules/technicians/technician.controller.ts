import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { technicianService } from "./technician.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma.js";

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
const getMyTechnicianProfile = catchAsync(
  async (req: Request, res: Response) => {
    const technicianId = req.user?.technicianId

    if (!technicianId) {
      throw new Error("Technician ID not found")
    }

    const technician =
      await technicianService.getMyTechnicianProfile(
        technicianId
      )

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile retrieved successfully",
      data: technician,
    })
  }
)

const getTechnicianAvailableSlots = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.params.id
    const { date, serviceId } = req.query

    const result = await technicianService.getTechnicianAvailableSlots(
      technicianId as string,
      {
        date: date as string,
        serviceId: serviceId as string | undefined,
      }
    )

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician availability slots retrieved successfully",
      data: result,
    })
  }
)

export const technicianController =  {
    getAllTechnicians, getTechnicianById,
    updateTechnicianProfile,
    updateTechnicianAvailability,
    getTechnicianBookings,
    updateBookingStatus,
    getMyTechnicianProfile,
    getTechnicianAvailableSlots,
};