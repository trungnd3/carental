import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';

describe('CarsService', () => {
  let carsService: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService],
    }).compile();

    carsService = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });

  it('should get all the cars', async () => {
    const cars = await carsService.getAll();
    expect(cars).toEqual([]);
  });

  it('should create a new car', async () => {
    const createdCar = await carsService.create();
    expect(createdCar).toEqual([]);
  });

  it('should update an existing car', async () => {
    const updatedCar = await carsService.update();
    expect(updatedCar).toEqual([]);
  });

  it('should delete an existing car', async () => {
    const carId = await carsService.delete();
    expect(carId).toEqual([]);
  });
});
