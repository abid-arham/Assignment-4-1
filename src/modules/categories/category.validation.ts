import { z } from "zod"

const create = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional()
  })
})

export const categoryValidation = { create }
