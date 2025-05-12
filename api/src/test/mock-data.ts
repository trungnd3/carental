import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { CarModel, User } from '@prisma/client';
import { CreateUserDto } from '@/auth/users/dtos/create-user.dto';
import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { CarWithModel } from '@/cars/interfaces/car-with-model.interface';

const generateUSLicense = () => {
  const states = ['CA', 'NY', 'TX', 'FL', 'OH', 'WA', 'IL', 'PA', 'MI', 'GA'];
  const stateCode = faker.helpers.arrayElement(states);
  const number = faker.string.numeric(9);
  return `${stateCode}${number}`;
};

export function generateToken(): string {
  return faker.internet.jwt();
}

export function generatePassword(): string {
  return faker.string.alphanumeric({
    length: {
      min: 8,
      max: 15,
    },
  });
}

export function generateUserDto(): CreateUserDto {
  return {
    email: faker.internet.email(),
    password: generatePassword(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    dateOfBirth: faker.date.birthdate(),
    licenseNumber: generateUSLicense(),
    licenseValidTo: faker.date.future({
      years: 20,
    }),
  };
}

export async function generateUser(
  defaults: Partial<CreateUserDto>,
): Promise<User> {
  const createUserDto: CreateUserDto = {
    ...generateUserDto(),
    ...defaults,
  };

  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  return {
    ...createUserDto,
    password: hashedPassword,
    id: 1,
  };
}

export function generateCarDto(): CreateCarDto {
  return {
    plateNumber: faker.vehicle.vrm(),
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    stock: 3,
    peakSeasonPrice: faker.number.float(),
    midSeasonPrice: faker.number.float(),
    offSeasonPrice: faker.number.float(),
    gracePeriod: faker.number.int(),
  };
}

export function generateCarModel(): CarModel {
  return {
    id: faker.number.int(),
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    stock: 3,
    peakSeasonPrice: faker.number.float(),
    midSeasonPrice: faker.number.float(),
    offSeasonPrice: faker.number.float(),
    gracePeriod: faker.number.int(),
  };
}

export function generateCar({
  plateNumber: defaultPlateNumber,
  ...modelDefaults
}: Partial<CreateCarDto> & { modelId?: number }): CarWithModel {
  const modelId = modelDefaults.modelId
    ? modelDefaults.modelId
    : faker.number.int();

  const { plateNumber, ...createModel }: CreateCarDto = generateCarDto();

  const carModel = {
    id: modelId,
    ...createModel,
    ...modelDefaults,
  };

  const carWithModel: CarWithModel = {
    id: faker.number.int(),
    plateNumber,
    modelId,
    model: { ...carModel },
  };

  if (defaultPlateNumber) {
    carWithModel.plateNumber = defaultPlateNumber;
  }

  return carWithModel;
}

export function generateCars(num: number = 10): CarWithModel[] {
  return Array.from(Array(num).keys()).map(() => generateCar({}));
}
