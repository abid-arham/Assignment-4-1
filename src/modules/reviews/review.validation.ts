import { z } from "zod"

const create = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    technicianId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  })
})

export const reviewValidation = { create }
