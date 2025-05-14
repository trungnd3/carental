import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UserPayload } from '@/auth/interfaces/user-payload.interface';
import { MakeCarBookingDto } from './dtos/make-car-booking.dto';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Normal users are able to browse all booking records of a particular car model
  @Get('/:modelSlug')
  getBookingRecordsByCar(@Param('modelSlug') modelSlug: string) {
    return this.bookingsService.getBookingRecordsByCarModel(modelSlug);
  }

  // Normal users are able to browsers all his/her booking records
  @Get()
  getOwnBookingRecords(@CurrentUser() user: UserPayload) {
    return this.bookingsService.getOwnBookingRecords(user.userId);
  }

  // Normal users are able to make a book for a car in particular date range
  @Post()
  makeCarBooking(
    @Body() makeCarBookingDto: MakeCarBookingDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.bookingsService.makeCarBooking(makeCarBookingDto, user.userId);
  }

  // Normal users are able to cancel a book of his/her own
  @Patch()
  cancelCarBooking() {}
}
