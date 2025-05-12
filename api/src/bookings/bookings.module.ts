import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CarsModule } from '@/cars/cars.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { PricingService } from './pricing.service';

@Module({
  imports: [CarsModule, PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService, PricingService],
})
export class BookingsModule {}
