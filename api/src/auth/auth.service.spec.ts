import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { generatePassword, generateUser } from '@/test/mock-data';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should verify user to be authorized if the user can be found by the provided credentials', async () => {
    const password = generatePassword();
    const existingUser = await generateUser({
      password,
    });

    (usersService.findOne as jest.Mock).mockResolvedValue(existingUser);

    const validUser = await authService.verifyUser({
      email: existingUser.email,
      password,
    });

    expect(validUser).toEqual(existingUser);
  });

  it('should verify user to be unauthorized if the user cannot be found by the provided credentials', async () => {
    const password = generatePassword();
    const nonExistingUser = await generateUser({
      password,
    });

    (usersService.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      async () =>
        await authService.verifyUser({
          email: nonExistingUser.email,
          password,
        }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('should verify user to be unauthorized if the user can be found by the provided credentials but the password does not match', async () => {
    const password = generatePassword();
    const existingUser = await generateUser({
      password,
    });

    (usersService.findOne as jest.Mock).mockResolvedValue(existingUser);

    await expect(
      async () =>
        await authService.verifyUser({
          email: existingUser.email,
          password: generatePassword(),
        }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });
});
