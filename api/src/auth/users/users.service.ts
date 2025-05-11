import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // check unique for email or license
    const existingUser = await this.findOne({
      OR: [
        {
          email: createUserDto.email,
        },
        {
          licenseNumber: createUserDto.licenseNumber,
        },
      ],
    });
    if (existingUser) {
      throw new BadRequestException();
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      const createdUser = await this.prismaService.user.create({
        data: { ...createUserDto, password: hashedPassword },
      });
      return {
        email: createdUser.email,
        licenseNumber: createdUser.licenseNumber,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(where: Prisma.UserWhereInput) {
    return this.prismaService.user.findFirst({
      where,
    });
  }
}
