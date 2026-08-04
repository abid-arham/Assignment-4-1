import { Router } from "express";
import { technicianController } from "./technician.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();





router.get("/", technicianController.getAllTechnicians)
router.get("/:id", technicianController.getTechnicianById)
router.put("/profile", auth(Role.TECHNICIAN), technicianController.updateTechnicianProfile)
router.put("/availability",auth(Role.TECHNICIAN), technicianController.updateTechnicianAvailability)
router.get("/bookings",auth(Role.TECHNICIAN), technicianController.getTechnicianBookings)
router.patch("/bookings/:id",auth(Role.TECHNICIAN), technicianController.updateBookingStatus)




export const technicianRouter = router;
