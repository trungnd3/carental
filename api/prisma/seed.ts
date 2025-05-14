import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { slugify } from '../src/utils';

const prisma = new PrismaClient();

const CAR_MODELS_DATA = [
  {
    brand: 'Toyota',
    model: 'Yaris',
    stock: 3,
    peakSeasonPrice: 98.43,
    midSeasonPrice: 76.89,
    offSeasonPrice: 53.65,
    gracePeriod: 3,
    images: ['/cars/toyota_yaris.jpg'],
  },
  {
    brand: 'Seat',
    model: 'Ibiza',
    stock: 5,
    peakSeasonPrice: 85.12,
    midSeasonPrice: 65.73,
    offSeasonPrice: 46.85,
    gracePeriod: 3,
    images: ['/cars/seat_ibiza.jpg'],
  },
  {
    brand: 'Nissan',
    model: 'Qashqai',
    stock: 2,
    peakSeasonPrice: 101.46,
    midSeasonPrice: 82.94,
    offSeasonPrice: 59.87,
    gracePeriod: 3,
    images: ['/cars/nissan_qashqai.jpg'],
  },
  {
    brand: 'Jaguar',
    model: 'e-pace',
    stock: 1,
    peakSeasonPrice: 120.54,
    midSeasonPrice: 91.35,
    offSeasonPrice: 70.27,
    gracePeriod: 3,
    images: ['/cars/jaguar_e-pace.jpg'],
  },
  {
    brand: 'Mercedes',
    model: 'Vito',
    stock: 2,
    peakSeasonPrice: 109.16,
    midSeasonPrice: 89.64,
    offSeasonPrice: 64.97,
    gracePeriod: 3,
    images: ['/cars/mercedes_vito.jpg'],
  },
];

async function main() {
  // Reset IDs
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "CarModel_id_seq" RESTART WITH 1`;

  const aliceEmail = 'alice@carental.com';
  const alicePassword = await bcrypt.hash('alice@12345', 10);
  const alice = await prisma.user.upsert({
    where: { email: aliceEmail },
    update: {},
    create: {
      email: aliceEmail,
      password: alicePassword,
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '(262) 237-6193',
      dateOfBirth: new Date('1995/02/25'),
      licenseNumber: faker.number
        .int({ min: 100000000, max: 999999999 })
        .toString(),
      licenseValidTo: new Date('2050/1/8'),
      avatar: '/users/alice.png',
    },
  });

  const bobEmail = 'bob@carental.com';
  const bobPassword = await bcrypt.hash('bob@12345', 10);
  const bob = await prisma.user.upsert({
    where: { email: bobEmail },
    update: {},
    create: {
      email: bobEmail,
      password: bobPassword,
      firstName: 'Bob',
      lastName: 'Parker',
      phone: '(262) 782-9821',
      dateOfBirth: new Date('1990/10/05'),
      licenseNumber: faker.number
        .int({ min: 100000000, max: 999999999 })
        .toString(),
      licenseValidTo: new Date('2030/11/6'),
      avatar: '/users/bob.png',
    },
  });
  console.log({ alice, bob });

  for (const carModelData of CAR_MODELS_DATA) {
    const slug = slugify(`${carModelData.brand} ${carModelData.model}`);

    const carModel = await prisma.carModel.upsert({
      where: {
        slug,
      },
      update: {},
      create: {
        ...carModelData,
        slug,
      },
    });
    console.log(`Car model: ${carModel.brand} - ${carModel.model} is created`);
    console.log(carModel);

    const batch: Prisma.BatchPayload = await prisma.car.createMany({
      data: Array.from(Array(carModel.stock).keys()).map(() => ({
        plateNumber: faker.vehicle.vrm(),
        modelId: carModel.id,
      })),
    });

    console.log(
      `${batch.count} of cars for the model: ${carModel.brand} - ${carModel.model} are created`,
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
