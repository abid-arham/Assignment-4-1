import { z } from "zod"

const updateProfile = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional()
  })
})

export const userValidation = { updateProfile }
