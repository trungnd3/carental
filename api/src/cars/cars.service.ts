import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCarDto } from './dtos/create-car.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { slugify } from '@/utils';
import { CarModel } from '@prisma/client';

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

  async getAllModels() {
    return this.prismaService.carModel.findMany();
  }

  async getModelById(id: number) {
    try {
      return this.prismaService.carModel.findUnique({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async create(createCarDto: CreateCarDto) {
    // Get the car by plateNumber, throw error if it exists
    const car = await this.getCarByPlateNumber(createCarDto.plateNumber);
    if (car) {
      throw new BadRequestException('Car already exists.');
    }

    try {
      // Get the car model by its slug, which is generated automatically
      // when a model is created
      // Create a new model if not found
      // Create new car with the modelId from previous step
      // Both of these steps could be done using the connectOrCreate offered by prisma
      const slug = slugify(`${createCarDto.brand} ${createCarDto.model}`);
      const createdCar = await this.prismaService.car.create({
        data: {
          plateNumber: createCarDto.plateNumber,
          model: {
            connectOrCreate: {
              where: {
                slug,
              },
              create: {
                brand: createCarDto.brand,
                model: createCarDto.model,
                slug,
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

  async getCarModelBySlug(
    slug: string,
  ): Promise<CarModel & { cars: string[] }> {
    const carModel = await this.prismaService.carModel.findUnique({
      where: {
        slug,
      },
    });

    if (!carModel) {
      throw new BadRequestException('Mode not found.');
    }

    const cars = await this.prismaService.car.findMany({
      where: {
        modelId: carModel?.id,
      },
    });

    return {
      ...carModel,
      cars: cars.map((c) => c.plateNumber),
    };
  }

  async getCarsByModelSlug(slug: string) {
    const carModel = await this.prismaService.carModel.findUnique({
      where: { slug },
    });
    if (!carModel) {
      throw new BadRequestException('Model does not exist.');
    }

    return this.prismaService.car.findMany({
      where: {
        modelId: carModel.id,
      },
    });
  }
}
