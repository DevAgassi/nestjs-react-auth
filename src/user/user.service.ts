import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicUser } from './models/public.user';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<PublicUser> {
    const { name, email, password, roles } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword, roles },
    });

    return this.serialize(user);
  }

  async findAll(): Promise<PublicUser[]> {
    return await this.prisma.user.findMany({
      select: {
        uuid: true,
        email: true,
        roles: true,
        name: true,
      },
      take: 50,
    });
  }

  async findByUUID(uuid: string): Promise<PublicUser> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { uuid },
      });

      return this.serialize(user);
    } catch (e) {
      throw new NotFoundException(`Can\`t find user by uuid:${uuid}`);
    }
  }

  async findByEmailOrTrow(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { email },
      });

      return user;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new NotFoundException('Bad request');
      } else {
        throw new NotFoundException(`Can\`t find user by email:${email}`);
      }
    }
  }

  async update(
    uuid: string,
    data: Prisma.UserUpdateInput,
  ): Promise<PublicUser> {
    try {
      const user = await this.prisma.user.update({
        where: { uuid: uuid },
        data,
      });

      return this.serialize(user);
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new NotFoundException('Bad request');
      } else {
        throw new NotFoundException(`Can\`t find user by uuid:${uuid}`);
      }
    }
  }

  async delete(uuid: string): Promise<PublicUser> {
    const userByUUID = await this.findByUUID(uuid);
    const user = await this.prisma.user.delete({
      where: { uuid: userByUUID.uuid },
    });

    return this.serialize(user);
  }

  serialize(user: User): PublicUser {
    const publicUser = new PublicUser();
    publicUser.email = user.email;
    publicUser.name = user.name;
    publicUser.roles = user.roles;
    publicUser.uuid = user.uuid;

    return publicUser;
  }
}
