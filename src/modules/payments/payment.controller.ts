import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync.js"
import { paymentServices } from "./payment.service.js"
import { sendResponse } from "../../utils/sendResponse.js"

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body
  if (!bookingId) throw new Error("bookingId required")
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

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getPaymentById(req.user!.id, req.params.id as string)
  sendResponse(res, { success: true, statusCode: 200, message: "Payment details", data: result })
})

export const paymentController = { createCheckoutSession, handleWebhook, getPaymentHistory, getPaymentById }
