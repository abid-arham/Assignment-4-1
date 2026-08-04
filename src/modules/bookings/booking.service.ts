import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interfaces";


const createBooking = async(payload: ICreateBooking)=>{
    const {customerId, technicianId, serviceId, scheduledAt, location, totalAmount, notes} = payload
    const createdBooking = await prisma.booking.create({
        data:{
            customerId,
            technicianId,
            serviceId,
            scheduledAt,
            location,
            totalAmount,
            notes
        }
    })

    return createdBooking

}
const getAllBookings = async(customerId: string)=>{

    const allBookings = await prisma.booking.findMany({
        where:{
            customerId
        }
    })
    return allBookings

}


const getBookingByBookingId = async(bookingId: string)=>{

    const booking = await prisma.booking.findUniqueOrThrow({
        where:{
            id: bookingId
        }
    })
    return booking

}






export const bookingServices =  {
    createBooking, getAllBookings, getBookingByBookingId
};
