import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import config from "../../config"
import Stripe from "stripe"

const createCheckoutSession = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { service: true }
  })

  if (booking.customerId !== userId) throw new Error("Not your booking")
  if (booking.status !== "ACCEPTED") throw new Error("Booking not accepted")

  const existing = await prisma.payment.findFirst({ where: { bookingId } })
  if (existing?.status === "COMPLETED") throw new Error("Already paid")

  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: booking.service.title },
        unit_amount: Math.round(booking.service.price.toNumber() * 100)
      },
      quantity: 1
    }],
    mode: "payment",
    success_url: `${config.app_url}/api/payments/success`,
    cancel_url: `${config.app_url}/api/payments/cancel`,
    metadata: { bookingId, userId }
  })

  if (existing) {
    await prisma.payment.update({
      where: { id: existing.id },
      data: { metadata: { stripeSessionId: session.id }, status: "PENDING" }
    })
  } else {
    await prisma.payment.create({
      data: {
        bookingId,
        customerId: booking.customerId,
        amount: booking.service.price,
        provider: "STRIPE",
        metadata: { stripeSessionId: session.id }
      }
    })
  }

  return { paymentUrl: session.url }
}

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(payload, signature, config.stripe_webhook_secret)
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId
    if (!bookingId) return
    
    const payment = await prisma.payment.findFirst({ where: { booking: { id: bookingId } } })
    if (!payment) return

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          transactionId: session.payment_intent as string,
          paidAt: new Date()
        }
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "PAID" }
      })
    ])
  }
}

const getPaymentHistory = async (userId: string) => {
  return prisma.payment.findMany({
    where: { booking: { customerId: userId } },
    include: { booking: { include: { service: true } } },
    orderBy: { createdAt: "desc" }
  })
}

const getPaymentById = async (userId: string, paymentId: string) => {
  return prisma.payment.findFirstOrThrow({
    where: { id: paymentId, booking: { customerId: userId } },
    include: { booking: { include: { service: true } } }
  })
}

export const paymentServices = { createCheckoutSession, handleWebhook, getPaymentHistory, getPaymentById }
