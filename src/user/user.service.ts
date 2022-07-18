import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const { name, email, password, roles } = data;
    return await this.prisma.user.create({
      data: { name, email, password, roles },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      take: 50,
    });
  }

  async findById(uuid: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { uuid },
      });
    } catch (e) {
      throw new NotFoundException(`Can\`t find user by uuid:${uuid}`);
    }
  }

  async findByEmailOrTrow(email: string) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async update(uuid: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { uuid: uuid },
        data,
      });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new NotFoundException('Bad request');
      } else {
        throw new NotFoundException(`Can\`t find user by uuid:${uuid}`);
      }
    }
  }

  async delete(uuid: string): Promise<User> {
    const user = await this.findById(uuid);
    return this.prisma.user.delete({
      where: { id: user.id },
    });
  }
}
