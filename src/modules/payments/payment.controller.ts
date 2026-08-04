import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { paymentServices } from "./payment.service"
import { sendResponse } from "../../utils/sendResponse"

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body
  const result = await paymentServices.createCheckoutSession(req.user!.id, bookingId)
  sendResponse(res, { success: true, statusCode: 200, message: "Checkout created", data: result })
})

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  await paymentServices.handleWebhook(req.body as Buffer, req.headers['stripe-signature'] as string)
  res.status(200).send()
})

const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getPaymentHistory(req.user!.id)
  sendResponse(res, { success: true, statusCode: 200, message: "Payment history", data: result })
})

export const paymentController = { createCheckoutSession, handleWebhook, getPaymentHistory }
