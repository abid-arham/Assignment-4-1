import { prisma } from "../../lib/prisma.js"
import { ICreateReview } from "./review.interface.js"



const createNewReview = async(userId: string, payload: ICreateReview)=>{
    const {customerId = userId,
            technicianId,
            bookingId,
            rating, 
            comment} = payload

    const bookings = await prisma.booking.findMany({
     where: {  
        customerId, 
        status: "COMPLETED" 
    }
    });

    
    const review = await prisma.review.create({

        data:{
            customerId,
            technicianId,
            bookingId,
            rating,
            comment
        }
        
    })

    return review
}





export const reviewServices = {
    createNewReview
}