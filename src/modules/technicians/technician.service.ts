import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IAvailabilityQuery, IAvailableSlot, IUpdateAvailabilitySlots, IUpdateTechnicianProfile } from "./technician.interface.js";

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

// Statuses that actually hold a slot. DECLINED/CANCELLED free the slot back up,
// COMPLETED is always in the past so it never collides with future candidates.
const HELD_BOOKING_STATUSES: BookingStatus[] = [
    "REQUESTED",
    "ACCEPTED",
    "PAID",
    "IN_PROGRESS",
]

const DAY_NAMES = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY",
]

const parseHourMinute = (value: string | undefined, label: string): { hour: number; minute: number } => {
    if (!value) {
        throw new Error(`Technician availability has an invalid ${label} time`)
    }

    const parts = value.split(":").map(Number)
    const hour = parts[0]
    const minute = parts[1]

    if (
        hour === undefined || minute === undefined ||
        Number.isNaN(hour) || Number.isNaN(minute)
    ) {
        throw new Error(`Technician availability has an invalid ${label} time`)
    }

    return { hour, minute }
}

const getTechnicianAvailableSlots = async (
    technicianId: string,
    query: IAvailabilityQuery
) => {
    const { date, serviceId } = query

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error("A valid date query param (YYYY-MM-DD) is required")
    }

    const technician = await prisma.technicianProfile.findUnique({
        where: { id: technicianId },
    })

    if (!technician) {
        throw new Error("Technician not found")
    }

    const availability = technician.availability as
        | { days?: string[]; hours?: string }
        | null

    if (!availability?.days?.length || !availability.hours) {
        return { date, slots: [] as IAvailableSlot[] }
    }

    const requestedDate = new Date(`${date}T00:00:00.000Z`)
    const dayIndex = requestedDate.getUTCDay()
    const dayName = DAY_NAMES[dayIndex]

    if (!dayName) {
        throw new Error("Could not resolve weekday for the given date")
    }

    const availableDays = availability.days.map((d) => d.toUpperCase())
    if (!availableDays.includes(dayName)) {
        return { date, slots: [] as IAvailableSlot[] }
    }

    const [startStr, endStr] = availability.hours.split("-").map((s) => s.trim())
    const { hour: startHour, minute: startMinute } = parseHourMinute(startStr, "start")
    const { hour: endHour, minute: endMinute } = parseHourMinute(endStr, "end")

    let durationMins = 60
    if (serviceId) {
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        })
        if (service?.durationMins) {
            durationMins = service.durationMins
        }
    }

    const dayStart = new Date(requestedDate)
    dayStart.setUTCHours(startHour, startMinute, 0, 0)

    const dayEnd = new Date(requestedDate)
    dayEnd.setUTCHours(endHour, endMinute, 0, 0)

    const candidateSlots: { start: Date; end: Date }[] = []
    let cursor = new Date(dayStart)

    while (cursor.getTime() + durationMins * 60000 <= dayEnd.getTime()) {
        const slotStart = new Date(cursor)
        const slotEnd = new Date(cursor.getTime() + durationMins * 60000)
        candidateSlots.push({ start: slotStart, end: slotEnd })
        cursor = slotEnd
    }

    const dayRangeStart = new Date(requestedDate)
    dayRangeStart.setUTCHours(0, 0, 0, 0)
    const dayRangeEnd = new Date(requestedDate)
    dayRangeEnd.setUTCHours(23, 59, 59, 999)

    const existingBookings = await prisma.booking.findMany({
        where: {
            technicianId,
            status: { in: HELD_BOOKING_STATUSES },
            scheduledAt: { gte: dayRangeStart, lte: dayRangeEnd },
        },
        include: {
            service: { select: { durationMins: true } },
        },
    })

    const bookedRanges = existingBookings.map((booking) => {
        const bookedDuration = booking.service?.durationMins ?? 60
        const start = new Date(booking.scheduledAt)
        const end = new Date(start.getTime() + bookedDuration * 60000)
        return { start, end }
    })

    const now = new Date()

    const availableSlots: IAvailableSlot[] = candidateSlots
        .filter((slot) => {
            if (slot.start < now) return false
            return !bookedRanges.some(
                (booked) => slot.start < booked.end && slot.end > booked.start
            )
        })
        .map((slot) => ({
            start: slot.start.toISOString(),
            end: slot.end.toISOString(),
        }))

    return { date, durationMins, slots: availableSlots }
}
export const technicianService = {
    getAllTechnicians, 
    getTechnicianById,
    updateTechnicianProfile,
    updateTechnicianAvailability,
    getTechnicianBookings,
    updateBookingStatus,
    getMyTechnicianProfile,
    getTechnicianAvailableSlots,
};