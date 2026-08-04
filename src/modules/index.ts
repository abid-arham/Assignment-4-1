import { Router } from "express";

import adminRouter from "./admin/admin.routes";
import { authRouter } from "./auth/auth.routes";
import { bookingRouter } from "./bookings/booking.routes";
import { categoryRouter } from "./categories/category.routes";
import { paymentRouter } from "./payments/payment.routes";
import { reviewRouter } from "./reviews/review.routes";
import { serviceRouter } from "./services/service.routes";
import { technicianRouter } from "./technicians/technician.routes";
import userRouter from "./users/user.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/services", serviceRouter);
router.use("/technicians", technicianRouter);
router.use("/categories", categoryRouter);
router.use("/bookings", bookingRouter);
router.use("/payments", paymentRouter);
router.use("/reviews", reviewRouter);
router.use("/admin", adminRouter);

export default router;
