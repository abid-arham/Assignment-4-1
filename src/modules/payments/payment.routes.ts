import { Router } from "express"
import { auth } from "../../middlewares/auth.js"
import { paymentController } from "./payment.controller.js"

const router = Router()

router.post("/create", auth("CUSTOMER"), paymentController.createCheckoutSession)
router.post("/confirm", paymentController.handleWebhook)
router.get("/success", (req, res) => res.json({ status: req.query.confirm || "CONFIRM" })) 
router.get("/cancel", (req, res) => res.json({ status: req.query.cancel || "CANCEL" })) 
router.get("/", auth("CUSTOMER"), paymentController.getPaymentHistory)
router.get("/:id", auth("CUSTOMER"), paymentController.getPaymentById)

export const paymentRouter = router
