import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller.js";
import { validate } from "../../middlewares/validate";
import { reviewValidation } from "./review.validation.js";

const router = Router();

router.post("/", auth(Role.CUSTOMER), validate(reviewValidation.create), reviewController.createNewReview)

export const reviewRouter = router;
