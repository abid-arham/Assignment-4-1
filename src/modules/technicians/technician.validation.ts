import { z } from "zod"

const updateProfile = z.object({
  body: z.object({
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experience: z.number().int().nonnegative().optional(),
    hourlyRate: z.string().optional(),
    location: z.string().optional()
  })
})

const updateAvailability = z.object({
  body: z.object({
    availability: z.object({
      days: z.array(z.string()),
      hours: z.string()
    })
  })
})

export const technicianValidation = { updateProfile, updateAvailability }
