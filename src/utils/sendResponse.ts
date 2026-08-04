

import { NextFunction, Request, Response, Router } from "express";

import bcrypt from "bcryptjs";

import httpStatus from "http-status"




type TMeta<T> = {
    page: number;
    rate: number;
    limit: number;
    
}

type TResponseData<T> = {
    success: boolean;
        statusCode: number;
        message: string;
        data:T;
        meta?: TMeta<T>;

}

export const sendResponse = <T>(res: Response, data: TResponseData<T>)=>{

    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
        meta: data.meta
        }
    )

}