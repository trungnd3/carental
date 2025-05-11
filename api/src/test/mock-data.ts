import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { CreateUserDto } from '@/auth/users/dtos/create-user.dto';

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

export async function generateCarDto() {
  return {

  }
}
