import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";







const registerUser = catchAsync(async(req: Request, res: Response, next:NextFunction)=>{
    const payload = req.body

    const user = await authServices.registerUser(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "New User created",
        data: user
    })
})



const loginUser = catchAsync(async(req: Request, res: Response, next:NextFunction)=>{
    const payload = req.body;
    const {accessToken, refreshToken} = await authServices.loginUser(payload);
    res.cookie("accessToken", accessToken, {httpOnly: true, secure: false, sameSite: "none", maxAge: 24*3600*1000})
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false, sameSite: "none", maxAge: 7*24*3600*1000})
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK, 
        message: "User Login successful",
        data: {accessToken, refreshToken}

    })
})



const getUserInfo = catchAsync(async(req: Request, res: Response, next:NextFunction)=>{
    const {accessToken} = req.cookies;
    const userId = req.user?.id as string
    const user = await authServices.getUserInfo(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User info retrieved successfully",
        data: user
    })
})












export const authController = {
    registerUser, loginUser, getUserInfo
}