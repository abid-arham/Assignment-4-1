import { z } from "zod"

const create = z.object({
  body: z.object({
    categoryId: z.string().uuid(),
    title: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    durationMins: z.number().int().positive()
  })
})

export const serviceValidation = { create }
