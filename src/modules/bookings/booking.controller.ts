import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { bookingServices } from "./booking.service.js"
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status"






const createBooking = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    
    const payload = req.body
    const result = await bookingServices.createBooking(payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "New Booking created",
        data: result
    })

})

const getAllBookings = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const customerId = req.user?.id
    const result = await bookingServices.getAllBookings(customerId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings retrieved successfully",
        data: result
    })
})

const getBookingByBookingId = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const bookingId = req.params.id
    const result = await bookingServices.getBookingByBookingId(bookingId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking retrieved successfully",
        data: result
    })
})







export const bookingController = {
    createBooking, getAllBookings, getBookingByBookingId
}