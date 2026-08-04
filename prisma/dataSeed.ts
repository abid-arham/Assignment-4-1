import bcrypt from "bcryptjs";

import {
  ActiveStatus,
  BookingStatus,
  PaymentStatus,
  Role,
} from "../generated/prisma/enums";
import { prisma } from "../src/lib/prisma";

const TEST_PASSWORD = "TestPass123!";

// Fixed UUIDs for seed records. These stay constant across runs so the
// upsert calls below remain idempotent — re-running the script updates
// the same rows instead of creating duplicates. Generated once via
// crypto.randomUUID(); do not regenerate these unless you also intend
// to reset/duplicate the seeded data.
const SEED_IDS = {
  userAdmin: "c381f81b-8b64-4acc-848f-0388089a4537",
  userCustomer: "4e626b2c-48c9-4be1-ae44-ff1dcbccf98c",
  userTechnicianAlice: "837a34b3-5514-4ed5-8134-1576fcc78634",
  userTechnicianBob: "73675bd0-0d17-4c54-bfb5-f1052abb20fb",

  categoryPlumbing: "6470f0fd-086a-4537-b7aa-bd7874264e7a",
  categoryElectrical: "a8ed2d55-8ce0-486e-8005-4a1337aa63b0",
  categoryCleaning: "1f09e032-6e08-48eb-98e6-2a96ef5b5151",

  profileAlice: "8c799db3-f6d4-48c2-a0ab-18b3f3922178",
  profileBob: "d445de66-e2c2-4a97-953c-4bbf4ecafa11",

  serviceDrainCleaning: "6edc8e98-6938-4fc2-bf24-3327d2c85109",
  serviceWiringInspection: "1e1aa8e3-7161-49e4-bc4c-6f011cce9b17",
  serviceDeepClean: "cfb1cfe5-add6-4ced-b979-00645cf7cea8",

  bookingCompleted: "478de2ac-9a71-4676-bac0-e34b6948238e",
  bookingAccepted: "28d33c14-b3df-4fb4-9b9f-5747d8c0ca3c",

  paymentCompleted: "fafd75ce-4f16-4ae8-ad23-86ea1deb982d",
  paymentPending: "94cbf429-6721-4184-928d-3385f1f64498",

  reviewAlice: "c278d7e2-a524-478f-b289-b4f75cfa6cc2",
} as const;

async function main() {
  const password = await bcrypt.hash(TEST_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fixitnow.com" },
    update: {
      name: "Admin User",
      password: await bcrypt.hash("admin123", 12),
      role: Role.ADMIN,
      activeStatus: ActiveStatus.ACTIVE,
    },
    create: {
      id: SEED_IDS.userAdmin,
      name: "Admin User",
      email: "admin@fixitnow.com",
      password: await bcrypt.hash("admin123", 12),
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@fixitnow.test" },
    update: {
      name: "Test Customer",
      password,
      role: Role.CUSTOMER,
      activeStatus: ActiveStatus.ACTIVE,
    },
    create: {
      id: SEED_IDS.userCustomer,
      name: "Test Customer",
      email: "customer@fixitnow.test",
      password,
      role: Role.CUSTOMER,
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: "alice.tech@fixitnow.test" },
    update: {
      name: "Alice Rahman",
      password,
      role: Role.TECHNICIAN,
      activeStatus: ActiveStatus.ACTIVE,
    },
    create: {
      id: SEED_IDS.userTechnicianAlice,
      name: "Alice Rahman",
      email: "alice.tech@fixitnow.test",
      password,
      role: Role.TECHNICIAN,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob.tech@fixitnow.test" },
    update: {
      name: "Bob Ahmed",
      password,
      role: Role.TECHNICIAN,
      activeStatus: ActiveStatus.ACTIVE,
    },
    create: {
      id: SEED_IDS.userTechnicianBob,
      name: "Bob Ahmed",
      email: "bob.tech@fixitnow.test",
      password,
      role: Role.TECHNICIAN,
    },
  });

  const plumbing = await prisma.category.upsert({
    where: { name: "Plumbing" },
    update: { description: "Repairs, installations, and maintenance for plumbing systems." },
    create: {
      id: SEED_IDS.categoryPlumbing,
      name: "Plumbing",
      description: "Repairs, installations, and maintenance for plumbing systems.",
    },
  });

  const electrical = await prisma.category.upsert({
    where: { name: "Electrical" },
    update: { description: "Safe electrical repairs, wiring, and installations." },
    create: {
      id: SEED_IDS.categoryElectrical,
      name: "Electrical",
      description: "Safe electrical repairs, wiring, and installations.",
    },
  });

  const cleaning = await prisma.category.upsert({
    where: { name: "Cleaning" },
    update: { description: "Home and office cleaning services." },
    create: {
      id: SEED_IDS.categoryCleaning,
      name: "Cleaning",
      description: "Home and office cleaning services.",
    },
  });

  const aliceProfile = await prisma.technicianProfile.upsert({
    where: { userId: alice.id },
    update: {
      bio: "Licensed plumber with eight years of residential repair experience.",
      skills: ["Leak repair", "Pipe installation", "Drain cleaning"],
      experience: 8,
      hourlyRate: "30.00",
      location: "Dhaka",
      availability: { days: ["Sunday", "Tuesday", "Thursday"], hours: "09:00-17:00" },
      averageRating: "5.00",
      reviewCount: 1,
    },
    create: {
      id: SEED_IDS.profileAlice,
      userId: alice.id,
      bio: "Licensed plumber with eight years of residential repair experience.",
      skills: ["Leak repair", "Pipe installation", "Drain cleaning"],
      experience: 8,
      hourlyRate: "30.00",
      location: "Dhaka",
      availability: { days: ["Sunday", "Tuesday", "Thursday"], hours: "09:00-17:00" },
      averageRating: "5.00",
      reviewCount: 1,
    },
  });

  const bobProfile = await prisma.technicianProfile.upsert({
    where: { userId: bob.id },
    update: {
      bio: "Experienced electrician specialising in home safety and upgrades.",
      skills: ["Wiring", "Circuit breakers", "Light fixtures"],
      experience: 6,
      hourlyRate: "35.00",
      location: "Dhaka",
      availability: { days: ["Monday", "Wednesday", "Saturday"], hours: "10:00-18:00" },
      averageRating: "0.00",
      reviewCount: 0,
    },
    create: {
      id: SEED_IDS.profileBob,
      userId: bob.id,
      bio: "Experienced electrician specialising in home safety and upgrades.",
      skills: ["Wiring", "Circuit breakers", "Light fixtures"],
      experience: 6,
      hourlyRate: "35.00",
      location: "Dhaka",
      availability: { days: ["Monday", "Wednesday", "Saturday"], hours: "10:00-18:00" },
      averageRating: "0.00",
      reviewCount: 0,
    },
  });

  const drainService = await prisma.service.upsert({
    where: { id: SEED_IDS.serviceDrainCleaning },
    update: {
      technicianId: aliceProfile.id,
      categoryId: plumbing.id,
      title: "Drain Cleaning",
      description: "Clear blocked drains and inspect the affected plumbing.",
      price: "60.00",
      durationMins: 90,
      isActive: true,
    },
    create: {
      id: SEED_IDS.serviceDrainCleaning,
      technicianId: aliceProfile.id,
      categoryId: plumbing.id,
      title: "Drain Cleaning",
      description: "Clear blocked drains and inspect the affected plumbing.",
      price: "60.00",
      durationMins: 90,
    },
  });

  const wiringService = await prisma.service.upsert({
    where: { id: SEED_IDS.serviceWiringInspection },
    update: {
      technicianId: bobProfile.id,
      categoryId: electrical.id,
      title: "Home Wiring Inspection",
      description: "Inspect household wiring, switches, and circuit breakers.",
      price: "75.00",
      durationMins: 120,
      isActive: true,
    },
    create: {
      id: SEED_IDS.serviceWiringInspection,
      technicianId: bobProfile.id,
      categoryId: electrical.id,
      title: "Home Wiring Inspection",
      description: "Inspect household wiring, switches, and circuit breakers.",
      price: "75.00",
      durationMins: 120,
    },
  });

  await prisma.service.upsert({
    where: { id: SEED_IDS.serviceDeepClean },
    update: {
      technicianId: aliceProfile.id,
      categoryId: cleaning.id,
      title: "Deep Cleaning",
      description: "A detailed cleaning session for a small home or apartment.",
      price: "45.00",
      durationMins: 180,
      isActive: false,
    },
    create: {
      id: SEED_IDS.serviceDeepClean,
      technicianId: aliceProfile.id,
      categoryId: cleaning.id,
      title: "Deep Cleaning",
      description: "A detailed cleaning session for a small home or apartment.",
      price: "45.00",
      durationMins: 180,
      isActive: false,
    },
  });

  const completedBooking = await prisma.booking.upsert({
    where: { id: SEED_IDS.bookingCompleted },
    update: {
      customerId: customer.id,
      technicianId: aliceProfile.id,
      serviceId: drainService.id,
      scheduledAt: new Date("2026-07-20T10:00:00.000Z"),
      location: "Dhanmondi, Dhaka",
      notes: "Kitchen sink drains slowly.",
      totalAmount: "60.00",
      status: BookingStatus.COMPLETED,
    },
    create: {
      id: SEED_IDS.bookingCompleted,
      customerId: customer.id,
      technicianId: aliceProfile.id,
      serviceId: drainService.id,
      scheduledAt: new Date("2026-07-20T10:00:00.000Z"),
      location: "Dhanmondi, Dhaka",
      notes: "Kitchen sink drains slowly.",
      totalAmount: "60.00",
      status: BookingStatus.COMPLETED,
    },
  });

  const acceptedBooking = await prisma.booking.upsert({
    where: { id: SEED_IDS.bookingAccepted },
    update: {
      customerId: customer.id,
      technicianId: bobProfile.id,
      serviceId: wiringService.id,
      scheduledAt: new Date("2026-08-20T11:00:00.000Z"),
      location: "Gulshan, Dhaka",
      notes: "Please inspect a frequently tripping circuit breaker.",
      totalAmount: "75.00",
      status: BookingStatus.ACCEPTED,
    },
    create: {
      id: SEED_IDS.bookingAccepted,
      customerId: customer.id,
      technicianId: bobProfile.id,
      serviceId: wiringService.id,
      scheduledAt: new Date("2026-08-20T11:00:00.000Z"),
      location: "Gulshan, Dhaka",
      notes: "Please inspect a frequently tripping circuit breaker.",
      totalAmount: "75.00",
      status: BookingStatus.ACCEPTED,
    },
  });

  await prisma.payment.upsert({
    where: { id: SEED_IDS.paymentCompleted },
    update: {
      transactionId: "seed-stripe-completed-001",
      bookingId: completedBooking.id,
      customerId: customer.id,
      amount: "60.00",
      status: PaymentStatus.COMPLETED,
      paidAt: new Date("2026-07-20T12:00:00.000Z"),
      metadata: { test: true, paymentIntentId: "pi_seed_completed_001" },
    },
    create: {
      id: SEED_IDS.paymentCompleted,
      transactionId: "seed-stripe-completed-001",
      bookingId: completedBooking.id,
      customerId: customer.id,
      amount: "60.00",
      status: PaymentStatus.COMPLETED,
      paidAt: new Date("2026-07-20T12:00:00.000Z"),
      metadata: { test: true, paymentIntentId: "pi_seed_completed_001" },
    },
  });

  await prisma.payment.upsert({
    where: { id: SEED_IDS.paymentPending },
    update: {
      transactionId: "seed-stripe-pending-001",
      bookingId: acceptedBooking.id,
      customerId: customer.id,
      amount: "75.00",
      status: PaymentStatus.PENDING,
      paidAt: null,
      metadata: { test: true, sessionKey: "seed_pending_001" },
    },
    create: {
      id: SEED_IDS.paymentPending,
      transactionId: "seed-stripe-pending-001",
      bookingId: acceptedBooking.id,
      customerId: customer.id,
      amount: "75.00",
      status: PaymentStatus.PENDING,
      metadata: { test: true, sessionKey: "seed_pending_001" },
    },
  });

  await prisma.review.upsert({
    where: { bookingId: completedBooking.id },
    update: {
      customerId: customer.id,
      technicianId: aliceProfile.id,
      rating: 5,
      comment: "Arrived on time and fixed the drain quickly.",
    },
    create: {
      id: SEED_IDS.reviewAlice,
      bookingId: completedBooking.id,
      customerId: customer.id,
      technicianId: aliceProfile.id,
      rating: 5,
      comment: "Arrived on time and fixed the drain quickly.",
    },
  });

  console.log("Seeded users, technician profiles, categories, services, bookings, payments, and reviews.");
  console.log(`Test account password: ${TEST_PASSWORD}`);
  console.log(`Admin account: ${admin.email}`);
}

main()
  .catch((error: unknown) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });