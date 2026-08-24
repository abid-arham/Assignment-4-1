import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync.js"
import { authServices } from "./auth.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

import httpStatus from "http-status"
import { prisma } from "../../lib/prisma.js";







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


const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const result = await authServices.updateProfile(userId as string, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const result = await authServices.changePassword(userId as string, req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result
  })
})

export const authController = {
  registerUser, loginUser, getUserInfo, updateProfile, changePassword
}