import { CarsService } from '@/cars/cars.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookingRecord, Prisma } from '@prisma/client';
import { MakeCarBookingDto } from './dtos/make-car-booking.dto';
import { PricingService } from './pricing.service';
import { DAY_MILLISECONDS } from './constants';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly carsService: CarsService,
    private readonly pricingService: PricingService,
  ) {}

  async getBookingRecordsByCarModel(modelSlug: string) {
    // Get the cars of this model
    // throw error if cars array is empty
    const cars = await this.carsService.getCarsByModelSlug(modelSlug);
    if (!cars || !cars.length) {
      throw new BadRequestException('This car model is out of stock.');
    }

    let bookingRecords: BookingRecord[] = [];

    for (const car of cars) {
      const bookings = await this.getBookingRecords({
        carId: car.id,
      });

      bookingRecords = [...bookingRecords, ...bookings];
    }

    return bookingRecords;
  }

  async getOwnBookingRecords(userId: number) {
    // Don't check user existence here
    // Since we're using get current user decorator
    // and we'll guarding and parsing the user to req using Guard
    return this.getBookingRecords({ userId });
  }

  async getBookingRecords(filter: Prisma.BookingRecordWhereInput) {
    try {
      return this.prismaService.bookingRecord.findMany({
        where: filter,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async makeCarBooking(booking: MakeCarBookingDto, userId: number) {
    // Throws error if the startAt date is less or equal than today
    if (booking.startedAt.getTime() <= new Date().getTime()) {
      throw new BadRequestException('Must book the car from tommorrow.');
    }

    // Throws error if the startAt date is greater than or equal to endedAt date
    if (booking.startedAt.getTime() >= booking.endedAt.getTime()) {
      throw new BadRequestException('Invalid date range.');
    }

    // Throws error if user wants to book the car for more than consecutively 90 days (around 3 months)
    const differ = booking.endedAt.getTime() - booking.startedAt.getTime();
    if (Math.floor(differ / DAY_MILLISECONDS) > 90) {
      throw new BadRequestException('Invalid date range.');
    }

    // Throws error if no existingCar found by plateNumber
    const existingCar = await this.carsService.getCarByPlateNumber(
      booking.plateNumber,
    );

    if (!existingCar) {
      throw new BadRequestException('Car does not exist.');
    }

    // Throws error if the model's stock is empty
    if (!existingCar.model.stock) {
      throw new BadRequestException('This model is out-of-stock.');
    }

    // Get all booking records by the car plate
    // and each of those records has the startedAt date greater than today
    const bookingRecords = await this.getBookingRecords({
      AND: [
        { carId: existingCar.id },
        {
          startedAt: {
            gte: new Date(),
          },
        },
      ],
    });

    // Throw error if the startDate and endDate overlapped any of the booking records
    /* Overlapping rules:
        1. record startedAt < booking startedAt < booking endedAt < record endedAt
        2. booking startedAt < record startedAt < record endedAt < booking endedAt
        3. record startedAt < booking startedAt < record endedAt < booking endedAt
        4. booking startedAt < record startedAt < booking endedAt < record endedAt
    */
    for (const record of bookingRecords) {
      if (
        (record.startedAt < booking.startedAt &&
          booking.endedAt < record.endedAt) ||
        (booking.startedAt < record.startedAt &&
          record.endedAt < booking.endedAt) ||
        (record.startedAt < booking.startedAt &&
          booking.startedAt < record.endedAt) ||
        (booking.startedAt < record.startedAt &&
          record.startedAt < booking.endedAt)
      ) {
        throw new BadRequestException('Invalid date range');
      }
    }

    const totalPrice = await this.totalPrice({
      plateNumber: existingCar.plateNumber,
      startedAt: booking.startedAt,
      endedAt: booking.endedAt,
    });

    // Store booking record
    return this.prismaService.bookingRecord.create({
      data: {
        startedAt: booking.startedAt,
        endedAt: booking.endedAt,
        userId,
        carId: existingCar.id,
        totalPrice,
      },
    });
  }

  async totalPrice({ plateNumber, startedAt, endedAt }: MakeCarBookingDto) {
    const existingCar = await this.carsService.getCarByPlateNumber(plateNumber);
    if (!existingCar) {
      throw new BadRequestException('Car does not exist.');
    }

    return this.pricingService.calculateTotalPrice(
      existingCar.model,
      startedAt,
      endedAt,
    );
  }

  async cancelCarBooking() {}
}
