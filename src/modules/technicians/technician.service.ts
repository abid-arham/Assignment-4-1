import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IUpdateAvailabilitySlots, IUpdateTechnicianProfile } from "./technician.interface";

const getAllTechnicians = async()=>{
    const technicians = await prisma.technicianProfile.findMany()
    return technicians
}

const getTechnicianById = async(technicianId: string)=>{
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where:{
            id: technicianId
        },
        include:{
            reviews: true
        }
    })

    return technician
}


const updateTechnicianProfile  = async(technicianId: string, payload: IUpdateTechnicianProfile)=>{

    

    const isTechnicianExist = await prisma.technicianProfile.findUnique({
        where:{
            id: technicianId
        }
    })
    
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
            ...payload
        }
    })

    return updatedAvailability
}

const getTechnicianBookings = async(technicianId: string)=>{

    const bookings = await prisma.booking.findMany({
        where: {
            id: technicianId
        }
    })

    return bookings

}

const updateBookingStatus = async(bookingId: string, newStatus: BookingStatus)=>{
    const isBookingExist = await prisma.booking.findUnique({
        where:{
            id: bookingId
        }
    })

    if(!isBookingExist){
        throw new Error("Booking does not exist")
    }

    const updatedStatus = await prisma.booking.update({

        where:{
            id:bookingId
        },

        data:{
            status: newStatus
        }
    
    })

    return updatedStatus

}



export const technicianService = {
    getAllTechnicians, 
    getTechnicianById,
    updateTechnicianProfile,
    updateTechnicianAvailability,
    getTechnicianBookings,
    updateBookingStatus,
};
