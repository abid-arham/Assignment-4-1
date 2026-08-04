import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";

import apiRouter from "./modules";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { prisma } from "./lib/prisma";
import { categoryRouter } from "./modules/categories/category.routes";
import { technicianRouter } from "./modules/technicians/technician.routes";
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









app.use(notFound);
app.use(globalErrorHandler);

export default app;
