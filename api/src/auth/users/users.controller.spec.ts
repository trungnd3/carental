import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { generateUserDto } from '@/test/mock-data';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user by usersService', async () => {
    const createUserDto = generateUserDto();
    usersService.create = jest
      .fn()
      .mockImplementation(async (createUserDto: CreateUserDto) =>
        Promise.resolve({
          email: createUserDto.email,
          licenseNumber: createUserDto.licenseNumber,
        }),
      );

    const createdUser = await controller.createUser(createUserDto);

    expect(createdUser).toEqual({
      email: createUserDto.email,
      licenseNumber: createUserDto.licenseNumber,
    });
  });
});
