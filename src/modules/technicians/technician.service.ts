import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IUpdateAvailabilitySlots, IUpdateTechnicianProfile } from "./technician.interface.js";

const getAllTechnicians = async () => {
    const technicians = await prisma.technicianProfile.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true }
            }
        }
    })
    return technicians
}

const getTechnicianById = async (technicianId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { id: technicianId },
        include: {
            reviews: true,
            user: {
                select: { id: true, name: true, email: true }
            }
        }
    })
    return technician
}


const updateTechnicianProfile  = async(technicianId: string, payload: IUpdateTechnicianProfile)=>{
    const{skills,experience,hourlyRate,location} = payload

    const updatedTechnicianProfile = await prisma.technicianProfile.update({
        where:{
            id: technicianId
        },
        data:{
            skills,experience,hourlyRate,location
        }
    })
    return updatedTechnicianProfile

}

const updateTechnicianAvailability = async(technicianId: string, payload: IUpdateAvailabilitySlots)=>{

    const isTechnicianExist = await prisma.technicianProfile.findUnique({
        where:{
            id: technicianId
        }
    })
    if(!isTechnicianExist){
        throw new Error("Technician Unavailable")
    }

    const updatedAvailability = await prisma.technicianProfile.update({
        where:{
            id: technicianId
        },
        data:{
            availability: {...payload}
        }
    })

    return updatedAvailability
}

const getTechnicianBookings = async(technicianId: string)=>{
    
    const bookings = await prisma.booking.findMany({
        where: {
            technicianId: technicianId
        }
    })

    return bookings

}

const updateBookingStatus = async(bookingId: string, newStatus: BookingStatus)=>{
    // const isBookingExist = await prisma.booking.findUnique({
    //     where:{
    //         id: bookingId
    //     }
    // })

    // if(!isBookingExist){
    //     throw new Error("Booking does not exist")
    // }

    return await prisma.booking.update({

        where:{
            id:bookingId
        },

        data:{
            status: newStatus
        }
    
    })

    

}
const getMyTechnicianProfile = async (
  technicianId: string
) => {
  const technician =
    await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        id: technicianId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

  return technician
}


export const technicianService = {
    getAllTechnicians, 
    getTechnicianById,
    updateTechnicianProfile,
    updateTechnicianAvailability,
    getTechnicianBookings,
    updateBookingStatus,
    getMyTechnicianProfile
};
