import { Router } from "express";
import { bookingController } from "./booking.controller.js";
import { auth } from "../../middlewares/auth.js";
import { Role } from "@prisma/client";
import { validate } from "../../middlewares/validate.js";
import { bookingValidation } from "./booking.validation.js";

const router = Router();

router.post("/", auth(Role.CUSTOMER), validate(bookingValidation.create), bookingController.createBooking)
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), bookingController.getAllBookings)

router.get("/:id", auth(Role.CUSTOMER), bookingController.getBookingByBookingId)

router.patch("/:id/cancel", auth(Role.CUSTOMER), bookingController.cancelBooking)

export const bookingRouter = router;
