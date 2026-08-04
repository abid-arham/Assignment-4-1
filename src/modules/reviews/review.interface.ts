import { BookingStatus } from "../../../generated/prisma/enums";


export interface ICreateReview{
    customerId: string;
    technicianId: string;
    bookingId: string;
    status: BookingStatus;
    rating: number;
    comment: string;
}