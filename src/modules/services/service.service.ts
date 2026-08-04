import { prisma } from "../../lib/prisma";

const getAllServices = async()=>{

    const services = await prisma.service.findMany()
    return services

}

export const serviceServices =  {
    getAllServices
};
