import { z } from "zod"
import { ActiveStatus } from "../../../generated/prisma/enums"

const updateUserStatus = z.object({
  body: z.object({
    activeStatus: z.nativeEnum(ActiveStatus)
  })
})




export const adminValidation = { updateUserStatus }
