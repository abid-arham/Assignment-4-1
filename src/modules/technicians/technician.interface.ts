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