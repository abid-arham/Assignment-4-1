import { prisma } from "../../lib/prisma";

const getAllTechnicians = async()=>{
    const technicians = await prisma.technicianProfile.findMany()
    return technicians
}



export const technicianService = {
    getAllTechnicians
};
