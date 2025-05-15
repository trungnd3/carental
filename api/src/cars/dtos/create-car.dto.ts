import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsInt()
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  peakSeasonPrice: number;

  @IsNotEmpty()
  @IsNumber()
  midSeasonPrice: number;

  @IsNotEmpty()
  @IsNumber()
  offSeasonPrice: number;

  @IsNotEmpty()
  @IsInt()
  gracePeriod: number;
}
