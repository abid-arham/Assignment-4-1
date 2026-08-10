import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { Role } from "@prisma/client";
import { reviewController } from "./review.controller.js";
import { validate } from "../../middlewares/validate.js";
import { reviewValidation } from "./review.validation.js";

const router = Router();

router.post("/", auth(Role.CUSTOMER), validate(reviewValidation.create), reviewController.createNewReview)

export const reviewRouter = router;
