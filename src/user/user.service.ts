import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PublicUser } from 'src/user/models/public.user';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async removeRefreshToken(user: User) {
    return await this.prisma.user.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        refreshToken: null,
      },
    });
  }

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

  async findByUUID(uuid: string): Promise<User> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { uuid },
      });
    } catch (e) {
      throw new NotFoundException(`Can\`t find user by uuid:${uuid}`);
    }
  }

  async findByUUIDPublic(uuid: string): Promise<PublicUser> {
    const user = await this.findByUUID(uuid);

    return this.serialize(user);
  }

  async findByEmailOrTrow(email: string): Promise<User> {
    try {
      return await this.prisma.user.findFirstOrThrow({
        where: { email },
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findByEmailOrTrowPublic(email: string): Promise<PublicUser> {
    const user = await this.findByEmailOrTrow(email);

    return this.serialize(user);
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

  async findByEmailPublic(email: string): Promise<PublicUser> {
    const user = await this.findByEmail(email);

    return this.serialize(user);
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

  async getUserIfRefreshTokenMatches(refreshToken: string, uuid: string) {
    const user = await this.findByUUID(uuid);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, uuid: string) {
    const currentRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: {
        uuid,
      },
      data: {
        refreshToken: currentRefreshToken,
      },
    });
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
