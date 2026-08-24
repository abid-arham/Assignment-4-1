import { z } from "zod"
import { Role } from "@prisma/client"

const register = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(Role),
    
  })
})

const login = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
  })
})
const updateProfile = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
  })
})

const changePassword = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
})

export const authValidation = { register, login, updateProfile, changePassword }