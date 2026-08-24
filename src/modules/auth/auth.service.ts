import { tr } from "zod/v4/locales";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js"
import bcrypt from "bcryptjs";
import { ICreateUser, ILoginUser } from "./auth.interface.js";
import { jwtUtils } from "../../utils/jwt.js";
import { SignOptions } from "jsonwebtoken";
import { create } from "domain";



const registerUser = async(payload: ICreateUser)=>{
    const {name, email, password, role} = payload
    const isUserExist = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(isUserExist){
        throw new Error("User with this email already exists")
    }

    const hashPassword = await bcrypt.hash(String(password), Number(config.bcrypt_salt_rounds))
    const createdUser = await prisma.user.create({
        data:{
            name,
            email,
            password: hashPassword,
            role
        },
        omit:{
            password: true
        }
    })

    if(role === "TECHNICIAN"){
        await prisma.technicianProfile.create({
            data: {
                userId: createdUser.id,
                experience: 0,
                hourlyRate: 0
            }
        })
    }
    return createdUser
    
}
const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload
    if (!email || password === undefined || password === null) {
        throw new Error("Email and password are required")
    }

    const user = await prisma.user.findUniqueOrThrow({ where: { email } })
    const isPasswordMatched = await bcrypt.compare(String(password), user.password)
    if (!isPasswordMatched) {
        throw new Error("Incorrect email or password")
    }

    let technicianId: string | undefined
    if (user.role === "TECHNICIAN") {
        const technicianProfile = await prisma.technicianProfile.findUnique({
            where: { userId: user.id },
            select: { id: true },
        })
        technicianId = technicianProfile?.id
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(technicianId && { technicianId }),
    }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, { expiresIn: config.jwt_access_expires_in } as SignOptions)
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, { expiresIn: config.jwt_refresh_expires_in } as SignOptions)

    return { accessToken, refreshToken }
}

const getUserInfo = async(userId: string)=>{
    
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id: userId
        },
        omit:{
            password: true
        }
    })

    return user


}
const updateProfile = async (userId: string, payload: { name: string }) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name: payload.name },
    omit: { password: true },
  })
  return updatedUser
}

const changePassword = async (
  userId: string,
  payload: { currentPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  const isMatch = await bcrypt.compare(payload.currentPassword, user.password)
  if (!isMatch) {
    throw new Error("Current password is incorrect")
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds))

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

  return { success: true }
}

export const authServices = {
  registerUser, loginUser, getUserInfo, updateProfile, changePassword
}