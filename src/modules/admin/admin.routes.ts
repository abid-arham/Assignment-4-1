import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller.js";
import { validate } from "../../middlewares/validate";
import { adminValidation } from "./admin.validation.js";
import { categoryValidation } from "../categories/category.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers)
router.patch("/users/:id", auth(Role.ADMIN), validate(adminValidation.updateUserStatus), adminController.updateUserStatus)
router.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings)
router.get("/categories", auth(Role.ADMIN), adminController.getAllCategories)
router.post("/categories", auth(Role.ADMIN), validate(categoryValidation.create), adminController.addNewCategory)

export const adminRouter = router;
