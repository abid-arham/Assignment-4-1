import { z } from "zod"
import { BookingStatus } from "../../../generated/prisma/enums"

const create = z.object({
  body: z.object({
    serviceId: z.string().uuid(),
    technicianId: z.string().uuid(),
    scheduledAt: z.string().datetime()
  })
})

const updateStatus = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus)
  })
})

export const bookingValidation = { create, updateStatus }
