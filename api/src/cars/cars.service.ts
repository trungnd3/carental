import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCarDto } from './dtos/create-car.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.car.findMany({
      include: {
        model: true,
      },
    });
  }

  async create(createCarDto: CreateCarDto) {
    // Get the car by plateNumber, throw error if it exists
    const car = await this.getCarByPlateNumber(createCarDto.plateNumber);
    if (car) {
      throw new BadRequestException('Car already exists.');
    }

    try {
      // Get the car model and brand name, create a new if that model doesn't exist
      // Create new car with the modelId from previous step
      // Both of these steps could be done using the connectOrCreate offered by prisma
      const createdCar = await this.prismaService.car.create({
        data: {
          plateNumber: createCarDto.plateNumber,
          model: {
            connectOrCreate: {
              where: {
                brand_model: {
                  brand: createCarDto.brand,
                  model: createCarDto.model,
                },
              },
              create: {
                brand: createCarDto.brand,
                model: createCarDto.model,
                stock: createCarDto.stock,
                peakSeasonPrice: createCarDto.peakSeasonPrice,
                midSeasonPrice: createCarDto.midSeasonPrice,
                offSeasonPrice: createCarDto.offSeasonPrice,
                gracePeriod: createCarDto.gracePeriod,
              },
            },
          },
        },
        include: {
          model: true,
        },
      });

      return createdCar;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update() {}

  async delete() {}

  getCarByPlateNumber(plateNumber: string) {
    return this.prismaService.car.findFirst({
      where: {
        plateNumber,
      },
      include: {
        model: true,
      },
    });
  }
}
