import { z } from "zod"
import { ActiveStatus } from "@prisma/client"

const updateUserStatus = z.object({
  body: z.object({
    activeStatus: z.nativeEnum(ActiveStatus)
  })
})




export const adminValidation = { updateUserStatus }
