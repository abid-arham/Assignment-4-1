export interface ICreateBooking {
    customerId: string;
    technicianId: string;
    serviceId: string;
    scheduledAt: Date | string;
    location: string;
    totalAmount: number;
    notes?: string;
}