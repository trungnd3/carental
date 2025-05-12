import { Body, Controller, Get, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getAllCars() {
    return this.carsService.getAll();
  }

  @Post()
  async createCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }
}
