import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";

import apiRouter from "./modules.js";
import { notFound } from "./middlewares/notFound.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { prisma } from "./lib/prisma.js";
import { categoryRouter } from "./modules/categories/category.routes.js";
import { technicianRouter } from "./modules/technicians/technician.routes.js";
import { serviceRouter } from "./modules/services/service.routes.js";
import { bookingRouter } from "./modules/bookings/booking.routes.js";
import { reviewRouter } from "./modules/reviews/review.routes.js";
import { paymentRouter } from "./modules/payments/payment.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";

const app: Application = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", async(req:Request, res:Response)=>{
    const user = await prisma.user.findMany();
    console.log(user)
    res.send("Hello World")
})

app.use("/api/auth", authRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/technicians", technicianRouter)
app.use("/api/services", serviceRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/payments", paymentRouter)
app.use("/api/admin", adminRouter)









app.use(notFound);
app.use(globalErrorHandler);

export default app;
