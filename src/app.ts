import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import apiRouter from "./modules";
import { errorHandler, notFoundHandler } from "./shared/middlewares/error.middleware";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
