import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middlewares/validate";
import { bookingValidation } from "./booking.validation";

const router = Router();

router.post("/", auth(Role.CUSTOMER), validate(bookingValidation.create), bookingController.createBooking)
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), bookingController.getAllBookings)

router.get("/:id", auth(Role.CUSTOMER), bookingController.getBookingByBookingId)

export const bookingRouter = router;
