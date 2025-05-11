import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { generateUser, generateUserDto } from '@/test/mock-data';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaMockService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMockService = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMockService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    prismaMockService.user.findFirst.mockClear();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should findOne user by condition', async () => {
    const existingUser = await generateUser({});

    prismaMockService.user.findFirst.mockResolvedValue(existingUser);

    const result = await usersService.findOne({
      email: existingUser.email,
    });
    expect(result).toEqual(existingUser);
    expect(prismaMockService.user.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMockService.user.findFirst).toHaveBeenCalledWith({
      where: {
        email: existingUser.email,
      },
    });
  });

  it('should createUser if user cannot be found by email or license', async () => {
    const createUserDto = generateUserDto();

    prismaMockService.user.create.mockResolvedValue(
      await generateUser(createUserDto),
    );

    const result = await usersService.create(createUserDto);
    expect(result).toEqual({
      email: createUserDto.email,
      licenseNumber: createUserDto.licenseNumber,
    });
  });

  it('should not createUser if user is found by email', async () => {
    const createUserDto = generateUserDto();
    const existingUser = await generateUser(createUserDto);

    prismaMockService.user.findFirst.mockResolvedValue(existingUser);

    await expect(
      async () => await usersService.create(createUserDto),
    ).rejects.toThrow(new BadRequestException('User already exists.'));
  });
});
