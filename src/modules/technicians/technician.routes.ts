import { Router } from "express";
import { technicianController } from "./technician.controller.js";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth.js";

const router = Router();





router.get("/", technicianController.getAllTechnicians)
router.get("/bookings",auth(Role.TECHNICIAN), technicianController.getTechnicianBookings)
router.patch("/bookings/:id",auth(Role.TECHNICIAN), technicianController.updateBookingStatus)
router.get(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.getMyTechnicianProfile
)
router.put("/profile", auth(Role.TECHNICIAN), technicianController.updateTechnicianProfile)
router.put("/availability",auth(Role.TECHNICIAN), technicianController.updateTechnicianAvailability)
router.get("/:id", technicianController.getTechnicianById)




export const technicianRouter = router;
