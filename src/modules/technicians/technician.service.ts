import { prisma } from "../../lib/prisma";

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



export const technicianService = {
    getAllTechnicians, getTechnicianById
};
