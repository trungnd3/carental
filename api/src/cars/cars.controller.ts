import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getAllCars() {
    return this.carsService.getAll();
  }

  @Get('/:modelSlug')
  @UseGuards(AuthGuard)
  async getCarModelBySlug(@Param('modelSlug') modelSlug: string) {
    return this.carsService.getCarModelBySlug(modelSlug);
  }

  @Get('/models/all')
  async getAllCarModels() {
    return this.carsService.getAllModels();
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }
}
