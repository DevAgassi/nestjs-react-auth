import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserService } from '../user.service';

export function UniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UserService) {}

  async validate(value: any) {
    if (!value) {
      return false;
    }

    const user = await this.usersService.findByEmail(value);

    if (user) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must by unique`;
  }
}
