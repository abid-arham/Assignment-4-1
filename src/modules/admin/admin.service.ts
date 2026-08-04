
import { ActiveStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const getAllUsers = async()=>{

    const users = await prisma.user.findMany()
    return users

}

const updateUserStatus = async(userId: string, status: ActiveStatus)=>{

    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })

    if(!user){
        throw new Error("User does not exist")
    }

    await prisma.user.update({
        where:{
            id: userId
        },
        data:{
            activeStatus: status
        }
    })

    



}

const getAllBookings = async()=>{

    const bookings = await prisma.booking.findMany()
    return bookings

}


const getAllCategories = async()=>{
    const categories = await prisma.category.findMany()
    return categories
}


const addNewCategory = async(name: string, description?: string)=>{
    return await prisma.category.create({
        data: { name, description }
    })
}





export const adminServices =  {

        getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
addNewCategory
};
