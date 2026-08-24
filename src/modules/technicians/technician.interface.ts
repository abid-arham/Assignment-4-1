export interface IUpdateTechnicianProfile{
    skills: string[];
    experience: number;
    hourlyRate:number;
    location: string;
}


export interface IUpdateAvailabilitySlots{
    days: string[];
    hours: string;
}

export interface IAvailabilityQuery {
    date: string       // "YYYY-MM-DD"
    serviceId?: string
}

export interface IAvailableSlot {
    start: string       // ISO datetime
    end: string          // ISO datetime
}