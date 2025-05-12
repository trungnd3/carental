import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import {
  generateCar,
  generateCarDto,
  generateCarModel,
  generateCars,
} from '@/test/mock-data';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

describe('CarsService', () => {
  let carsService: CarsService;
  let prismaMockService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMockService = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    }).compile();

    carsService = module.get<CarsService>(CarsService);
    prismaMockService.user.findFirst.mockClear();
  });

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });

  it('should get all the cars', async () => {
    const mockCars = generateCars();
    prismaMockService.car.findMany.mockResolvedValue(mockCars);
    const cars = await carsService.getAll();
    expect(cars.length).toEqual(mockCars.length);
    expect(cars[0].id).toEqual(mockCars[0].id);
  });

  it('should create a new car and a new car model if car model has not existed', async () => {
    const createCarDto = generateCarDto();

    prismaMockService.car.create.mockResolvedValue(generateCar(createCarDto));

    const createdCar = await carsService.create(createCarDto);
    expect(createdCar.plateNumber).toEqual(createCarDto.plateNumber);
  });

  it('should create a new car without creating a new car model if car model has existed', async () => {
    const createCarDto = generateCarDto();
    const carModel = generateCarModel();

    prismaMockService.car.create.mockResolvedValue(
      generateCar({ ...createCarDto, modelId: carModel.id }),
    );
    prismaMockService.carModel.findUnique.mockResolvedValue(carModel);

    const createdCar = await carsService.create(createCarDto);
    expect(createdCar.plateNumber).toEqual(createCarDto.plateNumber);
    expect(createdCar.modelId).toEqual(carModel.id);
  });

  it('should not create a new car if the car can be found by plateNumber', async () => {
    const createCarDto = generateCarDto();
    const car = generateCar({});

    prismaMockService.car.findFirst.mockResolvedValue(car);
    await expect(
      async () => await carsService.create(createCarDto),
    ).rejects.toThrow(new BadRequestException('Car already exists.'));
  });
});
