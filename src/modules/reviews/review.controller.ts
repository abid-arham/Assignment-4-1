import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status"



const createNewReview = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const payload = req.body
    const customerId = req.body.customerId
    
    const result = await reviewServices.createNewReview(customerId, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "New Booking created",
        data: result
    })
})






export const reviewController = {
    createNewReview
};