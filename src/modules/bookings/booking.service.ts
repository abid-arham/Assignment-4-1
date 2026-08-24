import { prisma } from "../../lib/prisma.js";
import { ICreateBooking } from "./booking.interfaces.js";


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

const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  })

  if (booking.customerId !== customerId) {
    throw new Error("Not your booking")
  }

  if (booking.status !== "REQUESTED") {
    throw new Error("Only requested bookings can be cancelled")
  }

  const cancelledBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  })

  return cancelledBooking
}

export const bookingServices = {
  createBooking, getAllBookings, getBookingByBookingId, cancelBooking
}




