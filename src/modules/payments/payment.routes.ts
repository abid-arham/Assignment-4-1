import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { paymentController } from "./payment.controller"

const router = Router()

router.post("/create", auth("CUSTOMER"), paymentController.createCheckoutSession)
router.post("/confirm", paymentController.handleWebhook)
router.get("/", auth("CUSTOMER"), paymentController.getPaymentHistory)
router.get("/:id", auth("CUSTOMER"), paymentController.getPaymentById)

export const paymentRouter = router
