import { Router } from "express";

import {adminRouter} from "./admin/admin.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { bookingRouter } from "./bookings/booking.routes.js";
import { categoryRouter } from "./categories/category.routes.js";
import { paymentRouter } from "./payments/payment.routes.js";
import { reviewRouter } from "./reviews/review.routes.js";
import { serviceRouter } from "./services/service.routes.js";
import { technicianRouter } from "./technicians/technician.routes.js";


const router = Router();

router.use("/auth", authRouter);

router.use("/services", serviceRouter);
router.use("/technicians", technicianRouter);
router.use("/categories", categoryRouter);
router.use("/bookings", bookingRouter);
router.use("/payments", paymentRouter);
router.use("/reviews", reviewRouter);
router.use("/admin", adminRouter);

export default router;
