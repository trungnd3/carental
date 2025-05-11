import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  generatePassword,
  generateToken,
  generateUser,
} from '@/test/mock-data';
import { LoginDto } from './dtos/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            verifyUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should login and set authorization cookie', async () => {
    const password = generatePassword();
    const mockUser = await generateUser({ password });
    const mockToken = generateToken();

    const req = {
      body: { email: mockUser.email, password } as LoginDto,
    } as unknown as Request;

    const res = {
      cookie: jest.fn(),
    } as unknown as Response;

    // Mock the service methods
    (authService.verifyUser as jest.Mock).mockResolvedValue(mockUser);
    (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

    await authController.login(req, res);

    expect(authService.verifyUser).toHaveBeenCalledWith(req.body);
    expect(jwtService.sign).toHaveBeenCalledWith({ email: mockUser.email });
    expect(res.cookie).toHaveBeenCalledWith('Authorization', mockToken, {
      httpOnly: true,
    });
  });
});
