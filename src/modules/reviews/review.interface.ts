import { BookingStatus } from "@prisma/client";


export interface ICreateReview{
    customerId: string;
    technicianId: string;
    bookingId: string;
    status: BookingStatus;
    rating: number;
    comment: string;
}