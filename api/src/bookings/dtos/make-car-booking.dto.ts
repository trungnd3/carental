import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class MakeCarBookingDto {
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endedAt: Date;
}
