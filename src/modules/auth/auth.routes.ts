import { Router } from "express";
import { authController } from "./auth.controller.js";
import { auth } from "../../middlewares/auth.js";
import { Role } from "@prisma/client";
import { validate } from "../../middlewares/validate.js";
import { authValidation } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(authValidation.register), authController.registerUser)
router.post("/login", validate(authValidation.login), authController.loginUser)
router.get("/me", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authController.getUserInfo)

export const authRouter = router;
